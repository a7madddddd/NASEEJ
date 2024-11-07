using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using Naseej_Project.DTOs;
using Naseej_Project.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Naseej_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class loginController : ControllerBase
    {

        private readonly MyDbContext _db;

        public loginController(MyDbContext db)
        {
            _db = db;
        }


        /// <summary>
        /// Register a new user
        /// </summary>
        /// <param name="registerDto"></param>
        /// <returns></returns>
        [HttpPost("Register")]
        public IActionResult Register([FromBody] LoginDTO registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Model state is not valid.");
            }

            if (string.IsNullOrEmpty(registerDto.PasswordHash))
            {
                return BadRequest("Password is required.");
            }

            // Check if a user with the same phone number or email already exists
            var existingUserByPhone = _db.Users.FirstOrDefault(u => u.PhoneNumber == registerDto.PhoneNumber);
            if (existingUserByPhone != null)
            {
                return Conflict(new { message = "Phone number is already used. Please use another one." });
            }

            var existingUserByEmail = _db.Users.FirstOrDefault(u => u.Email == registerDto.Email);
            if (existingUserByEmail != null)
            {
                return Conflict(new { message = "Email is already used. Please use another one." });
            }

            // Hash the password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.PasswordHash);

            var newUser = new User
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                PhoneNumber = registerDto.PhoneNumber,
                Email = registerDto.Email,
                Nationality = registerDto.Nationality,
                Degree = registerDto.Degree,
                Governorate = registerDto.Governorate,
                Age = registerDto.Age,
                JoinDate = DateTime.Now,
                PasswordHash = passwordHash,
                PasswordSalt = registerDto.PasswordSalt,
            };

            _db.Users.Add(newUser);
            _db.SaveChanges();

            return CreatedAtAction(nameof(Register), new { id = newUser.UserId }, new
            {
                FirstName = newUser.FirstName,
                LastName = newUser.LastName,
                PhoneNumber = newUser.PhoneNumber,
                Email = newUser.Email,
                Message = "User registered successfully."
            });
        }







        /// <summary>
        /// Login an existing user
        /// </summary>
        /// <param name="loginDto"></param>
        /// <returns></returns>
        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginDTO loginDto)
        {
            if (string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.PasswordHash))
            {
                return BadRequest(new { message = "Email Address and password are required." }); // Return JSON object instead of a string
            }

            var user = _db.Users.FirstOrDefault(u => u.Email == loginDto.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid Email Address or password." }); // Return JSON object instead of a string
            }

            if (!BCrypt.Net.BCrypt.Verify(loginDto.PasswordHash, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid Email Address or password." }); // Return JSON object instead of a string
            }

            return Ok(new { Message = "Login successful", UserId = user.UserId, FirstName = user.FirstName });
        }
    }
}
