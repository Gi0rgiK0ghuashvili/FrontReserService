export async function writeOptionsInSelect(menus, menuSelectId = null) {

    try {
        const elementId = "selected-menu";
        if (menuSelectId != null) {
            elementId = menuSelectId;
        }

        if (!menus) {
            console.error("ჩასატვირთი მონაცემები ვერ მოიძებნა.");
            return;
        }

        const selectHalls = document.getElementById(elementId);

        menus.forEach(menu => {
            const option = document.createElement("option");
            option.setAttribute("name", menu.nameGeo);
            option.setAttribute("data-name-geo", menu.nameGeo);
            option.setAttribute("data-name-eng", menu.nameEng);
            option.setAttribute("data-id", menu.id);

            option.textContent = `${menu.nameGeo} ${menu.nameEng}`;

            selectHalls.appendChild(option);
        });
    }
    catch (exception) {
        const ex = {
            message: exception.message,
            source: "item.js",
            operationType: "add-content"
        };
        const logExc = await logException(ex);
    }
}

export async function writeMenuItems(menuItems, menuSelectId = null) {
    const elementId = "selected-menu-item";
    if (menuSelectId != null) {
        elementId = menuSelectId;
    }

    if (!menuItems) {
        console.log("ჩასატვირთი მონაცემები ვერ მოიძებნა.");
        return;
    }
    console.log(menuItems);
    const selectHalls = document.getElementById(elementId);

    menuItems.forEach(item => {

        const option = document.createElement("option");
        option.setAttribute("name", item.nameGeo);
        option.setAttribute("data-name-geo", item.nameGeo);
        option.setAttribute("data-name-eng", item.nameEng);
        option.setAttribute("data-id", item.id);

        option.textContent = `${item.nameGeo} ${item.nameEng}`;

        selectHalls.appendChild(option);
    });
}

export async function insertByIndex(rowData, index = 0) {
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

export function addItemHeaderRow(hallNameGeo, hallNameEng, elementId = "tableHeaderTitle") {
    const hallHeader = document.getElementById(elementId);

    const tr = document.createElement("tr");

    const td = document.createElement("td");
    td.classList = "table-secondary text-center fw-bold text-dark";
    td.setAttribute("colspan", "4");

    tr.setAttribute("name", "header");
    tr.setAttribute("data-category-geo", hallNameGeo);
    tr.setAttribute("data-category-eng", hallNameEng);

    td.textContent = `${hallNameGeo} / ${hallNameEng}`;

    tr.appendChild(td);
    
    hallHeader.appendChild(tr);

    return tr;
}

export function addItemCategoryHeaderRow(categoryGeo, categoryEng) {
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

