import { } from "port"

/**
 * ფორმის submit ჰენდლერი — აგზავნის FilterMenuDto ობიექტს
 */
async function handleSearchForm(e) {
  e.preventDefault();
const filters = {
    id: null,
    active: null,
    createdBy: null,
    updatedBy: null,
    createdDate: null,
    updatedDate: null,
    nameGeo: null,
    nameEng: document.getElementById("productName"),
    minPrice: getDecimalOrNull("minPrice"),
    maxPrice: getDecimalOrNull("maxPrice"),
    category: null
  };

    try {
        const response = await fetch('https://localhost:7079/api/home/search', {
            method: 'POST',
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
             },
             body: JSON.stringify(filters)
           });
        if (!response.ok) throw new Error('Network error');

        const data = await response.json();
        populateTable(data);

    } catch (err) {
        console.error(err);
    }
}

async function searchMenu() {
    const filter = {
    id: null,
    active: null,
    createdBy: null,
    updatedBy: null,
    createdDate: null,
    updatedDate: null,
    nameGeo: null,
    nameEng: document.getElementById("productName"),
    minPrice: getDecimalOrNull("minPrice"),
    maxPrice: getDecimalOrNull("maxPrice"),
    category: null
  };

    try {
        const response = await fetch('https://localhost:7079/api/home/search', {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              'Content-Type': 'application/json'
            },
            credentials: "include",

            body: JSON.stringify(filters)
        });

        if (!response.ok) throw new Error('Network error');

        const data = await response.json();
        populateTable(data);

    } catch (err) {
        console.error(err);
    }
}

function populateTable(items) {
    const tbody = document.getElementById('menuTableBody');
    tbody.innerHTML = '';

    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.nameEng}</td>
            <td>${item.category}</td>
            <td>${item.price}</td>
        `;
        tbody.appendChild(row);
        alert("All done");
    });
}



// Generic fetch function
async function fetchData(url, payload = null, method = "GET") {
    const options = {
        method,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: "include"
    };

    if (payload) {
        options.body = JSON.stringify(payload);
    }

    const res = await fetch(url, options);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Request failed");
    }
    return res.json();
}

function safeGetValue(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  const val = el.value?.trim();
  return val ? val : null;
}
/**
 * დამხმარე ფუნქცია ტექსტური ან თარიღის ველის მნიშვნელობის მისაღებად
 */
function getValueOrNull(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  const value = el.value?.trim();
  return value ? value : null;
}

/**
 * დამხმარე ფუნქცია რიცხვითი ველის მისაღებად
 */
function getDecimalOrNull(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  const val = parseFloat(el.value);
  return isNaN(val) ? null : val;
}

window.AppUtils = {
  handleSearchForm,
  fetchData,
  searchMenu,
  populateTable
};