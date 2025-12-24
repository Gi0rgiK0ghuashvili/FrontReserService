import { getRequest, logException, setRequest } from "../Commons/requests.js";


const input = document.getElementById("hallSearch");
const dropdown = document.getElementById("hallDropdown");
const checkboxes = dropdown.querySelectorAll("input[type='checkbox']");

input.addEventListener("click", () => {
    dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
});

(function () {
    checkboxes.forEach(cb => {
        cb.addEventListener("change", () => {
            const selected = [...checkboxes]
                .filter(x => x.checked)
                .map(x => x.parentElement.textContent.trim());

            input.value = selected.join(", ");
        });
    });
})();

document.addEventListener("click", e => {
    if (!e.target.closest(".multi-select")) {
        dropdown.style.display = "none";
    }
});

// Frontend ქმნის checkbox-ებს
(async function () {
    const halls = await getRequest("hall", "getHalls");
    console.log(halls);
    halls.value.forEach(item => {
        dropdown.insertAdjacentHTML("beforeend", `
            <label>
              <input type="checkbox" value="${item.id}">
              ${item.name}
            </label>
          `);
    });
});
// Backend მოთხოვნა მონიშნულებზე
// function loadTableData(ids) {
//     fetch("/api/products/by-halls", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(ids)
//     })
//         .then(r => r.json())
//         .then(data => renderTable(data));
// }

//ცხრილის რენდერი (მაგალითი)
function renderTable(rows) {
    console.log("დაბრუნებული მონაცემები:", rows);
}