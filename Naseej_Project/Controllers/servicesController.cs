using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Naseej_Project.DTOs;
using Naseej_Project.Models;
using NuGet.Protocol.Core.Types;

namespace Naseej_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class servicesController : ControllerBase
    {
        private readonly MyDbContext _Db;
        public servicesController(MyDbContext db)
        {
            _Db = db;
        }

        [HttpGet("getallservices")]
        public IActionResult getallservices()
        {
            var services = _Db.Services.ToList();
            return Ok(services);
        }
        [HttpPost]
        public IActionResult AddServices([FromForm] addservicesDTO product)
        {
            var service = new Service
            {
                ServiceName = product.ServiceName,
                ServiceDescription = product.ServiceDescription,
                EmployeeId = product.EmployeeId,
                ServiceDate = DateTime.Now,
                Fromage=product.Fromage,
                Toage=product.Toage,

            };

            // التأكد من وجود ملف الصورة
            if (product.ServiceImage != null && product.ServiceImage.Length > 0)
            {
                try
                {
                    // تحديد مسار المجلد في wwwroot
                    var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads");

                    // التأكد من وجود المجلد، وإذا لم يكن موجودًا يتم إنشاؤه
                    if (!Directory.Exists(uploadsFolderPath))
                    {
                        Directory.CreateDirectory(uploadsFolderPath);
                    }

                    // اسم الملف الفريد لتجنب التعارض
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(product.ServiceImage.FileName);

                    // المسار الكامل للملف داخل wwwroot
                    var filePath = Path.Combine(uploadsFolderPath, fileName);

                    // حفظ الملف في المجلد المحدد
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        product.ServiceImage.CopyTo(stream);
                    }

                    // حفظ المسار النسبي للصورة في قاعدة البيانات
                    service.ServiceImage = $"{fileName}";
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"خطأ أثناء رفع الصورة: {ex.Message}");
                }
            }

            // حفظ الخدمة في قاعدة البيانات
            _Db.Services.Add(service);
            _Db.SaveChanges();

            return Ok(service);
        }


        [HttpPut("editservices/{id}")]
        public IActionResult UpdateService(int id, [FromForm] addservicesDTO obj)
        {
            // البحث عن الخدمة في قاعدة البيانات
            var service = _Db.Services.Find(id);
            if (service == null)
            {
                return NotFound("Service not found.");
            }
            
            try
            {
                // تحديث اسم الخدمة والوصف إذا تم تقديمهما
                service.ServiceName = obj.ServiceName ?? service.ServiceName;
                service.ServiceDescription = obj.ServiceDescription ?? service.ServiceDescription;
                service.Fromage=obj.Fromage ?? service.Fromage;
                service.Toage = obj.Toage ?? service.Toage;

                // تحديد مسار المجلد لحفظ الصور في wwwroot
                var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads");

                // التأكد من وجود المجلد، وإذا لم يكن موجودًا يتم إنشاؤه
                if (!Directory.Exists(uploadsFolderPath))
                {
                    Directory.CreateDirectory(uploadsFolderPath);
                }

                // تحديث الصورة إذا تم رفعها
                if (obj.ServiceImage != null && obj.ServiceImage.Length > 0)
                {
                    // اسم الملف الفريد لتجنب التعارض
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(obj.ServiceImage.FileName);

                    // المسار الكامل للملف داخل wwwroot
                    var filePath = Path.Combine(uploadsFolderPath, fileName);

                    // حفظ الملف في المجلد المحدد
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        obj.ServiceImage.CopyTo(stream);
                    }

                    // حفظ المسار النسبي للصورة في قاعدة البيانات
                    service.ServiceImage = $"{fileName}";
                }

                // حفظ التغييرات في قاعدة البيانات
                _Db.Services.Update(service);
                _Db.SaveChanges();

                return Ok("Service updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error while updating the service: {ex.Message}");
            }
        }



        [HttpDelete("deleteservicesid/{id}")]
        public IActionResult deleteservices(int id)
        {
            if (id <= 0)
            {
                return BadRequest();
            }
            var Servic = _Db.Services.FirstOrDefault(c => c.ServiceId == id);
            if (Servic == null)
            {
                return NotFound();
            }

            _Db.Services.Remove(Servic);
            _Db.SaveChanges();
            return NoContent();
        }

        [HttpGet("getallemployeebyid/{id}")]
        public IActionResult getallemployee(int id)
        {var x = _Db.Employees.Where(x=>x.EmployeeId==id);
            return Ok(x);
        }


        [HttpGet("getservicesbyid/{id}")]
        public IActionResult getusersid(int id)
        {
            var user = _Db.Services.Find(id);



            return Ok(user);
        }



        [HttpPut("editorder/{id}")]
        public IActionResult editorder(int id, editservicesstatus DTO)
        {
            var edit = _Db.Services.Where(x => x.ServiceId == id).FirstOrDefault();
            edit.IsAccept = DTO.IsAccept;
            _Db.Services.Update(edit);
            _Db.SaveChanges();

       
            return Ok(edit);
        }


        [HttpGet("getservicesAccepted")]
        public IActionResult getservices()
        {
            var sercice = _Db.Services.Where(x=>x.IsAccept== "Accept").ToList();
            return Ok(sercice);
        }



        /////////////////////////////////request//////////

        [HttpPost("addnewrequest")]
        public IActionResult addnewrequest([FromForm] NewRequestDTO DTO)
        {
            var user = _Db.Users.FirstOrDefault(u => u.UserId == DTO.UserId);
            var service = _Db.Services.FirstOrDefault(s => s.ServiceId == DTO.ServiceId);
        
            var request = new Request
            {
                UserId = DTO.UserId,
                ServiceId = DTO.ServiceId,
                RequestDate = DateTime.Now,
                Description = DTO.Description,
            };
            
            _Db.Requests.Add(request);
            _Db.SaveChanges();
            return Ok();
        }


        [HttpGet("getinfouserandservices/{userId}/{serviceId}")]
        public IActionResult GetUserAndServiceInfo(int userId, int serviceId)
        {
            var user = _Db.Users.FirstOrDefault(u => u.UserId == userId);

            var service = _Db.Services.FirstOrDefault(s => s.ServiceId == serviceId);


            if (user.Age < service.Fromage || user.Age > service.Toage)
            {
                return BadRequest("User age is not within the allowed range for this service");
            }
            var result = new
            {
                User = new
                {
                    user.UserId,
                Fullname= user.FirstName+" " + user.LastName,
                    user.Email,
                    user.Age,
                    user.PhoneNumber,
                },
                Service = new
                {
                    service.ServiceId,
                    service.ServiceName,
                    service.ServiceDescription,
                    service.Fromage,
                    service.Toage
                }
            };

            return Ok(result);
        }



        [HttpGet("GetAllRequest")]
        public IActionResult GetAllRequest()
        {
            var requests = _Db.Requests
                .Include(r => r.User)
                .Include(r => r.Service)
                .Select(r => new
                {
                    RequestId = r.RequestId,
                    RequestDate = r.RequestDate,
                    Description = r.Description,
                    UserId = r.User.UserId,
                    FullName = r.User.FirstName+" "+r.User.LastName,
                    Email = r.User.Email,
                    PhoneNumber = r.User.PhoneNumber,
                    Age=r.User.Age,
                    Nationality = r.User.Nationality,
                    Degree=r.User.Degree,
                    ServiceId = r.Service.ServiceId,
                    ServiceName = r.Service.ServiceName,
                    ServiceDescription = r.Service.ServiceDescription,
                    fromage=r.Service.Fromage,
                    toage=r.Service.Toage,
                })
                .ToList();

            return Ok(requests);
        }
        [HttpDelete("deleteRequest/{id}")]
        public IActionResult deleteRequest(int id)
        {
            if (id <= 0)
            {
                return BadRequest();
            }
            var Request = _Db.Requests.FirstOrDefault(c => c.RequestId == id);
            if (Request == null)
            {
                return NotFound();
            }

            _Db.Requests.Remove(Request);
            _Db.SaveChanges();
            return NoContent();
        }






    }
}
