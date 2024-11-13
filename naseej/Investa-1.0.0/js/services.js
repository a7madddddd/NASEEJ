async function servicesuser() {
    debugger
    let url = "http://localhost:25025/api/services/getservicesAccepted";
    const response = await fetch(url);
    let data = await response.json();
  
    let card = document.getElementById("contener");
  
    data.forEach((product) => {
      card.innerHTML += `
            <div class="col-md-6 col-lg-4 col-xl-3 wow fadeInUp" data-wow-delay="0.3s">
                    <div class="service-item bg-light rounded">
                        <div class="service-img">
                            <img src="http://localhost:25025/Uploads/${product.serviceImage}" class="img-fluid w-100 rounded-top" alt="">
                        </div>
                        <div class="service-content text-center p-4">
                            <div class="service-content-inner">
                                <a href="#" class="h4 mb-4 d-inline-flex text-start"><i
                                        class="fas fa-donate fa-2x me-2"></i>${product.serviceName}</a>
                                <p class="mb-4">${product.serviceDescription}
                                </p>
                                <a class="btn btn-light rounded-pill py-2 px-4" href="#">apply</a>
                            </div>
                        </div>
                    </div>
                </div>
             
          `;
    });


  }
  
  servicesuser();