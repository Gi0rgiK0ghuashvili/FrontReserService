// SEARCH FORM
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("searchProductButton");

    btn.addEventListener("click", async (event) => {
        event.preventDefault(); // თავიდან ავიცილოთ form submit
        await handleSearchForm();
    });


});

async function handleSearchForm() {
    const filters = {
        nameEng: "dlaptop",
        minPrice: 100,
        maxPrice: 6000
    };

    const token = localStorage.getItem("authToken");

    if (!token) {
        alert("ავტორიზაცია აუცილებელია!");
        window.location.href = "login.html";
        return;
    }

    const response = await fetch("https://localhost:7079/api/home2/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(filters),
        //credentials: "include"
    });

    if (!response.ok) {
        console.log("რექვესტი წარუმატებელი აღმოჩნდა.");
        return
    }

    const data = await response.json();
    console.log(data);
    

    const tableBody = document.getElementById("menuTableBody");

    

    data.forEach(item => {
        const tr = document.createElement("tr");

        const tdName = document.createElement("td");
        tdName.textContent = item.nameGeo;
        tr.appendChild(tdName);

        const tdNameEng = document.createElement("td");
        tdNameEng.textContent = item.nameEng;
        tr.appendChild(tdNameEng);

        const tdCategory = document.createElement("td");
        tdCategory.textContent = item.category;
        tr.appendChild(tdCategory);

        const tdPrice = document.createElement("td");
        tdPrice.textContent = item.price;
        tr.appendChild(tdPrice);

        tableBody.appendChild(tr);
    });

    console.log(data);
    //await renderTable(data);
}

async function renderTable(items) {
    const tableBody = document.getElementById("menuTableBody");

    //tableBody.innerHTML = "";

    items.forEach(item => {
        const tr = document.createElement("tr");

        const tdName = document.createElement("td");
        tdName.textContent = item.name.value;
        tr.appendChild(tdName);

        const tdNameEng = document.createElement("td");
        tdNameEng.textContent = item.nameEng.value;
        tr.appendChild(tdNameEng);

        const tdCategory = document.createElement("td");
        tdCategory.textContent = item.category.value;
        tr.appendChild(tdCategory);

        const tdPrice = document.createElement("td");
        tdPrice.textContent = item.price.value;
        tr.appendChild(tdPrice);

        tableBody.appendChild(tr);
    });

}

/*
function renderTable(items) {
    const tableBody = document.getElementById("resultsTableBody");
    console.log(items);
        items.forEach(item => {
        const row = `<tr>
            <td>${item.name}</td>
            <td>${item.nameEng}</td>
            <td>${item.category}</td>
            <td>${item.price}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
};
*/

function getDecimalOrNull(id) {
    const el = document.getElementById(id);
    const val = parseFloat(el.value);
    return isNaN(val) ? null : val;
};