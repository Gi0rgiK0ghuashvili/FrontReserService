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
        console.log("result", result);

        if (result.statusCode === 200) {
            showNotification("მომხმარებელი წარმატებით დარეგისტრირდა", true);
            return;
        }
        showNotification(result.message);

        console.log("result", result);
    }
    catch (exception) {
        showNotification(result.message);

        console.log(exception);
    }
}



function showNotification(message, isSucceed = false) {
    if (!message) {
        console.error(message);
        return;
    }

    const notification = document.getElementById("register-form-notification");
    if (!notification) {

        
        return;
    }

    notification.textContent = message;
    if (isSucceed) {
        notification.style.color = "green";
    } else {
        notification.style.color = "red";
    }

}