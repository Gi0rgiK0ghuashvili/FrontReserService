
export function readTable(tableBodyId) {
    const tbody = document.getElementById(tableBodyId);
    const rows = Array.from(tbody.querySelectorAll("tr"));

    return rows;
}

export function buildOrder(rows) {

    const order = { menus: [] };

    let currentMenu = null;
    let currentCategory = null;

    for (const row of rows) {

        const rowName = row.getAttribute("name");

        // ===== MENU =====
        if (rowName === "menu-name") {

            currentMenu = {
                nameGeo: row.dataset.nameGeo,
                nameEng: row.dataset.nameEng,
                categories: []
            };

            order.menus.push(currentMenu);
        }

        // ===== CATEGORY =====
        else if (rowName === "header") {

            currentCategory = {
                nameGeo: row.dataset.categoryGeo,
                nameEng: row.dataset.categoryEng,
                items: []
            };

            currentMenu.categories.push(currentCategory);
        }

        // ===== ITEM =====
        else if (rowName === "row") {

            const checkbox = row.querySelector("input[type='checkbox']");
            if (!checkbox.checked) continue;

            const quantityInput = row.querySelector("td:nth-child(4) input");
            const noteInput = row.querySelector("td:nth-child(7) input");

            const quantity = Number(quantityInput.value);
            const price = Number(row.dataset.price);

            const item = {
                id: row.dataset.id,
                nameGeo: row.dataset.nameGeo,
                nameEng: row.dataset.nameEng,
                quantity: quantity,
                price: price,
                total: quantity * price,
                note: noteInput.value
            };

            currentCategory.items.push(item);
        }
    }

    return order;
}