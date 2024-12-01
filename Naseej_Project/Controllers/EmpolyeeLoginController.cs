﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Naseej_Project.DTOs;
using Naseej_Project.Models;
using BCrypt;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace Naseej_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpolyeeLoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmpolyeeLoginController> _logger;
        private readonly MyDbContext _db;

        public EmpolyeeLoginController(IConfiguration configuration, ILogger<EmpolyeeLoginController> logger, MyDbContext db)
        {
            _configuration = configuration;
            _logger = logger;
            _db = db;
        }








        /// <summary>
        /// //////////////////////////////////////
        /// </summary>
        /// <param name="EmpolyeesDTO"></param>
        /// <returns></returns>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] EmpolyeeLoginDto EmpolyeesDTO)
        {
            try
            {
                if (EmpolyeesDTO == null)
                {
                    return BadRequest("Invalid login data.");
                }

                if (string.IsNullOrWhiteSpace(EmpolyeesDTO.Email))
                {
                    return BadRequest("Email is required.");
                }

                if (string.IsNullOrWhiteSpace(EmpolyeesDTO.PasswordHash))
                {
                    return BadRequest("Password is required.");
                }

                var normalizedEmail = EmpolyeesDTO.Email.Trim().ToLower();

                var employee = await _db.Employees
                    .FirstOrDefaultAsync(e => e.Email == normalizedEmail);

                if (employee == null)
                {
                    return Unauthorized(new { Message = "Invalid email." });
                }

                // Explicit null checks
                if (string.IsNullOrWhiteSpace(employee.PasswordHash))
                {
                    return Unauthorized(new { Message = "Employee password is not set." });
                }

                bool isPasswordValid = false;
                try
                {
                    isPasswordValid = BCrypt.Net.BCrypt.Verify(EmpolyeesDTO.PasswordHash, employee.PasswordHash);

                    if (!isPasswordValid)
                    {
                        return Unauthorized(new { Message = "Invalid password." });
                    }
                }
                catch (Exception ex)
                {
                    // Detailed logging
                    Console.WriteLine($"Login error: {ex.Message}");
                    Console.WriteLine($"Stack Trace: {ex.StackTrace}");

                    return StatusCode(500, new
                    {
                        Message = "An error occurred during login.",
                        DetailedError = ex.Message
                    });
                }

                var token = GenerateJwtToken(employee);

                // Handle potential null image
                return Ok(new
                {
                    Token = token,
                    EmployeeId = employee.EmployeeId,
                    Email = employee.Email,
                    FullName = employee.FullName,
                    IsAdmin = employee.IsAdmin,
                    Image = employee.Image ?? string.Empty // Provide empty string if null
                });
            }
            catch (Exception ex)
            {
                // Outer exception logging
                Console.WriteLine($"Outer login error: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");

                return StatusCode(500, new
                {
                    Message = "An error occurred during login.",
                    DetailedError = ex.Message
                });
            }
        }

        private string GenerateJwtToken(Employee employee)
        {
            _logger.LogInformation("Generating token for employee: {EmployeeId}", employee.EmployeeId);

            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new InvalidOperationException("JWT key is not configured");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, employee.EmployeeId.ToString()),
        new Claim(JwtRegisteredClaimNames.Email, employee.Email),
        new Claim("fullName", employee.FullName),
        new Claim("isAdmin", employee.IsAdmin.ToString()),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

            // Only add image claim if it's not null
            if (!string.IsNullOrWhiteSpace(employee.Image))
            {
                claims.Add(new Claim("image", employee.Image));
            }

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: credentials
            );

            var writtenToken = new JwtSecurityTokenHandler().WriteToken(token);
            _logger.LogInformation("Generated token: {Token}", writtenToken);

            return writtenToken;
        }
    }


}



