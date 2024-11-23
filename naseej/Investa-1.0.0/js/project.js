async function project() {
    debugger
    let url = "http://localhost:25025/api/project/getprojectAccepted";
    const response = await fetch(url);
    let data = await response.json();
  
    let card = document.getElementById("project");
  
    data.forEach((product) => {
      card.innerHTML += `
                        <div class="project-img">
                            <img src="http://localhost:25025/project/${product.projectImage}" class="img-fluid w-100 rounded" alt="Image">
                        </div>
                        <div class="project-content bg-light rounded p-4">
                            <div class="project-content-inner">
                                <div class="project-icon mb-3"><i class="fas fa-chart-line fa-4x text-primary"></i></div>
                                <p class="text-dark fs-5 mb-3">${product.projectName}</p>
                                <a href="#" class="h4">${product.projectDescription}</a>
                                <div class="pt-4">
                                    <a class="btn btn-light rounded-pill py-3 px-5" href="#">Read More</a>
                                </div>
                            </div>
                        </div>
             
          `;
    });


  }
  
  project();
  
  