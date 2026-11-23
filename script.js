const API_BASE = "http://localhost:5000/api/students";

function showMessage(message, isSuccess = false) {
  const messageElement = document.getElementById("message");
  if (!messageElement) return;
  messageElement.textContent = message;
  messageElement.classList.toggle("success", isSuccess);
}

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
}

// Registration
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = registerForm.querySelector("button");
    button.disabled = true;
    showMessage("Creating your account...");

    const student = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("regEmail").value.trim(),
      password: document.getElementById("regPassword").value,
      rollNumber: document.getElementById("rollNumber").value.trim(),
      department: document.getElementById("department").value.trim(),
      year: document.getElementById("year").value
    };

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
      });
      const data = await readResponse(response);
      showMessage(data.message, true);
      registerForm.reset();
      window.setTimeout(() => { window.location.href = "index.html"; }, 1200);
    } catch (error) {
      showMessage(error.message);
    } finally {
      button.disabled = false;
    }
  });
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = loginForm.querySelector("button");
    button.disabled = true;
    showMessage("Signing in...");

    const credentials = {
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value
    };

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });
      const data = await readResponse(response);
      // For this learning demo. Use secure HttpOnly cookies in production.
      localStorage.setItem("studentPortalToken", data.token);
      window.location.href = "dashboard.html";
    } catch (error) {
      showMessage(error.message);
    } finally {
      button.disabled = false;
    }
  });
}

// Dashboard profile
const profileContainer = document.getElementById("profile");
if (profileContainer) {
  const token = localStorage.getItem("studentPortalToken");

  if (!token) {
    window.location.href = "index.html";
  } else {
    fetch(`${API_BASE}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(readResponse)
      .then((student) => {
        showMessage("Profile loaded successfully.", true);
        const fields = [
          ["Name", student.name],
          ["Email", student.email],
          ["Roll number", student.rollNumber || "Not provided"],
          ["Department", student.department || "Not provided"],
          ["Year", student.year ? `${student.year}${student.year === 1 ? "st" : student.year === 2 ? "nd" : student.year === 3 ? "rd" : "th"} Year` : "Not provided"]
        ];

        profileContainer.replaceChildren();
        fields.forEach(([label, value]) => {
          const item = document.createElement("div");
          item.className = "profile-item";

          const labelElement = document.createElement("span");
          labelElement.className = "profile-label";
          labelElement.textContent = label;

          const valueElement = document.createElement("span");
          valueElement.className = "profile-value";
          valueElement.textContent = value;

          item.append(labelElement, valueElement);
          profileContainer.appendChild(item);
        });
      })
      .catch((error) => {
        showMessage(error.message);
        localStorage.removeItem("studentPortalToken");
        window.setTimeout(() => { window.location.href = "index.html"; }, 1400);
      });
  }
}

// Logout
const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("studentPortalToken");
    window.location.href = "index.html";
  });
}
