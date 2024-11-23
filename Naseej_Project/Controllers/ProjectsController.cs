using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Naseej_Project.DTOs;
using Naseej_Project.Models;

namespace Naseej_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {

        private readonly MyDbContext _context;

        public ProjectsController(MyDbContext context)
        {
            _context = context;
        }





        // GET: api/Projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectsDTOs>>> GetProjects()
        {
            var projects = await _context.Projects 
                .Select(project => new ProjectsDTOs
                {
                    ProjectId = project.ProjectId,
                    ProjectName = project.ProjectName,
                    ProjectImage = project.ProjectImage,
                    ProjectDescription = project.ProjectDescription,
                    EmployeeId = project.EmployeeId,
                    IsAccept = project.IsAccept
                })
                .ToListAsync();

            return Ok(projects);
        }

        // GET: api/Projects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectsDTOs>> GetProject(int id)
        {
            var project = await _context.Projects.FindAsync(id); 

            if (project == null)
            {
                return NotFound();
            }

            return new ProjectsDTOs
            {
                ProjectId = project.ProjectId,
                ProjectName = project.ProjectName,
                ProjectImage = project.ProjectImage,
                ProjectDescription = project.ProjectDescription,
                EmployeeId = project.EmployeeId,
                IsAccept = project.IsAccept
            };
        }

        // POST: api/Projects
        [HttpPost]
        public async Task<ActionResult<ProjectsDTOs>> CreateProject([FromForm] ProjectsDTOs projectDto, IFormFile projectImageFile)
        {
         

            string relativeImagePath = null;
            if (projectImageFile != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Projectsimages");
                Directory.CreateDirectory(uploadsFolder);

                string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(projectImageFile.FileName);
                string physicalPath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(physicalPath, FileMode.Create))
                {
                    await projectImageFile.CopyToAsync(fileStream);
                }

                relativeImagePath = Path.Combine("Projectsimages", uniqueFileName);
            }

            var project = new Project
            {
                ProjectName = projectDto.ProjectName,
                ProjectImage = relativeImagePath,
                ProjectDescription = projectDto.ProjectDescription,
                EmployeeId = projectDto.EmployeeId,
                IsAccept = projectDto.IsAccept ?? "Pending" 
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            projectDto.ProjectId = project.ProjectId;
            projectDto.ProjectImage = relativeImagePath;

            return CreatedAtAction(nameof(GetProject), new { id = project.ProjectId }, projectDto);
        }








        // PUT: api/Projects/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromForm] ProjectsDTOs projectDto, IFormFile projectImageFile)
        {
            if (id != projectDto.ProjectId)
            {
                return BadRequest();
            }

            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            project.ProjectName = projectDto.ProjectName;
            project.ProjectDescription = projectDto.ProjectDescription;
            project.EmployeeId = projectDto.EmployeeId;
            project.IsAccept = projectDto.IsAccept ?? "Pending";

            if (projectImageFile != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Projectsimages");
                Directory.CreateDirectory(uploadsFolder);

                string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(projectImageFile.FileName);
                string physicalPath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(physicalPath, FileMode.Create))
                {
                    await projectImageFile.CopyToAsync(fileStream);
                }

                project.ProjectImage = Path.Combine("Projectsimages", uniqueFileName);
            }

            _context.Entry(project).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Projects.Any(e => e.ProjectId == id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }



        // DELETE: api/Projects/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}




