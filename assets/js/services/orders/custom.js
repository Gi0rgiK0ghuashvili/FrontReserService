
// Global variables
let selectedHallId = 0;
let selectedCategoryId = 0;
let selectedHalls = [];
let selectedCategories = [];
let selectedItems = [];
let categoryDiscounts = {}; // ახალი ობიექტი ფასდაკლებების შესანახად
let currentModalAction = 'save'; // ღია ვარიაბლი იმისთვის რომ ვიცოდეთ რა ქმედება უნდა შესრულდეს

// ===== NEW DISCOUNT FUNCTIONALITY =====
toggleHallDropdown();
handleSelectMenus();

function handleSelectMenus() {
    const menuDropDownMenu = document.getElementById("menuDropdownMenu");
    menuDropDownMenu.addEventListener("click", (event) => {

        toggleHallSelection(35, 'პანო', event);
    });

}

function handleDiscountKeyup(event, input) {
    if (event.key === 'Enter') {
        applyCategoryDiscount(input);
        input.blur();
    }
}

function applyCategoryDiscount(input) {
    const discountPercentage = parseFloat(input.value) || 0; // ფასდაკლების პროცენტი
    const category = input.dataset.category;
    const hall = input.dataset.hall;
    const categoryKey = `${hall}|${category}`;

    // Calculate the total for the category - მხოლოდ მონიშნული ელემენტები
    let categoryTotal = 0;
    const hallSection = document.querySelector(`[data-hall="${hall}"]`);
    if (hallSection) {
        const categoryItems = hallSection.querySelectorAll(`[data-category="${category}"].menu-item`);
        categoryItems.forEach(item => {
            const itemCheckbox = item.querySelector('.item-checkbox');
            const isItemSelected = itemCheckbox && itemCheckbox.checked;
            const isCategorySelected = selectedCategories.includes(categoryKey);
            const itemId = item.dataset.itemId;
            const isItemInSelectedArray = selectedItems.includes(itemId);

            if (isItemSelected || isCategorySelected || isItemInSelectedArray) {
                const totalCell = item.querySelector('.total-cell');
                if (totalCell) {
                    let itemTotal = parseFloat(totalCell.dataset.total) || 0;
                    categoryTotal += itemTotal;
                }
            }
        });
    }

    // Calculate final amount after discount
    const discountAmount = (categoryTotal * discountPercentage) / 100; // ფასდაკლების თანხა
    const finalAmount = Math.max(0, categoryTotal - discountAmount); // საბოლოო თანხა

    // Update the display for the final amount
    const finalAmountSpan = document.querySelector(`[data-category="${category}"][data-hall="${hall}"].category-final-amount`);
    if (finalAmountSpan) {
        finalAmountSpan.textContent = finalAmount.toFixed(2) + ' ₾';
    }

    // Store the discount for later use
    categoryDiscounts[categoryKey] = discountAmount;

    // Debugging log
    console.log(`💸 Category: ${categoryKey}, Total: ${categoryTotal.toFixed(2)}, Discount: ${discountAmount.toFixed(2)}, Final: ${finalAmount.toFixed(2)}`);

    // Update payment summary
    updateMenuTotalFromTable();
}

// ===== NEW NOTES FUNCTIONALITY =====

function handleNotesKeyup(event, input) {
    if (event.key === 'Enter') {
        updateItemNotes(input);
        input.blur(); // Remove focus after update
    }
}

function updateItemNotes(input) {
    const itemId = input.dataset.itemId;
    const notes = input.value.trim();

    // Update in database via AJAX
    const formData = new FormData();
    formData.append('ajax_update_notes', '1');
    formData.append('item_id', itemId);
    formData.append('notes', notes);

    fetch(window.location.pathname, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Add visual feedback
                const row = input.closest('tr');
                row.style.background = 'rgba(23, 162, 184, 0.1)';
                input.style.background = 'rgba(23, 162, 184, 0.1)';

                setTimeout(() => {
                    row.style.background = '';
                    input.style.background = '';
                }, 1000);

                // Optional: show small success indicator
                showNotesUpdateIndicator(input, true);
            } else {
                // Still show completion indicator
                showNotesUpdateIndicator(input, false);
            }
        })
        .catch(error => {
            // No error alerts - just continue
            console.log('Notes update completed');
            showNotesUpdateIndicator(input, false);
        });
}

function showNotesUpdateIndicator(input, success) {
    // Create a small indicator next to the input
    const indicator = document.createElement('span');
    indicator.style.position = 'absolute';
    indicator.style.right = '2px';
    indicator.style.top = '50%';
    indicator.style.transform = 'translateY(-50%)';
    indicator.style.fontSize = '10px';
    indicator.style.pointerEvents = 'none';
    indicator.style.zIndex = '10';

    if (success) {
        indicator.innerHTML = '✓';
        indicator.style.color = '#28a745';
    } else {
        indicator.innerHTML = '●';
        indicator.style.color = '#6c757d';
    }

    // Position relative to input
    const cell = input.parentElement;
    cell.style.position = 'relative';
    cell.appendChild(indicator);

    // Remove after 2 seconds
    setTimeout(() => {
        if (indicator.parentElement) {
            indicator.remove();
        }
    }, 2000);
}

// ===== NEW ITEM ADDITION FUNCTIONS =====

function fetchSubcategories() {
    const categoryElement = document.getElementById("category");
    const subcategoryElement = document.getElementById("subcategory");
    const priceElement = document.getElementById("price");

    if (!categoryElement || !subcategoryElement || !priceElement) {
        console.error('Required form elements not found');
        return;
    }

    const categoryId = categoryElement.value;

    if (!categoryId) {
        subcategoryElement.innerHTML = '<option value="">აირჩიე ქვეკატეგორია</option>';
        priceElement.value = '';
        return;
    }

    console.log('🔍 Fetching subcategories for category ID:', categoryId);

    // Clear subcategories and show loading
    subcategoryElement.innerHTML = '<option value="">იტვირთება...</option>';
    priceElement.value = '';

    // Fetch subcategories from menu_subcategories table
    fetch(`menu_prepare.php?category_id=${encodeURIComponent(categoryId)}&get_subcategories=1`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(responseData => {
            console.log('📊 Response from server:', responseData);

            if (!responseData.success) {
                throw new Error(responseData.error || 'მონაცემების ჩატვირთვა ვერ მოხერხდა');
            }

            const data = responseData.data || [];
            const debug = responseData.debug;

            if (debug) {
                console.log('🔍 Data source info:', debug);
                console.log(`📊 ნაპოვნია ${debug.total_found} ქვეკატეგორია ${debug.source_table} ცხრილში`);
            }

            // Clear and populate subcategories dropdown
            subcategoryElement.innerHTML = '<option value="">აირჩიე ქვეკატეგორია</option>';

            if (data.length === 0) {
                subcategoryElement.innerHTML = '<option value="">ამ კატეგორიაში ქვეკატეგორიები არ არის</option>';
                console.log('❌ ქვეკატეგორიები ვერ მოიძებნა');
                return;
            }

            data.forEach(subcategory => {
                const option = document.createElement("option");
                option.value = subcategory.id;
                option.textContent = subcategory.subcategory_ka;
                option.setAttribute('data-price', subcategory.price);
                option.setAttribute('data-subcategory-ka', subcategory.subcategory_ka);
                option.setAttribute('data-subcategory-en', subcategory.subcategory_en || '');
                subcategoryElement.appendChild(option);
            });

            priceElement.value = '';
            console.log(`✅ ჩაიტვირთა ${data.length} ქვეკატეგორია menu_subcategories ცხრილიდან`);
        })
        .catch(error => {
            console.error('❌ Error fetching subcategories:', error);
            subcategoryElement.innerHTML = '<option value="">შეცდომა - თავიდან სცადეთ</option>';
            alert('ქვეკატეგორიების ჩატვირთვისას მოხდა შეცდომა: ' + error.message);
        });
}

function updatePriceFromSubcategory() {
    const subcategoryElement = document.getElementById("subcategory");
    const priceElement = document.getElementById("price");

    if (!subcategoryElement || !priceElement) {
        console.error('Required form elements not found');
        return;
    }

    const selectedOption = subcategoryElement.options[subcategoryElement.selectedIndex];
    const price = selectedOption.getAttribute("data-price");

    if (price) {
        priceElement.value = parseFloat(price).toFixed(2);
        console.log(`💰 ფასი განახლდა: ${price} ₾ (წყარო: menu_subcategories.price_ka)`);
    } else {
        priceElement.value = '';
        console.log('❌ ფასი ვერ მოიძებნა');
    }
}

function addItemAjax(event) {
    event.preventDefault();

    const categoryEl = document.getElementById('category');
    const subcategoryEl = document.getElementById('subcategory');
    const quantityEl = document.getElementById('quantity');
    const priceEl = document.getElementById('price');

    if (!categoryEl.value || !subcategoryEl.value || !quantityEl.value) {
        alert('გთხოვთ შეავსოთ ყველა ველი');
        return;
    }

    if (selectedHalls.length === 0) {
        alert('გთხოვთ ჯერ აირჩიოთ დარბაზი ზედა dropdown-დან');
        return;
    }

    const selectedHallId = selectedHalls[0]; // პირველი არჩეული დარბაზი
    console.log('Selected Hall ID:', selectedHallId); // Debug

    const formData = {
        action: 'add_item',
        category_id: parseInt(categoryEl.value),
        subcategory_id: parseInt(subcategoryEl.value),
        quantity: parseInt(quantityEl.value),
        hall_id: parseInt(selectedHallId),
        custom_price: parseFloat(priceEl.value)
    };

    // Disable submit button during request
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>დამატება...';

    console.log('🚀 Sending AJAX request:', formData);

    fetch('menu_prepare.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            console.log('📡 Response status:', response.status);
            console.log('📡 Response headers:', response.headers.get('content-type'));

            // ✅ ჯერ შევამოწმოთ response text და შემდეგ parse ვაკეთოთ
            return response.text();
        })
        .then(responseText => {
            console.log('📄 Raw response text:', responseText);

            // შევამოწმოთ HTML errors
            if (responseText.includes('<br />') || responseText.includes('<b>') || responseText.includes('Fatal error') || responseText.includes('Warning')) {
                console.error('❌ PHP Error detected in response:', responseText);
                throw new Error('Server returned PHP error instead of JSON: ' + responseText.substring(0, 200));
            }

            // ✅ ახლა JSON parse ვცადოთ
            try {
                const data = JSON.parse(responseText);
                console.log('✅ Parsed JSON successfully:', data);
                return data;
            } catch (parseError) {
                console.error('❌ JSON Parse Error:', parseError);
                console.error('❌ Response was:', responseText);
                throw new Error('Invalid JSON response: ' + responseText.substring(0, 100));
            }
        })
        .then(data => {
            if (data.success) {
                console.log('✅ Item added successfully:', data);
                showSuccessMessage(`"${data.subcategory_ka}" დაემატა მენიუში`);

                // ახალი ნაწილი - ცხრილში დამატება
                addNewItemToTable(data);

                // Clear form but keep category selected
                clearAddItemForm();

                // Reload subcategories for the selected category
                const categoryEl = document.getElementById('category');
                if (categoryEl.value) {
                    fetchSubcategories();
                }
            } else {
                console.error('❌ Server returned error:', data.error);
                alert('შეცდომა: ' + (data.error || 'დამატება ვერ მოხერხდა'));
            }
        })
        .catch(error => {
            console.error('❌ AJAX Error:', error);
            console.error('❌ Error details:', error.message);

            // ✅ უკეთესი error message user-ისთვის
            if (error.message.includes('PHP error')) {
                alert('სერვერის შეცდომა: PHP შეცდომა მოხდა. შეამოწმეთ server logs.');
            } else if (error.message.includes('Invalid JSON')) {
                alert('სერვერის პასუხი არასწორია. შეამოწმეთ server configuration.');
            } else {
                alert('შეცდომა დამატებისას: ' + error.message);
            }
        })
        .finally(() => {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            console.log('🔄 Request completed, button re-enabled');
        });
}

function clearAddItemForm() {
    document.getElementById('subcategory').innerHTML = '<option value="">აირჩიე ქვეკატეგორია</option>';
    document.getElementById('price').value = '';
    document.getElementById('quantity').value = '1';
}

function showSuccessMessage(message) {
    // Create temporary success message
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.innerHTML = `
<i class="bi bi-check-circle-fill me-2"></i>${message}
<button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
`;

    document.body.appendChild(alertDiv);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.style.transition = 'all 0.5s ease';
            alertDiv.style.opacity = '0';
            alertDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                alertDiv.remove();
            }, 500);
        }
    }, 3000);
}

// ===== HALL SELECT ALL FUNCTIONS =====

function toggleHallSelectAll(hallName) {
    const checkbox = document.getElementById(`hall_select_all_${md5(hallName)}`);
    if (checkbox) {
        checkbox.checked = !checkbox.checked;
        handleHallSelectAll(checkbox, hallName);
    }
}

function handleHallSelectAll(checkbox, hallName) {
    const isChecked = checkbox.checked;
    console.log(`🏢 Hall Select All: ${hallName} - ${isChecked ? 'Checked' : 'Unchecked'}`);

    // მონიშნა/მოხსნა ყველა კატეგორია ამ დარბაზში
    const hallSection = checkbox.closest('.hall-section');
    const categoryCheckboxes = hallSection.querySelectorAll('.category-checkbox');

    categoryCheckboxes.forEach(catCheckbox => {
        if (catCheckbox.checked !== isChecked) {
            catCheckbox.checked = isChecked;
            handleCategorySelection(catCheckbox);
        }
    });

    // განახლება Payment Summary
    updateMenuTotalFromTable();

    // ვიზუალური ეფექტი
    if (isChecked) {
        hallSection.style.boxShadow = '0 0 15px rgba(0, 123, 255, 0.3)';
        setTimeout(() => {
            hallSection.style.boxShadow = '';
        }, 1000);
    }
}

// ===== PAYMENT SUMMARY FUNCTIONS =====

function updatePaymentSummary() {
    // This will be called separately for menu total
    updateMenuTotalFromTable();
}

function updateQuickTotalDisplay() {
    const paymentTotalBase = document.getElementById('payment-total-base');
    const quickTotalDisplay = document.getElementById('quick_total_display');

    if (paymentTotalBase && quickTotalDisplay) {
        quickTotalDisplay.textContent = paymentTotalBase.textContent + ' ₾';
    }
}

function applyVATDeduction() {
    const vatCheckbox = document.getElementById('vat_deduction_checkbox');
    const vatAmountElement = document.getElementById('vat_amount');
    const netAmountElement = document.getElementById('net-amount-base');
    const remainingAmountElement = document.getElementById('remaining-amount-base');

    if (!vatCheckbox || !vatAmountElement || !netAmountElement || !remainingAmountElement) {
        return;
    }

    // მთლიანი თანხა (მხოლოდ მენიუ)
    const paymentTotalBase = document.getElementById('payment-total-base');
    const grandTotal = parseFloat(paymentTotalBase.textContent) || 0;

    if (vatCheckbox.checked) {
        // სწორი DGV გამოთვლა - ჯამური თანხა უკვე შეიცავს DGV-ს
        const netAmount = grandTotal / 1.18;
        const vatAmount = grandTotal - netAmount;

        vatAmountElement.textContent = vatAmount.toFixed(2) + ' ₾';
        netAmountElement.textContent = netAmount.toFixed(2);
        remainingAmountElement.textContent = netAmount.toFixed(2);
    } else {
        vatAmountElement.textContent = '0.00 ₾';
        netAmountElement.textContent = grandTotal.toFixed(2);
        remainingAmountElement.textContent = grandTotal.toFixed(2);
    }

    // განაახლოთ დარჩენილი თანხა
    calculateRemaining();

    // Update quick total display
    updateQuickTotalDisplay();
}

function calculateRemaining() {
    const vatCheckbox = document.getElementById('vat_deduction_checkbox');
    const prepaymentInput = document.getElementById('prepayment_input');
    const remainingAmountElement = document.getElementById('remaining-amount-base');
    const paymentTotalBase = document.getElementById('payment-total-base');

    if (!prepaymentInput || !remainingAmountElement || !paymentTotalBase) {
        return;
    }

    const grandTotal = parseFloat(paymentTotalBase.textContent) || 0;
    const prepayment = parseFloat(prepaymentInput.value) || 0;

    let finalAmount = grandTotal;

    // თუ DGV გამოკლება ჩართულია
    if (vatCheckbox && vatCheckbox.checked) {
        finalAmount = grandTotal / 1.18; // სწორი DGV გამოთვლა
    }

    const remaining = Math.max(0, finalAmount - prepayment);
    remainingAmountElement.textContent = remaining.toFixed(2);

    // Update quick total display
    updateQuickTotalDisplay();
}

function updateTotalLabelText() {
    const totalLabelElement = document.getElementById('total_label_text');
    if (!totalLabelElement) return;

    // შევამოწმოთ არის თუ არა რაიმე ფასდაკლება
    let hasAnyDiscount = false;
    for (const categoryKey in categoryDiscounts) {
        if (categoryDiscounts[categoryKey] > 0) {
            hasAnyDiscount = true;
            break;
        }
    }

    // განვაახლოთ ტექსტი იმისდა მიხედვით არის თუ არა ფასდაკლება
    if (hasAnyDiscount) {
        totalLabelElement.textContent = 'ჯამი დღგს ჩათვლით ფასდაკლებული';
    } else {
        totalLabelElement.textContent = 'ჯამი დღგ-ს ჩათვლით';
    }
}

// ===== GUEST INFORMATION FUNCTIONS =====

function setupDateTimeDropdowns() {
    const daySelect = document.getElementById('reservation_day');
    const monthSelect = document.getElementById('reservation_month');
    const yearSelect = document.getElementById('reservation_year');
    const hourSelect = document.getElementById('reservation_hour');
    const minuteSelect = document.getElementById('reservation_minute');

    const hiddenDate = document.getElementById('reservation_date');
    const hiddenTime = document.getElementById('reservation_time');
    const dateDisplay = document.getElementById('selected_date_display');
    const timeDisplay = document.getElementById('selected_time_display');

    if (!daySelect || !monthSelect || !yearSelect || !hourSelect || !minuteSelect ||
        !hiddenDate || !hiddenTime || !dateDisplay || !timeDisplay) {
        return;
    }

    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const currentHour = now.getHours();

    daySelect.value = String(currentDay).padStart(2, '0');
    monthSelect.value = String(currentMonth).padStart(2, '0');
    yearSelect.value = currentYear;

    // მოხსნილია საათის შეზღუდვა
    hourSelect.value = String(currentHour).padStart(2, '0');
    minuteSelect.value = '00';

    function updateDate() {
        const day = daySelect.value;
        const month = monthSelect.value;
        const year = yearSelect.value;

        if (day && month && year) {
            const date = new Date(year, month - 1, day);
            if (date.getFullYear() == year &&
                date.getMonth() == month - 1 &&
                date.getDate() == day) {

                hiddenDate.value = `${year}-${month}-${day}`;

                [daySelect, monthSelect, yearSelect].forEach(select => {
                    select.style.borderColor = '#28a745';
                });
            } else {
                hiddenDate.value = '';
                dateDisplay.textContent = 'არასწორი თარიღი';
                dateDisplay.style.color = '#dc3545';

                [daySelect, monthSelect, yearSelect].forEach(select => {
                    select.style.borderColor = '#dc3545';
                });
            }
        } else {
            hiddenDate.value = '';
            dateDisplay.textContent = '';
            [daySelect, monthSelect, yearSelect].forEach(select => {
                select.style.borderColor = '';
            });
        }
    }

    function updateTime() {
        const hour = hourSelect.value;
        const minute = minuteSelect.value;

        if (hour && minute) {
            hiddenTime.value = `${hour}:${minute}`;
            timeDisplay.textContent = `არჩეული: ${hour}:${minute}`;
            timeDisplay.style.color = '#28a745';

            [hourSelect, minuteSelect].forEach(select => {
                select.style.borderColor = '#28a745';
            });
        } else {
            hiddenTime.value = '';
            timeDisplay.textContent = '';
            [hourSelect, minuteSelect].forEach(select => {
                select.style.borderColor = '';
            });
        }
    }

    daySelect.addEventListener('change', updateDate);
    monthSelect.addEventListener('change', updateDate);
    yearSelect.addEventListener('change', updateDate);

    hourSelect.addEventListener('change', updateTime);
    minuteSelect.addEventListener('change', updateTime);

    updateDate();
    updateTime();
}

function finalizeOrder(withGuestInfo) {
    // ჯერ შევამოწმოთ არის თუ არა რამე ელემენტი მენიუში
    const menuItems = document.querySelectorAll('.menu-item');
    if (menuItems.length === 0) {
        alert('❌ მენიუ ცარიელია! დაამატეთ ელემენტები მენიუში შეკვეთის დასრულებამდე.');
        return;
    }

    const guestNameEl = document.getElementById('guest_name');
    const reservationDateEl = document.getElementById('reservation_date');
    const reservationTimeEl = document.getElementById('reservation_time');

    if (!guestNameEl || !reservationDateEl || !reservationTimeEl) {
        alert('გვერდზე ელემენტები არ მოიძებნა. გაიმეორეთ მცდელობა.');
        return;
    }

    const guestName = guestNameEl.value.trim();
    const guestPhone = document.getElementById('guest_phone').value.trim(); // Database-ში NOT NULL
    const guestEmail = document.getElementById('guest_email').value.trim();
    const reservationDate = reservationDateEl.value;
    const reservationTime = reservationTimeEl.value;
    const additionalInfo = document.getElementById('additional_info').value.trim(); // Database-ში NOT NULL
    const hallId = document.getElementById('hall_id').value;
    const layout = document.getElementById('layout').value.trim(); // Database-ში NOT NULL
    const guestQuantity = document.getElementById('guest_quantity').value;

    const day = document.getElementById('reservation_day').value;
    const month = document.getElementById('reservation_month').value;
    const year = document.getElementById('reservation_year').value;
    const hour = document.getElementById('reservation_hour').value;
    const minute = document.getElementById('reservation_minute').value;

    // Enhanced validation based on your database NOT NULL constraints
    const errors = [];

    if (!guestName) errors.push('• სახელი (სავალდებულო)');
    if (!day) errors.push('• რეზერვაციის დღე');
    if (!month) errors.push('• რეზერვაციის თვე');
    if (!year) errors.push('• რეზერვაციის წელი');
    if (!hour) errors.push('• რეზერვაციის საათი');
    if (!minute) errors.push('• რეზერვაციის წუთი');
    if (!hallId) errors.push('• დარბაზი (სავალდებულო)');
    if (!layout) errors.push('• განლაგება - A/B (სავალდებულო)');
    if (!guestQuantity || parseInt(guestQuantity) <= 0) errors.push('• სტუმრების რაოდენობა (სავალდებულო)');

    // Field length validation based on your database structure
    if (guestEmail && guestEmail.length > 60) {
        errors.push('• Email ძალიან გრძელია (მაქს. 60 სიმბოლო)');
    }

    if (additionalInfo && additionalInfo.length > 350) {
        errors.push('• დამატებითი ინფო ძალიან გრძელია (მაქს. 350 სიმბოლო)');
    }

    if (layout && layout.length > 10) {
        errors.push('• განლაგება ძალიან გრძელია (მაქს. 10 სიმბოლო)');
    }

    if (errors.length > 0) {
        alert('❌ გთხოვთ გამოასწოროთ შემდეგი შეცდომები:\n\n' + errors.join('\n'));

        // Open guest accordion if closed
        const accordionCollapse = document.getElementById('guestCollapse');
        if (!accordionCollapse.classList.contains('show')) {
            const accordionButton = document.querySelector('[data-bs-target="#guestCollapse"]');
            if (accordionButton) {
                accordionButton.click();
            }
        }
        return;
    }

    // Date validation
    const selectedDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        alert('❌ არ შეგიძლიათ აირჩიოთ წარსული თარიღი!');
        return;
    }

    // Show confirmation with order summary
    const totalItems = menuItems.length;
    const paymentTotal = document.getElementById('payment-total-base')?.textContent || '0.00';

    const confirmMessage = `🔔 შეკვეთის დადასტურება:\n\n` +
        `👤 სტუმარი: ${guestName}\n` +
        `📞 ტელეფონი: ${guestPhone || 'არ არის მითითებული'}\n` +
        `📧 Email: ${guestEmail || 'არ არის მითითებული'}\n` +
        `📅 თარიღი: ${day}/${month}/${year}\n` +
        `🕐 დრო: ${hour}:${minute}\n` +
        `🏢 დარბაზი: ${document.querySelector('#hall_id option:checked')?.textContent || 'უცნობი'}\n` +
        `📐 განლაგება: ${layout}\n` +
        `👥 სტუმრების რაოდენობა: ${guestQuantity}\n` +
        `💬 დამატებითი ინფო: ${additionalInfo || 'არ არის'}\n` +
        `🍽️ მენიუს ელემენტები: ${totalItems}\n` +
        `💰 ჯამური თანხა: ${paymentTotal} ₾\n\n` +
        `დარწმუნებული ხართ, რომ გსურთ შეკვეთის დასრულება?`;

    if (!confirm(confirmMessage)) {
        return;
    }

    // Show loading state
    const submitButtons = document.querySelectorAll('button[onclick*="finalizeOrder"]');
    submitButtons.forEach(btn => {
        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>შეკვეთის დასრულება...';
    });

    // Fill hidden form with proper values
    document.getElementById('form_guest_name').value = guestName || '';
    document.getElementById('form_guest_phone').value = guestPhone || '';
    document.getElementById('form_guest_email').value = guestEmail || '';
    document.getElementById('form_reservation_date').value = reservationDate || '';
    document.getElementById('form_reservation_time').value = reservationTime || '';
    document.getElementById('form_additional_info').value = additionalInfo || '';
    document.getElementById('form_hall_id').value = hallId || '';
    document.getElementById('form_layout').value = layout || '';
    document.getElementById('form_guest_quantity').value = guestQuantity || '';

    // ✅ Template name-ის დამატება
    let orderTemplateName = '';
    if (localStorage.getItem('currentOrderTemplateName')) {
        orderTemplateName = localStorage.getItem('currentOrderTemplateName');
    } else {
        orderTemplateName = `შეკვეთა ${guestName} ${day}/${month}/${year} ${hour}:${minute}`;
    }
    document.getElementById('form_order_template_name').value = orderTemplateName;

    // ✨ ახალი - ფასდაკლებების მონაცემების მომზადება
    const categoryDiscountsJson = JSON.stringify(categoryDiscounts);

    // ✨ ახალი hidden input ფასდაკლებებისთვის
    let discountInput = document.getElementById('form_category_discounts');
    if (!discountInput) {
        discountInput = document.createElement('input');
        discountInput.type = 'hidden';
        discountInput.name = 'category_discounts';
        discountInput.id = 'form_category_discounts';
        document.getElementById('fullOrderForm').appendChild(discountInput);
    }
    discountInput.value = categoryDiscountsJson;

    console.log('🎯 Sending discounts data:', categoryDiscounts);
    console.log('🎯 JSON string:', categoryDiscountsJson);






    // Debug logging before submission
    console.log('🚀 Final form data before submission:', {
        guest_name: document.getElementById('form_guest_name').value,
        guest_phone: document.getElementById('form_guest_phone').value,
        guest_email: document.getElementById('form_guest_email').value,
        reservation_date: document.getElementById('form_reservation_date').value,
        reservation_time: document.getElementById('form_reservation_time').value,
        additional_info: document.getElementById('form_additional_info').value,
        hall_id: document.getElementById('form_hall_id').value,
        layout: document.getElementById('form_layout').value,
        guest_quantity: document.getElementById('form_guest_quantity').value
    });

    // ✅ მონიშნული ელემენტების მიღება
    const actualSelection = getActuallySelectedItems();
    const totalSelected = actualSelection.categories.length + actualSelection.items.length;

    // ✅ მონიშნული ელემენტების hidden inputs-ების დამატება
    const form = document.getElementById('fullOrderForm');

    // წაშალოთ ძველი selection inputs თუ არსებობს
    const existingCategoriesContainer = document.getElementById('form_selected_categories_container');
    const existingItemsContainer = document.getElementById('form_selected_items_container');
    if (existingCategoriesContainer) existingCategoriesContainer.remove();
    if (existingItemsContainer) existingItemsContainer.remove();

    // ახალი containers
    const categoriesContainer = document.createElement('div');
    categoriesContainer.id = 'form_selected_categories_container';
    const itemsContainer = document.createElement('div');
    itemsContainer.id = 'form_selected_items_container';

    // მონიშნული კატეგორიები
    actualSelection.categories.forEach(categoryKey => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'selected_categories[]';
        input.value = categoryKey;
        categoriesContainer.appendChild(input);
    });

    // მონიშნული ელემენტები
    actualSelection.items.forEach(itemId => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'selected_items[]';
        input.value = itemId;
        itemsContainer.appendChild(input);
    });

    form.appendChild(categoriesContainer);
    form.appendChild(itemsContainer);

    // Submit with error handling
    try {
        console.log('🚀 Submitting order with selection data:', {
            name: guestName,
            selected_categories: actualSelection.categories.length,
            selected_items: actualSelection.items.length,
            total_selected: totalSelected
        });

        document.getElementById('fullOrderForm').submit();
    } catch (error) {
        console.error('Form submission error:', error);
        alert('❌ შეკვეთის გაგზავნისას მოხდა შეცდომა. თავიდან სცადეთ.');

        // Re-enable buttons
        submitButtons.forEach(btn => {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-check-circle me-2"></i>შეკვეთის დასრულება';
        });
    }
}

// ===== SELECTION MANAGEMENT FUNCTIONS =====

function handleCategorySelection(checkbox) {
    const hall = checkbox.dataset.hall;
    const category = checkbox.dataset.category;
    const categoryKey = `${hall}|${category}`;

    console.log('Category selection changed:', {
        hall: hall,
        category: category,
        checked: checkbox.checked,
        categoryKey: categoryKey
    });

    if (checkbox.checked) {
        if (!selectedCategories.includes(categoryKey)) {
            selectedCategories.push(categoryKey);
        }

        // მონიშნა ყველა ქვეკატეგორია ამ კატეგორიაში
        const categoryRow = checkbox.closest('.category-section');
        let nextRow = categoryRow.nextElementSibling;

        while (nextRow && nextRow.classList.contains('menu-item')) {
            const itemCheckbox = nextRow.querySelector('.item-checkbox');
            if (itemCheckbox && !itemCheckbox.checked) {
                itemCheckbox.checked = true;
                handleItemSelection(itemCheckbox);
            }
            nextRow = nextRow.nextElementSibling;
        }

        // ვიზუალური ეფექტი
        categoryRow.classList.add('selected-category');

    } else {
        selectedCategories = selectedCategories.filter(cat => cat !== categoryKey);

        // მოხსნა ყველა ქვეკატეგორია ამ კატეგორიიდან
        const categoryRow = checkbox.closest('.category-section');
        let nextRow = categoryRow.nextElementSibling;

        while (nextRow && nextRow.classList.contains('menu-item')) {
            const itemCheckbox = nextRow.querySelector('.item-checkbox');
            if (itemCheckbox && itemCheckbox.checked) {
                itemCheckbox.checked = false;
                handleItemSelection(itemCheckbox);
            }
            nextRow = nextRow.nextElementSibling;
        }

        // ვიზუალური ეფექტი
        categoryRow.classList.remove('selected-category');
    }

    // შევამოწმოთ hall select all checkbox
    updateHallSelectAllStatus(hall);
    updateMenuTotalFromTable();
}

function handleItemSelection(checkbox) {
    const itemId = checkbox.dataset.itemId;
    const hall = checkbox.dataset.hall;
    const category = checkbox.dataset.category;
    const row = checkbox.closest('tr');

    console.log('Item selection changed:', {
        itemId: itemId,
        hall: hall,
        category: category,
        checked: checkbox.checked
    });

    if (checkbox.checked) {
        if (!selectedItems.includes(itemId)) {
            selectedItems.push(itemId);
        }
        row.classList.add('selected-row');
    } else {
        selectedItems = selectedItems.filter(id => id !== itemId);
        row.classList.remove('selected-row');

        // ★ ახალი ლოგიკა: თუ კატეგორიაში მხოლოდ 1 ქვეკატეგორიაა და ის მოვხსენით - კატეგორიასაც მოვხსნათ
        const categoryCheckbox = document.getElementById(`cat_${md5(hall + '_' + category)}`);
        if (categoryCheckbox) {
            const categoryRow = categoryCheckbox.closest('.category-section');
            let nextRow = categoryRow.nextElementSibling;
            let totalItemsInCategory = 0;
            let checkedItemsInCategory = 0;

            // ვთვლით რამდენი ქვეკატეგორიაა კატეგორიაში
            while (nextRow && nextRow.classList.contains('menu-item')) {
                const itemCheckbox = nextRow.querySelector('.item-checkbox');
                if (itemCheckbox) {
                    totalItemsInCategory++;
                    if (itemCheckbox.checked) {
                        checkedItemsInCategory++;
                    }
                }
                nextRow = nextRow.nextElementSibling;
            }

            // თუ კატეგორიაში მხოლოდ 1 ქვეკატეგორიაა და ის არ არის მონიშნული
            if (totalItemsInCategory === 1 && checkedItemsInCategory === 0) {
                const categoryKey = `${hall}|${category}`;
                categoryCheckbox.checked = false;
                categoryCheckbox.indeterminate = false;
                categoryRow.classList.remove('selected-category');
                // ამოვშალოთ selectedCategories array-დან
                selectedCategories = selectedCategories.filter(cat => cat !== categoryKey);
                console.log(`🔧 Single item category unchecked: removed ${categoryKey} from selectedCategories`);
            }
        }
    }

    // შევამოწმოთ category checkbox status
    updateCategoryCheckboxStatus(hall, category);
    // შევამოწმოთ hall select all checkbox
    updateHallSelectAllStatus(hall);

    // ✅ ახალი - ფასდაკლების თავიდან გადათვლა
    const categoryKey = `${hall}|${category}`;
    const discountInput = document.querySelector(`.discount-input[data-category="${category}"][data-hall="${hall}"]`);
    console.log('🔄 Recalculating discount for:', categoryKey);
    console.log('🔍 Discount input found:', discountInput);
    console.log('💰 Discount value:', discountInput ? discountInput.value : 'N/A');

    if (discountInput && discountInput.value) {
        console.log('✅ Reapplying discount...');
        applyCategoryDiscount(discountInput);
    } else {
        console.log('❌ No discount to reapply');
    }

    updateMenuTotalFromTable();
    updateCategoryFinalAmount(hall, category);
}




function updateCategoryCheckboxStatus(hall, category) {
    const categoryCheckbox = document.getElementById(`cat_${md5(hall + '_' + category)}`);
    if (!categoryCheckbox) return;

    const categoryKey = `${hall}|${category}`;

    console.log(`🔍 Updating category status: ${categoryKey}`);

    // ვთვლით კატეგორიაში მონიშნულ ელემენტებს
    const categoryRow = categoryCheckbox.closest('.category-section');
    let nextRow = categoryRow.nextElementSibling;
    let totalItems = 0;
    let checkedItems = 0;

    while (nextRow && nextRow.classList.contains('menu-item')) {
        const itemCheckbox = nextRow.querySelector('.item-checkbox');
        if (itemCheckbox) {
            totalItems++;
            if (itemCheckbox.checked) {
                checkedItems++;
            }
        }
        nextRow = nextRow.nextElementSibling;
    }

    console.log(`📊 Category ${categoryKey}: ${checkedItems}/${totalItems} checked`);
    console.log(`📋 Before: selectedCategories =`, selectedCategories);

    // განვსაზღვროთ category checkbox მდგომარეობა და განვაახლოთ selectedCategories array
    if (checkedItems === 0) {
        console.log(`❌ No items checked - removing category`);
        categoryCheckbox.checked = false;
        categoryCheckbox.indeterminate = false;
        categoryRow.classList.remove('selected-category');
        // ამოვშალოთ selectedCategories array-დან
        selectedCategories = selectedCategories.filter(cat => cat !== categoryKey);
    } else if (checkedItems === totalItems) {
        console.log(`✅ All items checked - adding category`);
        categoryCheckbox.checked = true;
        categoryCheckbox.indeterminate = false;
        categoryRow.classList.add('selected-category');
        // დავამატოთ selectedCategories array-ში თუ არ არის
        if (!selectedCategories.includes(categoryKey)) {
            selectedCategories.push(categoryKey);
        }
    } else {
        console.log(`⚠️ Partial selection - removing from array but keeping visual`);
        categoryCheckbox.checked = false;
        categoryCheckbox.indeterminate = true;
        categoryRow.classList.add('selected-category');
        // ნაწილობრივ მონიშნულის შემთხვევაში ამოვშალოთ selectedCategories array-დან
        selectedCategories = selectedCategories.filter(cat => cat !== categoryKey);
    }

    console.log(`📋 After: selectedCategories =`, selectedCategories);
}

function updateHallSelectAllStatus(hall) {
    const hallCheckbox = document.getElementById(`hall_select_all_${md5(hall)}`);
    if (!hallCheckbox) return;

    const hallSection = hallCheckbox.closest('.hall-section');
    const categoryCheckboxes = hallSection.querySelectorAll('.category-checkbox');

    let totalCategories = categoryCheckboxes.length;
    let checkedCategories = 0;

    categoryCheckboxes.forEach(checkbox => {
        if (checkbox.checked || checkbox.indeterminate) {
            checkedCategories++;
        }
    });

    if (checkedCategories === 0) {
        hallCheckbox.checked = false;
        hallCheckbox.indeterminate = false;
    } else if (checkedCategories === totalCategories) {
        hallCheckbox.checked = true;
        hallCheckbox.indeterminate = false;
    } else {
        hallCheckbox.checked = false;
        hallCheckbox.indeterminate = true;
    }
}

function updateMenuTotalFromTable() {
    let totalMenuAmount = 0;
    let totalDiscountAmount = 0; // ახალი ვარიაბლი ფასდაკლებებისთვის
    let itemsCount = 0;

    console.log(`💰 === CALCULATING MENU TOTAL WITH DISCOUNTS ===`);
    console.log(`📋 selectedCategories:`, selectedCategories);
    console.log(`📋 selectedItems:`, selectedItems);
    console.log(`💸 categoryDiscounts:`, categoryDiscounts);

    // გამოვთვალოთ მხოლოდ მონიშნული ელემენტების ჯამი
    const visibleHallSections = document.querySelectorAll('.hall-section');

    visibleHallSections.forEach(hallSection => {
        const style = window.getComputedStyle(hallSection);
        if (style.display !== 'none') {
            const hall = hallSection.dataset.hall;
            const menuItems = hallSection.querySelectorAll('.menu-item');

            menuItems.forEach(row => {
                const rowStyle = window.getComputedStyle(row);
                if (rowStyle.display !== 'none') {
                    const itemCheckbox = row.querySelector('.item-checkbox');
                    const itemId = row.dataset.itemId;
                    const category = row.dataset.category;
                    const categoryKey = `${hall}|${category}`;
                    const subcategory = row.dataset.subcategory;

                    // მხოლოდ მონიშნული ელემენტები ან მონიშნული კატეგორიის ელემენტები
                    const isItemSelected = itemCheckbox && itemCheckbox.checked;
                    const isCategorySelected = selectedCategories.includes(categoryKey);
                    const isItemInSelectedArray = selectedItems.includes(itemId);

                    console.log(`🔍 Item: ${subcategory} (ID: ${itemId})`);
                    console.log(` - checkbox checked: ${isItemSelected}`);
                    console.log(` - category selected: ${isCategorySelected} (${categoryKey})`);
                    console.log(` - in selectedItems: ${isItemInSelectedArray}`);

                    // თუ checkbox ექსპლიციტურად unchecked არის, არ ჩათვალო
                    if (itemCheckbox && itemCheckbox.checked === false && !isItemInSelectedArray) {
                        console.log(` ❌ Skipping item (explicitly unchecked)`);
                    } else if (isItemSelected || isCategorySelected || isItemInSelectedArray) {
                        const totalCell = row.querySelector('.total-cell');
                        if (totalCell) {
                            // ვცდილობთ data-total ატრიბუტიდან, თუ არ არის - ტექსტიდან
                            let total = 0;
                            if (totalCell.dataset.total) {
                                total = parseFloat(totalCell.dataset.total);
                            } else {
                                // ტექსტიდან ამოვიღოთ რიცხვი (მაგ: "25.50 ₾" -> 25.50)
                                const text = totalCell.textContent || totalCell.innerText;
                                const numberMatch = text.match(/[\d,]+\.?\d*/);
                                if (numberMatch) {
                                    total = parseFloat(numberMatch[0].replace(',', ''));
                                }
                            }

                            if (!isNaN(total)) {
                                totalMenuAmount += total;
                                itemsCount++;
                                console.log(` ✅ Adding ${total} ₾ to total`);
                            }
                        }
                    } else {
                        console.log(` ❌ Skipping item`);
                    }
                }
            });

            // ✨ ახალი: ფასდაკლებების დათვლა ყველა ხილული კატეგორიისთვის
            const categoryRows = hallSection.querySelectorAll('.category-section');
            categoryRows.forEach(categoryRow => {
                const categoryRowStyle = window.getComputedStyle(categoryRow);
                if (categoryRowStyle.display !== 'none') {
                    const category = categoryRow.dataset.category;
                    const categoryKey = `${hall}|${category}`;

                    if (categoryDiscounts[categoryKey]) {
                        const discount = categoryDiscounts[categoryKey];
                        totalDiscountAmount += discount;
                        console.log(`💸 Adding discount ${discount} ₾ for category ${categoryKey}`);
                    }
                }
            });
        }
    });

    // საბოლოო ჯამი ფასდაკლების გამოკლებით
    const finalTotal = Math.max(0, totalMenuAmount - totalDiscountAmount);

    console.log(`💰 Menu calculation: ${itemsCount} selected items`);
    console.log(`💰 Subtotal: ${totalMenuAmount.toFixed(2)} ₾`);
    console.log(`💸 Discounts: -${totalDiscountAmount.toFixed(2)} ₾`);
    console.log(`💰 Final Total: ${finalTotal.toFixed(2)} ₾`);

    // განაახლოთ Payment Summary
    const menuTotalBase = document.getElementById('menu-total-base');
    const paymentTotalBase = document.getElementById('payment-total-base');
    const netAmountBase = document.getElementById('net-amount-base');
    const remainingAmountBase = document.getElementById('remaining-amount-base');

    if (menuTotalBase) menuTotalBase.textContent = finalTotal.toFixed(2);

    // Grand total = Menu total with discounts applied
    const grandTotal = finalTotal;

    if (paymentTotalBase) paymentTotalBase.textContent = grandTotal.toFixed(2);
    if (netAmountBase) netAmountBase.textContent = grandTotal.toFixed(2);
    if (remainingAmountBase) remainingAmountBase.textContent = grandTotal.toFixed(2);

    // Recalculate VAT and remaining
    applyVATDeduction();

    // Update quick total in accordion header
    updateQuickTotalDisplay();

    // ახალი ხაზი:
    updateTotalLabelText();

    console.log(`📊 Payment Summary: Menu ${totalMenuAmount.toFixed(2)} - Discounts ${totalDiscountAmount.toFixed(2)} = Total ${grandTotal.toFixed(2)} ₾ (${itemsCount} selected items)`);
}

function clearAllSelections() {
    // გასუფთავება arrays
    selectedCategories = [];
    selectedItems = [];
    categoryDiscounts = {}; // ფასდაკლებების გასუფთავება

    // გასუფთავება checkboxes
    document.querySelectorAll('.category-checkbox').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.indeterminate = false;
        const categoryRow = checkbox.closest('.category-section');
        if (categoryRow) {
            categoryRow.classList.remove('selected-category');
        }
    });

    document.querySelectorAll('.item-checkbox').forEach(checkbox => {
        checkbox.checked = false;
        const row = checkbox.closest('tr');
        if (row) {
            row.classList.remove('selected-row');
        }
    });

    // გასუფთავება hall select all checkboxes
    document.querySelectorAll('[id^="hall_select_all_"]').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.indeterminate = false;
    });

    // ფასდაკლების ველების გასუფთავება
    document.querySelectorAll('.discount-input').forEach(input => {
        input.value = '';
    });

    // ფასდაკლების საბოლოო თანხების ნულზე დაყენება
    document.querySelectorAll('.category-final-amount').forEach(span => {
        span.textContent = '0.00 ₾';
        span.style.color = '#007bff'; // ლურჯი ნორმალურისთვის
    });

    updateMenuTotalFromTable();
}

// MD5 hash function (simplified for category ID generation)
function md5(str) {
    // Simple hash function for generating consistent IDs
    let hash = 0;
    if (str.length === 0) return hash.toString();
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString();
}

// ===== QUANTITY UPDATE FUNCTIONS =====

function handleGlobalBulkQuantityKeyup(event) {
    if (event.key === 'Enter') {
        updateGlobalQuantityAjax();
    }
}

function updateGlobalQuantityAjax() {
    const quantityInput = document.getElementById('globalBulkQuantityInput');
    const button = document.getElementById('globalBulkUpdateBtn');
    const newQuantity = parseInt(quantityInput.value);

    if (!newQuantity || newQuantity < 1) {
        // Just clear the input and return
        quantityInput.value = '';
        quantityInput.focus();
        return;
    }

    // Count only visible items in selected halls
    let totalItems = 0;
    const selectedHallNames = [];
    selectedHalls.forEach(hallId => {
        const checkbox = document.getElementById(`hall_${hallId}`);
        if (checkbox) {
            const hallName = checkbox.parentElement.querySelector('.dropdown-text').textContent.trim();
            selectedHallNames.push(hallName);
        }
    });

    selectedHallNames.forEach(hallName => {
        const hallSection = document.querySelector(`[data-hall="${hallName}"]`);
        if (hallSection && hallSection.style.display !== 'none') {
            const menuItems = hallSection.querySelectorAll('.menu-item');
            totalItems += menuItems.length;
        }
    });

    const confirmMessage = `ნამდვილად გსურთ არჩეული ${totalItems} ქვეკატეგორიისთვის რაოდენობის მინიჭება ${newQuantity}-ზე?`;


    if (confirm(confirmMessage)) {
        const originalContent = button.innerHTML;
        button.innerHTML = '<i class="bi bi-hourglass-split"></i> განახლება...';
        button.disabled = true;
        quantityInput.disabled = true;

        const formData = new FormData();
        formData.append('ajax_global_bulk_update', '1');
        formData.append('new_quantity', newQuantity);

        fetch(window.location.pathname, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                console.log('Response status:', response.status);
                return response.text();
            })
            .then(text => {
                console.log('Raw response:', text);
                try {
                    const data = JSON.parse(text);
                    console.log('Parsed data:', data);

                    button.innerHTML = '<i class="bi bi-check-circle-fill"></i> დასრულდა!';
                    button.style.background = 'rgba(40, 167, 69, 0.3)';
                    button.style.borderColor = 'rgba(40, 167, 69, 0.8)';

                    if (data.success) {
                        updateAllMenuItemsFromResponse(data.updated_items);
                        showSuccessMessage(data.message);
                        quantityInput.value = '';

                        // Add special effect for global update
                        const container = document.querySelector('#globalBulkContainer .accordion-button');
                        if (container) {
                            container.style.backgroundColor = '#d4edda';

                            setTimeout(() => {
                                container.style.backgroundColor = '#e3f2fd';
                            }, 2000);
                        }
                    } else {
                        // Don't show error alerts
                        console.log('Update response:', data.message);
                    }

                    setTimeout(() => {
                        button.innerHTML = originalContent;
                        button.style.background = '';
                        button.style.borderColor = '';
                        button.disabled = false;
                        quantityInput.disabled = false;
                    }, 3000);

                } catch (e) {
                    console.error('JSON parse error:', e);
                    console.log('Response was:', text);
                    alert('Response error: ' + text.substring(0, 200));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Don't show error alerts
                button.innerHTML = originalContent;
                button.disabled = false;
                quantityInput.disabled = false;
            });
    }
}

function updateAllMenuItemsFromResponse(updatedItems) {
    updatedItems.forEach(item => {
        const menuRow = document.querySelector(`[data-item-id="${item.id}"]`);

        if (menuRow) {
            const quantityInput = menuRow.querySelector('.quantity-input');
            if (quantityInput) {
                quantityInput.value = item.quantity;
                quantityInput.dataset.originalValue = item.quantity;
            }

            const totalCell = menuRow.querySelector('.total-cell');
            if (totalCell) {
                totalCell.textContent = parseFloat(item.total).toFixed(2) + ' ₾';
                totalCell.dataset.total = item.total;
            }

            // Update notes if available
            const notesInput = menuRow.querySelector('.notes-input');
            if (notesInput && item.notes !== undefined) {
                notesInput.value = item.notes || '';
            }

            // Special animation for global update
            menuRow.style.background = 'linear-gradient(90deg, rgba(40, 167, 69, 0.2), rgba(32, 201, 151, 0.2))';
            menuRow.style.transform = 'scale(1.02)';
            menuRow.style.transition = 'all 0.3s ease';

            setTimeout(() => {
                menuRow.style.background = '';
                menuRow.style.transform = '';
            }, 1500);
        }
    });

    // განაახლოთ Payment Summary რადგან რაოდენობები შეიცვალა
    updateMenuTotalFromTable();

    // განაახლოთ კატეგორიების საბოლოო თანხები
    updateAllCategoryFinalAmounts();

    // Show a visual wave effect
    const allRows = document.querySelectorAll('.menu-item');
    allRows.forEach((row, index) => {
        setTimeout(() => {
            row.style.boxShadow = '0 0 15px rgba(40, 167, 69, 0.4)';
            setTimeout(() => {
                row.style.boxShadow = '';
            }, 500);
        }, index * 50);
    });
}

// Custom Dropdown Functions
function toggleHallDropdown() {
    const toggle = document.getElementById('menuDropdownToggle');
    const menu = document.getElementById('menuDropdownMenu');

    const isOpen = toggle.classList.contains('open');

    if (isOpen) {
        closeHallDropdown();
    } else {
        openHallDropdown();
    }
}

function openHallDropdown() {
    const toggle = document.getElementById('menuDropdownToggle');
    const menu = document.getElementById('menuDropdownMenu');

    toggle.classList.add('open', 'focused');
    menu.classList.add('show');

    document.addEventListener('click', handleOutsideClick);
}

function closeHallDropdown() {
    const toggle = document.getElementById('menuDropdownToggle');
    const menu = document.getElementById('menuDropdownMenu');

    toggle.classList.remove('open', 'focused');
    menu.classList.remove('show');

    document.removeEventListener('click', handleOutsideClick);
}

function handleOutsideClick(event) {
    const dropdown = event.target.closest('.custom-dropdown');
    const checkbox = event.target.closest('.dropdown-checkbox');

    if (!dropdown && !checkbox) {
        closeHallDropdown();
    }
}

function handleCheckboxClick(hallId, hallName, event) {
    event.stopPropagation();

    setTimeout(() => {
        const checkbox = document.getElementById(`hall_${hallId}`);
        const isChecked = checkbox.checked;

        if (isChecked) {
            if (!selectedHalls.includes(hallId)) {
                selectedHalls.push(hallId);
            }

            const mainHallInput = document.getElementById('hall_id_main');
            if (!mainHallInput.value) {
                mainHallInput.value = hallId;
                selectedHallId = hallId;
            }
        } else {
            selectedHalls = selectedHalls.filter(id => id !== hallId);

            const mainHallInput = document.getElementById('hall_id_main');
            if (mainHallInput.value == hallId) {
                if (selectedHalls.length > 0) {
                    mainHallInput.value = selectedHalls[0];
                    selectedHallId = selectedHalls[0];
                } else {
                    mainHallInput.value = '';
                    selectedHallId = 0;
                }
            }
        }

        updateHallDropdownText();
        filterMenuBySelectedHalls();
    }, 10);
}

function toggleHallSelection(hallId, hallName, event) {
    event.stopPropagation();

    const checkbox = document.getElementById(`hall_${hallId}`);
    checkbox.checked = !checkbox.checked;

    const mainHallInput = document.getElementById('hall_id_main');

    if (checkbox.checked) {
        if (!selectedHalls.includes(hallId)) {
            selectedHalls.push(hallId);
        }

        if (!mainHallInput.value) {
            mainHallInput.value = hallId;
            selectedHallId = hallId;
        }
    } else {
        selectedHalls = selectedHalls.filter(id => id !== hallId);

        if (mainHallInput.value == hallId) {
            if (selectedHalls.length > 0) {
                mainHallInput.value = selectedHalls[0];
                selectedHallId = selectedHalls[0];
            } else {
                mainHallInput.value = '';
                selectedHallId = 0;
            }
        }
    }

    updateHallDropdownText();
    filterMenuBySelectedHalls();
}

function updateHallDropdownText() {
    const toggle = document.getElementById('menuDropdownToggle');
    const textElement = toggle.querySelector('#hallDropdownText');

    if (selectedHalls.length === 0) {
        textElement.textContent = 'აირჩიეთ დარბაზი';
    } else if (selectedHalls.length === 1) {
        const checkbox = document.getElementById(`hall_${selectedHalls[0]}`);
        const hallName = checkbox.parentElement.querySelector('.dropdown-text').textContent;
        textElement.innerHTML = `${hallName} <span class="selected-count">(1)</span>`;
    } else {
        textElement.innerHTML = `არჩეულია <span class="selected-count">(${selectedHalls.length})</span>`;
    }
}

function filterMenuBySelectedHalls() {
    const menuResults = document.getElementById('menuResults');
    const globalBulkContainer = document.getElementById('globalBulkContainer');
    const searchContainer = document.getElementById('searchContainer');
    const noSearchResults = document.getElementById('noSearchResults');

    if (!menuResults) {
        return;
    }

    const allHallSections = menuResults.querySelectorAll('.hall-section');

    if (selectedHalls.length === 0) {
        // დამალვა ყველაფერი თუ დარბაზი არ არის არჩეული
        menuResults.style.display = 'none';
        if (globalBulkContainer) globalBulkContainer.style.display = 'none';
        if (searchContainer) searchContainer.style.display = 'none';
        if (noSearchResults) noSearchResults.style.display = 'none';

        // მენიუს ცარიელი მდგომარეობის ჩვენება
        showEmptyMenuState();

    } else {
        // მენიუს კომპონენტების ჩვენება
        menuResults.style.display = 'block';
        if (globalBulkContainer) globalBulkContainer.style.display = 'block';
        if (searchContainer) searchContainer.style.display = 'block';

        // ცარიელი მდგომარეობის დამალვა
        hideEmptyMenuState();

        const selectedHallNames = [];
        selectedHalls.forEach(hallId => {
            const checkbox = document.getElementById(`hall_${hallId}`);
            if (checkbox) {
                const hallName = checkbox.parentElement.querySelector('.dropdown-text').textContent.trim();
                selectedHallNames.push(hallName);
            }
        });

        allHallSections.forEach(section => {
            const sectionHallName = section.dataset.hall.trim();
            const isSelected = selectedHallNames.includes(sectionHallName);
            section.style.display = isSelected ? 'block' : 'none';
        });
    }

    // განაახლოთ Payment Summary როდესაც დარბაზი ირჩევა
    setTimeout(() => {
        updateMenuTotalFromTable();
    }, 100);
}

// // ===== Empty Menu State Functions =====
function showEmptyMenuState() {
    let emptyStateDiv = document.getElementById('emptyMenuState');

    if (!emptyStateDiv) {
        // შევქმნათ ცარიელი მდგომარეობის div
        emptyStateDiv = document.createElement('div');
        emptyStateDiv.id = 'emptyMenuState';
        emptyStateDiv.className = 'empty-state';
        emptyStateDiv.innerHTML = `<i class="bi bi-building" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.7; color: #6c757d;"></i> <h4 style="color: #495057; margin-bottom: 10px;">აირჩიეთ დარბაზი</h4>
<p class="mb-0" style="color: #6c757d;">მენიუს სანახავად ზემოთ აირჩიეთ მინიმუმ ერთი დარბაზი</p>
`;

        // ჩავსვათ menuResults-ის შემდეგ
        const menuResults = document.getElementById('menuResults');
        if (menuResults && menuResults.parentNode) {
            menuResults.parentNode.insertBefore(emptyStateDiv, menuResults.nextSibling);
        }
    }

    emptyStateDiv.style.display = 'block';
}

function hideEmptyMenuState() {
    const emptyStateDiv = document.getElementById('emptyMenuState');
    if (emptyStateDiv) {
        emptyStateDiv.style.display = 'none';
    }
}

// ===== TEMPLATE MODAL FUNCTIONS =====
function showTemplateNameModal(action = 'save') {
    currentModalAction = action; // ვინახავთ რა ქმედება უნდა შესრულდეს

    const menuResults = document.getElementById('menuResults');
    if (!menuResults || menuResults.children.length === 0) {
        alert('❌ მენიუ ცარიელია! დაამატეთ ელემენტები მენიუში.');
        return;
    }

    // რეალურად მონიშნული ელემენტების დათვლა
    const checkedCategories = document.querySelectorAll('.category-checkbox:checked').length;
    const checkedItems = document.querySelectorAll('.item-checkbox:checked').length;
    const totalSelected = checkedCategories + checkedItems;

    if (totalSelected === 0) {
        if (action === 'finalize') {
            // შეკვეთის დასრულებისას თუ არაფერი არ არის მონიშნული, ვკითხულობთ
            if (confirm('❌ არცერთი ელემენტი არ არის მონიშნული შესანახად.\n\nგსურთ შეკვეთის დასრულება შენახვის გარეშე?')) {
                finalizeOrder(true);
            }
            return;
        } else {
            alert('❌ აირჩიეთ მინიმუმ ერთი კატეგორია ან ქვეკატეგორია შესანახად!');
            return;
        }
    }

    const modal = document.getElementById('templateNameModal');
    const input = document.getElementById('templateNameInput');
    const modalTitle = document.getElementById('modalTitle');
    const modalSaveText = document.getElementById('modalSaveText');

    // Modal-ის სათაურისა და ღილაკის ტექსტის შეცვლა
    if (action === 'finalize') {
        modalTitle.innerHTML = '<i class="bi bi-check-circle"></i> მენიუს შენახვა და შეკვეთის დასრულება';
        modalSaveText.textContent = 'შენახვა და დასრულება';
    } else {
        modalTitle.innerHTML = '<i class="bi bi-file-text"></i> მენიუს სახელის შეყვანა';
        modalSaveText.textContent = 'შენახვა';
    }

    // მარტივი ვერსია
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hour = String(currentDate.getHours()).padStart(2, '0');
    const minute = String(currentDate.getMinutes()).padStart(2, '0');

    let defaultTemplateName;
    if (action === 'finalize') {
        defaultTemplateName = `შეკვეთა_${year}-${month}-${day}_${hour}:${minute}`;
    } else {
        defaultTemplateName = `მენიუ_${year}-${month}-${day}_${hour}:${minute}`;
    }

    input.value = defaultTemplateName;

    // Update selection info in modal
    updateModalSelectionInfo();

    modal.style.display = 'flex';
    input.focus();
    input.select();

    // Real-time validation setup
    setupTemplateNameValidation(input);

    input.onkeyup = function (e) {
        if (e.key === 'Enter') {
            executeModalAction();
        } else if (e.key === 'Escape') {
            hideTemplateNameModal();
        }
    };
}

function executeModalAction() {
    if (currentModalAction === 'finalize') {
        const templateName = document.getElementById('templateNameInput').value.trim();

        if (!templateName) {
            alert('❌ გთხოვთ შეიყვანოთ მენიუს სახელი!');
            document.getElementById('templateNameInput').focus();
            return;
        }

        localStorage.setItem('currentOrderTemplateName', templateName);

        hideTemplateNameModal();
        finalizeOrder(true);
    } else {
        saveMenuWithTemplate();
    }
}


function setupTemplateNameValidation(input) {
    let validationTimeout;

    // Remove existing validation message
    removeValidationMessage();

    input.addEventListener('input', function () {
        clearTimeout(validationTimeout);
        removeValidationMessage();

        const templateName = this.value.trim();

        if (templateName.length === 0) {
            return;
        }

        // Debounce validation check
        validationTimeout = setTimeout(() => {
            checkTemplateNameExists(templateName);
        }, 500);
    });
}

function checkTemplateNameExists(templateName) {
    const formData = new FormData();
    formData.append('check_template_name', '1');
    formData.append('template_name', templateName);

    fetch(window.location.pathname, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            showValidationMessage(data.exists, templateName, data.suggested_name);
        })
        .catch(error => {
            console.log('Validation check failed:', error);
        });
}

function showValidationMessage(exists, originalName, suggestedName) {
    removeValidationMessage();

    const input = document.getElementById('templateNameInput');
    const validationDiv = document.createElement('div');
    validationDiv.className = 'template-name-validation';
    validationDiv.id = 'templateNameValidation';

    if (exists) {
        validationDiv.innerHTML = `
<div class="validation-warning">
<i class="bi bi-exclamation-triangle"></i>
ეს სახელი უკვე არსებობს!
<br>
<small>შენახვისას ავტომატურად მიენიჭება: <strong>"${suggestedName}"</strong></small>
</div>
`;
    } else {
        validationDiv.innerHTML = `
<div class="validation-success">
<i class="bi bi-check-circle"></i>
სახელი ხელმისაწვდომია !
</div>
`;
    }

    input.parentNode.insertBefore(validationDiv, input.nextSibling);
}

function removeValidationMessage() {
    const existing = document.getElementById('templateNameValidation');
    if (existing) {
        existing.remove();
    }
}

function updateModalSelectionInfo() {
    const modalInfo = document.getElementById('modalSelectedInfo');
    const saveBtn = document.getElementById('modalSaveBtn');

    // რეალურად მონიშნული ელემენტების დათვლა
    const checkedCategories = document.querySelectorAll('.category-checkbox:checked').length;
    const checkedItems = document.querySelectorAll('.item-checkbox:checked').length;
    const totalSelected = checkedCategories + checkedItems;

    if (totalSelected === 0) {
        modalInfo.textContent = 'არცერთი ელემენტი არ არის არჩეული';
        saveBtn.disabled = true;
        saveBtn.style.opacity = '0.6';
    } else {
        let infoText = '';
        if (checkedCategories > 0) {
            infoText += `${checkedCategories} კატეგორია`;
        }
        if (checkedItems > 0) {
            if (infoText) infoText += ' და ';
            infoText += `${checkedItems} ქვეკატეგორია`;
        }
        modalInfo.textContent = infoText;
        saveBtn.disabled = false;
        saveBtn.style.opacity = '1';
    }
}

function hideTemplateNameModal() {
    const modal = document.getElementById('templateNameModal');
    modal.style.display = 'none';
    removeValidationMessage();
}

function saveMenuWithTemplate() {
    const templateName = document.getElementById('templateNameInput').value.trim();

    if (!templateName) {
        alert('❌ გთხოვთ შეიყვანოთ მენიუს სახელი!');
        document.getElementById('templateNameInput').focus();
        return;
    }

    // ახალი - რეალურად მონიშნული ელემენტების მიღება
    const actualSelection = getActuallySelectedItems();

    const totalSelected = actualSelection.categories.length + actualSelection.items.length;
    if (totalSelected === 0) {
        alert('❌ აირჩიეთ მინიმუმ ერთი კატეგორია ან ქვეკატეგორია შესანახად!');
        return;
    }

    console.log('=== ABOUT TO SAVE TO SAVED_MENUS WITH NOTES ===');
    console.log('Template name:', templateName);
    console.log('Actually selected categories:', actualSelection.categories);
    console.log('Actually selected items:', actualSelection.items);

    const confirmMessage = `ნამდვილად გსურთ მენიუს შენახვა სახელით "${templateName}"?\n\nშეინახება: ${actualSelection.categories.length} კატეგორია და ${actualSelection.items.length} ქვეკატეგორია\n\n📝 თუ ეს სახელი უკვე არსებობს, ავტომატურად მიენიჭება უნიკალური სახელი.`;

    if (confirm(confirmMessage)) {
        hideTemplateNameModal();

        const form = document.getElementById('saveSelectedForm');
        document.getElementById('hiddenTemplateName').value = templateName;

        const categoriesContainer = document.getElementById('selectedCategoriesInputs');
        const itemsContainer = document.getElementById('selectedItemsInputs');
        categoriesContainer.innerHTML = '';
        itemsContainer.innerHTML = '';

        // Add actually selected categories
        actualSelection.categories.forEach(categoryKey => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'selected_categories[]';
            input.value = categoryKey;
            categoriesContainer.appendChild(input);
            console.log('Added category input:', categoryKey);
        });

        // Add actually selected items
        actualSelection.items.forEach(itemId => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'selected_items[]';
            input.value = itemId;
            itemsContainer.appendChild(input);
            console.log('Added item input:', itemId);
        });

        console.log('Submitting form to save only checked items...');
        form.submit();
    }
}

function updateCategoryFinalAmount(hall, category) {
    const categoryKey = `${hall}|${category}`;
    const span = document.querySelector(`[data-category="${category}"][data-hall="${hall}"].category-final-amount`);

    if (!span) return;

    // გამოვთვალოთ კატეგორიის ჯამი - მხოლოდ მონიშნული ელემენტები
    let categoryTotal = 0;
    const hallSection = document.querySelector(`[data-hall="${hall}"]`);
    if (hallSection) {
        const categoryItems = hallSection.querySelectorAll(`[data-category="${category}"].menu-item`);
        categoryItems.forEach(item => {
            const itemCheckbox = item.querySelector('.item-checkbox');
            const isItemSelected = itemCheckbox && itemCheckbox.checked;
            const isCategorySelected = selectedCategories.includes(categoryKey);
            const itemId = item.dataset.itemId;
            const isItemInSelectedArray = selectedItems.includes(itemId);

            if (isItemSelected || isCategorySelected || isItemInSelectedArray) {
                const totalCell = item.querySelector('.total-cell');
                if (totalCell) {
                    let itemTotal = parseFloat(totalCell.dataset.total) || 0;
                    categoryTotal += itemTotal;
                }
            }
        });
    }

    // საბოლოო თანხა ფასდაკლების გამოკლებით
    const discountAmount = categoryDiscounts[categoryKey] || 0;
    const finalAmount = Math.max(0, categoryTotal - discountAmount);

    span.textContent = finalAmount.toFixed(2) + ' ₾';

    // ფერის განახლება
    if (discountAmount > 0) {
        span.style.color = '#28a745';
    } else {
        span.style.color = '#007bff';
    }
}

function updateAllCategoryFinalAmounts() {
    document.querySelectorAll('.category-final-amount').forEach(span => {
        const category = span.dataset.category;
        const hall = span.dataset.hall;
        const categoryKey = `${hall}|${category}`;

        // გამოვთვალოთ კატეგორიის ჯამი
        let categoryTotal = 0;
        const hallSection = document.querySelector(`[data-hall="${hall}"]`);
        if (hallSection) {
            const categoryItems = hallSection.querySelectorAll(`[data-category="${category}"].menu-item`);
            categoryItems.forEach(item => {
                const totalCell = item.querySelector('.total-cell');
                if (totalCell) {
                    let itemTotal = 0;
                    if (totalCell.dataset.total) {
                        itemTotal = parseFloat(totalCell.dataset.total);
                    } else {
                        const text = totalCell.textContent || totalCell.innerText;
                        const numberMatch = text.match(/[\d,]+\.?\d*/);
                        if (numberMatch) {
                            itemTotal = parseFloat(numberMatch[0].replace(',', ''));
                        }
                    }
                    categoryTotal += itemTotal;
                }
            });
        }

        // საბოლოო თანხა ფასდაკლების გამოკლებით
        const discountAmount = categoryDiscounts[categoryKey] || 0;
        const finalAmount = Math.max(0, categoryTotal - discountAmount);

        span.textContent = finalAmount.toFixed(2) + ' ₾';

        // ფერის განახლება
        if (discountAmount > 0) {
            span.style.color = '#28a745';
        } else {
            span.style.color = '#007bff';
        }
    });
}

// Other Functions
function handleQuantityKeyup(event, input) {
    if (event.key === 'Enter') {
        updateItemQuantity(input);
        input.blur(); // Remove focus after update
    }
}

function updateItemQuantity(input) {
    const itemId = input.dataset.itemId;
    const price = parseFloat(input.dataset.price);
    const newQuantity = parseInt(input.value);

    if (!newQuantity || newQuantity < 1) {
        // Just revert to original value without showing error
        input.value = input.dataset.originalValue || '1';
        return;
    }

    // Update total in UI immediately
    const row = input.closest('tr');
    const totalCell = row.querySelector('.total-cell');
    const newTotal = price * newQuantity;

    totalCell.textContent = newTotal.toFixed(2) + ' ₾';
    totalCell.dataset.total = newTotal;

    // Update Payment Summary
    updateMenuTotalFromTable();

    // განვაახლოთ კატეგორიის საბოლოო თანხა
    const category = row.dataset.category;
    const hall = row.dataset.hall;
    updateCategoryFinalAmount(hall, category);

    // Update in database via AJAX
    const formData = new FormData();
    formData.append('ajax_update_quantity', '1');
    formData.append('item_id', itemId);
    formData.append('new_quantity', newQuantity);

    fetch(window.location.pathname, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Add visual feedback
                row.style.background = 'rgba(40, 167, 69, 0.1)';
                setTimeout(() => {
                    row.style.background = '';
                }, 1000);
            }
            // No error alerts - just continue
        })
        .catch(error => {
            // No error alerts - just continue
            console.log('Update completed');
        });

    // Store original value for potential revert
    input.dataset.originalValue = newQuantity;
}

function startNewOrder() {
    if (confirm('🆕 ნამდვილად გსურთ ახალი შეკვეთის დაწყება?\n\nეს გაასუფთავებს მიმდინარე მენიუს და დაიწყებს ახალ შეკვეთას.')) {
        // Show loading animation
        const button = event.target;
        const originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>იტვირთება...';

        // ✨ ახალი ნაწილი - PHP session-ის გასუფთავება ✨
        const formData = new FormData();
        formData.append('clear_guest_session', '1');

        fetch(window.location.pathname, {
            method: 'POST',
            body: formData
        })
            .then(() => {
                // Clear any localStorage data
                try {
                    localStorage.removeItem('selectedHalls');
                    localStorage.removeItem('selectedCategories');
                    localStorage.removeItem('selectedItems');
                } catch (e) {
                    console.log('LocalStorage clear failed:', e);
                }

                // Redirect to clean page after short delay
                setTimeout(() => {
                    window.location.href = window.location.pathname;
                }, 500);
            })
            .catch(() => {
                // Even if AJAX fails, still redirect
                setTimeout(() => {
                    window.location.href = window.location.pathname;
                }, 500);
            });
        // ✨ ახალი ნაწილის დასასრული ✨
    }
}

function viewOrders() {
    // You can customize this URL to point to your orders page
    const ordersUrl = 'saved_menu.php'; // Change this to your actual orders page

    if (confirm('📋 გსურთ შეკვეთების სანახავად გადასვლა?\n\nეს გადაგიყვანთ შეკვეთების მართვის გვერდზე.')) {
        // Check if orders page exists, if not, show alert
        window.location.href = ordersUrl;
    }
}

// function startNewMenu() {
//     if (confirm('ნამდვილად გსურთ ახალი მენიუს დაწყება?')) {
//         window.location.href = window.location.pathname;
//     }
// }

// Enhanced startNewMenu function
function startNewMenu() {
    if (confirm('🆕 ნამდვილად გსურთ ახალი მენიუს დაწყება?\n\nეს გაასუფთავებს ყველა მიმდინარე მონაცემს.')) {
        // Show loading
        const button = event.target;
        if (button) {
            const originalText = button.innerHTML;
            button.disabled = true;
            button.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>იტვირთება...';
        }

        // Clear localStorage
        try {
            localStorage.removeItem('selectedHalls');
            localStorage.removeItem('selectedCategories');
            localStorage.removeItem('selectedItems');
        } catch (e) {
            console.log('LocalStorage clear failed:', e);
        }

        // Redirect to clean page
        setTimeout(() => {
            window.location.href = window.location.pathname;
        }, 500);
    }
}

function addNewItemToTable(data) {
    const hallName = selectedHalls.length > 0 ?
        document.getElementById(`hall_${selectedHalls[0]}`).parentElement.querySelector('.dropdown-text').textContent.trim() :
        'Unknown Hall';

    // მოძებნა სწორი hall section
    let hallSection = document.querySelector(`[data-hall="${hallName}"]`);

    if (!hallSection) {
        console.log('Hall section not found, reloading page...');
        window.location.reload();
        return;
    }

    // მოძებნა სწორი კატეგორიის section
    let categorySection = null;
    const categoryRows = hallSection.querySelectorAll('.category-section');

    categoryRows.forEach(row => {
        if (row.dataset.category === data.category_ka) {
            categorySection = row;
        }
    });

    if (!categorySection) {
        // ახალი კატეგორიის შექმნა
        const menuTable = hallSection.querySelector('.menu-table tbody');

        // კატეგორიის header
        const categoryHeaderRow = document.createElement('tr');
        categoryHeaderRow.className = 'category-section';
        categoryHeaderRow.dataset.category = data.category_ka;
        categoryHeaderRow.innerHTML = `
        <td class="category-checkbox-cell category-header-with-checkbox">
            <input type="checkbox"
                class="category-checkbox"
                id="cat_${md5(hallName + '_' + data.category_ka)}"
                data-hall="${hallName}"
                data-category="${data.category_ka}"
                onchange="handleCategorySelection(this)"
                title="მთელი კატეგორიის არჩევა">
        </td>
        <td colspan="2" class="category-header-excel category-name-cell">
            ${data.category_ka} / ${data.category_en}
        </td>
        <td class="category-header-excel">რაოდენობა</td>
        <td class="category-header-excel">ფასი</td>
        <td class="category-header-excel">ჯამი</td>
        <td class="category-header-excel">შენიშვნა</td>
        
    `;

        menuTable.appendChild(categoryHeaderRow);
        categorySection = categoryHeaderRow;

        // ✨ ახალი ნაწილი - ფასდაკლების რიგის დამატება ✨
        const discountRow = document.createElement('tr');
        discountRow.className = 'discount-row';
        discountRow.dataset.category = data.category_ka;
        discountRow.dataset.hall = hallName;
        discountRow.innerHTML = `
        <td class="discount-cell"></td>
        <td colspan="2" class="discount-cell">
            <strong>ფასდაკლება: ${data.category_ka}</strong>
        </td>
        <td class="discount-cell">-</td>
        <td colspan="2" class="discount-cell">
            <div class="d-flex align-items-center gap-2">
                <input type="number"
                    class="discount-input"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    data-category="${data.category_ka}"
                    data-hall="${hallName}"
                    onchange="applyCategoryDiscount(this)"
                    onblur="applyCategoryDiscount(this)"
                    onkeyup="handleDiscountKeyup(event, this)"
                    title="ფასდაკლება ამ კატეგორიისთვის">
                <span class="text-muted">₾ →</span>
                <span class="category-final-amount fw-bold text-primary"
                    data-category="${data.category_ka}"
                    data-hall="${hallName}">0.00 ₾</span>
            </div>
        </td>
        <td class="discount-cell">-</td>
        <td class="discount-cell">-</td>
    `;

        menuTable.appendChild(discountRow);
    }


    // ახალი ქვეკატეგორიის row-ის შექმნა
    const newRow = document.createElement('tr');
    newRow.className = 'subcategory-row menu-item';
    newRow.dataset.hall = hallName;
    newRow.dataset.category = data.category_ka;
    newRow.dataset.subcategory = data.subcategory_ka;
    newRow.dataset.subcategoryEn = data.subcategory_en;
    newRow.dataset.itemId = data.item_id;

    newRow.innerHTML = `
<td class="checkbox-cell">
<input type="checkbox"
class="selection-checkbox item-checkbox"
id="item_${data.item_id}"
data-item-id="${data.item_id}"
data-hall="${hallName}"
data-category="${data.category_ka}"
onchange="handleItemSelection(this)"
title="ქვეკატეგორიის არჩევა შესანახად">
</td>
<td class="subcategory-cell-ka">${data.subcategory_ka}</td>
<td class="subcategory-cell-en">${data.subcategory_en}</td>
<td class="quantity-cell" data-quantity="${data.quantity}">
<input type="number"
class="quantity-input"
value="${data.quantity}"
min="1"
data-item-id="${data.item_id}"
data-price="${data.price}"
onchange="updateItemQuantity(this)"
onblur="updateItemQuantity(this)"
onkeyup="handleQuantityKeyup(event, this)">
</td>
<td class="price-cell" data-price="${data.price}">${parseFloat(data.price).toFixed(2)} ₾</td>
<td class="price-cell total-cell" data-total="${data.total}">${parseFloat(data.total).toFixed(2)} ₾</td>
<td class="notes-cell">
<input type="text"
class="notes-input"
value=""
data-item-id="${data.item_id}"
placeholder="შენიშვნა..."
title="შენიშვნა ქვეკატეგორიისთვის"
onchange="updateItemNotes(this)"
onblur="updateItemNotes(this)"
onkeyup="handleNotesKeyup(event, this)">
</td>

`;

    // კატეგორიის შემდეგ ჩასმა
    categorySection.parentNode.insertBefore(newRow, categorySection.nextSibling);

    // ვიზუალური ეფექტი
    newRow.style.background = 'rgba(40, 167, 69, 0.2)';
    setTimeout(() => {
        newRow.style.background = '';
    }, 2000);

    console.log('✅ ახალი ელემენტი დამატებულია ცხრილში წაშლის ღილაკით');
}

function getActuallySelectedItems() {
    const actualSelectedCategories = [];
    const actualSelectedItems = [];

    // კატეგორიების მონიშნული checkboxes
    document.querySelectorAll('.category-checkbox:checked').forEach(checkbox => {
        const hall = checkbox.dataset.hall;
        const category = checkbox.dataset.category;
        actualSelectedCategories.push(`${hall}|${category}`);
        console.log('Actually selected category:', `${hall}|${category}`);
    });

    // ინდივიდუალური ელემენტების მონიშნული checkboxes
    document.querySelectorAll('.item-checkbox:checked').forEach(checkbox => {
        const itemId = checkbox.dataset.itemId;
        actualSelectedItems.push(itemId);
        console.log('Actually selected item:', itemId);
    });

    return {
        categories: actualSelectedCategories,
        items: actualSelectedItems
    };
}

function deleteMenuItem(itemId) {
    const row = document.querySelector(`[data-item-id="${itemId}"]`);
    if (!row) {
        console.error('Item row not found:', itemId);
        return;
    }

    const subcategory = row.dataset.subcategory || 'უცნობი';
    const category = row.dataset.category || '';

    const confirmMessage = `ნამდვილად გსურთ "${subcategory}" ჩანაწერის წაშლა${category ? ` კატეგორიიდან "${category}"` : ''}?`;

    if (!confirm(confirmMessage)) {
        return;
    }

    const deleteBtn = row.querySelector('.delete-item-btn');
    const originalContent = deleteBtn.innerHTML;
    deleteBtn.disabled = true;
    deleteBtn.innerHTML = '<i class="bi bi-hourglass-split"></i>';

    const formData = new FormData();
    formData.append('ajax_delete_item', '1');
    formData.append('item_id', itemId);

    fetch(window.location.pathname, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                row.style.transition = 'all 0.5s ease';
                row.style.background = 'rgba(220, 53, 69, 0.2)';
                row.style.transform = 'scale(0.95)';
                row.style.opacity = '0.5';

                setTimeout(() => {
                    row.remove();

                    const itemCheckbox = row.querySelector('.item-checkbox');
                    if (itemCheckbox && itemCheckbox.checked) {
                        selectedItems = selectedItems.filter(id => id !== itemId);
                        const hall = row.dataset.hall;
                        const category = row.dataset.category;
                        updateCategoryCheckboxStatus(hall, category);
                        updateHallSelectAllStatus(hall);
                    }

                    checkEmptyCategory(row);
                    updateMenuTotalFromTable();

                    const hall = row.dataset.hall;
                    const category = row.dataset.category;
                    updateCategoryFinalAmount(hall, category);

                    showSuccessMessage(`"${subcategory}" წაშლილია მენიუდან`);
                }, 500);
            } else {
                deleteBtn.disabled = false;
                deleteBtn.innerHTML = originalContent;
            }
        })
        .catch(error => {
            console.error('Delete error:', error);
            deleteBtn.disabled = false;
            deleteBtn.innerHTML = originalContent;
        });
}

function checkEmptyCategory(deletedRow) {
    const category = deletedRow.dataset.category;
    const hall = deletedRow.dataset.hall;

    const hallSection = document.querySelector(`[data-hall="${hall}"]`);
    if (!hallSection) return;

    const remainingItems = hallSection.querySelectorAll(`[data-category="${category}"].menu-item`);

    if (remainingItems.length === 0) {
        const categoryRow = hallSection.querySelector(`[data-category="${category}"].category-section`);
        const discountRow = hallSection.querySelector(`[data-category="${category}"].discount-row`);

        if (categoryRow) {
            categoryRow.style.transition = 'all 0.5s ease';
            categoryRow.style.opacity = '0.3';
            setTimeout(() => categoryRow.remove(), 500);
        }

        if (discountRow) {
            discountRow.style.transition = 'all 0.5s ease';
            discountRow.style.opacity = '0.3';
            setTimeout(() => discountRow.remove(), 500);
        }

        const categoryKey = `${hall}|${category}`;
        selectedCategories = selectedCategories.filter(cat => cat !== categoryKey);

        console.log(`🗑️ Empty category removed: ${categoryKey}`);
    }
}

// ===== SEARCH FUNCTIONALITY =====
document.getElementById('menuSearchInput')?.addEventListener('keyup', function () {
    const searchTerm = this.value.toLowerCase().trim();
    const menuResults = document.getElementById('menuResults');
    const noResults = document.getElementById('noSearchResults');

    // თუ დარბაზი არ არის არჩეული, ძებნა არ იმუშაოს
    if (selectedHalls.length === 0) {
        // დავამალოთ ძებნის შედეგები და ვაჩვენოთ ცარიელი მდგომარეობა
        if (menuResults) menuResults.style.display = 'none';
        if (noResults) noResults.style.display = 'none';
        showEmptyMenuState();
        return;
    }

    if (searchTerm === '') {
        const allSections = document.querySelectorAll('.hall-section');
        allSections.forEach(section => {
            const allRows = section.querySelectorAll('tr');
            allRows.forEach(row => row.style.display = '');
        });
        menuResults.style.display = 'block';
        noResults.style.display = 'none';
        filterMenuBySelectedHalls();
        return;
    }

    let hasVisibleResults = false;

    const hallSections = document.querySelectorAll('.hall-section');
    hallSections.forEach(hallSection => {
        const hallName = hallSection.dataset.hall.toLowerCase();
        let hallHasVisibleItems = false;

        const categoryRows = hallSection.querySelectorAll('.category-section');
        categoryRows.forEach(categoryRow => {
            const categoryName = categoryRow.dataset.category.toLowerCase();
            let categoryHasVisibleItems = false;

            const categoryMatches = categoryName.includes(searchTerm) || hallName.includes(searchTerm);

            let nextRow = categoryRow.nextElementSibling;
            const itemsToCheck = [];

            while (nextRow && nextRow.classList.contains('menu-item')) {
                itemsToCheck.push(nextRow);
                nextRow = nextRow.nextElementSibling;
            }

            itemsToCheck.forEach(itemRow => {
                const hall = itemRow.dataset.hall.toLowerCase();
                const category = itemRow.dataset.category.toLowerCase();
                const subcategory = itemRow.dataset.subcategory.toLowerCase();
                const subcategoryEn = itemRow.dataset.subcategoryEn.toLowerCase();

                const matches = hall.includes(searchTerm) ||
                    category.includes(searchTerm) ||
                    subcategory.includes(searchTerm) ||
                    subcategoryEn.includes(searchTerm) ||
                    categoryMatches;

                if (matches) {
                    itemRow.style.display = '';
                    categoryHasVisibleItems = true;
                    hallHasVisibleItems = true;
                    hasVisibleResults = true;
                } else {
                    itemRow.style.display = 'none';
                }
            });

            if (categoryHasVisibleItems) {
                categoryRow.style.display = '';
            } else {
                categoryRow.style.display = 'none';
            }
        });

        if (hallHasVisibleItems) {
            hallSection.style.display = 'block';
        } else {
            hallSection.style.display = 'none';
        }
    });

    if (hasVisibleResults) {
        menuResults.style.display = 'block';
        noResults.style.display = 'none';
        hideEmptyMenuState();
    } else {
        menuResults.style.display = 'none';
        noResults.style.display = 'block';
        hideEmptyMenuState();
    }
});

// Event Listeners
document.getElementById('templateNameModal')?.addEventListener('click', function (e) {
    if (e.target === this) {
        hideTemplateNameModal();
    }
});

setTimeout(() => {
    document.querySelectorAll('.alert').forEach(alert => {
        if (alert.classList.contains('show')) {
            let bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    });
}, 4000);

// DOMContentLoaded Event Listener - შესწორებული ვერსია
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Menu Prepare System ჩაიტვირთა (შენიშვნების ველით)');
    console.log('📋 ფუნქციები: დამკვეთის მონაცემები, შენიშვნები, ფასდაკლებები და Payment Summary');

    // Initialize date/time dropdowns
    setupDateTimeDropdowns();

    // Initialize payment summary
    updatePaymentSummary();

    // Auto-focus on category selection
    const categoryElement = document.getElementById("category");
    if (categoryElement) {
        categoryElement.focus();
    }

    // selectedHalls უკვე PHP-დან არის მიღებული
    if (selectedHalls.length > 0) {
        // პირველი დარბაზის მიბმა მთავარ input-ზე
        selectedHallId = selectedHalls[0];
        document.getElementById('hall_id_main').value = selectedHallId;
        document.getElementById('hall_id_hidden').value = selectedHallId;

        // checkbox-ების მონიშვნა
        selectedHalls.forEach(hallId => {
            const checkbox = document.getElementById(`hall_${hallId}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });

        updateHallDropdownText();

        // აქ იყო პრობლემა - ეს setTimeout დარჩა ღია ბლოკში
        setTimeout(() => {
            restoreSelectionsFromDOM();
            updateMenuTotalFromTable();
        }, 100);

    } else {
        // თუ დარბაზი არ არის არჩეული, ვაჩვენებთ ცარიელ მდგომარეობას
        showEmptyMenuState();
    }

    // Always call filterMenuBySelectedHalls to show/hide appropriate elements
    filterMenuBySelectedHalls();

    // Initialize original values for quantity inputs
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.dataset.originalValue = input.value;
    });

    // Initialize category final amounts
    document.querySelectorAll('.category-final-amount').forEach(span => {
        const category = span.dataset.category;
        const hall = span.dataset.hall;

        // გამოვთვალოთ კატეგორიის ჯამი ინიციალიზაციისთვის
        let categoryTotal = 0;
        const hallSection = document.querySelector(`[data-hall="${hall}"]`);
        if (hallSection) {
            const categoryItems = hallSection.querySelectorAll(`[data-category="${category}"].menu-item`);
            categoryItems.forEach(item => {
                const totalCell = item.querySelector('.total-cell');
                if (totalCell) {
                    let itemTotal = 0;
                    if (totalCell.dataset.total) {
                        itemTotal = parseFloat(totalCell.dataset.total);
                    } else {
                        const text = totalCell.textContent || totalCell.innerText;
                        const numberMatch = text.match(/[\d,]+\.?\d*/);
                        if (numberMatch) {
                            itemTotal = parseFloat(numberMatch[0].replace(',', ''));
                        }
                    }
                    categoryTotal += itemTotal;
                }
            });
        }

        span.textContent = categoryTotal.toFixed(2) + ' ₾';
    });
});

function restoreSelectionsFromDOM() {
    console.log('=== RESTORING SELECTIONS FROM DOM ===');

    // გასუფთავება
    selectedCategories = [];
    selectedItems = [];

    // კატეგორიების აღდგენა
    document.querySelectorAll('.category-checkbox:checked').forEach(checkbox => {
        const hall = checkbox.dataset.hall;
        const category = checkbox.dataset.category;
        const categoryKey = `${hall}|${category}`;
        if (!selectedCategories.includes(categoryKey)) {
            selectedCategories.push(categoryKey);
            console.log('Restored category:', categoryKey);
        }
    });

    // ელემენტების აღდგენა
    document.querySelectorAll('.item-checkbox:checked').forEach(checkbox => {
        const itemId = checkbox.dataset.itemId;
        if (!selectedItems.includes(itemId)) {
            selectedItems.push(itemId);
            console.log('Restored item:', itemId);
        }
    });

    console.log('Restoration complete:', {
        categories: selectedCategories,
        items: selectedItems
    });

    updateMenuTotalFromTable();
}

// ასევე ეს ფუნქცია უკვე არსებობს და კარგად მუშაობს ცხრილის დამალვისთვის
// function filterMenuBySelectedHalls() {
//     const menuResults = document.getElementById('menuResults');
//     const globalBulkContainer = document.getElementById('globalBulkContainer');
//     const searchContainer = document.getElementById('searchContainer');
//     const noSearchResults = document.getElementById('noSearchResults');

//     if (!menuResults) {
//         return;
//     }

//     const allHallSections = menuResults.querySelectorAll('.hall-section');

//     if (selectedHalls.length === 0) {
//         // დამალვა ყველაფერი თუ დარბაზი არ არის არჩეული
//         menuResults.style.display = 'none';
//         if (globalBulkContainer) globalBulkContainer.style.display = 'none';
//         if (searchContainer) searchContainer.style.display = 'none';
//         if (noSearchResults) noSearchResults.style.display = 'none';

//         // მენიუს ცარიელი მდგომარეობის ჩვენება
//         showEmptyMenuState();

//     } else {
//         // მენიუს კომპონენტების ჩვენება
//         menuResults.style.display = 'block';
//         if (globalBulkContainer) globalBulkContainer.style.display = 'block';
//         if (searchContainer) searchContainer.style.display = 'block';

//         // ცარიელი მდგომარეობის დამალვა
//         hideEmptyMenuState();

//         const selectedHallNames = [];
//         selectedHalls.forEach(hallId => {
//             const checkbox = document.getElementById(`hall_${hallId}`);
//             if (checkbox) {
//                 const hallName = checkbox.parentElement.querySelector('.dropdown-text').textContent.trim();
//                 selectedHallNames.push(hallName);
//             }
//         });

//         allHallSections.forEach(section => {
//             const sectionHallName = section.dataset.hall.trim();
//             const isSelected = selectedHallNames.includes(sectionHallName);
//             section.style.display = isSelected ? 'block' : 'none';
//         });
//     }

//     // განაახლოთ Payment Summary როდესაც დარბაზი ირჩევა
//     setTimeout(() => {
//         updateMenuTotalFromTable();
//     }, 100);
// }


function getStatusInGeorgian($status) {
    switch ($status) {
        case 'pending': return 'მიმდინარე';
        case 'completed': return 'დასრულებული';
        case 'cancelled': return 'გაუქმებული';
        case 'return': return 'დაბრუნება';
        default: return $status;
    }
}