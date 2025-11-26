/**
 * Dashboard script to render role-specific dashboard page.
 */
const DASHBOARD_SECTIONS = {
  owner: ["My Properties", "My Leads"],
  agent: ["My Listings", "Leads Center"],
  builder: ["Projects", "Project Leads"],
  agency: ["Lead Pool", "Agents"],
  service: ["My Services", "Service Leads"],
  buyer: ["Saved Properties", "My Requirements"],
  admin: ["Users", "Properties", "Plans & Credits"]
};

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const roleParam = params.get("role") || "";
  const role = roleParam.toLowerCase();
  const titleEl = document.getElementById("dashboard-title");
  if (titleEl && role) {
    titleEl.textContent = role.charAt(0).toUpperCase() + role.slice(1) + " Dashboard";
  }
  const contentEl = document.getElementById("dashboard-content");
  if (contentEl) {
    const sections = DASHBOARD_SECTIONS[role] || [];
    let html = "";
    sections.forEach((sec) => {
      html += `<section class="mb-4"><h2 class="h5">${sec}</h2><p>Content for ${sec} will go here.</p></section>`;
    });
    if (sections.length === 0) {
      html = "<p>No dashboard sections configured for this role.</p>";
    }
    contentEl.innerHTML = html;
  }
});
