import { ApiService } from "../../core/requests";

class OrderLine {
    constructor() {
        nameGeo = "";
        nameEng = "";
        quantity = 0;
        price = 0;
        sumPrice = 0;
    }
}
class Order {
    constructor() {
        orderLineGuestName = "";
        orderLineGuestPhone = "";
        orderLineGuestEmail = "";
        orderLineGuestReservationDate = "";
        orderLineGuestReservationTime = "";
        orderLineGuestHall = "";

        OrderLines = [];
    }
}

(function activateAddButton() {

    const modalEl = document.getElementById("add-fullscreenModal");

    if (!modalEl) {
        return;
    }

    console.log("modalEl: ", modalEl);

    const modal = new bootstrap.Modal(modalEl);

    const hideButton = document.getElementById("hide-add-modal");
    if(!hideButton){
        return;
    }

    console.log("hideButton: ", hideButton);

    document.getElementById('add-button').addEventListener('click', () => {
        modal.show();
    });

    hideButton.addEventListener('click', () => {
        modal.hide();
    });

})();

(async function loadDefault() {
    try {

        const payload = {
            pageIndex: 1,
            pageSize: 20,
            totalPages: 0,
        };

        const result = await getRequest("Order", "getOrders", payload);

        const ordersData = result.value;

        await renderTable(ordersData, "tableBody");
    }
    catch (exception) {
        console.error("this is errors sections", exception);

        const ex = {
            message: exception.message,
            source: "hall.js",
            operationType: "add-content"
        };

        await logException(ex);
        console.error("this is errors sections", ex);
    }
})();

async function renderTable(items, elementId) {

    try {
        const tableBody = document.getElementById(elementId);

        if (!tableBody) {
            return;
        }

        //tableBody.innerHTML = "";
        if (!items) {
            return;
        }

        if (!Array.isArray(items)) {
            console.error("Expected array but got:", items);
            return;
        }
        let index = 1;

        items.forEach(item => {

            // Data Values
            const tr = document.createElement("tr");

            const tdIndex = createTd(index, true);
            const tdOrderName = createTd(item.orderName);
            const tdTotalAmount = createTd(item.totalAmount, true);
            const tdReservationDate = createDateTimeTd(item.reservationDate, item.reservationTime);
            const tdHallName = createTd(item.hallNameGeo, false, item.hallNameEng);
            console.log(item);
            const tdGuestName = createGuestTd(item.customerName, item.customerEmail, item.customerPhoneNumber);
            const tdEmployee = createEmployeeTd(item.employeeName, item.employee.email, item.employee.phoneNumber);

            // Status td Element
            const tdOrderStatus = createStatusTd(item.orderStatus);;

            // Build Table
            tr.appendChild(tdIndex);
            tr.appendChild(tdOrderName);
            tr.appendChild(tdTotalAmount);
            tr.appendChild(tdReservationDate);
            tr.appendChild(tdHallName);
            tr.appendChild(tdGuestName);
            tr.appendChild(tdEmployee);
            tr.appendChild(tdOrderStatus);

            const td = generateButtonGroup(item.id)

            tr.appendChild(td);

            tableBody.appendChild(tr);
            index++;
        });

    }
    catch (exception) {
        console.error(exception);
        await logException(exception);
    }
}
function showModal(event) {
    const divModalShow = event.target;
    const div = document.createElement("div");

    console.log(divModalShow.getAttribute("data-id"));
    //const row = document.querySelector();
    const tbody = document.getElementById("tableBody");

    const rows = tbody.querySelectorAll("tr");

    const row = event.target.closest("tr");
    const table = document.getElementById("templatesTable");

    // ვიღებთ <th>-ებს და მათი name ატრიბუტებს
    const headers = [...table.querySelectorAll("thead th")].map(th =>
        th.getAttribute("name")
    );

    // ვიღებთ <td>-ებში შევსებულ მნიშვნელობებს
    const values = [...row.querySelectorAll("td")].map(td =>
        td.textContent.trim()
    );

    // ვაგებთ ობიექტს: { headerName: rowValue }
    const result = {};
    headers.forEach((header, i) => {
        result[header] = values[i] ?? null;
    });

    return result;

}
function createHeaderCard(value) {
    const td = document.createElement("td");

    td.textContent = value;
    td.setAttribute("data-value", value);
    td.classList = "text-center";

    return td;
}
function createTd(valueGeo, isBold = false, valueEng = null) {
    const td = document.createElement("td");
    if (valueGeo != null) {
        const divGeo = document.createElement("div");
        divGeo.textContent = valueGeo;
        divGeo.setAttribute("data-valueGeo", valueGeo);
        divGeo.classList = "text-center";
        if (isBold === true) {
            divGeo.classList.add("fw-bold");
        }
        td.appendChild(divGeo);
    }

    if (valueEng != null) {
        const divEng = document.createElement("div");
        divEng.textContent = valueEng;
        divEng.setAttribute("data-valueEng", valueEng);
        divEng.classList = "text-center";
        if (isBold === true) {
            divEng.classList.add("fw-bold");
        }
        td.appendChild(divEng);
    }
    return td;
}
function createDateTimeTd(date, time = null, isBold = false) {
    const td = document.createElement("td");
    const divDate = document.createElement("div");
    const divTime = document.createElement("div");

    divDate.textContent = date;
    divDate.setAttribute("data-value", date);
    divDate.classList = "text-center";
    if (isBold === true) {
        divDate.classList.add("fw-bold");
    }
    td.appendChild(divDate);

    if (time !== null) {
        divTime.textContent = time;
        divTime.setAttribute("data-value", time);
        divTime.classList = "text-center";
        if (isBold === true) {
            divTime.classList.add("fw-bold");
        }
        td.appendChild(divTime);
    }

    return td;
}
function createGuestTd(fullname, email = null, phone = null, isBold = false) {
    const td = document.createElement("td");
    const divFullname = document.createElement("div");
    const divEmail = document.createElement("div");
    const divPhone = document.createElement("div");


    divFullname.textContent = fullname;
    divFullname.setAttribute("data-fullname", fullname);
    divFullname.classList = "text-center";
    if (isBold === true) {
        divFullname.classList.add("fw-bold");
    }
    td.appendChild(divFullname);

    if (email !== null) {
        divEmail.textContent = email;
        divEmail.setAttribute("data-email", email);
        divEmail.classList = "text-center";
        if (isBold === true) {
            divEmail.classList.add("fw-bold");
        }
        td.appendChild(divEmail);
    }

    if (phone !== null) {
        divPhone.textContent = phone;
        divPhone.setAttribute("data-phone", phone);
        divPhone.classList = "text-center";
        if (isBold === true) {
            divPhone.classList.add("fw-bold");
        }
        td.appendChild(divPhone);
    }
    return td;
}
function createEmployeeTd(fullname, email = null, phone = null, isBold = false) {
    const td = document.createElement("td");
    const divFullname = document.createElement("div");
    const divEmail = document.createElement("div");
    const divPhone = document.createElement("div");


    divFullname.textContent = fullname;
    divFullname.setAttribute("data-fullname", fullname);
    divFullname.classList = "text-center";
    if (isBold === true) {
        divFullname.classList.add("fw-bold");
    }
    td.appendChild(divFullname);

    if (email !== null) {
        divEmail.textContent = email;
        divEmail.setAttribute("data-email", email);
        divEmail.classList = "text-center";
        if (isBold === true) {
            divEmail.classList.add("fw-bold");
        }
        td.appendChild(divEmail);
    }

    if (phone !== null) {
        divPhone.textContent = phone;
        divPhone.setAttribute("data-phone", phone);
        divPhone.classList = "text-center";
        if (isBold === true) {
            divPhone.classList.add("fw-bold");
        }
        td.appendChild(divPhone);
    }
    return td;
}
function createStatusTd(value, isBold = false) {
    const td = document.createElement("td");
    const selectOrderStatus = document.createElement("select");

    const optionPending = createOption("მიმდინარე", "pending", value);
    const optionReturn = createOption("დაბრუნებული", "return", value);
    const optionCompleted = createOption("დასრულებული", "completed", value);
    const optionCanceled = createOption("გაუქმებული", "canceled", value);


    //selectOrderStatus.classList = "text-center";
    selectOrderStatus.classList.add("status-select");
    selectOrderStatus.addEventListener("change", (event) => { changedSelectedStatus(event) });
    selectOrderStatus.setAttribute("data-template", value);
    selectOrderStatus.setAttribute("data-original", value);

    if (isBold === true) {
        selectOrderStatus.classList.add("fw-bold");
    }
    selectOrderStatus.appendChild(optionPending);
    selectOrderStatus.appendChild(optionReturn);
    selectOrderStatus.appendChild(optionCompleted);
    selectOrderStatus.appendChild(optionCanceled);

    td.appendChild(selectOrderStatus);
    return td;
}
function changedSelectedStatus(event) {
    console.log("this is firs log");
    console.log(event.target);
}
function createOption(textContent, value, data) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    option.selected = value === data;

    return option;
}
function saveChanges() {
    const data = {
        name: document.getElementById('edit-modalName').value,
        phone: document.getElementById('edit-modalPhone').value,
        email: document.getElementById('edit-modalEmail').value,
        date: document.getElementById('edit-modalReservationDate').value,
        time: document.getElementById('edit-modalReservationTime').value,
        guests: document.getElementById('edit-modalGuests').value,
        hall: document.getElementById('edit-modalHall').value
    };
}
function addOrder() {
    const data = {
        name: document.getElementById('add-modalName').value,
        phone: document.getElementById('add-modalPhone').value,
        email: document.getElementById('add-modalEmail').value,
        date: document.getElementById('add-modalReservationDate').value,
        time: document.getElementById('add-modalReservationTime').value,
        guests: document.getElementById('add-modalGuests').value,
        hall: document.getElementById('add-modalHall').value
    };
}
function openFullScreenModal(orderData) {

    // 1. ჩავასვათ სტუმრის ინფორმაცია
    document.querySelector(".guest-info-header").innerHTML =
        `<i class="fas fa-user-circle"></i> სტუმრის ინფორმაცია - ${orderData.guestName}`;

    document.querySelector(".guest-info-item .guest-info-value").innerText = orderData.guestName;
    document.querySelector(".guest-info-value.phone").innerHTML =
        `<a href="tel:${orderData.phone}"><i class="fas fa-phone"></i> ${orderData.phone}</a>`;

    document.querySelector(".guest-info-value.email").innerHTML =
        `<a href="mailto:${orderData.email}"><i class="fas fa-envelope"></i> ${orderData.email}</a>`;

    document.querySelector(".guest-info-value.date").innerHTML =
        `<i class="fas fa-calendar"></i> ${orderData.date}`;

    document.querySelector(".guest-info-value.time").innerHTML =
        `<i class="fas fa-clock"></i> ${orderData.time}`;

    document.querySelector(".guest-info-value.count").innerHTML =
        `<i class="fas fa-users"></i> ${orderData.count} ადამიანი`;

    document.querySelector(".guest-info-value.hall").innerText = orderData.hall;

    // 2. ჩავასვათ მენიუს ელემენტები into #menuTable
    const tbody = document.querySelector("#menuTable tbody");
    tbody.innerHTML = ""; // clear old content

    orderData.items.forEach(category => {

        // Header
        tbody.innerHTML += `
            <tr class="category-header">
                <td colspan="3">${category.categoryName}</td>
                <td class="category-header-excel">რაოდენობა</td>
                <td class="category-header-excel">ფასი</td>
                <td class="category-header-excel">ჯამი</td>
            </tr>`;

        // Items
        category.products.forEach(prod => {
            tbody.innerHTML += `
                <tr data-id="${prod.id}">
                    <td></td>
                    <td class="non-editable">${prod.nameGeo}</td>
                    <td class="non-editable">${prod.nameEng}</td>
                    <td class="text-center">${prod.quantity}</td>
                    <td class="price-cell text-end">${prod.price.toFixed(2)}</td>
                    <td class="price-cell text-end total-cell">${(prod.quantity * prod.price).toFixed(2)} ₾</td>
                </tr>`;
        });
    });

    // 3. ვხსნით მოდალს Bootstrap Modal API-ის საშუალებით
    const modal = new bootstrap.Modal(document.getElementById("fullscreenModal"));
    modal.show();
}
function getCustomerRow(rowData) {
    const tdGuestName = document.createElement("td");
    const divGuestName = document.createElement("div");
    const strongValue = document.createElement("strong");
    const spanCustomer = document.createElement("div");
    const iCustomerPhoneNumber = document.createElement("i");
}
async function loadOrders() {
    const search = document.getElementById("searchInput").value;

    const response = await fetch(
        `/api/orders?pageNumber=${currentPage}&pageSize=${pageSize}&search=${search}`
    );

    const result = await response.json();

    renderTable(result.items);
    renderPagination(result.totalCount);
}
function renderPagination(totalCount) {
    totalPages = Math.ceil(totalCount / pageSize);

    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;

        if (i === currentPage) {
            btn.classList.add("active");
        }

        btn.onclick = () => {
            currentPage = i;
            loadOrders();
        };

        pagination.appendChild(btn);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const addItemsButton = document.getElementById("add-items-button");
    const guestHalss = document.getElementById("guest-hall");
    const guestCategories = document.getElementById("guest-category");
    const guestItems = document.getElementById("guest-item");


    setItemsInSelect();
    addItemsButton.addEventListener("click", (event) => {

        //addItemInOrder(event);
    });

    guestHalss.addEventListener("change", (event) => {
        const selectedOption = changedItem(event);
        console.log("Changed Item: ", selectedOption);
    });

    guestCategories.addEventListener("change", (event) => {
        const selectedOption = changedItem(event);
        const select = event.target;
        //const drinkOptions = event.target.querySelectorAll(`option[category="${select.dataset.categoryGeo}"]`);
        const drinkOptions = [...select.options].filter(
            opt => opt.dataset.categoryGeo === selectedOption.categoryGeo);

        drinkOptions.forEach(option => {
            console.log("option.dataset.categoryGeo", option.dataset.categoryGeo);
            console.log("option.dataset.categoryEng", option.dataset.categoryEng);
            console.log("option.dataset.nameGeo", option.dataset.nameGeo);
            console.log("option.dataset.nameEng", option.dataset.nameEng);
            console.log("option.dataset.price", option.dataset.price);

            guestItems.appendChild(option);
        });
        console.log("Changed Item: ", selectedOption);
    });

    guestItems.addEventListener("change", (event) => {
        const selectedOption = changedItem(event);
        console.log("Changed Item: ", selectedOption);
    });

});

function changedItem(event) {
    return event.target.options[event.target.selectedIndex];
}

function addItemInOrder(event) {
    const guestName = document.getElementById("add-guestName");
    const guestPhone = document.getElementById("add-guestPhone");
    const guestEmail = document.getElementById("add-guestEmail");

    const guestReservationDate = document.getElementById("add-guestReservationDate");
    const guestReservationTime = document.getElementById("add-guestReservationTime");
    const guestsNumber = document.getElementById("add-guestsNumber");
    const guestHall = document.getElementById("add-guestHall");
    const guestHallArrangement = document.getElementById("add-guestHallArrangement");
}

async function setItemsInSelect() {
    const guestHalss = document.getElementById("guest-hall");
    const guestCategories = document.getElementById("guest-category");
    const guestItems = document.getElementById("guest-category");

    const halls = await getRequest("hall", "getHall");

    if (halls.statusCode === 200) {
        halls.value.forEach((item) => {

            const option = createOption(item.nameGeo, item.nameEng);
            guestHalss.appendChild(option);

        });
    }

    const items = await getRequest("items", "getItems");

    if (items.statusCode === 200) {

        items.value.forEach((item) => {
            const option = createItemOption(item.categoryGeo, item.categoryEng, item.nameGeo, item.nameEng, item.price);
            guestCategories.appendChild(option);
        });
    }

}

function createItemOption(categoryGeo, categoryEng, nameGeo, nameEng, price = 0) {
    const option = document.createElement("option");

    option.setAttribute("value", categoryGeo);
    option.setAttribute("data-category-geo", categoryGeo);
    option.setAttribute("data-category-eng", categoryEng);
    option.setAttribute("data-name-geo", nameGeo);
    option.setAttribute("data-name-eng", nameEng);
    option.setAttribute("data-price", price);
    option.textContent = categoryGeo;

    return option;
}

function createOption(valueGeo, valueEng) {
    const option = document.createElement("option");

    option.setAttribute("value", valueGeo);
    option.setAttribute("data-value-geo", valueGeo);
    option.setAttribute("data-value-eng", valueEng);
    option.textContent = valueEng;

    return option;
}