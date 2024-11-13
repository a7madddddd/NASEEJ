using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Naseej_Project.DTOs;
using Naseej_Project.Models;

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
                ServiceDate = DateTime.Now
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
        public IActionResult addnewrequest()
        {
            return Ok();
        }


    }
}
