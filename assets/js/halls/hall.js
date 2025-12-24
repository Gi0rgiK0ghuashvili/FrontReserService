import { getRequest, logException, setRequest } from "../Commons/requests.js";
import {generateButtonGroup } from "../Commons/actionButtons.js";
// Class implementations

class Hall {
    constructor() {
        this.nameGeo = null;
        this.nameEng = null;
        this.locationGeo = null;
        this.locationEng = null;
        this.description = null;
        this.phoneNumber = null;
    }
}

const addButton = document.getElementById("add-button");
const message = document.getElementById("add-message");

await fillData();


async function fillData() {

    const halls = await getRequest("hall", "getHall");
    
    if (!halls)
        return;
    
    await renderTableById(halls.value, "tableBody");
}

addButton.addEventListener("click", async (e) => {
    e.preventDefault();


    const hallData = new Hall();

    hallData.nameGeo = document.getElementById("add-hall-name-geo").value.trim();
    hallData.nameEng = document.getElementById("add-hall-name-eng").value.trim();

    hallData.locationGeo = document.getElementById("add-hall-location-geo").value.trim();
    hallData.locationEng = document.getElementById("add-hall-location-eng").value.trim();
    hallData.description = document.getElementById("add-hall-phoneNumber").value.trim();
    hallData.phoneNumber = document.getElementById("add-hall-phoneNumber").value.trim();


    if (hallData.nameGeo === null) {
        throw new Error("hallData.nameGeo is null");
    }
    if (hallData.nameEng === null) {
        throw new Error("hallData.nameEng is null");
    }

    const data = await setRequest("hall", "addHall", hallData);

    console.log(data);
    const status = data.status === 200;

    showMessage(data.value, status);

    
    await fillData();
});

function showMessage(notification, succeed = false){

    if(succeed){
        message.textContent = notification;
        message.style.color = "green";
        message.classList.add("text-center");
    }
    else{
        message.textContent = notification;
        message.style.color = "red";
        message.classList.add("text-center");
    }
}

async function renderTableById(items, elementId) {

    try {        
        if (elementId !== 'tableBody')
            return;
        
        const tableBody = document.getElementById(elementId);
        
        if (!tableBody) {
            return;
        }
        
        tableBody.innerHTML = "";

        if (!items) {
            return;
        }
        
        if (!Array.isArray(items)) {
            throw items;
        }

        items.forEach(item => {
            const tr = document.createElement("tr");
            const tdNameGeo = document.createElement("td");
            const tdNameEng = document.createElement("td");
            const tdLocationGeo = document.createElement("td");
            const tdLocationEng = document.createElement("td");
            const tdDescription = document.createElement("td");
            const tdPhoneNumber = document.createElement("td");

            tdNameGeo.textContent = item.nameGeo;
            tdNameEng.textContent = item.nameEng;
            tdLocationGeo.textContent = item.locationGeo;
            tdLocationEng.textContent = item.locationEng;
            tdDescription.textContent = item.description;
            tdPhoneNumber.textContent = item.phoneNumber;

            tr.appendChild(tdNameGeo);
            tr.appendChild(tdNameEng);
            tr.appendChild(tdLocationGeo);
            tr.appendChild(tdLocationEng);
            tr.appendChild(tdDescription);
            tr.appendChild(tdPhoneNumber);

            tr.setAttribute("data-id", item.id);

            // <td>
            const td = generateButtonGroup(item);

            tr.appendChild(td);
            tableBody.appendChild(tr);
        });

    }
    catch (exception) {
        console.error("First ex: ", exception);

        const ex = {
            message: exception.message,
            source: "hall.js",
            operationType: "add-content"
        };
        await logException(ex);
    }
}

function setPagesInfo(){

}

function changedSelectedStatus(event) {

    const modalWindow = new bootstrap.Modal(document.getElementById("fullscreenModal"));
    modalWindow.show();
    console.log("this is firs log");
    console.log(event.target);

}

function showModal(event) {
    const divModalShow = event.target;
    const div = document.createElement("div");
    
    console.log(divModalShow.getAttribute("data-id"));
    //const row = document.querySelector();
    const tbody = document.getElementById("tableBody");
    console.log(tbody);
    const rows = tbody.querySelectorAll("tr");
    console.log(rows);

    console.log(event);

    const row = event.target.closest("tr");
    const table = document.getElementById("templatesTable");

    // ვიღებთ <th>-ებს და მათი name ატრიბუტებს
    const headers = [...table.querySelectorAll("thead th")].map(th =>
        th.getAttribute("name")
    );

    // ვიღებთ <td>-ებში შევსებულ მნიშვნელობებს
    const values = [...row.querySelectorAll("td")].map(td =>
        td.textContent.trim()
    );

    // ვაგებთ ობიექტს: { headerName: rowValue }
    const result = {};
    headers.forEach((header, i) => {
        result[header] = values[i] ?? null;
    });

    return result;
}