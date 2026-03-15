// public/js/main.js

// Toggle password visibility
function toggleVisibility(id, btn) {
    const field = document.getElementById(id);
    const icon  = btn.querySelector("i");
    if (field.type === "password") {
        field.type = "text";
        icon.classList.replace("bi-eye", "bi-eye-slash");
    } else {
        field.type = "password";
        icon.classList.replace("bi-eye-slash", "bi-eye");
    }
}

// Live clock in navbar
function updateClock () {
    const el = document.getElementById('navClock')
    if (!el) return
    const now = new Date()
    el.textContent = now.toLocaleTimeString('en-US', {
        hour:   '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    })
}
updateClock()
setInterval(updateClock, 1000)
