using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace quizzard.Models;

public class QuizData
{
    private static Random random = new Random();
    Dictionary<string, QuizHubGroup> groups = new Dictionary<string, QuizHubGroup>();

    public QuizData() { }

    public QuizHubGroup? FindGroup(String groupName)
    {
        QuizHubGroup group;
        try
        {
            group = this.groups[groupName];
        }
        catch (KeyNotFoundException)
        {
            return null;
        }
        return group;
    }

    public string CreateGroup(String hostConnectionId)
    {
        string groupName = this.GenerateUniqueQuizCode();
        this.groups[groupName] = new QuizHubGroup(groupName, hostConnectionId);
        return groupName;
    }

    public void DeleteGroup(String groupName)
    {
        this.groups.Remove(groupName);
    }

    public bool AddConnectionToGroup(String groupName, String connectionId)
    {
        QuizHubGroup group;
        try
        {
            group = this.groups[groupName];
        }
        catch (KeyNotFoundException)
        {
            return false;
        }
        group.AddConnectionId(connectionId);
        return true;
    }

    public bool RemoveConnectionFromGroup(String groupName, String connectionId)
    {
        QuizHubGroup group;
        try
        {
            group = this.groups[groupName];
        }
        catch (KeyNotFoundException)
        {
            return false;
        }
        group.RemoveConnectionId(connectionId);
        return true;
    }

    public bool IsConnectionHostOfGroup(String groupName, String connectionId)
    {
        QuizHubGroup group;
        try
        {
            group = this.groups[groupName];
        }
        catch (KeyNotFoundException)
        {
            return false;
        }
        return group.HostConnectionId == connectionId;
    }

    public bool IsConnectionAHost(String connectionId)
    {
        foreach (KeyValuePair<string, QuizHubGroup> kvp in this.groups)
        {
            if (kvp.Value.HostConnectionId == connectionId)
            {
                return true;
            }
        }
        return false;
    }

    public QuizHubGroup? FindGroupOfConnectionId(String connectionId)
    {
        foreach (KeyValuePair<string, QuizHubGroup> kvp in this.groups)
        {
            if (kvp.Value.IsConnectionInGroup(connectionId))
            {
                return kvp.Value;
            }
        }
        return null;
    }

    public string GenerateUniqueQuizCode()
    {
        return RandomString(4);
    }

    public static string RandomString(int length)
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";
        return new string(Enumerable.Repeat(chars, length)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }
}
