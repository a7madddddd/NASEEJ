document.addEventListener('DOMContentLoaded', fetchAndDisplayUsers);

async function fetchAndDisplayUsers() {
    const tableBody = document.getElementById('userTableBody');

    // Verify that tableBody exists
    if (!tableBody) {
        console.error("Error: Table body element with id 'userTableBody' not found.");
        return;
    }

    try {
        const response = await fetch('http://localhost:25025/api/Users');
        if (!response.ok) {
            throw new Error("Failed to fetch data from the API");
        }

        const users = await response.json();

        // Clear any existing rows in the table body
        tableBody.innerHTML = '';

        users.forEach((user, index) => {
            const row = document.createElement('tr');

            // Format the join date to 'YYYY-MM-DD'
            const formattedJoinDate = user.joinDate ? new Date(user.joinDate).toISOString().split('T')[0] : 'N/A';

            // Define cell data, including formatted date
            const cells = [
                index + 1,                      // Row number
                user.firstName || 'N/A',        // First Name
                user.lastName || 'N/A',         // Last Name
                user.email || 'N/A',            // Email
                user.phoneNumber || 'N/A',      // Phone
                user.nationality || 'N/A',      // Nationality
                user.degree || 'N/A',           // Educational Degree
                user.governorate || 'N/A',      // Governorate
                formattedJoinDate               // Formatted Join Date
            ];

            cells.forEach(cellData => {
                const cell = document.createElement('td');
                cell.textContent = cellData;
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching and displaying data:", error);
    }
}
