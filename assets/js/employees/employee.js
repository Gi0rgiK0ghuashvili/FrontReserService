import { getRequest, logException, setRequest } from "../Commons/requests.js";
import { generateButtonGroup } from "../Commons/actionButtons.js";

class employee {
    constructor() {

        this.name;
        this.surname;
        this.email;
        this.username;
        this.phonenumber;
        this.role;
        this.password;
        this.confirmPassword;
    }
}

loadEmployees();


const addButton = document.getElementById("add_user");

if (addButton) {
    addButton.addEventListener("click", async (event) => {
        event.preventDefault();

        await registerEmployee(event);
    });
}

async function registerEmployee(event) {
    try {

        const employeeData = new employee();
        employeeData.name = document.getElementById("add-name").value.trim();
        employeeData.surname = document.getElementById("add-surname").value.trim();
        employeeData.email = document.getElementById("add-email").value.trim();
        employeeData.phoneNumber = document.getElementById("add-phoneNumber").value.trim();
        employeeData.username = document.getElementById("add-username").value.trim();
        employeeData.password = document.getElementById("add-password").value.trim();
        employeeData.confirmPassword = document.getElementById("add-confirmPassword").value.trim();
        employeeData.role = document.getElementById("add-userRole").value.trim();

        console.log(employeeData);

        if (employeeData.name === null) {
            alert("სახელი ცარიელია.");
            return;
        }
        if (employeeData.surname === null) {
            alert("გვარი არასწორია.");
            return;
        }

        if (employeeData.password != employeeData.confirmPassword) {
            alert("განმეორებითი პაროლი არასწორია.");
            return;
        }

        const result = await setRequest("account", "registerEmployee", employeeData);

        if (result.statusCode === 200) {
            console.log("result", result);
        }
        console.log("result", result);
    }
    catch (exception) {
        console.log(exception);
    }
}

async function loadEmployees() {
    try {
        const result = await getRequest("account", "getEmployees");

        if (result.statusCode !== 200) {
            throw new Error(result);
        }

        console.log(result.value);

        await renderTable(result.value, "tableBody");
    }
    catch (exception) {
        console.error(exception);
    }
}

async function renderTable(items, elementId) {

    try {
        const tableBody = document.getElementById(elementId);

        if (!tableBody) {
            return;
        }
        //tableBody.innerHTML = "";
        if (!items) {
            return;
        }
        if (!Array.isArray(items)) {
            console.error("Expected array but got:", items);
            return;
        }

        let index = 1;
        items.forEach(item => {
            // Data Values
            const tr = document.createElement("tr");

            const tdNumber = createTD(index, true);
            const tdName = createTD(`${item.name} ${item.surname}`);
            const tdUserName = createUserNameTD(item.userName);
            const tdUserRole = createRoleTD(item.role);
            const tdEmail = createTD(item.email);
            const tdPhoneNumber = createTD(item.phoneNumber);


            const tdActionGroup = document.createElement("td");
            const group = document.createElement("group");

            const tdEditButton = createEditButton(item.id);
            const tdDeleteButton = createDeleteButton(item.id)

            group.appendChild(tdEditButton);
            group.appendChild(tdDeleteButton);

            tdActionGroup.appendChild(group);

            // Build Table
            tr.appendChild(tdNumber);
            tr.appendChild(tdName);
            tr.appendChild(tdUserName);
            tr.appendChild(tdUserRole);
            tr.appendChild(tdEmail);
            tr.appendChild(tdPhoneNumber);
            tr.appendChild(tdActionGroup);

            tableBody.appendChild(tr);
            index++;
        });

    }
    catch (exception) {
        console.log(exception);
        await logException(exception);
    }
}

function createTD(value, isIndex = false) {
    const td = document.createElement("td");

    td.textContent = value;
    td.setAttribute("data-value", value);
    if (isIndex === true) {
        td.classList.add("fw-bold");
    }

    return td;
}

function createUserNameTD(value) {
    const td = document.createElement("td");
    const code = document.createElement("code");

    code.textContent = value;
    code.setAttribute("data-value", value);
    code.className = "bg-light p-1 rounded";

    td.appendChild(code);
    return td;
}

function createRoleTD(value) {

    const td = document.createElement("td");
    const span = document.createElement("span");
    span.textContent = value;
    span.setAttribute("data-value", value);

    span.classList = "badge badge-role bg-primary";
    td.appendChild(span);

    return td;
}

function createEditButton(value) {
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

function createDeleteButton(value) {
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