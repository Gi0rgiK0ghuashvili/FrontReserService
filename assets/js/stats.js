import { getRequest } from "../js/Commons/requests.js";

const ordersText = document.getElementById("ordersReport");

await getData();

async function getData() {
    if (!ordersText) {
        return;
    }

    const result = await getRequest("Report", "sumAmount", 5);

    if(result.statusCode !== 200) 
        throw result;

    setStatsResult(result.value);
}

function setStatsResult(text) {
    ordersText.textContent = text;
}
