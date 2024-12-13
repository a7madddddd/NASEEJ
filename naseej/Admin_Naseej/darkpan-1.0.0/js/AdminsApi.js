// start display all admins function here

fetch("http://localhost:25025/api/Empolyees")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch admins");
    }
    return response.json();
  })
  .then((data) => {
    const tableBody = document.getElementById("adminTableBody");
    tableBody.innerHTML = ""; // Clear any existing rows

    // Iterate over the data and create table rows
    data.forEach((admin) => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = admin.fullName;

      const emailCell = document.createElement("td");
      emailCell.textContent = admin.email;

      const roleCell = document.createElement("td");
      roleCell.textContent = admin.isAdmin ? "Super Admin" : "Admin";

      const imageCell = document.createElement("td");
      if (admin.image) {
        const img = document.createElement("img");
        img.src = `http://localhost:25025/${admin.image}`; // Full path to image
        img.alt = admin.fullName;
        img.style.width = "35px"; // Adjust image size as needed
        img.style.height = "35px";
        img.style.borderRadius = "50px";
        imageCell.appendChild(img);
      } else {
        imageCell.textContent = "No image available";
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
  .catch((error) => {
    console.error("Error:", error);
    alert("There was an error fetching the admin data.");
  });

// end function display all admins

// function to add admins
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById("addAdminForm");
  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      try {
        // Get form elements with null checks
        const emailInput = document.getElementById("exampleInputEmail1");
        const nameInput = document.getElementById("exampleInputName");
        const passwordInput = document.getElementById("exampleInputPassword1");
        const superAdminCheckbox = document.getElementById("isSuperAdmin");
        const imageFileInput = document.getElementById("formFile");

        // Validate form elements exist
        if (!emailInput || !nameInput || !passwordInput || !superAdminCheckbox) {
          throw new Error("Form elements are missing. Please check the page.");
        }

        // Normalize email
        const email = emailInput.value.trim().toLowerCase();

        // Validate email
        if (!email) {
          throw new Error("Email is required.");
        }

        // Check if email exists
        const emailExists = await fetch(
          `http://localhost:25025/api/Empolyees/CheckEmailExists?email=${encodeURIComponent(email)}`
        )
          .then((response) => response.json())
          .catch((error) => {
            console.error("Error checking email:", error);
            throw new Error("There was an error checking the email.");
          });

        // If email exists, show error and stop
        if (emailExists) {
          await Swal.fire({
            icon: "error",
            title: "Error!",
            text: "An employee with this email already exists. Please use a different email.",
            confirmButtonText: "OK"
          });
          return;
        }

        // Create FormData object
        let formData = new FormData();

        // Append form data
        formData.append("FullName", nameInput.value);
        formData.append("Email", email);
        formData.append("PasswordHash", passwordInput.value);
        formData.append("IsAdmin", superAdminCheckbox.checked);

        // Handle image file
        const imageFile = imageFileInput.files[0];
        if (imageFile) {
          formData.append("ImageFile", imageFile);
        }

        // Send form data
        const response = await fetch("http://localhost:25025/api/Empolyees", {
          method: "POST",
          body: formData
        });

        // Check response
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to add admin");
        }

        // Parse response
        const data = await response.json();
        console.log("Admin added successfully:", data);

        // Show success message
        await Swal.fire({
          icon: "success",
          title: "Admin added successfully!",
          text: "The new admin has been added successfully.",
          confirmButtonText: "OK"
        });

        // Reset form
        form.reset();

        // Optionally refresh the page
        location.reload();

      } catch (error) {
        // Handle any errors during the process
        console.error("Error:", error);

        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "There was an error with the submission: " + error.message,
          confirmButtonText: "Try Again"
        });
      }
    });
  } else {
    console.error("Add Admin form not found on the page.");
  }
});
// function end here

// Populate the dropdown on page load
document.addEventListener("DOMContentLoaded", () => {
  populateEmployeeDropdowns();
});

// Populate both dropdowns with employees
// Populate both dropdowns with employees, excluding admins from the delete dropdown

// start edit admins function
// start edit admins function
// start edit admins function
document.addEventListener("DOMContentLoaded", function () {
  const employeeDropdown = document.getElementById("employeeDropdown");
  const form = document.getElementById("EditEmployeeForm");
  const superAdminCheckbox = document.getElementById("EditSuperAdminCheck");

  // Populate dropdown with employees
  function populateEmployeeDropdown() {
    fetch("http://localhost:25025/api/Empolyees")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(employees => {
        employeeDropdown.innerHTML = '<option value="">Select an Admin</option>';
        employees.forEach(employee => {
          const option = document.createElement("option");
          option.value = employee.employeeId;
          option.textContent = `${employee.fullName} (${employee.email})`;
          employeeDropdown.appendChild(option);
        });
      })
      .catch(error => {
        console.error("Error fetching employees:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Could not load employees",
          confirmButtonText: "OK"
        });
      });
  }

  // Populate dropdown on page load
  populateEmployeeDropdown();

  // Handle employee selection to populate form fields
  employeeDropdown.addEventListener("change", function () {
    const selectedEmployeeId = employeeDropdown.value;
    if (!selectedEmployeeId) return;

    fetch(`http://localhost:25025/api/Empolyees/${selectedEmployeeId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((employee) => {
        console.log("Employee data received:", employee);

        // Populate form fields with employee details
        document.getElementById("EditEmployeeName").value = employee.fullName || '';
        document.getElementById("EditEmployeeEmail1").value = employee.email || '';

        // Check if `isAdmin` exists and log its type and value
        if (typeof employee.isAdmin !== "undefined") {
          console.log(`isAdmin value: ${employee.isAdmin}, type: ${typeof employee.isAdmin}`);
          superAdminCheckbox.checked = !!employee.isAdmin;
          console.log("Checkbox checked state updated:", superAdminCheckbox.checked);
        } else {
          console.error("'isAdmin' property not found in employee data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching employee details:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Could not load employee details",
          confirmButtonText: "OK"
        });
      });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const employeeDropdown = document.getElementById("employeeDropdown");
  const form = document.getElementById("EditEmployeeForm");
  const superAdminCheckbox = document.getElementById("EditSuperAdminCheck");

  // Populate dropdown with employees
  function populateEmployeeDropdown() {
    fetch("http://localhost:25025/api/Empolyees")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(employees => {
        employeeDropdown.innerHTML = '<option value="">Select an Admin</option>';
        employees.forEach(employee => {
          const option = document.createElement("option");
          option.value = employee.employeeId;
          option.textContent = `${employee.fullName} (${employee.email})`;
          employeeDropdown.appendChild(option);
        });
      })
      .catch(error => {
        console.error("Error fetching employees:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Could not load employees",
          confirmButtonText: "OK"
        });
      });
  }

  // Populate dropdown on page load
  populateEmployeeDropdown();

  // Handle employee selection to populate form fields
  employeeDropdown.addEventListener("change", function () {
    const selectedEmployeeId = employeeDropdown.value;
    if (!selectedEmployeeId) return;

    fetch(`http://localhost:25025/api/Empolyees/${selectedEmployeeId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((employee) => {
        console.log("Employee data received:", employee);

        // Populate form fields with employee details
        document.getElementById("EditEmployeeName").value = employee.fullName || '';
        document.getElementById("EditEmployeeEmail1").value = employee.email || '';

        // Check if `isAdmin` exists and log its type and value
        if (typeof employee.isAdmin !== "undefined") {
          console.log(`isAdmin value: ${employee.isAdmin}, type: ${typeof employee.isAdmin}`);
          superAdminCheckbox.checked = !!employee.isAdmin;
          console.log("Checkbox checked state updated:", superAdminCheckbox.checked);
        } else {
          console.error("'isAdmin' property not found in employee data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching employee details:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Could not load employee details",
          confirmButtonText: "OK"
        });
      });
  });


  // Form submission logic
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);

    // Append selected employee ID to form data
    const selectedEmployeeId = employeeDropdown.value;
    if (!selectedEmployeeId) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please select an employee to edit.",
        confirmButtonText: "OK"
      });
    }

    // Explicitly set IsAdmin in formData
    formData.set("IsAdmin", superAdminCheckbox.checked);

    fetch(`http://localhost:25025/api/Empolyees/${selectedEmployeeId}`, {
      method: "PUT",
      body: formData
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => Promise.reject(text));
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          return {};
        }
      })
      .then((data) => {
        Swal.fire({
          icon: "success",
          title: "Employee updated successfully!",
          text: "The employee details have been updated.",
          confirmButtonText: "OK"
        }).then(() => {
          // Refresh the page or update the dropdown
          populateEmployeeDropdown();

          // Reset the form
          form.reset();


          // Close the modal using Bootstrap's modal method
          if (editAdminModal) {
            const modalInstance = bootstrap.Modal.getInstance(editAdminModal);
            if (modalInstance) {
              modalInstance.hide();
            } else {
              // Fallback method
              $(editAdminModal).modal('hide');
            }
          }
          // Reload the page
          location.reload();
        });
      })
      .catch((error) => {
        console.error("Error updating employee:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: `There was an error with the update: ${error}`,
          confirmButtonText: "Try Again"
        });
      });
  });
});
// end edit admins function




function populateEmployeeDropdowns() {
  fetch("http://localhost:25025/api/Empolyees")
    .then((response) => response.json())
    .then((data) => {
      const editDropdown = document.getElementById("employeeDropdown");
      const deleteDropdown = document.getElementById("adminDropdown");

      if (!editDropdown || !deleteDropdown) {
        console.error("Dropdown elements not found");
        return;
      }

      // Reset the dropdowns
      editDropdown.innerHTML = '<option value="">Select an Admin</option>';
      deleteDropdown.innerHTML =
        '<option value="">-- Select an Admin --</option>';

      data.forEach((employee) => {
        const optionEdit = document.createElement("option");
        const optionDelete = document.createElement("option");

        // Set option values and text content for edit dropdown
        optionEdit.value = employee.employeeId;
        optionEdit.textContent = `${employee.fullName} (${employee.email})`;
        editDropdown.appendChild(optionEdit);

        // Add all employees to delete dropdown, including admins
        optionDelete.value = employee.employeeId;
        optionDelete.textContent = `${employee.fullName} (${employee.email})`;
        deleteDropdown.appendChild(optionDelete);
      });
    })
    .catch((error) => {
      console.error("Error fetching employee data:", error);
    });
}

// Handle Delete Button Click
document.getElementById("deleteButton").addEventListener("click", async () => {
  const employeeId = document.getElementById("adminDropdown").value;

  if (!employeeId) {
    Swal.fire("Warning", "Please select an Admin to delete", "warning");
    return;
  }

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to undo this action!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:25025/api/Empolyees/${employeeId}`, {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The employee has been deleted successfully.",
          confirmButtonText: "OK"
        }).then(() => {
          // Refresh the page after the user clicks "OK"
          location.reload();
        });
        // Close the modal if it's open
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteAdminModal'));
        if (deleteModal) {
          deleteModal.hide();
        }

        // Refresh the dropdowns
        populateEmployeeDropdowns();

      } catch (error) {
        console.error("Error deleting Admin:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete the Admin. Please try again.",
          confirmButtonText: "OK"
        });
      }
    }
  });
});
