using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Naseej_Project.DTOs;
using Naseej_Project.Models;
using BCrypt;
namespace Naseej_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpolyeeLoginController : ControllerBase
    {

        private readonly MyDbContext _db;

        public EmpolyeeLoginController(MyDbContext db)
        {
            _db = db;
        }




        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] EmpolyeeLoginDto loginDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.PasswordHash))
                {
                    return BadRequest("Email and Password are required.");
                }

                var normalizedEmail = loginDto.Email.Trim().ToLower();
                var employee = await _db.Employees
                    .FirstOrDefaultAsync(e => e.Email == normalizedEmail);

                if (employee == null)
                {
                    return Unauthorized("Invalid email or password.");
                }

                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.PasswordHash, employee.PasswordHash);
                if (!isPasswordValid)
                {
                    return Unauthorized("Invalid email or password.");
                }

                // Consider adding JWT token generation here for secure authentication

                return Ok(new
                {
                    Message = "Login successful",
                    EmployeeId = employee.EmployeeId,
                    Email = employee.Email,
                    FullName = employee.FullName,
                    IsAdmin = employee.IsAdmin
                });
            }
            catch (Exception ex)
            {
                // Log the exception details
                return StatusCode(500, "An error occurred during login.");
            }
        }
    }
}