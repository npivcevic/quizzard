using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace quizzard.Models;

public class Question
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public Guid QuestionId { get; set; }

    [Required]
    public string Text { get; set; } = "";

    public int Order { get; set; } = 0;

    public List<Answer> Answers { get; set; } = new List<Answer>();
    
    public Guid? QuestionSetId { get; set; }
    public QuestionSet? QuestionSet { get; set; }
}
