import { ApiService, logException } from "../core/requests.js";
// Class implementations

class Hall {
    constructor() {
        this.nameGeo = null;
        this.nameEng = null;
        this.locationGeo = null;
        this.locationEng = null;
        this.description = null;
        this.phoneNumber = null;
    }
}

const formSelectors = {
    nameGeo: "add-hall-name-geo",
    nameEng: "add-hall-name-eng",
    locationGeo: "add-hall-location-geo",
    locationEng: "add-hall-location-eng",
    description: "add-hall-description",
    phoneNumber: "add-hall-phoneNumber",
    id: "data-id" // we'll store selected row id here temporarily
};

const addButton = document.getElementById("add-button");
const message = document.getElementById("add-message");

const updateBtn = document.querySelector('#update-button');
const cancelBtn = document.querySelector('#cancel-button');

addButton.addEventListener("click", async (e) => {
    e.preventDefault();
    showMessage();

    const hallData = new Hall();

    hallData.nameGeo = document.getElementById("add-hall-name-geo").value.trim();
    hallData.nameEng = document.getElementById("add-hall-name-eng").value.trim();

    hallData.locationGeo = document.getElementById("add-hall-location-geo").value.trim();
    hallData.locationEng = document.getElementById("add-hall-location-eng").value.trim();
    hallData.description = document.getElementById("add-hall-phoneNumber").value.trim();
    hallData.phoneNumber = document.getElementById("add-hall-phoneNumber").value.trim();

    if (hallData.nameGeo === null) {
        throw new Error("hallData.nameGeo is null");
    }
    if (hallData.nameEng === null) {
        throw new Error("hallData.nameEng is null");
    }

    const data = await ApiService.post("hall", "addHall", hallData);

    const status = data.status === 200;

    showMessage(data.value, status);
    await fillData();
});

updateBtn.addEventListener("click", (event) => {
    showMessage();
    updateHall(event);
});

cancelBtn.addEventListener('click', (event) => {
    resetForm();
    showMessage();
});

await fillData();

async function fillData() {

    const halls = await ApiService.post("hall", "halls", new Hall());

    if (!halls)
        return;

    await renderTableById(halls.value, "tableBody");
    showMessage();

}

function showMessage(notification, succeed = false) {

    if(!notification){
        message.textContent = '';
    }
    if (succeed) {
        message.textContent = notification;
        message.style.color = "green";
        message.classList.add("text-center");
    }
    else {
        message.textContent = notification;
        message.style.color = "red";
        message.classList.add("text-center");
    }
}

async function renderTableById(items, elementId) {

    try {
        if (elementId !== 'tableBody')
            return;

        const tableBody = document.getElementById(elementId);

        if (!tableBody) {
            return;
        }

        tableBody.innerHTML = "";

        if (!items) {
            return;
        }

        if (!Array.isArray(items)) {
            throw items;
        }

        items.forEach(item => {
            const tr = document.createElement("tr");

            tr.setAttribute("name", "header-data");
            tr.setAttribute("data-name-geo", item.nameGeo);
            tr.setAttribute("data-name-eng", item.nameEng);
            tr.setAttribute("data-location-geo", item.locationGeo);
            tr.setAttribute("data-location-eng", item.locationEng);
            tr.setAttribute("data-description", item.description);
            tr.setAttribute("data-phone-number", item.phoneNumber);

            const tdNameGeo = document.createElement("td");
            const tdNameEng = document.createElement("td");
            const tdLocationGeo = document.createElement("td");
            const tdLocationEng = document.createElement("td");
            const tdDescription = document.createElement("td");
            const tdPhoneNumber = document.createElement("td");

            tdNameGeo.textContent = item.nameGeo;
            tdNameEng.textContent = item.nameEng;
            tdLocationGeo.textContent = item.locationGeo;
            tdLocationEng.textContent = item.locationEng;
            tdDescription.textContent = item.description;
            tdPhoneNumber.textContent = item.phoneNumber;

            tr.appendChild(tdNameGeo);
            tr.appendChild(tdNameEng);
            tr.appendChild(tdLocationGeo);
            tr.appendChild(tdLocationEng);
            tr.appendChild(tdDescription);
            tr.appendChild(tdPhoneNumber);

            tr.setAttribute("data-id", item.id);

            // <td>
            const td = generateButtonGroup(item);

            tr.appendChild(td);
            tableBody.appendChild(tr);
        });

    }
    catch (exception) {
        console.error("First ex: ", exception);

        const ex = {
            message: exception.message,
            source: "hall.js",
            operationType: "add-content"
        };
        await logException(ex);
    }
}

function generateButtonGroup(item) {
    const td = document.createElement("td");
    td.className = "text-center";

    // <div class="btn-group">
    const btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";
    btnGroup.setAttribute("role", "group");
    btnGroup.setAttribute("aria-label", "Basic mixed styles example");

    // --- Edit button ---
    const editBtn = document.createElement("a");

    editBtn.href = "#";
    editBtn.className = "btn btn-warning btn-sm";
    editBtn.title = "რედაქტირება";
    editBtn.addEventListener("click", event => {
        editHall(event);
    });

    const iEdit = document.createElement('i');

    iEdit.classList.add("fas", "fa-edit");

    iEdit.setAttribute("data-id", item.id);

    editBtn.appendChild(iEdit);

    // --- Delete button ---
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn-danger btn-sm delete-template-btn";
    deleteBtn.title = "შაბლონის წაშლა";
    deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;

    // ღილაკების დამატება ჯგუფში
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);
    // ჯგუფის დამატება <td>-ში
    td.appendChild(btnGroup);

    return td;
}

function editHall(event) {
    const row = event.target.closest('tr');

    if (!row)
        return;

    const data = row.dataset;

    document.getElementById(formSelectors.nameGeo).value = data.nameGeo;
    document.getElementById(formSelectors.nameEng).value = data.nameEng;
    document.getElementById(formSelectors.locationGeo).value = data.locationGeo;
    document.getElementById(formSelectors.locationEng).value = data.locationEng;
    document.getElementById(formSelectors.description).value = data.description;
    document.getElementById(formSelectors.phoneNumber).value = data.phoneNumber;

    addButton.hidden = true;

    updateBtn.hidden = false;
    cancelBtn.hidden = false;

    updateBtn.dataset.id = data.id;
}

function resetForm() {
    for (const key in formSelectors) {
        if (key === 'id')
            continue;
        document.getElementById(formSelectors[key]).value = '';
    }

    addButton.hidden = false;

    updateBtn.hidden = true;
    cancelBtn.hidden = true;

    updateBtn.dataset.id = '';
}

async function updateHall(event) {

    const button = event.target;
    if (!button) {
        showMessage("მონაცემების განახლება ვერ მოხერხდა", false);
        return;
    }

    const id = button.dataset.id;

    const data = {
        nameGeo: document.getElementById("add-hall-name-geo").value.trim(),
        nameEng: document.getElementById("add-hall-name-eng").value.trim(),

        locationGeo: document.getElementById("add-hall-location-geo").value.trim(),
        locationEng: document.getElementById("add-hall-location-eng").value.trim(),
        description: document.getElementById("add-hall-phoneNumber").value.trim(),
        phoneNumber: document.getElementById("add-hall-phoneNumber").value.trim(),
        id: id
    }
    
    resetForm();
    showMessage("მონაცემების წარმატებით განახლდა", true);
}

