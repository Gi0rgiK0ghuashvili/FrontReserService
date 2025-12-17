reloadItemsData();

async function reloadItemsData() {

    const items = await axios("https://localhost:7079/api/items/getItems");

    console.log("ITEMS:", items);
    console.log("this is from searchItems.js ");

    await renderItemsTableById(items, "itemsTableBody");
}

async function axios(url) {

    const token = localStorage.getItem("authToken");
    try {

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "include"
        });

        if (!response.ok) {
            console.log("API error: " + response.status);
        }

        const data = await response.json();
        return data;

    }
    catch (exception) {

        const ex = {
            message: "exception.message",
            source: "add-content",
            operationType: "url"
        };

        console.log("ex.message: ", ex.message);
        console.log("ex.source: ", ex.source);
        console.log("ex.operationType: ", ex.operationType);

        const logExc = await logException(ex);

        console.log(logExc);
    }
}

async function renderItemsTableById(items, elementId) {

    try {

        if (elementId !== "itemsTableBody") {

            console.log("this is from renderItemsTableById. elementId is: ", elementId);
            return;
        }

        const tableBody = document.getElementById(elementId);

        if (!tableBody) {

            return;
        }

        console.log("tableBody", tableBody);
        //tableBody.innerHTML = "";
        if (!items) {
            return;
        }

        if (!Array.isArray(items)) {
            console.error("Expected array but got:", items);
            return;
        }

        console.log("items from renderbody: ", items);

        items.forEach(item => {
            const tr = document.createElement("tr");
            const tdNameGeo = document.createElement("td");
            const tdNameEng = document.createElement("td");
            const tdCategoryGeo = document.createElement("td");
            const tdCategoryEng = document.createElement("td");
            const tdPrice = document.createElement("td");

            tdCategoryGeo.textContent = item.categoryGeo;
            tdCategoryEng.textContent = item.categoryEng;
            tdNameGeo.textContent = item.nameGeo;
            tdNameEng.textContent = item.nameEng;
            tdPrice.textContent = item.price;

            tr.appendChild(tdCategoryGeo);
            tr.appendChild(tdCategoryEng);
            tr.appendChild(tdNameGeo);
            tr.appendChild(tdNameEng);
            tr.appendChild(tdPrice);
            tableBody.appendChild(tr);
        });

    }
    catch (exception) {
        console.log("First ex: ", exception.message);

        const ex = {
            message: exception.message,
            source: "add-content",
            operationType: url.toString()
        };

        console.log('ex.message: ', ex.message);
        console.log('ex.source: ', ex.source);
        console.log('ex.operationType: ', ex.operationType);

        const logExc = await logException(ex);
        console.log(logExc);
    }
}

async function logException(ex) {

    if (!ex) {
        return;
    }

    const token = localStorage.getItem("authToken");

    const url = "https://localhost:7079/api/exceptions/addAsync"

    const result = await fetch(url, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify(ex),
    });

    if (result.status !== 200) {
        return "Not Added Exception";
    }

    return "Exception added to database.";
}
