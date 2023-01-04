using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace quizzard.Models;

public class QuizDto
{
    public Guid QuizId { get; set; }

    public string Name { get; set; } = "";

    public QuizStatus Status { get; set; } = QuizStatus.Draft;

    public string Description { get; set; } = "";

    public int NumberOfQuestions { get; set; }
}
