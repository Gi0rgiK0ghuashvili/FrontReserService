export function createCheckBox(model) {

    const div = document.createElement("div");
    const div2 = document.createElement("div2");
    const span = document.createElement("span");
    const span2 = document.createElement("span");
    const i = document.createElement("i");

    div.classList = "dropdown-toggle";
    div.setAttribute("data-id", "menuDropdownToggle");
    span.setAttribute("data-id", "menuDropdownText");
    span.textContent = "აირჩიეთ მენიუ";
    span2.classList = "selected-count";
    span2.textContent = "(0)";
    i.classList = "bi bi-chevron-down dropdown-arrow";
    div.appendChild(div2);
    div2.appendChild(span);
    span.appendChild(span2);
    div2.appendChild(i);

    return div;
}

export function createDropDownItem(orderMenu) {

    if (!orderMenu) {
        throw new Error("orderMenu is required");
    }
    
    const div = document.createElement("div");
    const input = document.createElement("input");
    const span = document.createElement("span");

    div.className = "dropdown-item";

    input.type = "checkbox";
    input.name = orderMenu.nameGeo;
    input.dataset.id = orderMenu.id;
    input.dataset.name = orderMenu.nameGeo;
    input.dataset.nameGeo = orderMenu.nameGeo;
    input.dataset.nameEng = orderMenu.nameEng;
    input.value = orderMenu.nameGeo;
    input.className = "dropdown-checkbox";

    span.className = "dropdown-text";
    span.textContent = orderMenu.nameGeo;

    div.appendChild(input);
    div.appendChild(span);
    
    return div;
}

