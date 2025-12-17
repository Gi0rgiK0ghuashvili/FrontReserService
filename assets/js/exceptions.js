export async function logException(exception) {

    if (!exception) {
        return;
    }

    const ex = {
        message: exception.message,
        source: "ordersModeal.js",
        operationType: "modal-search-parameters.js"
    };

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

    const finalResult = "Exception added to database.";
    if (result.status !== 200) {
        finalResult = "Not Added Exception";
        return finalResult
    }
    return finalResult;
}