import { getRequest } from "../js/Commons/requests.js";

const ordersText = document.getElementById("ordersReport");

await getData();

async function getData() {
        console.log("ordersText", ordersText);

    if (!ordersText) {
        console.log("ordersText", ordersText);
        return;
    }

    const result = await getRequest("Report", "sumAmount", 5);

    if(result.statusCode !== 200) 
        throw result;

        console.log(result);
        
    setStatsResult(result.value);
}

function setStatsResult(text) {
    ordersText.textContent = text;
}
