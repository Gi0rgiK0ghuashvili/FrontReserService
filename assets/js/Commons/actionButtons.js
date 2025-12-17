export function generateButtonGroup(item) {
    const td = document.createElement("td");
    td.className = "text-center";

    // <div class="btn-group">
    const btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";
    btnGroup.setAttribute("role", "group");
    btnGroup.setAttribute("aria-label", "Basic mixed styles example");

    // --- View button ---
    const viewBtn = document.createElement("a");

    viewBtn.className = "btn btn-info btn-sm";

    viewBtn.setAttribute("data-bs-toggle", "modal");
    viewBtn.setAttribute("data-bs-target", "#view-fullscreenModal");
    viewBtn.title = "დეტალური ნახვა";
    const i = document.createElement('i');

    i.classList.add("fas");
    i.classList.add("fa-eye");

    i.setAttribute("data-bs-toggle", "modal");
    i.setAttribute("data-bs-target", "#view-fullscreenModal");

    i.setAttribute("data-id", item.id);

    viewBtn.appendChild(i);
    // --- Edit button ---
    const editBtn = document.createElement("a");

    editBtn.href = "#";
    editBtn.className = "btn btn-warning btn-sm";
    editBtn.title = "რედაქტირება";
    editBtn.setAttribute("data-bs-toggle", "modal");
    editBtn.setAttribute("data-bs-target", "#edit-fullscreenModal");

    
    const iEdit = document.createElement('i');
    
    iEdit.classList.add("fas", "fa-edit");

    iEdit.setAttribute("data-bs-toggle", "modal");
    iEdit.setAttribute("data-bs-target", "#edit-fullscreenModal");
    
    iEdit.setAttribute("data-id", item.id);
    
    editBtn.appendChild(iEdit);

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

    return td;

}

function showModal(event) {
    if(!event){
        console.error("modal eror: ",event);
        return;
    }
    
    
}
