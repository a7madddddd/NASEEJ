async function project() {
    let url = "http://localhost:25025/api/project/getprojectAccepted";
    const response = await fetch(url);
    let data = await response.json();

    let card = document.getElementById("project");
    card.innerHTML = ""; // تفريغ المحتوى القديم

    data.forEach((product) => {
        card.innerHTML += `
            <div class="project-item h-100">
                <div class="project-img">
                    <img src="http://localhost:25025/project/${product.projectImage}" class="img-fluid w-100 rounded" alt="${product.projectName}">
                </div>
                <div class="project-content bg-light rounded p-4">
                    <div class="project-content-inner">
                        <div class="project-icon mb-3"><i class="fas fa-chart-line fa-4x text-primary"></i></div>
                        <p class="text-dark fs-5 mb-3">${product.projectName}</p>
                        <a href="#" class="h4">${product.projectDescription}</a>
                        <div class="pt-4">
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    // إعادة تهيئة الكاروسيل بعد إدخال العناصر
    $('.project-carousel').owlCarousel({
        loop: true,
        margin: 30,
        nav: true,
        dots: false,
        autoplay: true,
        autoplayTimeout: 3000,
        smartSpeed: 1000,
        responsive: {
            0: { items: 1 },
            576: { items: 2 },
            768: { items: 3 },
            992: { items: 4 }
        }
    });
}

project();
