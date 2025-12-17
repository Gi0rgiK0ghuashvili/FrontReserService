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
        console.log(payload);

        console.log("Starting test method...");
        await sendTest()
          .then((result) => {
            console.log(result)

          })
          .catch(error => {
            showError("Operation Test failed: ", error);

          });
        console.log("End test method...");


        console.log("start operation...");
        // Login Section
        await logIn(payload)
          .then((response) => {
            console.log("Operation succeed.", response);
            window.location.href = "index.html";
          })
          .catch(error => {
            console.log("Operation failed.");
            showError(error);
          });

      } catch (err) {
        showError(error);
      }
    });

  });

})();

document.addEventListener("DOMContentLoaded", () => {

  // LogOut FORM
  document.getElementById("logout")?.addEventListener("submit", (e) => {
    e.preventDefault();

    try {

    } catch (err) {
      showError(error);
    }
  });

});

function logOut() {
  const span = document.getElementById("mySpan");

  span.addEventListener("click", () => {
    alert("Span ელემენტზე დაკლიკდა!");
  });
}

function showError(error = "") {
  const errorLogin = document.getElementById("errorLogin");

  errorLogin.textContent = error;
  errorLogin.style.color = "red";
}