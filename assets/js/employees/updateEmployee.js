const tableBody = document.querySelector("#usersTable tbody");
const addBtn = document.getElementById("addRowBtn");

let counter = 1; // მომხმარებელთა ნომრების სათვალავი

addBtn.addEventListener("click", async function () {
    // დროებითი მონაცემები (შეგიძლია შეცვალო ან აიღო ფორმიდან)
    const data = await getData();
    
    console.log("მეთოდმა დააბრუნა შედეგი:");
    console.log(data);
    data.result.forEach(element => {
        const user = {
            id: Date.now(),
            fullName: element.nameGeo,
            username: element.nameEng,
            role: "user",
        email: "amosidze@gmtgroup.ge",
        phone: "577896512"
    };

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td class="fw-bold">${counter}</td>
        <td>${user.fullName}</td>
        <td><code class="bg-light p-1 rounded">${user.username}</code></td>
        <td><span class="badge bg-success" >${user.role}</span></td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>
          <button type="button" class="btn btn-sm btn-warning editBtn me-1" title="რედაქტირება">
            <i class="bi bi-pencil-square"></i>
            </button>
            <button type="button" class="btn btn-sm btn-danger deleteBtn" title="წაშლა">
            <i class="bi bi-trash3"></i>
            </button>
        </td>
        `;
        
        tableBody.appendChild(newRow);
        counter++;
    });
});

// დელეგირება — მუშაობს დინამიურად დამატებულ ელემენტებზე
tableBody.addEventListener("click", function (e) {
    const target = e.target.closest("button");
    if (!target) {
        console.log("button is null")
        return;
    }

    // თუ რედაქტირების ღილაკია
    if (target.classList.contains("editBtn")) {
        const row = target.closest("tr");
        const fullNameCell = row.children[1];
        const emailCell = row.children[4];
        const phoneCell = row.children[5];

        const newName = prompt("შეიყვანე ახალი სახელი:", fullNameCell.textContent);
        const newEmail = prompt("შეიყვანე ახალი ელფოსტა:", emailCell.textContent);
        const newPhone = prompt("შეიყვანე ახალი ტელეფონი:", phoneCell.textContent);

        if (newName) fullNameCell.textContent = newName;
        if (newEmail) emailCell.textContent = newEmail;
        if (newPhone) phoneCell.textContent = newPhone;
    }

    // თუ წაშლის ღილაკია
    if (target.classList.contains("deleteBtn")) {
        const row = target.closest("tr");
        const userName = row.children[1].textContent;
        if (confirm(`ნამდვილად გსურს ${userName}-ის წაშლა?`)) {
            row.remove();
        }
    }
});

async function getData() {

    const token = localStorage.getItem("authToken");

    if (!token) {
        alert("ავტორიზაცია აუცილებელია!");
        window.location.href = "login.html";
        return;
    }

    const filters = {
        nameEng: "dlaptop",
        minPrice: 100,
        maxPrice: 6000
    };

    const response = await fetch("https://localhost:7079/api/home/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(filters),
        credentials: "include"
    });

    if (!response.ok) {
        console.log("რექვესტი წარუმატებელი აღმოჩნდა.");
        return
    }

    const data = await response.json();
    console.log(data);
    return data;
}