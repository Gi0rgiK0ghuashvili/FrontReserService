import { createDropDownItem } from '../../ui/orders/dropDown.js';
import { readTable, buildOrder} from '../../ui/orders/tableReader.js';
const MenuState = {
    selectedMenuIds: [],
    orderLines: []
};

document.addEventListener("DOMContentLoaded", () => {

    const toggle = document.getElementById("menuDropdownToggle");
    const menu = document.getElementById("menuDropdownMenu");

    if (!toggle || !menu) return;

    document.addEventListener("click", () => {
        menu.classList.remove("show");
    });

    toggle.addEventListener("click", e => {
        e.stopPropagation();
        menu.classList.toggle("show");
    });

    menu.addEventListener("click", e => {
        e.stopPropagation();
    });

});

// შერჩეული მენიუების განახლება
export function updateSelectedMenus() {
    const checkboxes = document.querySelectorAll(".dropdown-checkbox:checked");
    const textSpan = document.getElementById("menuDropdownText");

    let names = [];
    let ids = [];

    checkboxes.forEach(cb => {
        names.push(cb.dataset.nameGeo);
        console.log("cb.id: ", cb.dataset.id)
        ids.push(cb.dataset.id);
    });

    if (names.length === 0) {
        textSpan.innerHTML = "აირჩიეთ მენიუ";
    }
    else {
        textSpan.innerHTML = `${names.join(", ")}<span class="selected-count">(${names.length})</span>`;
    }

    // hidden input-ებში ჩაწერა
    document.getElementById("menu_id_hidden").value = ids.join(",");
    document.getElementById("menu_id_main").value = ids.length > 0 ? ids[0] : 0;

    //onMenuSelected(ids);
    return ids;
}

export function saveChangesButtonEvent() {
    const saveChangesButton = document.getElementById("add-saveChanges");
    if (!saveChangesButton) {
        return;
    }

    saveChangesButton.addEventListener("click", async (event) => {
        try {
            const rows = readTable("tableBody");
            const order = buildOrder(rows);

            const resporse = await ApiService.post("order", "addOrder", order);
            if (!resporse) {
                console.error("resporse", resporse);
                return;
            }


            alert(response.message, " Order sent successfully");
        }
        catch (error) {
            console.error(error);
            alert("Error sending order");
        }
    });

}

function onMenuSelected(ids) {

    console.log("არჩეული დარბაზები:", ids);
}
