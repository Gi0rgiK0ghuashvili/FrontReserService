import { ApiService } from "../../core/requests.js";
import { readInputsCategory } from "./readCategories.js";
import { showNotification } from "../../components/notifications/showNotification.js";

(async function addButonEventHandler(){
    const addButton = document.getElementById("add-button");

    if(!addButton){
        return;
    }

    addButton.addEventListener("click", async (event) => {
        const category = await readInputsCategory();
            console.log("Category: ", category);

        if(!category){
            console.error("Category: ", category);
            return;
        }
        
        const response = await ApiService.post("category", "addCategory", category);

        console.log(response);

        if(response.success){
            showNotification("notification", "კატეგორია წარმატებით დაემატა", true);
            return;
        }
        else{
            showNotification("notification", "კატეგორია ვერ დაემატა", false);
            return;
        }
    });
})();