import { logIn, sendTest } from "../Commons/requests.js";

(function () {
  document.addEventListener("DOMContentLoaded", () => {

    // LOGIN FORM
    document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const errorLogin = document.getElementById("errorLogin");

      errorLogin.textContent = " ";

      const payload = {
        userName: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value.trim()
      };

      try {
        await sendTest()
          .then((result) => {
            if (result.status !== 200) {
              console.log(result)
              showMessage("ავტორიზაცია ვერ განხორციელდა");
            }
            console.log(result)
            showMessage("ავტორიზაცია წარმატებით გაიარეთ", true);


          })
          .catch(error => {
            showMessage(error);
            return;
          });

        const res = await logIn(payload);

        console.log("Operation succeed.", res);
        //window.location.href = "index.html";

      } catch (err) {
        showMessage(err);
      }
    });

  });


})();



function showMessage(error = "", succeed = false) {
  const errorLogin = document.getElementById("errorLogin");
  errorLogin.textContent = error;
  errorLogin.style.color = "red";
  if (succeed)
    errorLogin.style.color = "green";
}