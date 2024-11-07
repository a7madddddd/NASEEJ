// start display all admins function here 

fetch("http://localhost:25025/api/Empolyees")
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch admins');
        }
        return response.json();
    })
    .then(data => {
        const tableBody = document.getElementById('adminTableBody');
        tableBody.innerHTML = ''; // Clear any existing rows

        // Iterate over the data and create table rows
        data.forEach((admin) => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = admin.fullName;

            const emailCell = document.createElement('td');
            emailCell.textContent = admin.email;

            const roleCell = document.createElement('td');
            roleCell.textContent = admin.isAdmin ? 'Super Admin' : 'Admin';

            const imageCell = document.createElement('td');
            if (admin.image) {
                const img = document.createElement('img');
                img.src = `http://localhost:25025/${admin.image}`;  // Full path to image
                img.alt = admin.fullName;
                img.style.width = '35px'; // Adjust image size as needed
                img.style.height = '35px';
                img.style.borderRadius = '50px';
                imageCell.appendChild(img);
            } else {
                imageCell.textContent = 'No image available';
            }

            // Append cells to the row
            row.appendChild(nameCell);
            row.appendChild(emailCell);
            row.appendChild(imageCell);
            row.appendChild(roleCell);

            // Append the row to the table body
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert("There was an error fetching the admin data.");
    });

// end function display all admins 





// function to add admins 
document.getElementById("addAdminForm").addEventListener("submit", function (event) {
    event.preventDefault();  // Prevent the form from submitting normally

    // Create a FormData object to capture the form data
    let formData = new FormData();

    // Append form data from input fields
    formData.append("FullName", document.getElementById("exampleInputName").value);
    formData.append("Email", document.getElementById("exampleInputEmail1").value);
    formData.append("PasswordHash", document.getElementById("exampleInputPassword1").value);

    // Append the image file
    let imageFile = document.getElementById("formFile").files[0];
    if (imageFile) {
        formData.append("ImageFile", imageFile);
    }

    // Send the form data using fetch API
    fetch("http://localhost:25025/api/Empolyees", {
        method: "POST",
        body: formData,  // The form data (including image) to send
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => Promise.reject(text));  // Read and reject with the error message
            }
            return response.json();
        })
        .then(data => {
            console.log("Admin added successfully:", data);

            // SweetAlert success message
            Swal.fire({
                icon: 'success',
                title: 'Admin added successfully!',
                text: 'The new admin has been added successfully.',
                confirmButtonText: 'OK'
            });

            // Clear the form after success
            document.getElementById("addAdminForm").reset();
        })
        .catch(error => {
            console.error("Error:", error);

            // SweetAlert error message
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'There was an error with the submission: ' + error,
                confirmButtonText: 'Try Again'
            });
        });
});
// function end here 




