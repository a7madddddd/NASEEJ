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
                // المسار المخصص الذي تريد حفظ الملف فيه
                var customFolderPath = @"C:\Users\almom\OneDrive\سطح المكتب\nnnnnn\Naseej\naseej\Admin_Naseej\darkpan-1.0.0\Uploads";

                // التأكد من وجود المجلد، وإذا لم يكن موجودًا يتم إنشاؤه
                if (!Directory.Exists(customFolderPath))
                {
                    Directory.CreateDirectory(customFolderPath);
                }

                // اسم الملف الفريد لتجنب التعارض
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(product.ServiceImage.FileName);

                // المسار الكامل للملف
                var filePath = Path.Combine(customFolderPath, fileName);

                // حفظ الملف في المسار المحدد
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    product.ServiceImage.CopyTo(stream);
                }

                // حفظ اسم الملف فقط في قاعدة البيانات
                service.ServiceImage = fileName;
            }

            // حفظ الخدمة في قاعدة البيانات
            _Db.Services.Add(service);
            _Db.SaveChanges();

            return Ok(service);
        }
        [HttpPut("editservices/{id}")]
        public IActionResult updatecategory(int id, [FromForm] addservicesDTO obj)
        {
            // البحث عن الخدمة في قاعدة البيانات
            var service = _Db.Services.Find(id);
            if (service == null)
            {
                return NotFound("Service not found.");
            }

            // تحديد المسار لحفظ الصور
            var uploadImageFolder = @"C:\Users\almom\OneDrive\سطح المكتب\nnnnnn\Naseej\naseej\Admin_Naseej\darkpan-1.0.0\Uploads";

            // التأكد من وجود المجلد، وإن لم يكن موجودًا يتم إنشاؤه
            if (!Directory.Exists(uploadImageFolder))
            {
                Directory.CreateDirectory(uploadImageFolder);
            }

            // حفظ الصورة إذا تم رفعها
            if (obj.ServiceImage != null && obj.ServiceImage.Length > 0)
            {
                // إنشاء المسار الكامل للصورة
                var imageFilePath = Path.Combine(uploadImageFolder, obj.ServiceImage.FileName);

                // حفظ الصورة في المجلد المحدد
                using (var stream = new FileStream(imageFilePath, FileMode.Create))
                {
                    obj.ServiceImage.CopyTo(stream);
                }

                // تحديث اسم الصورة في قاعدة البيانات
                service.ServiceImage = obj.ServiceImage.FileName;
            }

            // تحديث اسم الخدمة والوصف إذا تم تقديمهما
            service.ServiceName = obj.ServiceName ?? service.ServiceName;
            service.ServiceDescription = obj.ServiceDescription ?? service.ServiceDescription;

            // حفظ التغييرات في قاعدة البيانات
            _Db.Services.Update(service);
            _Db.SaveChanges();

            return Ok("Service updated successfully.");
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



    }
}
