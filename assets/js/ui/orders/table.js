import { createOptionDefault, createChecBox, createInputTD, createTD, createEditButton, createDeleteButton } from "../../Commons/buildElements.js";
import { insertByIndex, writeMenuItems, writeOptionsInSelect } from "../../services/menus/writeMenu.js";


// select ელემენტში  კატეგორიის მნიშვნელობების ჩამატება
export function renderToTable(menus, elementId) {
    const table = document.getElementById(elementId);

    if (!table) {
        console.log("select not found.");
        return;
    }

    table.innerHTML = "";

    menus.forEach(value => {
        console.log(value);

        const menuHeader = createMenuHeader(value);

        const tableHeader = createTableHeader();
        table.appendChild(menuHeader);

        table.appendChild(tableHeader);

        addMenuItems(value.items, false);
    });

}

function addMenuItems(items, tableClear = true) {
    if (!items) {
        console.log("items: ", items);
        return;
    }
    const tableBody = document.getElementById("tableBody");
    if (tableClear) {
        tableBody.textContent = "";
    }

    const arr = [];

    items.forEach(item => {
        let category = item.categoryGeo;

        if (!arr.includes(category)) {
            const itemHeader = addItemHeaderRow(item.categoryGeo, item.categoryEng);
            const itemRow = createMenuRow(item);

            tableBody.appendChild(itemHeader);
            tableBody.appendChild(itemRow);

            arr.push(category);
        }
        else {
            const index = header.index + 1;
            const tr = createMenuRow(item);
            insertByIndex(tr, index);

            console.log("Header not.");
        }
    });

}

function createMenuHeader(menu) {
    const tr = document.createElement("tr");

    if (!tr) {
        return null;
    }
    tr.classList = "table-primary text-center fw-bold text-dark";

    tr.setAttribute("name", "menu-name");
    tr.setAttribute("data-name-geo", menu.nameGeo);
    tr.setAttribute("data-name-eng", menu.nameEng);

    const tdGeo = createTD(`${menu.nameGeo} | ${menu.nameEng}`);
    tdGeo.setAttribute("colspan", "10");

    tr.appendChild(tdGeo);

    return tr;
}

function createTableHeader() {
    const tr = document.createElement("tr");

    if (!tr) {
        return null;
    }
    tr.classList = "table-primary text-center fw-bold text-dark";

    const tdChecked = createTD("check");
    const tdNameGeo = createTD("სახელი");
    const tdNameEng = createTD("Name");
    const tdQuantity = createTD("რაოდენობა (ცალი)");
    const tdPrice = createTD("ფასი (ლ)");
    const tdSum = createTD("ჯამი (ლ)");
    const tdComment = createTD("შენიშვნა");

    tr.appendChild(tdChecked);
    tr.appendChild(tdNameGeo);
    tr.appendChild(tdNameEng);
    tr.appendChild(tdQuantity);
    tr.appendChild(tdPrice);
    tr.appendChild(tdSum);
    tr.appendChild(tdComment);

    return tr;
}

function addItemHeaderRow(menuNameGeo, menuNameEng) {
    const tr = document.createElement("tr");

    const tdMain = document.createElement("td");
    const span = document.createElement("span");
    tdMain.classList = "table-secondary text-center fw-bold text-dark";
    tdMain.setAttribute("colspan", "10");

    tr.setAttribute("name", "header");
    tr.setAttribute("data-category-geo", menuNameGeo);
    tr.setAttribute("data-category-eng", menuNameEng);
    span.textContent = `${menuNameGeo} / ${menuNameEng}`;

    
    const input = document.createElement("input");

    input.type = "number";
    input.min = 0;
    input.max = 100;
    

    input.value = "0";
    input.name = "input"

    tdMain.appendChild(span);
    tdMain.appendChild(input);
    tr.appendChild(tdMain);
    return tr;
}

export async function createOrderHeader(nameGeo, nameEng, tableHeaderTitleId = null) {

    if (!tableHeaderTitleId) {
        tableHeaderTitleId = "tableHeaderTitle";
    }

    const menuNameElement = document.getElementById(tableHeaderTitleId);

    menuNameElement.setAttribute("name", "menu-name");
    menuNameElement.setAttribute("data-name-geo", nameGeo);
    menuNameElement.setAttribute("data-name-eng", nameEng);

    const divGeo = createDIV(`${nameGeo}`);
    const divEng = createDIV(`${nameEng}`);
    const inputPercent = createInputTD("0", true);

    menuNameElement.textContent = "";
    menuNameElement.appendChild(divGeo);
    menuNameElement.appendChild(divEng);
    menuNameElement.appendChild(inputPercent);

    return menuNameElement;
}


function createMenuRow(item) {
    const trMenuRow = document.createElement("tr");

    if (item.id) {
        trMenuRow.setAttribute("data-id", item.id);
    }

    trMenuRow.setAttribute("name", "row");
    trMenuRow.setAttribute("data-category-geo", item.categoryGeo);
    trMenuRow.setAttribute("data-category-eng", item.categoryEng);
    trMenuRow.setAttribute("data-name-geo", item.nameGeo);
    trMenuRow.setAttribute("data-name-eng", item.nameEng);
    trMenuRow.setAttribute("data-price", item.price);

    const tdChecked = createChecBox();
    const tdNameGeo = createTD(item.nameGeo);
    const tdNameEng = createTD(item.nameEng);
    const tdQuantity = createInputTD(0, "quantity", true);
    const tdPrice = createTD(item.price, "price");
    const tdSum = createTD(0, "sum");
    const tdComment = createInputTD(" ", "comment");

    const tdActions = document.createElement("td");

    tdActions.classList = "text-Center";

    trMenuRow.appendChild(tdChecked);
    trMenuRow.appendChild(tdNameGeo);
    trMenuRow.appendChild(tdNameEng);
    trMenuRow.appendChild(tdQuantity);
    trMenuRow.appendChild(tdPrice);
    trMenuRow.appendChild(tdSum);
    trMenuRow.appendChild(tdComment);

    return trMenuRow;
}