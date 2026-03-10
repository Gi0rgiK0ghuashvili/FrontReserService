import { Item } from "../items/modelItems.js";
import { Menu } from "./modelMenus.js";

export function readTableHeader() {
    const tableBody = document.getElementById("tableHeaderTitle");

    const data = {
        menuId: tableBody.dataset.id ?? null,
        items: []
    };

    return data;
}

export function readTableRows(tableBodyId) {
    if(!tableBodyId)
        tableBodyId = "tableBody";

    const tableBody = document.getElementById(tableBodyId);
    const rows = tableBody.querySelectorAll(`tr[name="row"]`);

    if (!rows || !tableBody) {
        return null;
    }

    const items = [];
    rows.forEach(row => {
        const data = new Item();
        data.id = row.dataset.id ?? null;
        data.categoryGeo = row.dataset.categoryGeo ?? null;
        data.categoryEng = row.dataset.categoryEng ?? null;
        data.nameGeo = row.dataset.nameGeo ?? null;
        data.nameEng = row.dataset.nameEng ?? null;
        data.price = row.dataset.price ?? null;

        items.push(data);
    });

    return items;
}

// არ უღებს კატეგორიის სახელს და აბრუნებს null-ს
export async function readItemDatas() {
    const select = document.getElementById("selected-menu-item");
    const nameGeoInput = document.getElementById("item-name-geo");
    const nameEngInput = document.getElementById("item-name-eng");
    const priceInput = document.getElementById("item-price");

    if (!select || !nameGeoInput || !nameEngInput || !priceInput) {
        console.error("Required form elements not found");
        return;
    }

    const itemNameGeo = nameGeoInput.value.trim();
    const itemNameEng = nameEngInput.value.trim();
    const price = Number(priceInput.value);

    if (!itemNameGeo || !itemNameEng || Number.isNaN(price)) {
        console.error("Invalid form values");
        return;
    }

    const option = select.options[select.selectedIndex];

    const dataset = option.dataset;
    
    const catGeo = dataset.nameGeo;
    const catEng = dataset.nameEng;

    if (!catGeo || !catEng) {
        console.error("Category data missing");
        return;
    }

    const item = new Item();

    item.categoryGeo = catGeo;
    item.categoryEng = catEng;
    item.nameGeo = itemNameGeo;
    item.nameEng = itemNameEng;
    item.price = price;

    return item;
}

export function getHeadersWithIndexesByValue(byValue) {
    if (!byValue) return null;

    const tableBody = document.getElementById("tableBody");
    if (!tableBody) return null;

    const trs = tableBody.querySelectorAll("tr");

    for (let i = 0; i < trs.length; i++) {
        const tr = trs[i];

        if (tr.getAttribute("name") === "header" &&
            tr.dataset.categoryGeo === byValue) {
            return {
                index: i,
                categoryGeo: tr.dataset.categoryGeo
            };
        }
    }

    return null;
}

export function getUniqueHeadersWithIndexes() {
    const tableBody = document.getElementById("tableBody");
    const allRows = [...tableBody.querySelectorAll("tr")];

    const result = [];
    const seenCategories = new Set();

    allRows.forEach((row, index) => {
        if (row.getAttribute("name") === "header") {
            const category = row.dataset.categoryGeo;

            if (!seenCategories.has(category)) {
                seenCategories.add(category);

                result.push({
                    index,
                    categoryGeo: category
                });
            }
        }
    });

    return result;
}

export function dragAndDropWithRows() {
    const tableBody = document.getElementById("tableBody");
    let draggedRow = null;
    let draggedGroup = []; // ჰედერი + მის category-ის rowData-ები

    tableBody.querySelectorAll("tr").forEach(row => {
        row.draggable = true;

        row.addEventListener("dragstart", (e) => {
            draggedRow = row;
            row.style.opacity = "0.5";

            // თუ ეს header-ია, ავყაროთ draggedGroup
            if (row.getAttribute("name") === "header") {
                const category = row.dataset.categoryGeo;
                const rows = Array.from(tableBody.querySelectorAll('tr[data-category-geo="' + category + '"], tr[category="' + category + '"]'));

                // group = header + მისი rowData-ები
                draggedGroup = [row, ...rows.filter(r => r !== row)];
            } else {
                draggedGroup = [row]; // თუ უბრალოდ data-row
            }
        });

        row.addEventListener("dragend", () => {
            draggedRow = null;
            draggedGroup = [];
            row.style.opacity = "1";
        });

        row.addEventListener("dragover", (e) => {
            e.preventDefault();
            row.style.borderTop = "2px solid #007bff";
        });

        row.addEventListener("dragleave", () => {
            row.style.borderTop = "";
        });

        row.addEventListener("drop", (e) => {
            e.preventDefault();
            row.style.borderTop = "";

            if (!draggedGroup.length || draggedGroup.includes(row)) return;

            const allRows = Array.from(tableBody.querySelectorAll("tr"));
            const targetIndex = allRows.indexOf(row);

            // შეგვიძლია შევწიოთ წინ/หลัง logics
            const firstDraggedIndex = allRows.indexOf(draggedGroup[0]);

            if (firstDraggedIndex < targetIndex) {
                // group-ს მივდებთ target-ის უკან
                row.after(...draggedGroup);
            } else {
                // group-ს მივდებთ target-ის წინ
                row.before(...draggedGroup);
            }
        });
    });
}

export function dragAndDrop() {
    const tableBody = document.getElementById("tableBody");
    let draggedRow = null;

    // 1. ყველა row-ს ვუმატებთ drag events
    tableBody.querySelectorAll("tr").forEach(row => {
        row.draggable = true;

        // როცა დავიწყებთ დრაფტს
        row.addEventListener("dragstart", (e) => {
            draggedRow = row;
            row.style.opacity = "0.5"; // ვატყუებთ, რომ ეს გატანილია
        });

        row.addEventListener("dragend", () => {
            draggedRow = null;
            row.style.opacity = "1";
        });

        // drag over სხვაზე
        row.addEventListener("dragover", (e) => {
            e.preventDefault(); // აუცილებელია, რომ drop მოხდეს
            row.style.borderTop = "2px solid #007bff"; // ვიზუალური ჰინტი
        });

        row.addEventListener("dragleave", () => {
            row.style.borderTop = "";
        });

        // drop
        row.addEventListener("drop", (e) => {
            e.preventDefault();
            row.style.borderTop = "";

            if (draggedRow && draggedRow !== row) {
                const allRows = Array.from(tableBody.querySelectorAll("tr"));
                const draggedIndex = allRows.indexOf(draggedRow);
                const targetIndex = allRows.indexOf(row);

                if (draggedIndex < targetIndex) {
                    row.after(draggedRow); // draggedRow-ი მიაქვს შემდეგ
                } else {
                    row.before(draggedRow); // draggedRow-ი მიაქვს წინ
                }
            }
        });
    });
}