// Services listing + provider details

function svcGetParams() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(params.entries());
}

// Prefer backend /services, fallback to static JSON
async function loadServices() {
  const apiBase = window.HOMEHNI_API_BASE || "http://localhost:4000";
  try {
    const res = await fetch(apiBase + "/services");
    if (res.ok) {
      return res.json();
    }
  } catch (e) {
    console.warn("Backend API not reachable, falling back to static services.json");
  }
  try {
    const res = await fetch("assets/data/services.json");
    if (!res.ok) {
      console.error("Failed to load services.json");
      return [];
    }
    return res.json();
  } catch (e) {
    console.error("Failed to load services.json", e);
    return [];
  }
}

async function initServicesList() {
  const grid = document.getElementById("services-grid");
  if (!grid) return;
  const filtersForm = document.getElementById("services-filters");
  const params = svcGetParams();
  const all = await loadServices();

  function matchFilters(s) {
    if (params.category && s.category !== params.category) return false;
    if (params.city && !s.cities.includes(params.city)) return false;
    return true;
  }

  function render() {
    const filtered = all.filter(matchFilters);
    grid.innerHTML = "";
    filtered.forEach((s) => {
      const col = document.createElement("div");
      col.className = "col-12 col-md-4 mb-3";
      col.innerHTML = `
        <article class="hh-property-card">
          <img src="${s.image}" alt="${s.name}" />
          <div class="hh-property-body">
            <span class="badge bg-secondary hh-badge">${s.category}</span>
            <h2 class="h6 mt-2 mb-1">
              <a class="text-decoration-none text-dark" href="service-provider.html?id=${encodeURIComponent(
                s.id
              )}">${s.name}</a>
            </h2>
            <p class="hh-meta mb-1">${s.cities.join(", ")}</p>
            <p class="hh-meta mb-1">Rating: ${s.rating}★ (${s.reviews} reviews)</p>
            <button class="btn btn-sm btn-primary" onclick="location.href='service-provider.html?id=${encodeURIComponent(
              s.id
            )}'">Request Quote</button>
          </div>
        </article>
      `;
      grid.appendChild(col);
    });
  }

  if (filtersForm) {
    // Prefill
    for (const el of filtersForm.elements) {
      if (el.name && params[el.name]) {
        el.value = params[el.name];
      }
    }
    filtersForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(filtersForm);
      const p = new URLSearchParams();
      for (const [k, v] of data.entries()) {
        if (v) p.set(k, v.toString());
      }
      window.location.search = p.toString();
    });
  }

  render();
}

async function initServiceProviderDetails() {
  const container = document.getElementById("service-provider-details");
  if (!container) return;
  const params = svcGetParams();
  const id = params.id;
  const all = await loadServices();
  const s = all.find((x) => String(x.id) === String(id));
  if (!s) {
    container.innerHTML = "<p>Service provider not found.</p>";
    return;
  }

  container.innerHTML = `
    <div class="row g-4">
      <div class="col-md-8">
        <h1 class="h4 mb-1">${s.name}</h1>
        <p class="small text-muted mb-2">${s.category} • ${s.cities.join(", ")}</p>
        <p class="small mb-2">Rating: <strong>${s.rating}★</strong> (${s.reviews} reviews)</p>
        <p>${s.description}</p>
        <h2 class="h6 mt-4">Services Offered</h2>
        <ul class="small">
          ${s.services.map((sv) => `<li>${sv}</li>`).join("")}
        </ul>
        <h2 class="h6 mt-4">Portfolio</h2>
        <p class="small text-muted">Add project gallery / before-after photos here.</p>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h2 class="h6 mb-3">Request Quote</h2>
            <form id="service-quote-form">
              <div class="mb-2">
                <input class="form-control" name="name" placeholder="Name" required />
              </div>
              <div class="mb-2">
                <input class="form-control" name="phone" placeholder="Phone" required />
              </div>
              <div class="mb-2">
                <input class="form-control" name="email" placeholder="Email" />
              </div>
              <div class="mb-3">
                <textarea class="form-control" name="message" rows="3" placeholder="Tell us your requirement..."></textarea>
              </div>
              <button class="btn btn-primary w-100" type="submit">Submit</button>
              <p class="small text-muted mt-2 mb-0">This creates a service lead in provider dashboard.</p>
            </form>
            <div class="small mt-2" id="service-quote-status"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach submit handler to send service lead
  const form = document.getElementById("service-quote-form");
  const statusEl = document.getElementById("service-quote-status");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const payload = {
        service_provider_id: s.id,
        name: data.get("name"),
        phone: data.get("phone"),
        email: data.get("email") || "",
        city: s.cities[0] || "",
        budget: "",
        source: "website_service",
      };

      const apiBase = window.HOMEHNI_API_BASE || "http://localhost:4000";
      try {
        const res = await fetch(apiBase + "/leads/service", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          if (statusEl) {
            statusEl.textContent = "Thank you. Your request has been submitted.";
            statusEl.className = "small text-success";
          } else {
            alert("Request submitted.");
          }
          form.reset();
        } else {
          if (statusEl) {
            statusEl.textContent = "Could not submit request. Please try again.";
            statusEl.className = "small text-danger";
          } else {
            alert("Could not submit request.");
          }
        }
      } catch (err) {
        console.error(err);
        if (statusEl) {
          statusEl.textContent = "Network error. Please try again.";
          statusEl.className = "small text-danger";
        } else {
          alert("Network error.");
        }
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("services-grid")) {
    initServicesList();
  }
  if (document.getElementById("service-provider-details")) {
    initServiceProviderDetails();
  }
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
