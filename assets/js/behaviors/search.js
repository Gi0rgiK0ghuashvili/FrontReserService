// Search Employee
document.addEventListener("DOMContentLoaded", () => 
    {
    const btn = document.getElementById("search-button");

    if (btn.name === 'halls') {
        
    }
    else if (btn.name = 'employees') {
        btn.addEventListener("click", async () => {
            await emoloyeeSearch();
        });
        console.log("this is employee body");
        emoloyeeSearch();
    }
    else if ((btn.name = 'items')) {

    }
    else if ((btn.name = 'menus')) {

    }
    else if ((btn.name = 'payment-types')) {

    }
    else if ((btn.name = 'orders')) {

    }
    else {

    }
});

async function emoloyeeSearch() {
    const filters = {
        name: document.getElementById("name").value.trim(),
        surname: document.getElementById("surname").value.trim(),
        email: document.getElementById("email").value.trim(),
        username: document.getElementById("username").value.trim(),
        phonenumber: document.getElementById("phoneNumber").value.trim(),
    };

    try {
        const items = await webApiConnection(filters, "https://localhost:7079/api/employee/filter");

        const tableBody = document.getElementById("employeesTableBody");

        if (tableBody === null) {
            return;
        }
        tableBody.innerHTML = "";

        items.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML =
                `<td>${item.name ?? '-'}</td>
         <td>${item.surname ?? '-'}</td>
         <td>${item.email ?? '-'}</td>
          <td><code class="bg-light p-1 rounded">${item.userName ?? '-'}</code></td>
         <td>${item.phoneNumber ?? '-'}</td>
          <td><span class="badge badge-role bg-primary">${item.role ?? '-'}</span></td>
          <td>
          <form method="POST" style="display:inline;">
            <button type="button" class="btn btn-sm btn-warning editBtn me-1"
              data-user="{&quot;id&quot;:&quot;42&quot;,&quot;fl_name&quot;:&quot;ზურაბ ლაცაბიძე&quot;,&quot;username&quot;:&quot;SySAdmin&quot;,&quot;password&quot;:&quot;$2y$10$FJD\/lh0.hoc8.33HukKmR.lczga1LmyFRwRFwUD9L0ZaY0R6Ywn2S&quot;,&quot;role&quot;:&quot;Admin&quot;,&quot;email&quot;:&quot;zurablatsabidze@gmail.com&quot;,&quot;phone&quot;:&quot;591293422&quot;,&quot;created_at&quot;:&quot;2025-05-30 15:21:51&quot;}"
              title="რედაქტირება"
              onclick="return confirm('ნამდვილად გსურს ზურაბ ლაცაბიძე-ის წაშლა?')" title="წაშლა">
              <i class="bi bi-pencil-square"></i>
            </button>

              <input type="hidden" name="delete_id" value="42">
              <button type="submit" name="delete_user" class="btn btn-sm btn-danger" onclick="return confirm('ნამდვილად გსურს ზურაბ ლაცაბიძე-ის წაშლა?')" title="წაშლა">
                <i class="bi bi-trash3"></i>
              </button>
            </form>
        </td>`;
            tableBody.appendChild(tr);
        });
        for (let i = 0; i < items.leng;) {

        }

    }
    catch (error) {
        alert("დაფიქსირდა პრობლემა მონაცემების ჩატვირთვისას.");
    }
}


// Functions initialize
async function webApiConnection(filters, url) {
    
    return true;
}

function renderTable(items) {

    const tableBody = document.getElementById("employeesTableBody");

    tableBody.innerHTML = "";

    items.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML =
            `<td>${item.name ?? '-'}</td>
         <td>${item.surname ?? '-'}</td>
         <td>${item.email ?? '-'}</td>
          <td><code class="bg-light p-1 rounded">${item.userName ?? '-'}</code></td>
         <td>${item.phoneNumber ?? '-'}</td>
          <td><span class="badge badge-role bg-primary">${item.role ?? '-'}</span></td>
          <td>
          <form method="POST" style="display:inline;">
            <button type="button" class="btn btn-sm btn-warning editBtn me-1"
              data-user="{&quot;id&quot;:&quot;42&quot;,&quot;fl_name&quot;:&quot;ზურაბ ლაცაბიძე&quot;,&quot;username&quot;:&quot;SySAdmin&quot;,&quot;password&quot;:&quot;$2y$10$FJD\/lh0.hoc8.33HukKmR.lczga1LmyFRwRFwUD9L0ZaY0R6Ywn2S&quot;,&quot;role&quot;:&quot;Admin&quot;,&quot;email&quot;:&quot;zurablatsabidze@gmail.com&quot;,&quot;phone&quot;:&quot;591293422&quot;,&quot;created_at&quot;:&quot;2025-05-30 15:21:51&quot;}"
              title="რედაქტირება"
              onclick="return confirm('ნამდვილად გსურს ზურაბ ლაცაბიძე-ის წაშლა?')" title="წაშლა">
              <i class="bi bi-pencil-square"></i>
            </button>

              <input type="hidden" name="delete_id" value="42">
              <button type="submit" name="delete_user" class="btn btn-sm btn-danger" onclick="return confirm('ნამდვილად გსურს ზურაბ ლაცაბიძე-ის წაშლა?')" title="წაშლა">
                <i class="bi bi-trash3"></i>
              </button>
            </form>
        </td>`
            ;
        tableBody.appendChild(tr);
    });
}

function renderTableById(items, elementId) {

    const tableBody = document.getElementById(elementId);

    tableBody.innerHTML = "";

    items.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML =
            `<td>${item.name ?? '-'}</td>
         <td>${item.surname ?? '-'}</td>
         <td>${item.email ?? '-'}</td>
          <td><code class="bg-light p-1 rounded">${item.userName ?? '-'}</code></td>
         <td>${item.phoneNumber ?? '-'}</td>
          <td><span class="badge badge-role bg-primary">${item.role ?? '-'}</span></td>
          <td>
          <form method="POST" style="display:inline;">
            <button type="button" class="btn btn-sm btn-warning editBtn me-1"
              data-user="{&quot;id&quot;:&quot;42&quot;,&quot;fl_name&quot;:&quot;ზურაბ ლაცაბიძე&quot;,&quot;username&quot;:&quot;SySAdmin&quot;,&quot;password&quot;:&quot;$2y$10$FJD\/lh0.hoc8.33HukKmR.lczga1LmyFRwRFwUD9L0ZaY0R6Ywn2S&quot;,&quot;role&quot;:&quot;Admin&quot;,&quot;email&quot;:&quot;zurablatsabidze@gmail.com&quot;,&quot;phone&quot;:&quot;591293422&quot;,&quot;created_at&quot;:&quot;2025-05-30 15:21:51&quot;}"
              title="რედაქტირება"
              onclick="return confirm('ნამდვილად გსურს ზურაბ ლაცაბიძე-ის წაშლა?')" title="წაშლა">
              <i class="bi bi-pencil-square"></i>
            </button>

              <input type="hidden" name="delete_id" value="42">
              <button type="submit" name="delete_user" class="btn btn-sm btn-danger" onclick="return confirm('ნამდვილად გსურს ზურაბ ლაცაბიძე-ის წაშლა?')" title="წაშლა">
                <i class="bi bi-trash3"></i>
              </button>
            </form>
        </td>`
            ;
        tableBody.appendChild(tr);
    });
}
