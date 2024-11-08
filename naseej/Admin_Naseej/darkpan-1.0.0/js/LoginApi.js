async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('floatingInput').value.trim();
    const passwordHash = document.getElementById('floatingPassword').value;

    // Show loading state on button
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Signing in...';

    // Clear any existing messages
    clearMessages();

    try {
        const response = await fetch("http://localhost:25025/api/EmpolyeeLogin/login", {
            method: "POST",
            headers: {
                "accept": "*/*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                passwordHash: passwordHash
            })
        });

        // First get the response as text
        const responseText = await response.text();
        let data;

        // Try to parse it as JSON
        try {
            data = JSON.parse(responseText);
        } catch {
            // If it's not JSON, use the text directly
            data = { message: responseText };
        }

        if (!response.ok) {
            let errorMsg = "Something went wrong. Please try again.";

            // Customize error messages based on status
            switch (response.status) {
                case 400:
                    errorMsg = "Please check your email and password.";
                    break;
                case 401:
                    errorMsg = "Invalid email or password.";
                    break;
                case 404:
                    errorMsg = "Account not found. Please check your email.";
                    break;
                case 500:
                    errorMsg = "Server error. Please try again later.";
                    break;
            }

            throw new Error(data.message || errorMsg);
        }

        // Show success message
        showMessage('success-message', 'Login successful! Redirecting...', true);

       

        // Wait for 1 second to show the success message before redirecting
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Redirect based on admin status
        if (data.isAdmin) {
            window.location.href = 'index.html';
        } else {
            window.location.href = 'user-dashboard.html';
        }
    } catch (error) {
        console.error("Error during login:", error);
        showMessage('error-message', error.message || "An unexpected error occurred. Please try again.", false);
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

// Show message function
function showMessage(elementId, message, isSuccess = false) {
    clearMessages(); // Clear any existing messages

    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.display = 'block';

        // Add fade-in animation
        messageElement.style.opacity = '0';
        messageElement.style.transition = 'opacity 0.3s ease-in-out';
        setTimeout(() => {
            messageElement.style.opacity = '1';
        }, 10);

        // Optional: Auto-hide error messages after 5 seconds
        if (!isSuccess) {
            setTimeout(() => {
                messageElement.style.opacity = '0';
                setTimeout(() => {
                    messageElement.style.display = 'none';
                }, 300);
            }, 5000);
        }
    }
}

// Clear all messages
function clearMessages() {
    const messages = ['success-message', 'error-message'];
    messages.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
            element.textContent = '';
        }
    });
}

// Clear messages when user starts typing
document.getElementById('floatingInput').addEventListener('input', clearMessages);
document.getElementById('floatingPassword').addEventListener('input', clearMessages);