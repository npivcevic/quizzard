using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quizzard.Data;
using quizzard.Models;
using Microsoft.AspNetCore.Authorization;

namespace quizzard.Controllers
{
    // [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Host")]

    public class QuestionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuestionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Questions/random
        [HttpGet("Random")]
        public async Task<ActionResult<IEnumerable<Question>>> GetRandomQuestions(int size = 20)
        {
            if (size > 20)
            {
                size = 20;
            }

            if (_context.Questions == null)
            {
                return NotFound();
            }

            return await _context.Questions.OrderBy(r => EF.Functions.Random()).Take(size).Include(q => q.Answers).ToListAsync();
        }

        // GET: api/Questions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestions()
        {
            if (_context.Questions == null)
            {
                return NotFound();
            }

            return await _context.Questions.Include(q => q.Answers).ToListAsync();
        }

        // GET: api/Questions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Question>> GetQuestion(Guid id)
        {
            if (_context.Questions == null)
            {
                return NotFound();
            }
            var question = await _context.Questions.Include(q => q.Answers).FirstOrDefaultAsync(q => q.QuestionId.Equals(id));

            if (question == null)
            {
                return NotFound();
            }

            return question;
        }

        // PUT: api/Questions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuestion(Guid id, Question question)
        {
            if (id != question.QuestionId)
            {
                return BadRequest();
            }

            if (_context.Questions == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Questions'  is null.");
            }

            var dbQuestion = _context.Questions
                .Include(q => q.Answers)
                .FirstOrDefault(q => q.QuestionId.Equals(id));

            if (dbQuestion == null)
            {
                return NotFound();
            }

            _context.RemoveRange(dbQuestion.Answers);

            dbQuestion.Text = question.Text;
            dbQuestion.Answers = question.Answers;
            dbQuestion.QuestionSetId = question.QuestionSetId;
            dbQuestion.Order = question.Order;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionExists(id))
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

        // POST: api/Questions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Question>> PostQuestion(Question question)
        {
            if (_context.Questions == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Questions'  is null.");
            }
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuestion", new { id = question.QuestionId }, question);
        }

        // DELETE: api/Questions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(Guid id)
        {
            if (_context.Questions == null)
            {
                return NotFound();
            }
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
            {
                return NotFound();
            }

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool QuestionExists(Guid id)
        {
            return (_context.Questions?.Any(e => e.QuestionId == id)).GetValueOrDefault();
        }
    }
}
