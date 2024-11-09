async function populateUserData() {
  // Retrieve the JWT token from sessionStorage
  const token = sessionStorage.getItem("jwtToken");

  if (!token) {
    console.error("JWT token not found in session storage.");
    return;
  }

  try {
    // Decode the JWT to get the userId
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.UserId;  // Assuming 'userId' is stored in the JWT

    // Fetch user data from the API using the userId
    const response = await fetch(`http://localhost:25025/api/Users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Pass JWT in the Authorization header
      }
    });

    if (response.ok) {
      // Parse the JSON response
      const userData = await response.json();

      // Populate the form fields with user data and disable them
      document.getElementById("firstname").value = userData.firstName;
      document.getElementById("firstname").disabled = true;

      document.getElementById("lastname").value = userData.lastName;
      document.getElementById("lastname").disabled = true;

      document.getElementById("email").value = userData.email;
      document.getElementById("email").disabled = true;
    } else {
      console.error("Failed to fetch user data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", populateUserData);

async function sendMessage(event) {
  event.preventDefault();  // Prevent the default form submission behavior

  // Get the JWT token from sessionStorage
  let token = sessionStorage.getItem("jwtToken");

  // Check if the user is logged in
  if (!token) {
    await Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "You need to be logged in to send a message.",
    });
    return;
  }

  // Decode the JWT to get the userId
  const decodedToken = jwt_decode(token);
  const userId = decodedToken.UserId;  // Assuming 'userId' is in the token

  // Get the user data and message from the form inputs
  const firstName = document.getElementById("firstname").value;
  const lastName = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("theTestimonials").value;

  // Prepare the data object
  let url = `http://localhost:25025/api/Testimonials/AddTestimonial/${userId}`;
  let data = {
    firstName,
    lastName,
    email,
    message
  };

  // Send the POST request with the token in the Authorization header
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`  // Pass the JWT token in the Authorization header
    },
    body: JSON.stringify(data),
  });

  // Check the response and display appropriate alerts
  if (response.ok) {
    await Swal.fire({
      icon: "success",
      title: "Message Sent",
      text: "Your message has been sent successfully.",
    });
    // Clear the message input field
    document.getElementById("theTestimonials").value = "";
  } else {
    await Swal.fire({
      icon: "error",
      title: "Submission Failed",
      text: "Failed to send your message.",
    });
  }
}

// Bind the function to the form submission
document.getElementById("contact-form").addEventListener("submit", sendMessage);
