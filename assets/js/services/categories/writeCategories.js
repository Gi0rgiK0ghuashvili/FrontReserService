import {ApiService } from "../../core/requests.js"

(async function() {

    const categories = await ApiService.get("category", "categories");
        
    if(categories.statusCode === 404)
    {
        console.log(categories.message);
        return;
    }
    await renderCategoriesTableById(categories.value, "tableBody");
})();

async function renderCategoriesTableById(categories, elementId) {

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
        
        if (!categories) {
            return;
        }
        
        if (!Array.isArray(categories)) {
            console.error("Expected array but got:", items);
            return;
        }
        
        categories.forEach(category => {
            // Data Values
            const tr = document.createElement("tr");
            const tdNameGeo = document.createElement("td");
            const tdNameEng = document.createElement("td");
                        
            tdNameGeo.textContent = category.nameGeo;
            tdNameEng.textContent = category.nameEng;
            
            // 
            // Build Table
            tr.appendChild(tdNameGeo);
            tr.appendChild(tdNameEng);
            
            tr.setAttribute("data-id", category.id);

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

            i.classList.add("fas");
            i.classList.add("fa-eye");
            
            i.setAttribute("data-bs-toggle", "modal");
            i.setAttribute("data-bs-target", "#fullscreenModal");
            
            i.setAttribute("data-id", category.id);
            
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
            source: "writeCategories.js",
            operationType: "add-content"
        };

        console.log(ex);
    }
}
