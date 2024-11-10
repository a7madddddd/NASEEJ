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









async function loadTestimonials() {
  try {
    const response = await fetch('http://localhost:25025/api/Testimonials/GetAllTestimonials');
    console.log('Response Status:', response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch testimonials. Status: ${response.status}`);
    }

    const testimonials = await response.json();
    console.log('Testimonials:', testimonials);

    // Filter only accepted testimonials
    const acceptedTestimonials = testimonials.filter(t => t.isaccepted);
    const testimonialContainer = document.querySelector('.testimonial-carousel');
    testimonialContainer.innerHTML = '';

    acceptedTestimonials.forEach(testimonial => {
      const testimonialItem = document.createElement('div');
      testimonialItem.classList.add('testimonial-item', 'bg-white', 'rounded', 'p-4', 'wow', 'fadeInUp');
      testimonialItem.setAttribute('data-wow-delay', '0.3s');

      testimonialItem.innerHTML = `
        <div class="d-flex">
          <div><i class="fas fa-quote-left fa-3x text-dark me-3"></i></div>
          <p class="mt-4">${testimonial.theTestimonials}</p>
        </div>
        <div class="d-flex justify-content-end">
          <div class="my-auto text-end">
            <h5>${testimonial.firstname} ${testimonial.lastname}</h5>
            <p class="mb-0">${testimonial.email}</p>
          </div>
          <div class="bg-white rounded-circle ms-3">
            <img src="${testimonial.imageUrl || '../WhatsApp_Image_2024-11-06_at_17.51.49_8309486c.jpg'}"
              class="rounded-circle p-2" style="width: 80px; height: 80px; border: 1px solid; border-color: var(--bs-primary);" alt="Client Image">
          </div>
        </div>
      `;
      testimonialContainer.appendChild(testimonialItem);
    });

    // Initialize Owl Carousel
    $('.testimonial-carousel').owlCarousel({
      loop: true,
      margin: 10,
      nav: false,
      items: 2,
      autoplay: true,
      autoplayTimeout: 5000,
      dots: true,
      animateOut: 'fadeOut',
      animateIn: 'fadeIn'
    });

  } catch (error) {
    console.error('Error loading testimonials:', error);
    alert("An error occurred while loading testimonials. Please check the console for details.");
  }
}

document.addEventListener('DOMContentLoaded', loadTestimonials);
