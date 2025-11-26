/**
 * Shared JS for HomeHNI static prototype: public site + property flows
 */

function getYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const obj = {};
  for (const [key, value] of params.entries()) {
    obj[key] = value;
  }
  return obj;
}

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) {
    console.error("Failed to load", path);
    return [];
  }
  return res.json();
}

// Prefer backend API, fallback to static JSON
async function loadProperties() {
  const apiBase = window.HOMENI_API_BASE || 'https://hni-uae-2.vercel.app/api';
  try {
    const res = await fetch(apiBase + "/properties");

      return res.json();
    }
  } catch (e) {
    console.warn("Backend API not reachable, falling back to static properties.json");
  }
  return loadJSON("assets/data/properties.json");


function formatPrice(aed) {
  if (aed == null) return "";
  if (aed >= 1000000) {
    return "AED " + (aed / 1000000).toFixed(2) + "M";
  }
  if (aed >= 1000) {
    return "AED " + (aed / 1000).toFixed(1) + "K";
  }
  return "AED " + aed.toLocaleString();
}

function createPropertyCard(p) {
  const col = document.createElement("div");
  col.className = "col-12 col-md-4";

  const link = document.createElement("a");
  link.href = "property.html?id=" + encodeURIComponent(p.id);
  link.className = "text-decoration-none text-dark";

  link.innerHTML = `
    <article class="hh-property-card">
      <img src="${p.image}" alt="${p.title}" />
      <div class="hh-property-body">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="badge bg-success hh-badge">${p.purpose === "rent" ? "For Rent" : "For Sale"}</span>
          <span class="hh-price">${formatPrice(p.price)}</span>
        </div>
        <h2 class="h6 mb-1">${p.title}</h2>
        <p class="hh-meta mb-1">${p.city} • ${p.community}</p>
        <p class="hh-meta mb-0">${p.bedrooms} Bed • ${p.bathrooms} Bath • ${p.area}</p>
      </div>
    </article>
  `;
  col.appendChild(link);
  return col;
}

async function initHomePage() {
  const form = document.getElementById("hero-search-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const params = new URLSearchParams();
      for (const [key, value] of data.entries()) {
        if (value) params.set(key, value.toString());
      }
      window.location.href = "listings.html?" + params.toString();
    });
  }

  const container = document.getElementById("featured-properties");
  if (!container) return;

  const properties = await loadProperties();
  const featured = properties.filter((p) => p.featured).slice(0, 6);

  featured.forEach((p) => {
    container.appendChild(createPropertyCard(p));
  });
}

async function initListingsPage() {
  const grid = document.getElementById("listing-grid");
  if (!grid) return;

  const props = await loadProperties();
  const params = getQueryParams();

  const form = document.getElementById("filters-form");
  if (form) {
    // Prefill from query
    for (const element of form.elements) {
      if (element.name && params[element.name]) {
        element.value = params[element.name];
      }
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const newParams = new URLSearchParams();
      for (const [key, value] of data.entries()) {
        if (value) newParams.set(key, value.toString());
      }
      window.location.search = newParams.toString();
    });
  }

  function matchFilters(p) {
    if (params.purpose && p.purpose !== params.purpose) return false;
    if (params.city && p.city !== params.city) return false;
    if (params.type && p.type !== params.type) return false;
    if (params.beds && p.bedrooms < Number(params.beds)) return false;
    if (params.minPrice && p.price < Number(params.minPrice)) return false;
    if (params.maxPrice && p.price > Number(params.maxPrice)) return false;
    return true;
  }

  const filtered = props.filter(matchFilters);
  grid.innerHTML = "";
  filtered.forEach((p) => grid.appendChild(createPropertyCard(p)));

  const countEl = document.getElementById("listing-count");
  if (countEl) {
    countEl.textContent = `${filtered.length} propert${filtered.length === 1 ? "y" : "ies"} found`;
  }

  const titleEl = document.getElementById("listing-title");
  if (titleEl) {
    let title = "Properties in UAE";
    if (params.city) title = `Properties in ${params.city}`;
    if (params.purpose === "rent") title = "Properties for rent in UAE";
    if (params.purpose === "buy") title = "Properties for sale in UAE";
    titleEl.textContent = title;
  }
}

async function initPropertyPage() {
  const container = document.getElementById("property-details");
  if (!container) return;

  const params = getQueryParams();
  const id = params.id;
  const props = await loadProperties();
  const p = props.find((x) => String(x.id) === String(id));

  if (!p) {
    container.innerHTML = "<p>Property not found.</p>";
    return;
  }

  container.innerHTML = `
  <div class="row g-4">
    <div class="col-12">
      <div class="hh-hero-image mb-3">
        <img src="${p.image}" alt="${p.title}" />
      </div>
    </div>
    <div class="col-md-8">
      <h1 class="h4 mb-2">${p.title}</h1>
      <p class="text-muted-2 mb-2">${p.city} • ${p.community}</p>
      <div class="mb-3">
        <span class="badge bg-success hh-badge">${p.purpose === "rent" ? "For Rent" : "For Sale"}</span>
      </div>
      <p><strong>${formatPrice(p.price)}</strong></p>
      <p class="hh-meta mb-2">
        ${p.bedrooms} Bed • ${p.bathrooms} Bath • ${p.area}
      </p>
      <p>${p.description}</p>
    </div>
    <div class="col-md-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <h2 class="h6 mb-3">Enquire about this property</h2>
          <form id="property-enquiry-form">
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
              <textarea class="form-control" name="message" rows="3" placeholder="I am interested in this property..."></textarea>
            </div>
            <button class="btn btn-primary w-100" type="submit">Send Enquiry</button>
            <p class="small text-muted mt-2 mb-0">This will create a lead in your dashboard once API is connected.</p>
          </form>
          <div class="small mt-2" id="property-enquiry-status"></div>
        </div>
      </div>
    </div>
  </div>
  `;

  // Attach submit handler to send lead to backend
  const form = document.getElementById("property-enquiry-form");
  const statusEl = document.getElementById("property-enquiry-status");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const payload = {
        property_id: p.id,
        name: data.get("name"),
        phone: data.get("phone"),
        email: data.get("email") || "",
        city: p.city || "",
        budget: p.price ? String(p.price) : "",
        source: "website_property",
      };

      const apiBase = window.HOMEHNI_API_BASE || "http://localhost:4000";
      try {
        const res = await fetch(apiBase + "/leads/property", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          if (statusEl) {
            statusEl.textContent = "Thank you. Your enquiry has been submitted.";
            statusEl.className = "small text-success";
          } else {
            alert("Enquiry submitted.");
          }
          form.reset();
        } else {
          if (statusEl) {
            statusEl.textContent = "Could not submit enquiry. Please try again.";
            statusEl.className = "small text-danger";
          } else {
            alert("Could not submit enquiry.");
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
  getYear();
  initHomePage();
  initListingsPage();
  initPropertyPage();
});
