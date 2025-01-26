document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#inventory-table tbody");
    const searchBar = document.getElementById("search-bar");

    const getItems = () => JSON.parse(localStorage.getItem("inventory")) || [];
    const saveItems = (items) => localStorage.setItem("inventory", JSON.stringify(items));

    const loadItems = () => {
        const items = getItems();
        tableBody.innerHTML = items.map((item, index) => `
            <tr style="background-color: ${item.quantity < 15 ? 'rgba(255, 0, 0, 0.2)' : item.quantity < 50 ? 'rgba(255, 255, 0, 0.2)' : ''}">
                <td>${item.sku}</td>
                <td>${item.name}</td>
                <td contenteditable="true">${item.quantity}</td>
                <td contenteditable="true">${item.measure}</td>
                <td contenteditable="true">${item.price}</td>
                <td>${item.quantity * item.price}</td>
                <td>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </td>
            </tr>
        `).join('');
    };

    const deleteItem = (index) => {
        const items = getItems();
        items.splice(index, 1);
        saveItems(items);
        loadItems();
    };

    tableBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const index = e.target.getAttribute("data-index");
            if (confirm("Are you sure you want to delete this product?")) {
                deleteItem(index);
            }
        }
    });

    tableBody.addEventListener("input", (e) => {
        const row = e.target.closest("tr");
        if (row) {
            const rowIndex = Array.from(tableBody.rows).indexOf(row);
            const items = getItems();
            const columns = row.cells;

            items[rowIndex] = {
                sku: columns[0].textContent.trim(),
                name: columns[1].textContent.trim(),
                quantity: parseInt(columns[2].textContent, 10) || 0,
                measure: columns[3].textContent.trim(),
                price: parseFloat(columns[4].textContent) || 0,
            };
            saveItems(items);
            loadItems();
        }
    });

    searchBar.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        Array.from(tableBody.rows).forEach(row => {
            const nameCell = row.cells[1];
            row.style.display = nameCell.textContent.toLowerCase().includes(searchTerm) ? "" : "none";
        });
    });

    loadItems();
});