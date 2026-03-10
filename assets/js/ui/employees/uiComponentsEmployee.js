
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

    form.setAttribute("method", "POST");
    form.setAttribute("style", "display:inline;");

    input.setAttribute("type", "hidden");
    input.setAttribute("name", "delete_id");
    input.setAttribute("value", value);

    button.classList = "btn btn-sm btn-danger";
    button.onclick = "return confirm('ნამდვილად გსურს Giorgi-ის წაშლა?')";
    button.setAttribute("type", "submit");
    button.setAttribute("name", "delete_user");
    button.setAttribute("title", "წაშლა");

    i.classList = "bi bi-trash3";

    form.appendChild(input);
    button.appendChild(i);
    form.appendChild(button);

    return form;
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
