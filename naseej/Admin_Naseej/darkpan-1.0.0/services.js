async function fetchCardData() {
  const url = "http://localhost:5068/api/services/getallservices";
  const response = await fetch(url);
  const data = await response.json();
  EmployeeId = localStorage.getItem("employeeId");
  document.getElementById("EmployeeId").value = EmployeeId;

  const cardContainer = document.getElementById("container");
  cardContainer.innerHTML = ""; // تفريغ الحاوية قبل إضافة البطاقات

  data.forEach((product) => {
      cardContainer.innerHTML += `
          <div class="col-xl-4 col-md-6 mb-4">
              <div class="card service-card shadow h-100">
                  <!-- صورة الخدمة -->
                  <img src="Uploads/${product.serviceImage}" class="card-img-top" alt="Service Image">
                  
                  <!-- محتوى البطاقة -->
                  <div class="card-body">
                      <h5 class="card-title">${product.serviceName}</h5>
                      <p class="card-text"><strong>Description:</strong> ${product.serviceDescription}</p>
                  </div>
                  

                              <div class="card-footer text-center">
    <div class="dropdown mt-3">
        <select onchange="editstatus(${product.serviceId})"id="status-${product.serviceId}"class="form-select form-select-sm text-uppercase fw-bold shadow-sm custom-dropdown">
            <option value="" class="text-info">${product.isAccept}</option>
            <option value="Pinding" class="text-info">Pinding</option>
            <option value="Accept" class="text-success">Accept</option>
        </select>
    </div>
</div>

                  <!-- أزرار الإجراءات -->
                  <div class="card-footer text-center">

                  
                 
                       
                    <a href="#"  class="btn btn-success"onclick="editservice(${product.serviceId})"><i class="fas fa-edit"></i> Edit</a>
                    <a href="#"  class="btn btn-primary"  onclick="deleteservices(${product.serviceId})"><i class="fas fa-trash"></i> Delete</a>
                            
                  </div>
              </div>
          </div>
      `;
  });

  console.log(data);
}

fetchCardData();





const url = "http://localhost:5068/api/services";
async function addservice() {

  event.preventDefault();
  var form = document.getElementById("addservice");
  var formData = new FormData(form);



  var response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    Swal.fire({
      title: "Success!",
      text: "Registration completed successfully",
      icon: "success",
      confirmButtonText: "OK",
      timer: 3000,
      timerProgressBar: true, 
    });


    setTimeout(() => {
      window.location.href = "servesadmin.html";
    }, 2000);
  } else {
    Swal.fire({
      title: "Error!",
      text: "Registration failed",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}



async function deleteservices(id) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This employee will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (result.isConfirmed) {
      var delet = `http://localhost:5068/api/services/deleteservicesid/${id}`;
      var response = await fetch(delet, {
        method: "DELETE",
      });
  
      console.log("Response Status:", response.status);
      console.log("Response OK:", response.ok);
  
      if (response.ok) {
        await Swal.fire(
          "Deleted!",
          "The employee has been deleted successfully.",
          "success"
        );
        location.reload();
      } else {
        const errorMessage = await response.text();
        await Swal.fire(
          "Error!",
          `There was an error deleting the employee: ${errorMessage}`,
          "error"
        );
      }
    }
  }



  
async function editservice(id) {
    var urll1 = `http://localhost:5068/api/services/getservicesbyid/${id}`;
    var response = await fetch(urll1);
    var employee = await response.json();
  
    document.getElementById("editEmployeeId").value = employee.serviceId;
    document.getElementById("ServiceName").value = employee.serviceName;
    document.getElementById("ServiceDescription").value =
      employee.serviceDescription;
    document.getElementById("batool").src = `Uploads/${employee.serviceImage}`;
  
    $("#editEmployeeModal").modal("show");
  }
  
  async function updateservice() {
    var id = document.getElementById("editEmployeeId").value;
    var url2 = `http://localhost:5068/api/services/editservices/${id}`;
    var formData = new FormData(document.getElementById("serviceEditForm"));
  
    // طباعة بيانات النموذج
  
    var response = await fetch(url2, {
      method: "PUT",
      body: formData,
    });
  
    console.log("Response Status:", response.status);
    console.log("Response OK:", response.ok);
  
    if (response.ok) {
      await Swal.fire({
        title: "Success!",
        text: "Employee updated successfully.",
        icon: "success",
      });
  
      $("#editEmployeeModal").modal("hide"); // إغلاق المودال بعد التحديث
      // الانتظار قبل إعادة تحميل الصفحة
      setTimeout(() => {
        location.reload();
      }, 1000); // الانتظار لمدة 1 ثانية قبل إعادة تحميل الصفحة
    } else {
      const errorMessage = await response.text();
      await Swal.fire({
        title: "Error!",
        text: `Failed to update employee: ${errorMessage}`,
        icon: "error",
      });
    }
  }
  


  
async function editstatus(id) {

    event.preventDefault();
    debugger;
    let urlm = `http://localhost:5068/api/services/editorder/${id}`;
    let newStatus = document.getElementById(`status-${id}`).value;
  
    let response = await fetch(urlm, {
      method: "PUT",
      body: JSON.stringify({
        isAccept: newStatus,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (response.status == 200) {
      alert("Status updated successfully");
  
      // تحديث الحالة في allOrders وتحديث الواجهة
      let order = allOrders.find((order) => order.serviceId === id);
      if (order) {
        order.isAccept = newStatus;
      }
  
      // عرض الطلبات من جديد بناءً على الحالة الجديدة
      displayOrders(allOrders);
    } else {
      alert("Error updating status");
    }
  }
  