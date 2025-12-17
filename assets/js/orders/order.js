import { checkTokenValidation, sendTest, getRequest, logException } from "../Commons/requests.js";
import { generateButtonGroup } from "../Commons/actionButtons.js";

class OrderLine {
    constructor() {
        nameGeo = "";
        nameEng = "";
        quantity = 0;
        price = 0;
        sumPrice = 0;
    }
}

// let pageIndex = 1;
// let pageSize = 10;
// let totalPages = 0;

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

document.getElementById("searchInput").addEventListener("input", () => {
    currentPage = 1;
    loadOrders();
});

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

        items.forEach(item => {
            // Data Values
            const tr = document.createElement("tr");
            const tdOrderName = document.createElement("td");
            const tdTotalAmount = document.createElement("td");
            const tdReservationDate = document.createElement("td");
            const tdHallName = document.createElement("td");

            const tdGuestName = document.createElement("td");
            const tdEmployeeName = document.createElement("td");



            const spanCustomerPhoneNumber = document.createElement("div");
            const iCustomerPhoneNumber = document.createElement("i");

            const spanCustomerDateTime = document.createElement("div");
            const spanCustomerName = document.createElement("div");


            const tdPrice = document.createElement("td");

            tdOrderName.textContent = item.orderName;
            tdOrderName.classList = "text-center";

            tdTotalAmount.textContent = item.totalAmount;
            tdTotalAmount.classList = "text-center";

            tdReservationDate.textContent = item.reservationDate;
            tdReservationDate.classList = "text-center";

            tdHallName.textContent = item.hallName;
            tdHallName.classList = "text-center";

            tdGuestName.classList = "text-center";
            spanCustomerName.textContent = item.customerName;
            spanCustomerName.classList = "text-muted";
            spanCustomerDateTime.textContent = item.reservationDate;
            spanCustomerDateTime.classList = "text-muted";
            spanCustomerPhoneNumber.textContent = item.customerPhoneNumber;
            spanCustomerPhoneNumber.classList = "text-muted";

            tdGuestName.appendChild(spanCustomerName);
            tdGuestName.appendChild(spanCustomerPhoneNumber);
            tdGuestName.appendChild(spanCustomerDateTime);

            tdEmployeeName.textContent = item.employeeName;
            tdEmployeeName.classList = "text-center";

            // Status td Element
            const tdOrderStatus = document.createElement("td");
            tdOrderStatus.classList = "text-center";
            // Select Element
            const selectOrderStatus = document.createElement("select");
            selectOrderStatus.classList = "status-select";
            selectOrderStatus.addEventListener("change", (event) => { changedSelectedStatus(event) });
            selectOrderStatus.setAttribute("data-template", item.orderName);
            selectOrderStatus.setAttribute("data-original", item.orderName);
            // Options Values
            // optionPending
            const optionPending = document.createElement("option");
            optionPending.value = "pending";
            optionPending.textContent = "მიმდინარე";

            // optionReturn
            const optionReturn = document.createElement("option");
            optionReturn.value = "return";
            optionReturn.textContent = "დაბრუნებული";

            // optionCompleted
            const optionCompleted = document.createElement("option");
            optionCompleted.value = "completed";
            optionCompleted.textContent = "დასრულებული";

            // optionCanceled
            const optionCanceled = document.createElement("option");
            optionCanceled.value = "canceled";
            optionCanceled.textContent = "გაუქმებული";

            // Selected Default Option by value
            if (item.orderStatus === "Pending") {
                optionPending.selected = true;
            } else if (item.orderStatus === "Return") {
                optionReturn.selected = true;
            } else if (item.orderStatus === "Completed") {
                optionCanceled.selected = true;
            } else if (item.orderStatus === "Canceled") {
                optionCanceled.selected = true;
            }
            else {
                optionPending.selected = true;
            }
            // END Options Values


            selectOrderStatus.appendChild(optionPending);
            selectOrderStatus.appendChild(optionReturn);
            selectOrderStatus.appendChild(optionCompleted);
            selectOrderStatus.appendChild(optionCanceled);

            tdOrderStatus.appendChild(selectOrderStatus);
            // END Select Element


            tdPrice.textContent = item.price;

            // Build Table
            tr.appendChild(tdOrderName);
            tr.appendChild(tdTotalAmount);
            tr.appendChild(tdReservationDate);
            tr.appendChild(tdHallName);
            tr.appendChild(tdGuestName);
            tr.appendChild(tdEmployeeName);
            tr.appendChild(tdOrderStatus);

            const td = generateButtonGroup(item.id)
            tr.appendChild(td);
            tableBody.appendChild(tr);
        });

    }
    catch (exception) {
        await logException(exception);
    }
}

function changedSelectedStatus(event) {

    const modalWindow = new bootstrap.Modal(document.getElementById("fullscreenModal"));
    modalWindow.show();
    console.log("this is firs log");
    console.log(event.target);

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