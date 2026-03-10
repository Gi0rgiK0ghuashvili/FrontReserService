import {addEmployee, updateEmployee} from"../../services/employees/crudEmployees.js";
import {buildEmployeeObject} from"../../services/employees/readEmployee.js";
import { showNotification } from"../../services/employees/writeEmployee.js";


export async function addEmployeeEventHandler(elementId) {
    if (!elementId) {
        console.error("Element id is null.");
    }
    const addButton = document.getElementById(elementId);
    if (!addButton) {
        console.error("addButton is null.");
    }
    addButton.addEventListener("click", async (e) => {

        const employee = buildEmployeeObject();
        const response = await addEmployee(employee);
        console.log(response);
        showNotification(response, true);
    });
}

export async function updateEmployeeEventHandler(elementId) {
    if (!elementId) {
        console.error("Element id is null.");
    }
    const updateButton = document.getElementById(elementId);
    if (!updateButton) {
        console.error("updateButton is null.");
    }

    updateButton.addEventListener("click", async (e) => {

        let response = await updateEmployee();
        console.log(response);
        showNotification(response, true);
    });
}

