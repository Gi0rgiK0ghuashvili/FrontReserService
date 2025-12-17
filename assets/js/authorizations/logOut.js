(async function () {
  document.addEventListener("DOMContentLoaded", () => {

    const logOutNavLink = document.getElementById("logOut-navLink");
    const logOutMenuBtn = document.getElementById("logout");
    console.log("logOutNavLink: ", logOutNavLink);
    console.log("logOutMenuBtn: ", logOutMenuBtn);


    logOutNavLink.addEventListener("click", (e) => userLogOut(e));
    logOutMenuBtn.addEventListener("click", (e) => userLogOut(e));

  })
})();



function userLogOut(event) {

  const token = localStorage.getItem("authToken");

  const cookieName = "AuthToken";
  const cookies = document.cookie.split(";");

  console.log("this is toke: ", token);

  if (token) {
    localStorage.removeItem("authToken");
    console.log("token removed.");
  }

  let cookieExists = false;
  console.log("this is coockie: ", cookieExists);

  for (let c of cookies) {
    const [name, value] = c.trim().split("=");
    if (name === cookieName && value) {
      cookieExists = true;
      break;
    }
  }

  if (cookieExists) {
    console.log("the coockie is alive: ", cookieExists);
    localStorage.removeItem("authToken");
  }

  window.location.href = "pages-login.html";
};