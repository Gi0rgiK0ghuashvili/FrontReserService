import { ApiService } from "../../core/requests.js";
import {setStatsResult } from "./reportWrites.js"


await dailyReport();

async function dailyReport() {
    const result = await ApiService.post("report", "sumAmount", 5);
        console.log(result.message, result.statusCode);

    if(result.statusCode >= 300) {
        console.error(result.message, result.statusCode);
        return;
    }

    setStatsResult("ordersReport", result.value);
}

