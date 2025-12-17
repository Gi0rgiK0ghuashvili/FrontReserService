document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    userName: document.getElementById("username").value.trim(),
    password: document.getElementById("password").value.trim()
  };
  
console.log("Get username");
  try {
      console.log("Start try");

    const res = await fetch("https://localhost:7079/api/auth/login", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      credentials: "include" // საჭიროა cookie-ზე დაყრდნობილი ავტორიზაციისთვის
    });
      console.log("send request");

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "შესვლის შეცდომა!");
    }

    // თუ backend აბრუნებს JSON მონაცემს (მაგ. { token: "...", user: {...} })
    const data = await res.json();

    // თუ token მოდის JSON-ით, შეგიძლია შეინახო localStorage-ში:
    if (data.token) {
      localStorage.setItem("authToken", data.token);
    }

    alert("შესვლა წარმატებით შესრულდა!");
    window.location.href = "index.html"; // გადაყვანა შემდეგ გვერდზე

  } catch (err) {
    console.error("Login Error:", err);
    alert("შესვლის შეცდომა: " + err.message);
  }
});

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("https://localhost:7079/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" 
          
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.token) {
        document.cookie = `jwtToken=${data.token}; path=/; max-age=3600; secure`;
        // secure = მხოლოდ HTTPS-ზე
    } else {
        alert("გაითვალისწინეთ: ავტორიზაცია ვერ შესრულდა.");
    }
}