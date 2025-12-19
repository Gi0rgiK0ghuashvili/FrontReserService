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

document.addEventListener("DOMContentLoaded", () => {

  // LogOut FORM
  document.getElementById("logOut-navLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    
    logOut(); });
});


function logOut() {
  const span = document.getElementById("mySpan");

  span.addEventListener("click", () => {
    alert("Span ელემენტზე დაკლიკდა!");
  });
}


function userLogOut(event) {

  const token = localStorage.getItem("authToken");

  const cookieName = "AuthToken";
  const cookies = document.cookie.split(";");

  console.log("this is toke: ", token);

  if (token) {
    localStorage.removeItem("authToken");
    console.log("token removed.");
  }

  window.location.href = "pages-login.html";
};