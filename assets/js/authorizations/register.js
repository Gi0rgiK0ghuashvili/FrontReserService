document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        name: document.getElementById("yourName").value.trim(),
        surname: document.getElementById("yourSurname").value.trim(),
        phoneNumber: document.getElementById("yourSurname").value.trim(),
        email: document.getElementById("yourEmail").value.trim(),
        phoneNumber: document.getElementById("phoneNumber").value.trim(),
        username: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value.trim(),
        confirmPassword: document.getElementById("confirmPassword").value.trim(),
        role: document.getElementById("userRole").value.trim()
    };

    if(payload.password != payload.confirmPassword)
    {
        alert("განმეორებითი პაროლი არასწორია.");
        console.error("განმეორებითი პაროლი არასწორია.");
        return;
    }

    const token = localStorage.getItem("authToken");

    if (!token) {
        alert("ავტორიზაცია აუცილებელია!");
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch("https://localhost:7079/api/account/registerEmployee", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`

            },
            credentials: "include", // აუცილებელია Cookie-სთვის
            body: JSON.stringify(payload)
        });

        if(res.status == 401)
        {
            localStorage.removeItem("authToken");
            window.location.href = "pages-login.html";
        }

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "შესვლის შეცდომა!");
        }

        setTimeout(() => {
          location.reload();
        }, 1000);


    } catch (err) {
        console.error("Login Error:", err);
        alert("შესვლის შეცდომა: " + err.message);
    }
});