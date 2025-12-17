import { checkTokenValidation} from "../Commons/requests.js";

(async function () {
    try {
        const checked = await checkTokenValidation();

    }
    catch (ex) {
        window.location.href = "pages-error-404.html";
        console.error("Login Error:", ex);
    }
})();


function errorCached() {

}
