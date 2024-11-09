async function Addtestimonial() {
debugger
              event.preventDefault();
              let user = localStorage.getItem("UserID");
              if (user == null || user == undefined) {
                await Swal.fire({
                  icon: "warning",
                  title: "Login Required",
                  text: "You need to be logged in to submit a testimonial.",
                });
                return;
              }
            
              let message = document.getElementById("testimonialtext").value;
              let url = `http://localhost:25025/api/Testimonials/AddTestimonial/${user}`;
              let data = { theTestimonials: message };
            
              let response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
            
              if (response.ok) {
                await Swal.fire({
                  icon: "success",
                  title: "Success!",
                  text: "Testimonial submitted successfully. We are happy to see your testimonial.",
                });
                document.getElementById("testimonialtext").value = "";
              } else {
                await Swal.fire({
                  icon: "error",
                  title: "Submission Failed",
                  text: "Failed to submit the testimonial.",
                });
              }
            }
            