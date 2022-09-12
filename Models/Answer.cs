using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace quizzard.Models;

public class Answer
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public Guid ID { get; set; }

    public string Text { get; set; }

    public bool isCorrect { get; set; }
}
