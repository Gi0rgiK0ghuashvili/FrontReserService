import { logException, ApiService } from "../../core/requests.js";
import { createUserNameTD, createRoleTD, createEditButton, createDeleteButton } from"../employees/uiComponentsEmployee.js";
import { renderTable, showNotification } from "../../services/employees/writeEmployee.js";

export async function randerEmployeeTable(){
    try {
            const result = await ApiService.post("account", "getEmployees");
            if (result.statusCode !== 200) {
                throw new Error(result);
            }
            await renderTable(result.value, "tableBody");
        }
        catch (exception) {
            console.error(exception);
        }
}
