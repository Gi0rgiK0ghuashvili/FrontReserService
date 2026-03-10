export function createDIV(value) {
    const td = document.createElement("div");

    td.textContent = value;
    td.classList = "text-center";
    td.setAttribute("data-value", value);
    return td;
}

export function createOption(nameGeo, nameEng, id, itemsCount = 0) {
    const option = document.createElement("option");

    option.setAttribute("name", nameGeo);
    option.setAttribute("data-name-geo", nameGeo);
    option.setAttribute("data-name-eng", nameEng);
    option.setAttribute("data-id", id);

    option.textContent = `${nameGeo} ${nameEng} - ${itemsCount}`;

    return option;
}

export function createOptionWithoutNumber(nameGeo, nameEng, id) {
    const option = document.createElement("option");

    option.setAttribute("name", nameGeo);
    option.setAttribute("data-name-geo", nameGeo);
    option.setAttribute("data-name-eng", nameEng);
    option.setAttribute("data-id", id);

    option.textContent = `${nameGeo} ${nameEng}`;

    return option;
}

export function createOptionDefault() {

    const option = document.createElement("option");
    option.disabled = true;
    option.selected = true;
    option.textContent = "აირჩიე ...";

    return option;
}

export function createTD(value, isIndex = false) {
    const td = document.createElement("td");
    td.textContent = value;
    td.setAttribute("data-value", value);
    if (isIndex === true) {
        td.classList.add("fw-bold");
    }
    return td;
}

export function createInputTD(value, isNumber = false, isDisabled = true) {
    const td = document.createElement("td");
    const input = document.createElement("input");

    if (isNumber) {
        input.type = "number";
        input.name = "quantity";
        input.min = 0;
    }
    else {
        input.type = "text";
        input.name = "input"
    }

    if (isDisabled) {
        input.disabled = true;
    }
    input.value = value;
    td.setAttribute("data-value", value);

    td.appendChild(input);
    return td;
}

export function createUserNameTD(value) {
    const td = document.createElement("td");
    const code = document.createElement("code");

    code.textContent = value;
    code.setAttribute("data-value", value);
    code.className = "bg-light p-1 rounded";

    td.appendChild(code);
    return td;
}

export function createRoleTD(value) {

    const td = document.createElement("td");
    const span = document.createElement("span");
    span.textContent = value;
    span.setAttribute("data-value", value);

    span.classList = "badge badge-role bg-primary";
    td.appendChild(span);

    return td;
}

export function createSaveEditedButton(value) {
    const button = document.createElement("button");
    const i = document.createElement("i");

    button.type = "button";
    button.title = "შენახვა";
    button.dataset.user = value;

    button.className = "btn btn-sm btn-success saveBtn me-1 d-none";

    i.className = "bi bi-check-lg";

    button.appendChild(i);

    return button;
}

export function createEditButton(value) {
    const button = document.createElement("button");
    const i = document.createElement("i");

    button.setAttribute("type", "button");
    button.setAttribute("title", "რედაქტირება");
    button.setAttribute("data-user", value);

    button.classList = "btn btn-sm btn-warning editBtn me-1";

    i.classList = "bi bi-pencil-square";

    button.appendChild(i);

    return button;
}

export function createDeleteButton(value) {
    const form = document.createElement("form");
    const input = document.createElement("input");
    const button = document.createElement("button");
    const i = document.createElement("i");

    form.setAttribute("style", "display:inline;");

    input.setAttribute("type", "hidden");
    input.setAttribute("name", "delete_id");
    input.setAttribute("data-value", value);

    button.classList = "btn btn-sm btn-danger";
    button.onclick = "return confirm('ნამდვილად გსურს მონაცემის წაშლა?')";
    button.setAttribute("type", "submit");
    button.setAttribute("name", "delete_user");
    button.setAttribute("title", "წაშლა");

    i.classList = "bi bi-trash3";

    form.appendChild(input);
    button.appendChild(i);
    form.appendChild(button);

    return form;
}

export async function createCheckboxes() {
    const menus = await ApiService.post("menu", "menus");
    menus.value.forEach(item => {
        dropdown.insertAdjacentHTML("beforeend", `
            <label>
              <input type="checkbox" value="${item.id}">
              ${item.name}
            </label>
          `);
    });
}

export function createChecBox(checked = false) {
    const td = document.createElement("td");
    const input = document.createElement("input");

    input.type = "checkbox";
    input.checked = checked;
    input.value = "value"

    input.className = "form-check-input";
    td.appendChild(input);

    return td;
}

export async function createMenuNameTitle(data, tableHeaderTitleId) {

    if (!tableHeaderTitleId) {
        tableHeaderTitleId = "tableHeaderTitle";
    }

    const menuNameElement = document.getElementById(tableHeaderTitleId);

    menuNameElement.setAttribute("name", "menu-name");
    menuNameElement.setAttribute("data-id", data.id);
    menuNameElement.setAttribute("data-name-geo", data.nameGeo);
    menuNameElement.setAttribute("data-name-eng", data.nameEng);

    const divGeo = createDIV(`${data.nameGeo}`);
    const divEng = createDIV(`${data.nameEng}`);

    menuNameElement.textContent = "";
    menuNameElement.appendChild(divGeo);
    menuNameElement.appendChild(divEng);

    return menuNameElement;
}

export async function createMenuHeader(nameGeo, nameEng, tableHeaderTitleId = null) {

    if (!tableHeaderTitleId) {
        tableHeaderTitleId = "tableHeaderTitle";
    }

    const menuNameElement = document.getElementById(tableHeaderTitleId);

    menuNameElement.setAttribute("name", "menu-name");
    menuNameElement.setAttribute("data-name-geo", nameGeo);
    menuNameElement.setAttribute("data-name-eng", nameEng);

    const divGeo = createDIV(`${nameGeo}`);
    const divEng = createDIV(`${nameEng}`);

    menuNameElement.textContent = "";
    menuNameElement.appendChild(divGeo);
    menuNameElement.appendChild(divEng);

    return menuNameElement;
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

// ეს არის მენიუს აითემების დამატება ცხრილში.
// უნდა გადაეცეს აქვს თუ არა უფლება, რომ ცვლილება შეძლოს. საწყისად განსაზღვრული არის false.
export function createMenuRow(item, isPermited = false) {
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

    const tdNameGeo = createTD(item.nameGeo);
    const tdNameEng = createTD(item.nameEng);
    const tdPrice = createTD(item.price);

    const tdActions = document.createElement("td");

    tdActions.classList = "text-Center";

    if (isPermited) {

        const tdEditButton = createEditButton(item.id);
        tdEditButton.addEventListener("click", async (event) => {
            event.preventDefault();
            editMenuItem(event);
        });
        tdActions.appendChild(tdEditButton);

        const tdDeleteButton = createDeleteButton(item.id);
        tdDeleteButton.addEventListener("click", async (event) => {
            event.preventDefault();
            deleteMenuItem(event);
        });
        tdActions.appendChild(tdDeleteButton);

        const tdSaveButton = createSaveEditedButton(item.id)
        tdSaveButton.addEventListener("click", async (event) => {
            event.preventDefault();
            setEditedValueMenuItem(event);
        })
        tdActions.appendChild(tdSaveButton);

    }

    trMenuRow.appendChild(tdNameGeo);
    trMenuRow.appendChild(tdNameEng);
    trMenuRow.appendChild(tdPrice);
    trMenuRow.appendChild(tdActions);

    return trMenuRow;
}

function deleteMenuItem(event) {
    const tr = event.target.closest("tr");
    if (!tr) {
        console.error("tr is deleted: ", tr);
        return;
    }
    tr.remove();
}

function editMenuItem(event) {

    const tr = event.target.closest("tr");
    if (!tr) {
        console.error("tr is changed: ", tr);
        return;
    }

    const tds = tr.querySelectorAll("td[data-value]");

    tds.forEach(td => {

        if (td.querySelector("input")) return;

        const currentValue = td.dataset.value;

        const input = document.createElement("input");
        input.type = "text";
        input.className = "form-control form-control-sm";
        input.value = currentValue;

        td.innerHTML = "";
        td.appendChild(input);
    });

    // Edit დამალვა
    const editBtn = tr.querySelector(".editBtn");
    editBtn?.classList.add("d-none");

    // Save გამოჩენა
    const saveBtn = tr.querySelector(".saveBtn");
    saveBtn?.classList.remove("d-none");
}

function setEditedValueMenuItem(event) {

    const tr = event.target.closest("tr");
    if (!tr) {
        console.error("tr is saved: ", tr);
        return;
    }

    const saveChangesButton = document.getElementById("add-saveChanges");
    if(saveChangesButton){
        saveChangesButton.removeAttribute("hidden");
    }
    const tds = tr.querySelectorAll("td[data-value]");

    tds.forEach((td, index) => {

        const input = td.querySelector("input");
        if (!input) return;

        const newValue = input.value.trim();

        td.dataset.value = newValue;
        td.innerHTML = newValue;

        switch (index) {
            case 0:
                tr.dataset.nameGeo = newValue;
                break;
            case 1:
                tr.dataset.nameEng = newValue;
                break;
            case 2:
                tr.dataset.price = newValue;
                break;
        }
    });

    const actionsTd = tr.querySelector("td:last-child");

    if (actionsTd) {
        const saveBtn = actionsTd.querySelector(".saveBtn");
        const editBtn = actionsTd.querySelector(".editBtn");

        saveBtn?.classList.add("d-none");
        editBtn?.classList.remove("d-none");
    }

    console.log("Updated Row Dataset:", tr.dataset);
}

