using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace quizzard.Models;

public class Quiz
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public Guid QuizId { get; set; }

    [Required]
    public string Name { get; set; } = "";

    public string Description { get; set; } = "";

    public QuizStatus Status { get; set; } = QuizStatus.Draft;

    public DateTime? PublishDate { get; set; } = null;

    public List<QuestionSet> QuestionSets { get; set; } = new List<QuestionSet>();

    public QuizDto ToQuizDto() {
        return new QuizDto() {
            QuizId = this.QuizId,
            Name = this.Name,
            Status = this.Status,
            Description = this.Description,
            NumberOfQuestions = this.QuestionSets.Aggregate(0, (acc, set) => acc += set.Questions.Count)
        };
    }
}

public enum QuizStatus
{
    Draft,
    Published
}
