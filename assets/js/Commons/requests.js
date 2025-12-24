//const apiHost = "10.30.22.53";
//const apiHost = window.location.hostname;
//const apiHost = "localhost";
const apiHost = "10.30.52.50";

//const port = 5117; // შენი API პორტი
//const port = 7079; // შენი API პორტი
//const port = 80; // შენი API პორტი localhost web api
const port = 8080; // შენი API პორტი

const apiFullAddress = `http://${apiHost}:${port}/api`;
//const apiFullAddress = `http://${apiHost}/api`;

const tokenName = "authToken";

export async function setRequest(controller, endpoint, data) {
    try {
        const newToken = await checkTokenValidation();

        if (!controller) throw "controller is null.";
        if (!endpoint) throw "endpoint is null.";
        if (!data) throw "endpoint is null.";

        const api = `${apiFullAddress}/${controller}/${endpoint}`;
        const payload = JSON.stringify(data);

        const response = await fetch(api, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${newToken.value}`
            },
            body: payload
        });

        if (response.status !== 200) {
            throw response;
        }

        const result = await response.json();
        return result;
    }
    catch (error) {
        throw error;
    }
}

export async function getRequest(controller, endpoint, payload = null) {
    try {
        const newToken = await checkTokenValidation();

        if (newToken.statusCode !== 200) {
            localStorage.removeItem(tokenName);
            window.location.href = "pages-login.html";
            return;
        }

        if (!controller) throw "controller is null.";
        if (!endpoint) throw "endpoint is null.";

        const api = `${apiFullAddress}/${controller}/${endpoint}`;

        const response = await fetch(api, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${newToken.value}`
            },
            body: JSON.stringify(payload)
        });

        if (response.status !== 200) {
            throw response;
        }

        const result = await response.json();
        return result;
    }
    catch (error) {
        console.log("First ex: ", error);

        const ex = {
            message: error.message,
            source: error.url.toString(),
            operationType: "add-content"
        };
        throw error;
    }
}

export async function checkTokenValidation() {
    const token = localStorage.getItem(tokenName);
    const API = `${apiFullAddress}/auth/checkToken`;

    const response = await fetch(API, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    // Token invalid
    if (response.status === 401) {
        localStorage.removeItem(tokenName);
        window.location.href = "pages-login.html";
        return;
    }

    if (response.status !== 200) {
        throw response;
    }

    const result = await response.json();

    if (result?.value) {
        localStorage.setItem(tokenName, result.value);

        return result;
    }
    throw result;
}

export async function logIn(model) {
    if (!model) throw new Error("Payload is null");
    if (!model.userName) throw new Error("userName is null");
    if (!model.password) throw new Error("password is null");

    const payload = JSON.stringify(model);

    const api = `${apiFullAddress}/auth/login`;
    try {
        const response = await fetch(api, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: payload
        });

        if (response.status !== 200) {
            return await response.json();
        }
        const result = await response.json();

        localStorage.setItem(tokenName, result.value);

        return result;

    } catch (ex) {
        console.error(ex);
        throw ex;
    }
}

export async function logException(ex) {

    if (!ex) {
        return;
    }

    const payload = JSON.stringify(ex);
    const token = localStorage.getItem("authToken");

    const url = `${apiFullAddress}/exceptions/addAsync`

    const result = await fetch(url, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: payload
    });

    if (result.status !== 200) {
        console.error(result);
        return "Not Added Exception";
    }

    return "Exception added to database.";
}

export async function sendTest() {
    try {
        const api = `${apiFullAddress}/auth/testApi`;

        const response = await fetch(api, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        return response;
    }
    catch (ex) {

    }
}