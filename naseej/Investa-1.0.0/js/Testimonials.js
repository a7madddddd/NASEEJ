// Function to get claims from token
function getClaimsFromToken(token) {
  try {
    const decodedToken = jwt_decode(token);
    return {
      // Map standard .NET ClaimTypes to their full URIs
      userId: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      email: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      firstName: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"],
      lastName: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"]
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    throw new Error("Invalid token format");
  }
}

// Function to handle form submission
async function handleTestimonialSubmit(event) {
  event.preventDefault();

  const token = sessionStorage.getItem("jwtToken");
  if (!token) {
    await Swal.fire({
      icon: 'warning',
      title: 'Authentication Required',
      text: 'Please log in to submit a testimonial'
    });
    return;
  }

  try {
    const claims = getClaimsFromToken(token);

    // Create testimonial data object
    const testimonialData = {
      userId: parseInt(claims.userId), // Convert to number since it comes as string
      firstname: claims.firstName,
      lastname: claims.lastName,
      email: claims.email,
      theTestimonials: document.getElementById('theTestimonials').value.trim()
    };

    // Validate message
    if (!testimonialData.theTestimonials) {
      await Swal.fire({
        icon: 'warning',
        title: 'Empty Message',
        text: 'Please enter your testimonial message'
      });
      return;
    }

    // Submit testimonial
    const response = await fetch(`http://localhost:25025/api/Testimonials/AddTestimonial/${claims.userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testimonialData)
    });

    if (!response.ok) {
      throw new Error('Failed to submit testimonial');
    }

    // Show success message
    await Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Your testimonial has been submitted successfully'
    });

    // Clear the message field
    document.getElementById('theTestimonials').value = '';

  } catch (error) {
    console.error('Error:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to submit testimonial. Please try again.'
    });
  }
}

// Function to populate form with user data from token
function populateUserDataFromToken() {
  const token = sessionStorage.getItem("jwtToken");
  if (!token) {
    console.error("No token found");
    return;
  }

  try {
    const claims = getClaimsFromToken(token);

    // Populate and disable form fields
    document.getElementById('firstname').value = claims.firstName;
    document.getElementById('firstname').disabled = true;

    document.getElementById('lastname').value = claims.lastName;
    document.getElementById('lastname').disabled = true;

    document.getElementById('email').value = claims.email;
    document.getElementById('email').disabled = true;

  } catch (error) {
    console.error("Error populating form:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load user information'
    });
  }
}

// Initialize everything when document loads
document.addEventListener('DOMContentLoaded', () => {
  populateUserDataFromToken();

  const form = document.getElementById('testimonialForm');
  if (form) {
    form.addEventListener('submit', handleTestimonialSubmit);
  }
});

// Test function to verify token parsing
function testTokenParsing() {
  const token = sessionStorage.getItem("jwtToken");
  if (token) {
    try {
      const claims = getClaimsFromToken(token);
      console.log("Parsed claims:", {
        userId: claims.userId,
        email: claims.email,
        firstName: claims.firstName,
        lastName: claims.lastName
      });
    } catch (error) {
      console.error("Token parsing test failed:", error);
    }
  } else {
    console.log("No token found in sessionStorage");
  }
}








