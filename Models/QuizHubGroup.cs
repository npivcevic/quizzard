using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace quizzard.Models;

public class QuizHubGroup
{
    public string Name { get; set; }

    public string HostConnectionId { get; set; }

    public QuizHubGroup(String name, String connectionId) {
        this.Name = name;
        this.HostConnectionId = connectionId;
    }
}
