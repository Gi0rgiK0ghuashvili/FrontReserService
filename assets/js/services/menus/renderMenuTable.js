import { createDIV, createTD, createUserNameTD, createRoleTD, createEditButton, createDeleteButton } from "../../Commons/buildElements.js";
import { ApiService } from "../../core/requests.js";
import { createOptionDefault, createOption, createOptionWithoutNumber } from "../../Commons/buildElements.js";

class Menu {
    constructor() {
        this.id = null;
        this.nameGeo = null;
        this.nameEng = null;

        this.hallNameGeo = null;
        this.hallNameEng = null;

        this.items = null;
    }
}


// data read from backend and fill slect elements.
export async function getMenus() {
    const resultMenus = await ApiService.post("menu", "menus", new Menu());

    if (resultMenus.statusCode === 200) {
        const menus = resultMenus.value;

        renderSelectElement(menus, "selected-menu");
    }

    const resultCategories = await ApiService.get("category", "categories");
    console.log("resultCategories", resultCategories);
    if (resultCategories.statusCode === 200) {
        const categories = resultCategories.value;

        renderSelectCategoryElement(categories, "selected-menu-item");
    }
}

function renderMenuName(menu) {
    const menuNameElement = document.getElementById("tableHeaderTitle");

    menuNameElement.setAttribute("name", "menu-name");
    menuNameElement.setAttribute("data-name-geo", menu.nameGeo);
    menuNameElement.setAttribute("data-name-eng", menu.nameEng);

    menuNameElement.setAttribute("data-location-geo", menu.locationGeo);
    menuNameElement.setAttribute("data-location-eng", menu.locationEng);
    menuNameElement.setAttribute("data-description", menu.description);
    menuNameElement.setAttribute("data-phoneNumber", menu.phoneNumber);

    const divGeo = createDIV(`${menu.nameGeo}`);
    const divEng = createDIV(`${menu.nameEng}`);

    menuNameElement.textContent = "";
    menuNameElement.appendChild(divGeo);
    menuNameElement.appendChild(divEng);
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

// create header title row.
export function renderMenuToTable(menu) {
    const menuNameElement = document.getElementById("tableHeaderTitle");

    menuNameElement.setAttribute("data-id", menu.id);
    menuNameElement.setAttribute("data-name-geo", menu.nameGeo);
    menuNameElement.setAttribute("data-name-eng", menu.nameEng);

    menuNameElement.setAttribute("data-location-geo", menu.locationGeo);
    menuNameElement.setAttribute("data-location-eng", menu.locationEng);
    menuNameElement.setAttribute("data-description", menu.description);
    menuNameElement.setAttribute("data-phoneNumber", menu.phoneNumber);

    const divGeo = createDIV(`${menu.nameGeo}`);
    const divEng = createDIV(`${menu.nameEng}`);

    menuNameElement.textContent = "";
    menuNameElement.appendChild(divGeo);
    menuNameElement.appendChild(divEng);
}

// select ელემენტში მენიუს მნიშვნელობების ჩამატება
export function renderSelectElement(menus, elementId) {
    const select = document.getElementById(elementId);
    
    if (!select) {
        console.log("select not found.");
        return;
    }

    select.innerHTML = "";
    select.appendChild(createOptionDefault());

    menus.forEach(menu => {
        let count = 0;
        if(menu.items)
            count = menu.items.length;
        select.appendChild(createOption(menu.nameGeo, menu.nameEng, menu.id, count));
    });

}

// select ელემენტში  კატეგორიის მნიშვნელობების ჩამატება
export function renderSelectCategoryElement(menus, elementId) {
    const select = document.getElementById(elementId);
    
    if (!select) {
        console.log("select not found.");
        return;
    }

    select.innerHTML = "";
    select.appendChild(createOptionDefault());

    menus.forEach(menu => {
        select.appendChild(createOptionWithoutNumber(menu.nameGeo, menu.nameEng, menu.id));
    });

}
