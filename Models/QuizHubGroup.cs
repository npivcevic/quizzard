using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace quizzard.Models;

public class QuizHubGroup
{
    public string Name { get; set; }

    public string HostConnectionId { get; set; }

    List<string> connectionIds = new List<string>();

    public QuizHubGroup(String name, String hostConnectionId)
    {
        this.Name = name;
        this.HostConnectionId = hostConnectionId;
        this.connectionIds.Add(this.HostConnectionId);
    }

    public void AddConnectionId(String connectionId)
    {
        this.connectionIds.Add(connectionId);
    }

    public void RemoveConnectionId(String connectionId)
    {
        this.connectionIds.Remove(connectionId);
    }

    public bool IsEmpty()
    {
        return this.connectionIds.Count == 0;
    }

    public bool IsConnectionInGroup(String connectionId)
    {
        return this.connectionIds.Contains(connectionId);
    }
}
