// Utility function to determine if a value represents true
function isTrue(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
}

// Function to check if user is Super Admin


// Updated loadEmployeeData function
function loadEmployeeData() {
    const jwt = sessionStorage.getItem('Token');

    if (jwt) {
        try {
            const decodedJWT = JSON.parse(atob(jwt.split('.')[1]));
            const employeeName = decodedJWT.fullName;
            const isSuperAdmin = isTrue(decodedJWT.isAdmin);
            const employeeRole = isSuperAdmin ? 'Super Admin' : 'Admin';
            const employeeImagePath = decodedJWT.image;

            // Format image URL
            const imageUrl = `http://localhost:25025/${employeeImagePath.replace(/\\/g, "/")}`;

            // Update profile section
            const profileImg = document.querySelector('.d-flex.align-items-center.ms-4.mb-4 img');
            const profileName = document.querySelector('.d-flex.align-items-center.ms-4.mb-4 h6');
            const profileRole = document.querySelector('.d-flex.align-items-center.ms-4.mb-4 span');

            if (profileImg) profileImg.src = imageUrl;
            if (profileName) profileName.textContent = employeeName;
            if (profileRole) profileRole.textContent = employeeRole;

            // Update navbar
            const navbarImage = document.querySelector('.rounded-circle.me-lg-2');
            const navbarNames = document.querySelectorAll('.d-none.d-lg-inline-flex');

            if (navbarNames.length > 1) {
                const secondNavbarName = navbarNames[2];
                secondNavbarName.textContent = employeeName;
            }

            if (navbarImage) navbarImage.src = imageUrl;

            // Update UI visibility based on admin status
            const adminOnlyElements = document.querySelectorAll('.admin-only');
            adminOnlyElements.forEach(element => {
                element.style.display = isSuperAdmin ? '' : 'none';
            });

            // Optional: Add role-specific styling
            document.body.classList.toggle('super-admin-view', isSuperAdmin);
            document.body.classList.toggle('admin-view', !isSuperAdmin);

        } catch (error) {
            console.error("Error loading employee data:", error);
        }
    }
}


// Initialize when document is ready
document.addEventListener('DOMContentLoaded', loadEmployeeData);










// Optional: Add visual indicators for Super Admin only features
document.addEventListener("DOMContentLoaded", function () {
    const jwt = sessionStorage.getItem('Token');
    if (jwt) {
        try {
            const decodedJWT = JSON.parse(atob(jwt.split('.')[1]));
            if (!decodedJWT.isAdmin) {
                // Hide or disable admin-only UI elements
                const adminOnlyElements = document.querySelectorAll('.admin-only');
                adminOnlyElements.forEach(element => {
                    element.style.display = 'none';
                });
            }
        } catch (error) {
            console.error("Error checking admin status:", error);
        }
    }
});











// Function to fetch messages and update the existing HTML structure
async function fetchMessages() {
    try {
        // Fetch the contact messages from the API
        const response = await fetch('http://localhost:25025/api/Contact/GetAllMessage');
        const messages = await response.json();

        // Select the existing dropdown menu container
        const dropdownMenu = document.querySelector(".dropdown-menu");

        // Remove all message items except the "See all messages" link
        const allMessagesLink = dropdownMenu.lastElementChild;
        dropdownMenu.innerHTML = '';
        dropdownMenu.appendChild(allMessagesLink);  // Re-append the "See all messages" link

        // Slice to get only the last 3 messages
        const lastThreeMessages = messages.slice(-3);

        // Insert each message dynamically
        lastThreeMessages.forEach(message => {
            const messageItem = document.createElement("a");
            messageItem.className = "dropdown-item";
            messageItem.href = "ContactsMessages.html";
            messageItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <img class="rounded-circle" src="../../WhatsApp_Image_2024-11-06_at_17.51.49_8309486c.jpg" alt="" style="width: 40px; height: 40px;">
                    <div class="ms-2">
                        <h6 class="fw-normal mb-0">${message.name} sent you a message</h6>
                        <small>${message.message}</small>
                    </div>
                </div>
            `;
            dropdownMenu.insertBefore(messageItem, allMessagesLink);

            // Add divider line after each message, except for the last one
            const divider = document.createElement("hr");
            divider.className = "dropdown-divider";
            dropdownMenu.insertBefore(divider, allMessagesLink);
        });

    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}


// Call the function to fetch messages when the page loads
document.addEventListener("DOMContentLoaded", fetchMessages);
