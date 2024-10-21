﻿using KinstonBackend.Data;
using KinstonBackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KinstonBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnrollmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EnrollmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult EnrollInCourse([FromBody] Enrollment enrollment)
        {
            if (enrollment == null)
                return BadRequest("Enrollment details are required.");

            // Check if already enrolled in another course
            var existingEnrollment = _context.Enrollments
                .Any(e => e.StudentId == enrollment.StudentId && e.CourseId == enrollment.CourseId);
            if (existingEnrollment)
                return BadRequest("Already enrolled in this course.");

            _context.Enrollments.Add(enrollment);
            _context.SaveChanges();

            // Increment enrollment count in Course
            var course = _context.Courses.Find(enrollment.CourseId);
            if (course != null)
            {
                course.EnrollmentCount++;
                _context.SaveChanges();
            }

            return CreatedAtAction(nameof(GetMyEnrollments), new { id = enrollment.EnrollmentId }, enrollment);
        }

        [HttpGet("my")]
        public ActionResult<IEnumerable<Enrollment>> GetMyEnrollments(int studentId)
        {
            return _context.Enrollments.Where(e => e.StudentId == studentId).ToList();
        }


        //

        /*
        [HttpPut("{enrollmentId}/rating")]
        public IActionResult RateCourse(int enrollmentId, [FromBody] int rating)
        {
            var enrollment = _context.Enrollments.Find(enrollmentId);
            if (enrollment == null)
            {
                return NotFound();
            }

            enrollment.Rating = rating;
            _context.SaveChanges();
            return NoContent(); // Respond with 204 No Content
        }
        */

        [HttpPut("{enrollmentId}/rating")]
        public IActionResult RateCourse(int enrollmentId, [FromBody] int? rating)
        {
            var enrollment = _context.Enrollments.Find(enrollmentId);
            if (enrollment == null)
            {
                return NotFound();
            }

            enrollment.Rating = rating ?? 0; // If rating is null, set it to 0
            _context.SaveChanges();
            return NoContent(); // Respond with 204 No Content
        }

    }
}
