import {randerEmployeeTable } from "../../ui/employees/uiEmployees.js";
import {addEmployeeEventHandler, updateEmployeeEventHandler} from"../../services/employees/eventEmployees.js";
import {  } from"../../services/employees/crudEmployees.js";
import {  } from"../../services/employees/writeEmployee.js";
import {  } from"../../services/employees/readEmployee.js";

randerEmployeeTable();

addEmployeeEventHandler("add-button");
updateEmployeeEventHandler("update-button");
