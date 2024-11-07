using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Operations;
using Microsoft.EntityFrameworkCore;
using Naseej_Project.DTOs;
using Naseej_Project.Models;
using BCrypt.Net;
namespace Naseej_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpolyeesController : ControllerBase
    {

        private readonly MyDbContext _db;

        public EmpolyeesController(MyDbContext db)
        {
            _db = db;
        }

        // GET: api/Employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmpolyeesDTO>>> GetEmployees()
        {
            return await _db.Employees
                .Select(e => new EmpolyeesDTO
                {
                    FullName = e.FullName,
                    Email = e.Email,
                    Image = e.Image,
                    PasswordHash = e.PasswordHash,
                    PasswordSalt = e.PasswordSalt,
                    IsAdmin = e.IsAdmin,
                })
                .ToListAsync();
        }

        // GET: api/Employees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EmpolyeesDTO>> GetEmployee(int id)
        {
            var employee = await _db.Employees.FindAsync(id);

            if (employee == null)
            {
                return NotFound();
            }

            return new EmpolyeesDTO
            {
                FullName = employee.FullName,
                Email = employee.Email,
                Image = employee.Image,
                PasswordHash = employee.PasswordHash,
                PasswordSalt = employee.PasswordSalt
            };
        }



        /// <summary>
        /// ///////
        /// </summary>
        /// <param name="employeesDto"></param>
        /// <param name="imageFile"></param>
        /// <returns></returns>
        // POST: api/Employees
        [HttpPost]
        public async Task<ActionResult> CreateAdmin([FromForm] EmpolyeesDTO employeesDto, [FromForm] IFormFile imageFile)
        {
            try
            {
                employeesDto.IsAdmin = false;

                // Hash the password using BCrypt
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(employeesDto.PasswordHash);
                employeesDto.PasswordHash = passwordHash;  // Update the passwordHash field with the hashed password

                if (imageFile != null && imageFile.Length > 0)
                {
                    var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "EmployeeImages");
                    Directory.CreateDirectory(uploadsFolderPath);  // Ensure the directory exists

                    var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                    var filePath = Path.Combine(uploadsFolderPath, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(fileStream);
                    }

                    employeesDto.Image = Path.Combine("EmployeeImages", uniqueFileName);  // Store the relative image path in the database
                }

                var employee = new Employee
                {
                    FullName = employeesDto.FullName,
                    Email = employeesDto.Email,
                    PasswordHash = employeesDto.PasswordHash,  // The hashed password
                    PasswordSalt = employeesDto.PasswordSalt,  // This can be omitted if you use BCrypt (as BCrypt includes the salt in the hash)
                    Image = employeesDto.Image,
                    IsAdmin = employeesDto.IsAdmin,
                };

                _db.Employees.Add(employee);
                await _db.SaveChangesAsync();

                return CreatedAtAction(nameof(GetEmployee), new { id = employee.EmployeeId }, employeesDto);
            }
            catch (Exception ex)
            {
                // Log the exception for further diagnosis
                return StatusCode(500, "Internal server error occurred while creating admin.");
            }
        }






        /// <summary>
        /// ///////////
        /// </summary>
        /// <param name="id"></param>
        /// <param name="employeesDto"></param>
        /// <param name="imageFile"></param>
        /// <returns></returns>
        // PUT: api/Employees/5

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromForm] EmpolyeesDTO employeesDto, IFormFile imageFile)
        {
            var employee = await _db.Employees.FindAsync(id);

            if (employee == null)
            {
                return NotFound();
            }

            employee.FullName = employeesDto.FullName;
            employee.Email = employeesDto.Email;
            employee.PasswordHash = employeesDto.PasswordHash;
            employee.PasswordSalt = employeesDto.PasswordSalt;

            if (imageFile != null && imageFile.Length > 0)
            {
                // Define the directory path for storing images
                var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "EmployeeImages");
                Directory.CreateDirectory(uploadsFolderPath);

                // Delete the old image file if it exists
                if (!string.IsNullOrEmpty(employee.Image))
                {
                    var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", employee.Image);
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                // Generate a unique file name for the new image
                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                var filePath = Path.Combine(uploadsFolderPath, uniqueFileName);

                // Save the new image file
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(fileStream);
                }

                // Store the relative path to the new image in the database
                employee.Image = Path.Combine("EmployeeImages", uniqueFileName);
            }

            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!_db.Employees.Any(e => e.EmployeeId == id))
            {
                return NotFound();
            }

            return NoContent();
        }


        // DELETE: api/Employees/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _db.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            _db.Employees.Remove(employee);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}

