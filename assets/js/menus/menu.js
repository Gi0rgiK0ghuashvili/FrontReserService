import { checkTokenValidation, sendTest, getRequest, logException, setRequest } from "../Commons/requests.js";

class item {
    constructor() {
        this.categoryGeo;
        this.categoryEng;
        this.nameGeo;
        this.nameEng;
        this.price;
    }
}


const addButton = document.getElementById("add-button");
addButton.addEventListener("click", async (e) => {
    e.preventDefault();


    console.log(addButton.name);
    console.log("this is items datatabel.");


    const itemData = new item();
    itemData.categoryGeo = document.getElementById("add-item-category-geo").value.trim();
    itemData.categoryEng = document.getElementById("add-item-category-eng").value.trim();
    itemData.nameGeo = document.getElementById("add-item-name-geo").value.trim();
    itemData.nameEng = document.getElementById("add-item-name-eng").value.trim();
    itemData.price = document.getElementById("add-item-price").value.trim();


    if (itemData.nameGeo === null) {
        alert("სახელი ქართულად ცარიელია.");
        return;
    }
    if (itemData.nameEng === null) {
        alert("სახელი ინგლისურად ცარიელია.");
        return;
    }
    if (itemData.categoryGeo === null) {
        alert("კატეგორია ქართულად ცარიელია.");
        return;
    }
    if (itemData.categoryEng === null) {
        alert("კატეგორია ინგლისურად ცარიელია.");
        return;
    }
    if (itemData.price === null) {
        alert("ფასი ცარიელია.");
        return;
    }

    const itemDataResult = await setRequest("menus", "addMenu", itemData);

    if (!itemDataResult) {
        console.log(itemDataResult);

        return;
    }

    console.log("this is from adding item", itemDataResult);

});

(async function() {

    const items = await getRequest("memus", "getMenus");
    console.log(items.value);

    await renderItemsTableById(items.value, "tableBody");
})();



async function renderItemsTableById(items, elementId) {

    try {

        if (elementId !== 'tableBody') {
            return;
        }

        const tableBody = document.getElementById(elementId);

        
        if (!tableBody) {
            console.error("table not found.");
            return;
        }
        
        tableBody.innerHTML = "";
        
        if (!items) {
            return;
        }
        
        if (!Array.isArray(items)) {
            console.error("Expected array but got:", items);
            return;
        }
        
        items.forEach(item => {
            // Data Values
            const tr = document.createElement("tr");
            const tdNameGeo = document.createElement("td");
            const tdNameEng = document.createElement("td");
            const categoryGeo = document.createElement("td");
            const categoryEng = document.createElement("td");
            const tdPrice = document.createElement("td");
            
            categoryGeo.textContent = item.categoryGeo;
            categoryEng.textContent = item.categoryEng;
            tdNameGeo.textContent = item.nameGeo;
            tdNameEng.textContent = item.nameEng;
            tdPrice.textContent = item.price;
            
            // 
            // Build Table
            tr.appendChild(categoryGeo);
            tr.appendChild(categoryEng);
            tr.appendChild(tdNameGeo);
            tr.appendChild(tdNameEng);
            tr.appendChild(tdPrice);
            
            tr.setAttribute("data-id", item.id);

            //
            // Action Buttons Section
            //

            // <div class="btn-group">
            const btnGroup = document.createElement("div");
            btnGroup.className = "btn-group";
            btnGroup.setAttribute("role", "group");

            // <td>
            const td = document.createElement("td");
            td.className = "text-center";
            // --- View button ---
            const viewBtn = document.createElement("a");
            
            
            viewBtn.addEventListener('click', (event) => { showModal(event) });
            viewBtn.className = "btn btn-info btn-sm";
            viewBtn.title = "დეტალური ნახვა";
            const i = document.createElement('i');
            
            //i.classList.add("btn");
            //i.classList.add("btn-primary");

            i.classList.add("fas");
            i.classList.add("fa-eye");
            
            i.setAttribute("data-bs-toggle", "modal");
            i.setAttribute("data-bs-target", "#fullscreenModal");
            
            i.setAttribute("data-id", item.id);
            
            viewBtn.appendChild(i);

            // --- Edit button ---
            const editBtn = document.createElement("a");

            editBtn.className = "btn btn-warning btn-sm";
            editBtn.title = "რედაქტირება";
            editBtn.setAttribute("data-bs-toggle", "modal");
            editBtn.setAttribute("data-bs-target", "#edit-fullscreenModal");
            
            editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
            
            // --- Delete button ---
            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "btn btn-danger btn-sm delete-template-btn";
            deleteBtn.title = "შაბლონის წაშლა";
            deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
            
            // ღილაკების დამატება ჯგუფში
            btnGroup.appendChild(viewBtn);
            btnGroup.appendChild(editBtn);
            btnGroup.appendChild(deleteBtn);
            // ჯგუფის დამატება <td>-ში
            td.appendChild(btnGroup);
            
            tr.appendChild(td);
            //
            //  End Action Buttons Section
            //
            
            tableBody.appendChild(tr);
        });
        
    }
    catch (exception) {
        const ex = {
            message: exception.message,
            source: "item.js",
            operationType: "add-content"
        };

        const logExc = await logException(ex);

    }
}