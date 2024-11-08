// Get the selected contact ID from localStorage
const selectedContactId = localStorage.getItem('selectedContactId');

// Function to fetch contact details and populate the form
async function getContactDetails() {
    try {
        const url = `http://localhost:25025/api/Contact/GetMessage/${selectedContactId}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Contact details loaded:', data);

        // Populate form fields
        document.getElementById('email').value = data.email;
        document.getElementById('subject').value = data.subject;

        // Add event listener to form submission
        const form = document.getElementById('Reply-form');
        form.addEventListener('submit', handleSubmit);
    } catch (error) {
        console.error('Error fetching contact details:', error);
        alert('Failed to load contact details. Please try again.');
    }
}



// Handle form submission
async function handleSubmit(event) {
    event.preventDefault();

    const replyMessage = document.getElementById('replayMessage').value;
    const recipientEmail = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;

    if (!replyMessage.trim()) {
        alert('Please enter a reply message');
        return;
    }

    // Create FormData to match API structure
    const formData = new FormData();
    formData.append('ContactId', selectedContactId);
    formData.append('Email', recipientEmail);
    formData.append('Subject', `Reply: ${subject}`);
    formData.append('Message', '');  // Original message content; adjust if needed
    formData.append('MessageReply', replyMessage);

    try {
        // Send the reply to the backend API
        const response = await fetch('http://localhost:25025/api/Contact/PostMessageToEmail', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to send reply message');
        }

        // Clear the form and confirm success
        document.getElementById('replayMessage').value = '';
        alert('Reply sent successfully!');
    } catch (error) {
        console.error('Error sending reply:', error);
        alert('Failed to send reply. Please try again.');
    }
}


// Call the function when the page loads
document.addEventListener('DOMContentLoaded', getContactDetails);
