async function contactGet() {
    const url = 'http://localhost:25025/api/Contact/GetAllMessage';
    let response = await fetch(url);
    let data = await response.json();
    console.log('Contacts loaded:', data);

    let contactTable = document.getElementById('Contact');
    data.forEach(element => {
        console.log('Processing contact:', element);
        contactTable.innerHTML += `
                

                        <tr>
                            <th scope="row">${element.contactId}</th>
                            <td>${element.name}</td>
                            <td>${element.email}</td>
                            <td>${element.subject}</td>
                            <td>${element.message}</td>
                            <button class="btn btn-primary" 
			                onclick="redirectToReply(${element.contactId})"> Reply</button>
                        </tr>
                `
    });
}

function redirectToReply(contactId) {
    console.log('Redirecting to reply page with contact ID:', contactId);
    localStorage.setItem('selectedContactId', contactId);
    window.location.href = 'ReplyAdmin.html';
}

contactGet();