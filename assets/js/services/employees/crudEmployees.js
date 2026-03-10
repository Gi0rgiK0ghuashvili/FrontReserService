import { logException, ApiService } from "../../core/requests.js";
import { showNotification } from"../../services/employees/writeEmployee.js";


export async function updateEmployee(employee) {

    if(!employee) {
        console.error("employee is null.");
        return};

    const response = await ApiService.post("employee", "updateEmployee", employee);

    if(response.success){
        showNotification("User added", response.success);
    }
    else{
        showNotification(response.message, response.success);
    }
    return response;
}

export async function addEmployee(employee) {
    if(!employee) {
        console.error("employee is null.");
        return;
    }

    const response = await ApiService.post("employee", "addEmployee", employee);
    
    if(response.success){
        showNotification("User added", response.success);
    }
    else{
        showNotification(response.message, response.success);
    }
    return response;
}