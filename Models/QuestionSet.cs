using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace quizzard.Models;

public class QuestionSet
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public Guid QuestionSetId { get; set; }

    [Required]
    public string Name { get; set; } = "";

    [Required]
    public int Order { get; set; } = 0;

    public List<Question> Questions { get; set; } = new List<Question>();

    public Guid QuizId { get; set; }
    public Quiz? Quiz { get; set; }
}
