import { validatedName } from "../../validators/menus/menuValidators.js";
import { showNotification } from "../../components/notifications/showNotification.js";
import { ApiService } from "../../core/requests.js"
import { createSelectObject } from "./selectMenu.js";
import { readTableHeader, readTableRows, readItemDatas, getHeadersWithIndexesByValue } from "./readMenu.js";
import { insertByIndex, addItemHeaderRow } from "./writeMenu.js";
import { createMenuNameTitle, createMenuRow } from "../../Commons/buildElements.js";

class Menu {
    constructor() {
        this.nameGeo = null;
        this.nameEng = null;
        this.description = null;
        this.phoneNumber = null;

        this.items = [];
    }
}

const notifications = {
    menuNotification: "menu-notification",
    selectedMenuNotification: "selected-menu-notification",
    itemNotification: "item-notification",
    saveChanges: ""
};


export function initializeEditableTable(tableBodyId) {

    const tableBody = document.getElementById(tableBodyId);
    if (!tableBody) return;

    tableBody.addEventListener("click", function (e) {

        const row = e.target.closest("tr[name='row']");
        if (!row) return;

        // =========================
        // EDIT
        // =========================
        const editBtn = e.target.closest(".editBtn");

        if (editBtn) {

            const cells = row.querySelectorAll("td[data-value]");

            cells.forEach(cell => {

                const currentValue = cell.dataset.value;

                const input = document.createElement("input");
                input.type = "text";
                input.className = "form-control form-control-sm";
                input.value = currentValue;

                cell.innerHTML = "";
                cell.appendChild(input);
            });

            editBtn.classList.add("d-none");
            row.querySelector(".saveBtn")?.classList.remove("d-none");

            return;
        }

        // =========================
        // SAVE
        // =========================
        const saveBtn = e.target.closest(".saveBtn");

        if (saveBtn) {

            const cells = row.querySelectorAll("td");

            cells.forEach(cell => {

                const input = cell.querySelector("input");
                if (!input) return;

                const newValue = input.value.trim();

                // განვაახლოთ dataset
                cell.dataset.value = newValue;

                cell.innerHTML = newValue;
            });

            saveBtn.classList.add("d-none");
            row.querySelector(".editBtn")?.classList.remove("d-none");

            return;
        }

    });

}

// ახალი, ცარიელი მენიუს დამატება ბაზაში, რომელიც შემდეგ უნდა შეივსოს.
export function addMenuHeaderButtonEvent() {

    const addHallHeaderButton = document.getElementById("add-menu-header-button");
    if (!addHallHeaderButton) {

        return;
    }

    addHallHeaderButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const geoNameId = "menu-name-geo";
        const engNameId = "menu-name-eng";

        const geoNameElement = document.getElementById(geoNameId);
        const engNameElement = document.getElementById(engNameId);

        if (!validatedName(geoNameElement)) {
            showNotification(notifications.menuNotification, geoNameElement.validationMessage, false);
            console.warn("Validation failed");
            return;
        }

        if (!validatedName(engNameElement)) {
            showNotification(notifications.menuNotification, engNameElement.validationMessage, false);
            console.warn("Validation failed");
            return;
        }

        const menu = new Menu();

        menu.nameGeo = geoNameElement.value.trim();
        menu.nameEng = engNameElement.value.trim();

        const result = await ApiService.post("menu", "addMenu", menu);
        if (result.success) {
            showNotification(notifications.menuNotification, "მონაცემები წარმატებით დაემატა ბაზაში.", true);
        }

    });

}

// მონაცემთა ბაზიდან ჩატვირთული მენიუების არჩევა.
export function selectMenuButtonEvent() {
    const selectMenuButton = document.getElementById("add-menu-button");
    if (!selectMenuButton) {
        return;
    }

    selectMenuButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const menuSelect = document.getElementById("selected-menu");

        let isValid = true;

        menuSelect.classList.remove("is-invalid");

        if (!menuSelect.value) {
            menuSelect.classList.add("is-invalid");
            isValid = false;
        }

        if (!isValid) {
            console.warn("Validation failed");
            return;
        }

        const menu = new Menu();

        const selectedMenu = createSelectObject("selected-menu");

        const request = await ApiService.post("menu", "byId", selectedMenu.id);

        if (request.success && request.value.items) {
            console.log("Menu data received.");
            await addMenuItems(request.value.items);
        }
        menu.id = selectedMenu.id;
        menu.nameGeo = selectedMenu.nameGeo;
        menu.nameEng = selectedMenu.nameEng;

        const menuNameResult = await createMenuNameTitle(menu, "tableHeaderTitle");
        if (!menuNameResult) {
            console.error("Menu name did not created.");
            return;
        }

        activeSelectElements(false);
        activeItemElements(true);
    });
}

function activeSelectElements(isActive) {
    const selectMenuButton = document.getElementById("add-menu-button");
    const selectMenu = document.getElementById("selected-menu");

    if (selectMenuButton)
        selectMenuButton.disabled = !isActive;

    if (selectMenu)
        selectMenu.disabled = !isActive;
}

export function activeItemElements(isActive) {
    const selectItems = document.getElementById("selected-menu-item");
    const nameGeo = document.getElementById("item-name-geo");
    const nameEng = document.getElementById("item-name-eng");
    const price = document.getElementById("item-price");
    const addButton = document.getElementById("add-button");

    if (selectItems)
        selectItems.disabled = !isActive;

    if (nameGeo)
        nameGeo.disabled = !isActive;

    if (nameEng)
        nameEng.disabled = !isActive;

    if (price)
        price.disabled = !isActive;

    if (addButton)
        addButton.disabled = !isActive;
}

// შედგენილი მენიუს დამახსოვრება SaveChanges
export function addSaveChangesButtonEvent() {
    console.log("Save changes button not found 1...");

    const saveChangesButton = document.getElementById("add-saveChanges");
    if (!saveChangesButton) {
        console.log("Save changes button not found 1-2...");
        return;
    }
    console.log("Save changes button not found 2...");

    saveChangesButton.addEventListener("click", async (event) => {
        //event.preventDefault();

        const model = readTableHeader();
        const itemsData = readTableRows();

        model.items = [];
        itemsData.forEach(item => {
            model.items.push(item);
        });
        console.log(model);
        const response = await ApiService.post("menu", "addMenuLine", model);

        console.log("Save changes button not found 3...");

        if (!response.success) {
            showNotification(notifications.itemNotification, response.message, response.success);

            console.log(response);
            return;
        }

        console.log("Save changes button not found 4...");

        showNotification(notifications.itemNotification, "მონაცემები შენახულია ბაზაში", response.success);
        console.log(response);

        alert(JSON.stringify(response));
        location.reload();
    });
}

// შერჩეული აითემის დამატება ცხრილში შესაბამისი კატეგორიის მიხედვით. AddItem
export function addItemButtonEvent() {
    document.addEventListener("DOMContentLoaded", () => {
        const addItemButton = document.getElementById("add-button");
        if (!addItemButton) {
            return;
        }

        addItemButton.addEventListener("click", async (event) => {
            event.preventDefault();
            addMenuItemFromInput(event);
        });
    });
}


async function addMenuItemFromInput(event) {
    // არ აბრუნებს კატეგორიის მნიშნველობას და აბრუნებს null-ს.
    const itemData = await readItemDatas();

    const tableBody = document.getElementById("tableBody");

    let header = await getHeadersWithIndexesByValue(itemData.categoryGeo);

    if (!header) {
        // const itemHeader = addItemHeader(itemData);
        const itemHeader = addItemHeaderRow(itemData.categoryGeo, itemData.categoryEng);
        const itemRow = createMenuRow(itemData, true);

        tableBody.appendChild(itemHeader);
        tableBody.appendChild(itemRow);
    }
    else {
        const index = header.index + 1;
        const tr = createMenuRow(itemData, true);
        insertByIndex(tr, index);
    }
    const saveChangesButton = document.getElementById("add-saveChanges");
    if (saveChangesButton) {
        saveChangesButton.removeAttribute("hidden");
    }
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
            const itemRow = createMenuRow(item, true);

            tableBody.appendChild(itemHeader);
            tableBody.appendChild(itemRow);

            arr.push(category);
        }
        else {
            const index = header.index + 1;
            const tr = createMenuRow(item, true);
            insertByIndex(tr, index);

            console.log("Header not.");
        }
    });

}