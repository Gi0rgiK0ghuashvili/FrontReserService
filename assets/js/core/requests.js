//const apiHost = "localhost"; const port = 7079;
// const apiHost = "localhost"; const port = 8080;
const apiHost = "10.30.52.50"; const port = 8080;

const apiFullAddress = `https://${apiHost}:${port}/api`;

const tokenName = "authToken";

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

const API_BASE_URL = apiFullAddress;

// Local function for check request headers.
async function getAuthHeaders() {
    const tokenResult = await checkTokenValidation();

    if (tokenResult.statusCode !== 200) {
        localStorage.removeItem(tokenName);
        window.location.href = "pages-login.html";
        throw new Error("Unauthorized");
    }

    return {
        "Accept": "application/json",
        "Authorization": `Bearer ${tokenResult.value}`
    };
}

async function handleResponse(response) {
    if (!response.ok) {
        const errorText = await response.text();
        throw {
            statusCode: response.status,
            message: errorText || response.statusText
        };
    }

    return await response.json();
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
        console.error(ex);
    }
}

export const ApiService = {
    async get(controller, endpoint) {
        const headers = await getAuthHeaders();
        const url = `${apiFullAddress}/${controller}/${endpoint}`;

        const response = await fetch(url, {
            method: "GET",
            headers
        });
        return handleResponse(response);
    },
    async post(controller, endpoint, payload) {
        const headers = await getAuthHeaders();
        const url = `${apiFullAddress}/${controller}/${endpoint}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                ...headers,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        return handleResponse(response);
    },
    async put(controller, endpoint, payload) {
        const headers = await getAuthHeaders();
        const url = `${apiFullAddress}/${controller}/${endpoint}`;

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                ...headers,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        return handleResponse(response);
    },
    async delete(controller, endpoint) {
        const headers = await getAuthHeaders();
        const url = `${apiFullAddress}/${controller}/${endpoint}`;

        const response = await fetch(url, {
            method: "DELETE",
            headers
        });

        return handleResponse(response);
    }
};

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