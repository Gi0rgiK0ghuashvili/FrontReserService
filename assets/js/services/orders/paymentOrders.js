export function applyVATDeduction2(state) {
    const total = state.total;
    return {
        vatAmount: total - total / 1.18,
        netAmount: total / 1.18
    };
}

export function updateGrandPaymentTotal(categoryTotals) {

    const grandTotal = Object.values(categoryTotals)
        .reduce((acc, val) => acc + val, 0);

    // Update all total display elements
    setText("quick_total_display", grandTotal);
    setText("payment-total-base", grandTotal);
    setText("net-amount-base", grandTotal);
    setText("remaining-amount-base", grandTotal);

    // VAT / Remaining recalculation
    applyVATDeduction();
    calculateRemaining();
}

export function handleCheckboxChange(checkbox) {
    const row = checkbox.closest("tr[name='row']");
    if (!row) return;

    const quantityInput = row.querySelector("input[name='quantity']");
    const commentInput = row.querySelector("input[name='comment']");
    const price = parseFloat(row.dataset.price);
    const sumCell = row.children[5]; // sum column index

    if (checkbox.checked) {
        quantityInput.value = 1;

        quantityInput.disabled = false;
        commentInput.disabled = false;

        row.classList.remove("table-light");

        const quantity = parseFloat(quantityInput.value) || 0;
        const sum = quantity * price;

        const sumCell = row.children[5];
        sumCell.textContent = sum.toFixed(2);
        sumCell.dataset.value = sum.toFixed(2);
    } 
    else {
        quantityInput.value = 0;
        quantityInput.disabled = true;
        commentInput.value = "";
        commentInput.disabled = true;

        sumCell.textContent = "0";
        sumCell.dataset.value = "0";
        row.classList.add("table-light");
    }

}

// quantity handler
export function handleQuantityChange(quantityInput) {
    const row = quantityInput.closest("tr[name='row']");
    if (!row) return;

    const checkbox = row.querySelector("input[type='checkbox']");
    if (!checkbox.checked) return;

    const price = parseFloat(row.dataset.price);
    const quantity = parseFloat(quantityInput.value) || 0;

    const sum = quantity * price;

    const sumCell = row.children[5];
    sumCell.textContent = sum.toFixed(2);
    sumCell.dataset.value = sum.toFixed(2);
}

// calculate by category type
export function recalculateCategoryTotals() {
    const rows = document.querySelectorAll("tr[name='row']");
    const categoryTotals = {};

    rows.forEach(row => {
        const category = row.dataset.categoryGeo;
        const checkbox = row.querySelector("input[type='checkbox']");
        const sumCell = row.children[5];

        if (!checkbox.checked) return;

        const sum = parseFloat(sumCell.textContent) || 0;

        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }

        categoryTotals[category] += sum;
    });

    updateCategoryUI(categoryTotals);
    updateGrandPaymentTotal(categoryTotals);
}


function applyVATDeduction() {

    const checkbox = document.getElementById("vat_deduction_checkbox");
    const vatAmountElement = document.getElementById("vat_amount");
    const netAmountBase = document.getElementById("net-amount-base");

    const total = parseFloat(
        document.getElementById("payment-total-base").textContent
    ) || 0;

    if (checkbox.checked) {
        const vat = total * VAT_RATE;
        const net = total - vat;

        //vatAmountElement.textContent = vat.toFixed(2) + " ₾";
        //netAmountBase.textContent = net.toFixed(2);

        setText("vat_amount", vat.toFixed(2));
        setText("net-amount-base", net.toFixed(2));

    } else {
        //vatAmountElement.textContent = "0.00 ₾";
        //netAmountBase.textContent = total.toFixed(2);

        setText("vat_amount", 0.00);
        setText("net-amount-base", total.toFixed(2));
    }

    calculateRemaining();
}

function calculateRemaining() {

    const prepayment = parseFloat(
        document.getElementById("prepayment_input").value
    ) || 0;

    const netAmount = parseFloat(
        document.getElementById("net-amount-base").textContent
    ) || 0;

    const remaining = Math.max(netAmount - prepayment, 0);

    setText("remaining-amount-base", remaining);
}

// update categoru UI by calculated sum price
function updateCategoryUI(categoryTotals) {
    const headers = document.querySelectorAll("tr[name='header']");

    headers.forEach(header => {
        const category = header.dataset.categoryGeo;
        const total = categoryTotals[category] || 0;

        let totalElement = header.querySelector(".category-total");

        if (!totalElement) {
            totalElement = document.createElement("span");
            totalElement.classList.add("category-total", "ms-3", "text-success");
            header.firstElementChild.appendChild(totalElement);
        }

        totalElement.textContent = ` | ჯამი: ${total.toFixed(2)} ₾`;
    });

}

function setText(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    element.dataset.value = value;
    element.textContent = value.toFixed(2);
}
