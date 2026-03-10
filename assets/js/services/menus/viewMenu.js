import { ApiService } from "../../core/requests.js";
import { getSelectedDataId } from "./selectMenu.js";
import { renderMenuToTable } from "./renderMenuTable.js";
import { insertByIndex, addItemHeaderRow } from "./writeMenu.js";
import { createMenuRow } from "../../Commons/buildElements.js";
import { renderSelectElement } from "../menus/renderMenuTable.js"


export async function showMenuInTable() {

    const selectedMenu = getSelectedDataId();

    if (!selectedMenu) {
        return;
    }

    const resultMenus = await ApiService.post("menu", "byId", selectedMenu.id);
    if (!resultMenus) {
        console.error("resultMenus is: ", resultMenus);
        return;
    }

    console.log(resultMenus);

    if (resultMenus.statusCode === 200) {
        const menus = resultMenus.value;

        renderSelectElement(menus, "selected-menu");
    }
}

export function selectedMenuChangeSelectedEvent() {
    const select = document.getElementById("selected-menu");

    if (!select) {
        return;
    }

    select.addEventListener("change", async (event) => await selectedMenuChangedEventHandler(event, select))
}

async function selectedMenuChangedEventHandler(event, select) {
    event.preventDefault();

    const option = select.options[select.selectedIndex];

    if (!option) {
        console.log("option error"); // მთლიანი <option> ელემენტი
        return;
    }
    // მაგალითები:
    const id = option.dataset.id;

    const response = await ApiService.post("menu", "byId", id);

    if (!response.success) {
        console.error("response is: ", response);
        return;
    }
    const menu = response.value;
    if (!menu) {
        console.error("response is: ", response);
        return;
    }
    renderMenuToTable(menu);

    if (menu.items) {
        await addMenuItems(menu.items);
    }
    else {
        clearTable("tableBody");
    }

}

function clearTable(tableId = null) {
    if (!tableId) {
        console.log("tableId is: ", tableId);
        return;
    }
    const tableBody = document.getElementById(tableId);
    if (!tableBody) {
        console.log("table not found: ", tableBody);
        return;
    }
    tableBody.textContent = "";
}

async function addMenuItems(items) {
    if (!items) {
        console.log("items: ", items);
        return;
    }
    const tableBody = document.getElementById("tableBody");
    tableBody.textContent = "";
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

