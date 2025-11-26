/**
 * Authentication script for HomeHNI login.
 * Redirects to dashboard based on selected role.
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const roleField = form.querySelector("select[name='role']");
    const role = roleField ? roleField.value : "";
    // redirect to dashboard with role param
    if (role) {
      window.location.href = `dashboard.html?role=${encodeURIComponent(role)}`;
    }
  });
});
