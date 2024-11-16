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





async function displayContactMessages() {
    try {
        // Fetch data from the API
        const response = await fetch('http://localhost:25025/api/Contact/GetAllMessage');
        if (!response.ok) {
            throw new Error('Error fetching contact messages');
        }
        const messages = await response.json();

        // Get the last 3 messages in reverse order (newest first)
        const lastThreeMessages = messages.slice(-3).reverse();

        // Get the dropdown menu container
        const dropdownMenu = document.querySelector('.nav-item .dropdown-menu');
        if (!dropdownMenu) {
            console.error('Dropdown menu not found');
            return;
        }

        // Clear existing dropdown items
        dropdownMenu.innerHTML = '';

        // Add new dropdown items
        lastThreeMessages.forEach((message) => {
            const dropdownItem = document.createElement('a');
            dropdownItem.classList.add('dropdown-item');
            dropdownItem.href = 'ContactsMessages.html';

            const messageDiv = document.createElement('div');
            messageDiv.classList.add('d-flex', 'align-items-center');

            const avatarImg = document.createElement('img');
            avatarImg.classList.add('rounded-circle');
            avatarImg.src = 'img/user.jpg';
            avatarImg.alt = '';
            avatarImg.style.width = '40px';
            avatarImg.style.height = '40px';

            const messageContentDiv = document.createElement('div');
            messageContentDiv.classList.add('ms-2');

            const messageHeader = document.createElement('h6');
            messageHeader.classList.add('fw-normal', 'mb-0');
            messageHeader.textContent = `${message.name ? message.name : 'Anonymous'} - ${message.email ? message.email : 'No email available'}`;

            const messageTimestamp = document.createElement('small');
            messageTimestamp.textContent = message.message ? message.message.substring(0, 30) + (message.message.length > 30 ? '...' : '') : 'No message available';

            messageContentDiv.appendChild(messageHeader);
            messageContentDiv.appendChild(messageTimestamp);
            messageDiv.appendChild(avatarImg);
            messageDiv.appendChild(messageContentDiv);
            dropdownItem.appendChild(messageDiv);
            dropdownMenu.appendChild(dropdownItem);
        });

        // Update the messages link
        const messagesLink = document.querySelector('a[href="ContactsMessages.html"]');
        if (messagesLink) {
            messagesLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'ContactsMessages.html';
            });
        }
    } catch (error) {
        console.error('Error fetching contact messages:', error);
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', displayContactMessages);






//////////logout function/////////////
// Add click event listener to logout button
document.addEventListener('DOMContentLoaded', function () {
    // Find the logout link in the admin dropdown
    const logoutButton = Array.from(document.querySelectorAll('.dropdown-item'))
        .find(item => item.textContent === 'Log Out');

    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
});

// Logout handler function
function handleLogout(event) {
    event.preventDefault(); // Prevent default link behavior

    // Remove token from session storage
    sessionStorage.removeItem('Token');

    // Redirect to login page
    window.location.href = 'signin.html'; // Change this to your login page URL
}