const jwtToken = sessionStorage.getItem('jwtToken');

const loginLogoutBtn = document.getElementById('loginLogoutBtn');

if (jwtToken) {
    loginLogoutBtn.textContent = 'Logout';
    loginLogoutBtn.href = 'index.html'; 
    loginLogoutBtn.addEventListener('click', function () {
        
        sessionStorage.removeItem('jwtToken');
        window.location.reload();
    });
}


