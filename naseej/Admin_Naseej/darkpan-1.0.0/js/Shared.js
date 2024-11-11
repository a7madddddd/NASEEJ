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