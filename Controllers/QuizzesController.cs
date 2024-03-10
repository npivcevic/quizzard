using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quizzard.Data;
using quizzard.Models;

namespace quizzard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizzesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuizzesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Quizzes/published
        [HttpGet("published")]
        public async Task<ActionResult<IEnumerable<QuizDto>>> GetPublishedQuizzes()
        {
            if (_context.Quizzes == null)
            {
                return NotFound();
            }
            return await _context.Quizzes
                .Where(quiz => quiz.Status == QuizStatus.Published)
                .Include(quiz => quiz.QuestionSets.OrderBy(s => s.Order))
                .ThenInclude(set => set.Questions.OrderBy(s => s.Order))
                .ThenInclude(question => question.Answers)
                .Select(q => q.ToQuizDto())
                .ToListAsync();
        }

        [HttpGet("deploy")]
        public async Task<string> Deploy()
        {
            return await Task.FromResult("dobro je sve edited");
        }

        // GET: api/Quizzes
        [HttpGet, Authorize(Roles = "Host")]
        public async Task<ActionResult<IEnumerable<QuizDto>>> GetQuizzes()
        {
            if (_context.Quizzes == null)
            {
                return NotFound();
            }
            return await _context.Quizzes
                .Include(quiz => quiz.QuestionSets.OrderBy(s => s.Order))
                .ThenInclude(set => set.Questions.OrderBy(s => s.Order))
                .ThenInclude(question => question.Answers)
                .Select(q => q.ToQuizDto())
                .ToListAsync();
        }

        // GET: api/Quizzes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Quiz>> GetQuiz(Guid id)
        {
            if (_context.Quizzes == null)
            {
                return NotFound();
            }
            var quiz = await _context.Quizzes
                .Include(quiz => quiz.QuestionSets.OrderBy(s => s.Order))
                .ThenInclude(set => set.Questions.OrderBy(s => s.Order))
                .ThenInclude(question => question.Answers)
                .FirstOrDefaultAsync(q => q.QuizId.Equals(id));

            if (quiz == null)
            {
                return NotFound();
            }

            return quiz;
        }

        // PUT: api/Quizzes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}"), Authorize(Roles = "Host")]
        public async Task<IActionResult> PutQuiz(Guid id, Quiz quiz)
        {
            if (id != quiz.QuizId)
            {
                return BadRequest();
            }

            _context.Entry(quiz).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuizExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Quizzes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost, Authorize(Roles = "Host")]
        public async Task<ActionResult<Quiz>> PostQuiz(Quiz quiz)
        {
            if (_context.Quizzes == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Quizzes'  is null.");
            }
            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuiz", new { id = quiz.QuizId }, quiz);
        }

        // DELETE: api/Quizzes/5
        [HttpDelete("{id}"), Authorize(Roles = "Host")]
        public async Task<IActionResult> DeleteQuiz(Guid id)
        {
            if (_context.Quizzes == null)
            {
                return NotFound();
            }
            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz == null)
            {
                return NotFound();
            }

            _context.Quizzes.Remove(quiz);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool QuizExists(Guid id)
        {
            return (_context.Quizzes?.Any(e => e.QuizId == id)).GetValueOrDefault();
        }
    }
}
