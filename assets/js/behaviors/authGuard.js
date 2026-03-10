import { checkTokenValidation} from "../../js/core/requests.js";

const tokenName = "authToken";

(function () {
    try {
        const token = localStorage.getItem(tokenName);
        if(!token)
        {
            window.location.href = "pages-login.html";
        }
        
        const checked = checkTokenValidation();

    }
    catch (ex) {
        window.location.href = "pages-error-404.html";
        console.error("Login Error:", ex);
    }
})();


function errorCached() {

}
