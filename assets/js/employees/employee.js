import {getRequest, logException, setRequest} from "../Commons/requests.js";

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


const addButton = document.getElementById("add-button");


if (addButton.name === 'employees') {
    addButton.addEventListener("click", async (e) => {
        e.preventDefault();

        const employeeData = new employee();
        employeeData.name = document.getElementById("add-name").value.trim();
        employeeData.surname = document.getElementById("add-surname").value.trim();
        employeeData.email = document.getElementById("add-email").value.trim();
        employeeData.phoneNumber = document.getElementById("add-phoneNumber").value.trim();
        employeeData.username = document.getElementById("add-username").value.trim();
        employeeData.password = document.getElementById("add-password").value.trim();
        employeeData.confirmPassword = document.getElementById("add-confirmPassword").value.trim();
        employeeData.role = document.getElementById("add-userRole").value.trim();

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

        await setRequest("account", "registerEmployee", employeeData);
    });
}