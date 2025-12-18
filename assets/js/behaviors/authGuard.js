import { checkTokenValidation} from "../Commons/requests.js";

const tokenName = "authToken";

(async function () {
    try {
        const token = localStorage.getItem(tokenName);
        if(!token)
        {
            window.location.href = "pages-error-404.html";
        }
        
        const checked = await checkTokenValidation();

    }
    catch (ex) {
        window.location.href = "pages-error-404.html";
        console.error("Login Error:", ex);
    }
})();


function errorCached() {

}
