import { ApiService } from "../../core/requests.js";
import { Menu } from "../menus/modelMenus.js";
import { createDropDownItem } from "../../ui/orders/dropDown.js";
import { updateSelectedMenus } from "./eventOrders.js";
import { renderToTable} from '../../ui/orders/table.js';


let VAT_RATE = 0.18;
let vatIncludedMode = true; // true = დღგ ჩათვლით

const _ids = [];

export async function selectedMenusElement() {
    const selectMenus = document.getElementById("select-menu");
    const dropDownMenu = document.getElementById("menuDropdownMenu");

    if (!selectMenus) {
        console.error(selectMenus);
        return;
    }

    const menusRequest = await ApiService.post("menu", "menus", new Menu());
    if (!menusRequest.success) {
        console.error(menusRequest.message);
        return;
    }
    const menus = menusRequest.value;

    menus.forEach(menu => {
        const menuItem = createDropDownItem(menu);

        menuItem.addEventListener("change", async (event) => {
            const resultIds = updateSelectedMenus();
            _ids.length = 0;
            resultIds.forEach(id => {
                _ids.push(id);
            });

            const menus = await getMenusByIds(_ids);
            if (menus.length > 1) {
                menus.forEach(x => {
                    renderToTable(menus, "tableBody");
                });
            }
            else {

                console.log("menus: ", menus);
                // მენიუების შეტანა ცხრილში
                renderToTable(menus, "tableBody");
            }
        });

        dropDownMenu.appendChild(menuItem);
    });
}

async function getMenusByIds(ids) {
    const menusRequest = await ApiService.post("menu", "byIds", ids);
    if (!menusRequest.success) {
        console.error(menusRequest.message);
        return;
    }
    const values = menusRequest.value;
    console.log("we have menus by ids: ", values);
    return values;
}

