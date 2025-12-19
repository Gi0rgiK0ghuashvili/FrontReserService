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
              console.log(result);
              showMessage("სერვერთან დაკავშირება ვერ მოხერხდა.");
              return;
            }
          })
          .catch(error => {
            throw error;
          });

        const res = await logIn(payload);

        if (res.statusCode === 200) {
          window.location.href = "index.html";
          return;
        }
        console.log(res);
        showMessage("ავტორიზაცია ვერ მოხერხდა. გთხოვთ დარწმუნდით, რომ სწორად შეგყავთ მომხმარებლის სახელი და პაროლი.");


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