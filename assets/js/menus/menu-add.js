import { checkTokenValidation, sendTest, getRequest, logException, setRequest } from "../Commons/requests.js";

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

class Item {
    constructor() {
        this.categoryGeo = null;
        this.categoryEng = null;
        this.nameGeo = null;
        this.nameEng = null;
        this.price = null;
    }
}

class Menu {
    constructor() {
        this.nameGeo = null;
        this.nameEng = null;

        this.hallNameGeo = null;
        this.hallNameEng = null;

        this.items = [new Item()];
    }
}

let selectedHall = null;


/* ---------------- EVENTS ---------------- */

(function addHallButtonEvent() {
    const addHallButton = document.getElementById("add-hall-button");
    addHallButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const selectedHall = document.getElementById("selected-hall");

        const hall = chouseHall();

        if(!hall.nameGeo)
            {
            console.error(hall);
            return;
        }
        if(!hall.nameEng)
            {
            console.error(hall);
            return;
        }
            //console.log(hall);


        if (selectedHall) selectedHall.disabled = true;

    });
})();

(function addItemButtonEvent() {
    document.addEventListener("DOMContentLoaded", () => {
        const addItemButton = document.getElementById("add-button");
        addItemButton.addEventListener("click", async (event) => {
            event.preventDefault();

            addMenuItem(event);

        });
    });
})();


(function addSaveChangesEvent() {
    const saveChangesButton = document.getElementById("add-saveChanges");
    if (!saveChangesButton) {
        return;
    }
    saveChangesButton.addEventListener("click", (event) => {

        readTableRows();
        //const menu = await createMenuObject();
    });
})();

(async function () {

    const result = await getRequest("hall", "halls", new Hall());

    if (result.statusCode === 200) {
        const halls = result.value;
        console.log(halls);
        renderHalls(halls);
    }

})();

/* ---------------- LOGIC ---------------- */

function chouseHall() {
    const selectedHall = document.getElementById("selected-hall");

    const selectedOption = selectedHall.options[selectedHall.selectedIndex];

    const hall = new Hall();

    hall.nameGeo = selectedOption.dataset.nameGeo;
    hall.nameEng = selectedOption.dataset.nameEng;

    hall.locationGeo = selectedOption.dataset.locationGeo;
    hall.locationEng = selectedOption.dataset.locationEng;

    hall.description = selectedOption.dataset.description;
    hall.phoneNumber = selectedOption.dataset.phoneNumber;
    
    return hall;
}

function renderHalls(halls) {
    const selectHalls = document.getElementById("selected-hall");

    halls.forEach(hall => {

        const option = document.createElement("option");

        option.setAttribute("data-name-geo", hall.nameGeo);
        option.setAttribute("data-name-eng", hall.nameEng);
        option.setAttribute("data-location-geo", hall.locationGeo);
        option.setAttribute("data-location-eng", hall.locationEng);
        option.setAttribute("data-description", hall.description);
        option.setAttribute("data-phoneNumber", hall.phoneNumber);

        option.textContent = `${hall.nameGeo} ${hall.nameEng}`;

        selectHalls.appendChild(option);
    });

}

async function readTableRows() {
    const tableBody = document.getElementById("tableBody");
    const rows = tableBody.querySelectorAll(`tr[name="row"]`);
    if (!rows) {
        return null;
    }

    const items = [];
    rows.forEach(row => {
        const data = new Item();

        data.categoryGeo = row.dataset.categoryGeo ?? null;
        data.categoryEng = row.dataset.categoryEng ?? null;
        data.nameGeo = row.dataset.nameGeo ?? null;
        data.nameEng = row.dataset.nameEng ?? null;
        data.price = row.dataset.price ?? null;

        items.push(data);
    });

    return items;
}

function createMenuObject(nameGeo, nameEng, hallNameGeo, hallNameEng, manuItems) {
    const menu = new Menu();
    menu.nameGeo = nameGeo;
    menu.nameEng = nameEng;
    menu.hallNameGeo = hallNameGeo;
    menu.hallNameEng = hallNameEng;

    manuItems.forEach((item) => {
        menu.itemspush(item);
    });

    return menu;
}

function createItemObject(categoryGeo, categoryEng, nameGeo, nameEng, price) {
    const item = new Item();
    item.categoryGeo = categoryGeo;
    item.categoryEng = categoryEng;

    item.nameGeo = nameGeo;
    item.nameEng = nameEng;

    item.price = price;

    return item;
}

function addHallHeaderRow(hallNameGeo, hallNameEng) {
    const hallHeader = document.getElementById("tableHeaderTitle");

    const td = document.createElement("td");
    td.classList = "table-secondary text-center fw-bold text-dark";
    td.setAttribute("colspan", "4");
    td.setAttribute("data-value-geo", hallNameGeo);
    td.setAttribute("data-value-eng", hallNameEng);
    hallHeader.textContent = `${hallNameGeo} / ${hallNameEng}`;

    tr.appendChild(td);

    return tr;
}

function addItemCategoryHeaderRow(categoryGeo, categoryEng) {
    const tr = document.createElement("tr");

    const td = document.createElement("td");

    td.classList = "table-secondary text-center fw-bold text-dark";
    td.setAttribute("colspan", "4");
    td.setAttribute("data-value-geo", categoryGeo);
    td.setAttribute("data-value-eng", categoryEng);
    td.textContent = `${categoryGeo} / ${categoryEng}`;

    tr.appendChild(td);

    return tr;
}

function addMenuItem(event) {

    const itemData = getInputsObject();


    const tableBody = document.getElementById("tableBody");

    let headerIndex = getHeaderByCategory(itemData.categoryGeo);

    if (headerIndex === null) {
        const itemHeader = addItemHeader(itemData);
        const itemRow = addItemRow(itemData);

        tableBody.appendChild(itemHeader);
        tableBody.appendChild(itemRow);
    }
    else {
        console.log(headerIndex);
        headerIndex += 1;
        insertByIndex(addItemRow(itemData), headerIndex);
    }

    //insertByIndex(addItemHeader(itemData), 3);
    //console.log(getHeadersWithIndexes());
    //console.log(getUniqueHeadersWithIndexes());
    //console.log(getHeaderByCategory("სასმელები"));

    //dragAndDrop();
    //dragAndDropWithRows();
}

function dragAndDrop() {
    const tableBody = document.getElementById("tableBody");
    let draggedRow = null;

    // 1. ყველა row-ს ვუმატებთ drag events
    tableBody.querySelectorAll("tr").forEach(row => {
        row.draggable = true;

        // როცა დავიწყებთ დრაფტს
        row.addEventListener("dragstart", (e) => {
            draggedRow = row;
            row.style.opacity = "0.5"; // ვატყუებთ, რომ ეს გატანილია
        });

        row.addEventListener("dragend", () => {
            draggedRow = null;
            row.style.opacity = "1";
        });

        // drag over სხვაზე
        row.addEventListener("dragover", (e) => {
            e.preventDefault(); // აუცილებელია, რომ drop მოხდეს
            row.style.borderTop = "2px solid #007bff"; // ვიზუალური ჰინტი
        });

        row.addEventListener("dragleave", () => {
            row.style.borderTop = "";
        });

        // drop
        row.addEventListener("drop", (e) => {
            e.preventDefault();
            row.style.borderTop = "";

            if (draggedRow && draggedRow !== row) {
                const allRows = Array.from(tableBody.querySelectorAll("tr"));
                const draggedIndex = allRows.indexOf(draggedRow);
                const targetIndex = allRows.indexOf(row);

                if (draggedIndex < targetIndex) {
                    row.after(draggedRow); // draggedRow-ი მიაქვს შემდეგ
                } else {
                    row.before(draggedRow); // draggedRow-ი მიაქვს წინ
                }
            }
        });
    });
}

function dragAndDropWithRows() {
    const tableBody = document.getElementById("tableBody");
    let draggedRow = null;
    let draggedGroup = []; // ჰედერი + მის category-ის rowData-ები

    tableBody.querySelectorAll("tr").forEach(row => {
        row.draggable = true;

        row.addEventListener("dragstart", (e) => {
            draggedRow = row;
            row.style.opacity = "0.5";

            // თუ ეს header-ია, ავყაროთ draggedGroup
            if (row.getAttribute("name") === "header") {
                const category = row.dataset.categoryGeo;
                const rows = Array.from(tableBody.querySelectorAll('tr[data-category-geo="' + category + '"], tr[category="' + category + '"]'));

                // group = header + მისი rowData-ები
                draggedGroup = [row, ...rows.filter(r => r !== row)];
            } else {
                draggedGroup = [row]; // თუ უბრალოდ data-row
            }
        });

        row.addEventListener("dragend", () => {
            draggedRow = null;
            draggedGroup = [];
            row.style.opacity = "1";
        });

        row.addEventListener("dragover", (e) => {
            e.preventDefault();
            row.style.borderTop = "2px solid #007bff";
        });

        row.addEventListener("dragleave", () => {
            row.style.borderTop = "";
        });

        row.addEventListener("drop", (e) => {
            e.preventDefault();
            row.style.borderTop = "";

            if (!draggedGroup.length || draggedGroup.includes(row)) return;

            const allRows = Array.from(tableBody.querySelectorAll("tr"));
            const targetIndex = allRows.indexOf(row);

            // შეგვიძლია შევწიოთ წინ/หลัง logics
            const firstDraggedIndex = allRows.indexOf(draggedGroup[0]);

            if (firstDraggedIndex < targetIndex) {
                // group-ს მივდებთ target-ის უკან
                row.after(...draggedGroup);
            } else {
                // group-ს მივდებთ target-ის წინ
                row.before(...draggedGroup);
            }
        });
    });
}

function insertByIndex(rowData, index = 0) {
    try {

        const tableBody = document.getElementById("tableBody");
        const rows = tableBody.querySelectorAll("tr");

        if (rows[index]) {
            tableBody.insertBefore(rowData, rows[index]);
        } else {
            tableBody.appendChild(rowData);
        }
    }
    catch (exception) {
        console.error(exception);
    }
}

function getHeadersWithIndexes() {
    const tableBody = document.getElementById("tableBody");

    const allRows = tableBody.querySelectorAll("tr");

    const result = [];

    allRows.forEach((row, index) => {
        if (row.getAttribute("name") === "header") {
            result.push({
                index,
                categoryGeo: row.dataset.categoryGeo
            });
        }
    });

    return result;
}

function getHeaderByCategory(categoryName) {
    const tableBody = document.getElementById("tableBody");
    const allRows = tableBody.querySelectorAll("tr");

    for (let index = 0; index < allRows.length; index++) {
        const row = allRows[index];

        // მხოლოდ header-ები გვინდა
        if (row.getAttribute("name") === "header") {
            const category = row.dataset.categoryGeo;

            if (category === categoryName) {
                // ვიპოვეთ ჰედერი
                return index;
            }
        }
    }

    // თუ ვერ მოიძებნა
    return null;
}

function getUniqueHeadersWithIndexes() {
    const tableBody = document.getElementById("tableBody");
    const allRows = [...tableBody.querySelectorAll("tr")];

    const result = [];
    const seenCategories = new Set();

    allRows.forEach((row, index) => {
        if (row.getAttribute("name") === "header") {
            const category = row.dataset.categoryGeo;

            if (!seenCategories.has(category)) {
                seenCategories.add(category);

                result.push({
                    index,
                    categoryGeo: category
                });
            }
        }
    });

    return result;
}

function addItemHeader(item) {
    const trHeader = document.createElement("tr");

    const tdHeaderGeo = document.createElement("td");
    const tdHeaderEng = document.createElement("td");
    const tdHeaderPrice = document.createElement("td");
    const tdHeaderActions = document.createElement("td");

    trHeader.setAttribute("name", "header");
    trHeader.setAttribute("data-category-geo", item.categoryGeo);
    trHeader.classList = "table-secondary text-center fw-bold text-dark";

    tdHeaderGeo.setAttribute("value", item.categoryGeo);
    tdHeaderGeo.textContent = item.categoryGeo;

    tdHeaderEng.setAttribute("value", item.categoryEng);
    tdHeaderEng.textContent = item.categoryEng;

    tdHeaderPrice.setAttribute("value", "ფასი / Price");
    tdHeaderPrice.textContent = "ფასი / Price";


    trHeader.appendChild(tdHeaderGeo);
    trHeader.appendChild(tdHeaderEng);
    trHeader.appendChild(tdHeaderPrice);
    trHeader.appendChild(tdHeaderActions);

    return trHeader;
}

function addItemRow(item) {
    const trRow = document.createElement("tr");

    const tdRowGeo = document.createElement("td");
    const tdRowEng = document.createElement("td");
    const tdRowPrice = document.createElement("td");
    const tdRowActions = document.createElement("td");

    trRow.setAttribute("name", "row");
    trRow.setAttribute("data-category-geo", item.categoryGeo);
    trRow.setAttribute("data-category-eng", item.categoryEng);
    trRow.setAttribute("data-name-geo", item.nameGeo);
    trRow.setAttribute("data-name-eng", item.nameEng);
    trRow.setAttribute("data-price", item.price);

    tdRowGeo.setAttribute("value", item.nameGeo);
    tdRowGeo.textContent = item.nameGeo;

    tdRowEng.setAttribute("value", item.nameEng);
    tdRowEng.textContent = item.nameEng;

    tdRowPrice.setAttribute("value", item.price);
    tdRowPrice.textContent = item.price;

    trRow.appendChild(tdRowGeo);
    trRow.appendChild(tdRowEng);
    trRow.appendChild(tdRowPrice);
    trRow.appendChild(tdRowActions);

    return trRow;
}

function getInputsObject() {
    const itemData = new Item();
    itemData.categoryGeo = document.getElementById("item-category-geo").value.trim();
    itemData.categoryEng = document.getElementById("item-category-eng").value.trim();
    itemData.nameGeo = document.getElementById("item-name-geo").value.trim();
    itemData.nameEng = document.getElementById("item-name-eng").value.trim();
    itemData.price = document.getElementById("item-price").value.trim();

    return itemData;
}