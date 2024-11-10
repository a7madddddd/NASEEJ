function loadEmployeeData() {
    const jwt = sessionStorage.getItem('Token');

    if (jwt) {
        try {
            // Decode JWT payload
            const decodedJWT = JSON.parse(atob(jwt.split('.')[1]));

            const employeeName = decodedJWT.fullName;
            const employeeRole = decodedJWT.isAdmin ? "Super Admin" : "Employee";
            const employeeImagePath = decodedJWT.image; // Get the image path from the JWT payload

            // Ensure image path is correct and replace backslashes with forward slashes for URL
            const imageUrl = `http://localhost:25025/${employeeImagePath.replace("\\", "/")}`;

            // Update HTML for the first container (assuming the container exists)
            const profileImg = document.querySelector('.d-flex.align-items-center.ms-4.mb-4 img');
            const profileName = document.querySelector('.d-flex.align-items-center.ms-4.mb-4 h6');
            const profileRole = document.querySelector('.d-flex.align-items-center.ms-4.mb-4 span');

            if (profileImg) profileImg.src = imageUrl;
            if (profileName) profileName.textContent = employeeName;
            if (profileRole) profileRole.textContent = employeeRole;

            // Update HTML for the navbar image and name
            const navbarImage = document.querySelector('.rounded-circle.me-lg-2'); // Correct class selector
            const navbarNames = document.querySelectorAll('.d-none.d-lg-inline-flex');

            // Check if there is more than one element with this class
            if (navbarNames.length > 1) {
                const secondNavbarName = navbarNames[2]; // The second element in the NodeList
                secondNavbarName.textContent = employeeName; // Update the name of the second element
            }
            
            // Update navbar elements
            if (navbarImage) navbarImage.src = imageUrl;  // Update the image source
            if (navbarName) navbarName.textContent = employeeName; // Update the name

        } catch (error) {
            console.error("Error decoding JWT or updating UI", error);
        }
    }
}

// Call the function when the page is ready
loadEmployeeData();
