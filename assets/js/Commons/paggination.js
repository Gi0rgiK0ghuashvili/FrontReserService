

function renderPagination(totalCount) {
  totalPages = Math.ceil(totalCount / pageSize);

  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  // Prev
  const prevBtn = document.createElement("button");
  prevBtn.innerText = "«";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    currentPage--;
    loadOrders();
  };
  pagination.appendChild(prevBtn);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;

    if (i === currentPage) {
      btn.classList.add("active");
    }

    btn.onclick = () => {
      currentPage = i;
      loadOrders();
    };

    pagination.appendChild(btn);
  }

  // Next
  const nextBtn = document.createElement("button");
  nextBtn.innerText = "»";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    currentPage++;
    loadOrders();
  };
  pagination.appendChild(nextBtn);
}

document.getElementById("pageSizeSelect").addEventListener("change", e => {
  pageSize = parseInt(e.target.value);
  currentPage = 1;
  loadOrders();
});

document.getElementById("searchInput").addEventListener("input", () => {
  currentPage = 1;
  loadOrders();
});

document.addEventListener("DOMContentLoaded", () => {
  loadOrders();
});

async function loadOrders() {
  const search = document.getElementById("searchInput").value;

  const response = await fetch(
    `/api/orders?pageNumber=${currentPage}&pageSize=${pageSize}&search=${search}`
  );

  const result = await response.json();

  renderTable(result.items);
  renderPagination(result.totalCount);
}

function renderTable(items) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  items.forEach(order => {
    tbody.innerHTML += `
      <tr>
        <td>${order.name}</td>
        <td class="text-end">${order.sum}</td>
        <td class="text-center">${order.date}</td>
        <td class="text-center">${order.hall}</td>
        <td class="text-center">${order.guest}</td>
        <td class="text-center">${order.customer}</td>
        <td class="text-center">${order.status}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-primary">ნახვა</button>
        </td>
      </tr>
    `;
  });
}