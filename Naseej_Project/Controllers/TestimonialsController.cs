using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Naseej_Project.DTOs;
using Naseej_Project.Models;

namespace Naseej_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestimonialsController : ControllerBase
    {

        private readonly MyDbContext _db;

        public TestimonialsController(MyDbContext db)
        {
            _db = db;
        }


        //////////////////////////////////////////////////////


        [HttpGet("GetAllTestimonials")]
        public IActionResult GetAllTestimonial()
        {
            var GetAllTestimonials = _db.Testimonials.ToList();

            return Ok(GetAllTestimonials);
        }

        //////////////////////////////////////////////////////


        [HttpGet("GetTestimonial/{id}")]
        public IActionResult GetTestimonial(int id)
        {
            var Testimonialmessage = _db.Testimonials.FirstOrDefault(m => m.UserId == id);

            if (Testimonialmessage == null)
            {
                return NotFound(new { Message = "Message not found" });
            }

            var messageDto = new TestimonialDTO
            {
                Email = Testimonialmessage.Email,
                Firstname = Testimonialmessage.Firstname,
                Lastname = Testimonialmessage.Lastname,
                TheTestimonials = Testimonialmessage.TheTestimonials,

            };

            return Ok(Testimonialmessage);
        }

        //////////////////////////////////////////////////////

        [HttpPost("PostTestimonial")]
        public IActionResult PostMessage([FromForm] TestimonialDTO TestimonialsDto)
        {


            var Testimonials = new Testimonial
            {
                Firstname = TestimonialsDto.Firstname,
                Lastname = TestimonialsDto.Lastname,
                Email = TestimonialsDto.Email,
                TheTestimonials = TestimonialsDto.TheTestimonials,

            };

            _db.Testimonials.Add(Testimonials);
            _db.SaveChanges();

            return Ok(new { Message = " message sent successfully !" });
        }


    }
}
