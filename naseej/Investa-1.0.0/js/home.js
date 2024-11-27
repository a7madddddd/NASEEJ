


document.addEventListener("DOMContentLoaded", async () => {
    const teamContainer = document.getElementById("team-container");

    try {
        const response = await fetch('http://localhost:25025/api/Empolyees');
        let employees = await response.json();

        // Sort employees: Admins first
        employees.sort((a, b) => b.isAdmin - a.isAdmin);

        // Generate HTML for each employee
        employees.forEach(employee => {
            const teamItem = `
    <div class="col-sm-6 col-md-6 col-lg-4 col-xl-3 wow fadeInUp" data-wow-delay="0.1s">
        <div class="team-item rounded">
            <div class="team-img">
                <img src="http://localhost:25025/${employee.image}" class="img-fluid w-100 rounded-top" alt="${employee.fullName}">
                    <div class="team-icon">
                        <a class="btn btn-primary btn-sm-square text-white rounded-circle mb-3" href=""><i
                            class="fas fa-share-alt"></i></a>
                        <div class="team-icon-share">
                            <a class="btn btn-primary btn-sm-square text-white rounded-circle mb-3" href=""><i
                                class="fab fa-facebook-f"></i></a>
                            <a class="btn btn-primary btn-sm-square text-white rounded-circle mb-3" href=""><i
                                class="fab fa-twitter"></i></a>
                            <a class="btn btn-primary btn-sm-square text-white rounded-circle mb-0" href=""><i
                                class="fab fa-instagram"></i></a>
                        </div>
                    </div>
            </div>
            <div class="team-content bg-dark text-center rounded-bottom p-4">
                <div class="team-content-inner rounded-bottom">
                    <h4 class="text-white">${employee.fullName}</h4>
                    <p class="text-muted mb-0">${employee.email}</p>
                </div>
            </div>
        </div>
    </div>
    `;

            // Append the team item to the container
            teamContainer.innerHTML += teamItem;
        });
    } catch (error) {
        console.error("Failed to fetch employees:", error);
        teamContainer.innerHTML = "<p class='text-danger'>Failed to load team members.</p>";
    }
});


