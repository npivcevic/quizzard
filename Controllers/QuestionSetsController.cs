using System;
using System.Collections.Generic;
using System.Data;
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
    [Authorize(Roles = "Host")]
    public class QuestionSetsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuestionSetsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/QuestionSets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuestionSet>>> GetQuestionSets()
        {
            if (_context.QuestionSets == null)
            {
                return NotFound();
            }
            return await _context.QuestionSets.ToListAsync();
        }

        // GET: api/QuestionSets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QuestionSet>> GetQuestionSet(Guid id)
        {
            if (_context.QuestionSets == null)
            {
                return NotFound();
            }
            var questionSet = await _context.QuestionSets.FindAsync(id);

            if (questionSet == null)
            {
                return NotFound();
            }

            return questionSet;
        }

        // PUT: api/QuestionSets/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuestionSet(Guid id, QuestionSet questionSet)
        {
            if (id != questionSet.QuestionSetId)
            {
                return BadRequest();
            }

            _context.Entry(questionSet).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionSetExists(id))
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

        // POST: api/QuestionSets
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<QuestionSet>> PostQuestionSet(QuestionSet questionSet)
        {
            if (_context.QuestionSets == null)
            {
                return Problem("Entity set 'ApplicationDbContext.QuestionSets'  is null.");
            }

            _context.QuestionSets.Add(questionSet);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuestionSet", new { id = questionSet.QuestionSetId }, questionSet);
        }

        // DELETE: api/QuestionSets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestionSet(Guid id)
        {
            if (_context.QuestionSets == null)
            {
                return NotFound();
            }
            var questionSet = await _context.QuestionSets.FindAsync(id);
            if (questionSet == null)
            {
                return NotFound();
            }

            _context.QuestionSets.Remove(questionSet);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool QuestionSetExists(Guid id)
        {
            return (_context.QuestionSets?.Any(e => e.QuestionSetId == id)).GetValueOrDefault();
        }
    }
}
