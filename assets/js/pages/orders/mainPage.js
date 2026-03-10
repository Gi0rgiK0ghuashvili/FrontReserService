import { createDropDownItem } from '../../ui/orders/dropDown.js';
import { ApiService } from '../../core/requests.js';
import { Menu } from '../../services/menus/modelMenus.js';
import { updateSelectedMenus, saveChangesButtonEvent } from '../../services/orders/eventOrders.js';
import { selectedMenusElement } from '../../services/orders/menuOrders.js';
import { handleCheckboxChange, recalculateCategoryTotals, handleQuantityChange } from '../../services/orders/paymentOrders.js';
import { showActionButtons } from '../../ui/orders/actionButtons.js';
let VAT_RATE = 0.18;
let vatIncludedMode = true; // true = დღგ ჩათვლით

const _ids = [];

selectedMenusElement();
saveChangesButtonEvent();
showActionButtons();
// ________________________________________________________________________________________________________

// CheckBox-სა და input quantity-ის ივენთი არის და ანახლებს რაოდენობის მიხედვით ჯამურ ფასს.
document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("tableBody");
    if (!tableBody) return;

    tableBody.addEventListener("change", (e) => {
        const target = e.target;

        // ===== CHECKBOX CHANGE =====
        if (target.type === "checkbox") {
            handleCheckboxChange(target);
            recalculateCategoryTotals();
        }

        // ===== QUANTITY CHANGE =====
        if (target.name === "quantity") {
            handleQuantityChange(target);
            recalculateCategoryTotals();
        }
    });
});