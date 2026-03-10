import { createUserNameTD, createRoleTD, createEditButton, createDeleteButton, createTD } from"../../ui/employees/uiComponentsEmployee.js";


export async function renderTable(items, elementId) {

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
    }
}

export function showNotification(message, isSucceed = false) {
    if (!message) {
        console.error("message is: ", message);
        return;
    }

    const notification = document.getElementById("notification");
    if (!notification) {
        console.error("notification is: ", notification);

        return;
    }

    notification.textContent = message;
    if (isSucceed) {
        notification.style.color = "green";
    } else {
        notification.style.color = "red";
    }
}