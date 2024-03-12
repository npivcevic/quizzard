using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace quizzard.Models;

public class QuizHubGroup
{
    public string Name { get; set; }

    public string HostConnectionId { get; set; }

    List<Player> players = new List<Player>();

    public QuizHubGroup(String name, String hostConnectionId)
    {
        this.Name = name;
        this.HostConnectionId = hostConnectionId;
        this.players.Add(new Player(hostConnectionId, ""));
    }

    public void AddPlayer(String connectionId, String playerName)
    {
        this.players.Add(new Player(connectionId, playerName));
    }

    public void DeactivateConnectionId(String connectionId)
    {
        Player? player = this.players.Find(p => p.connectionId == connectionId);
        if (player == null)
        {
            return;
        }
        player.Deactivate();
    }

    public Player? FindPlayer(String connectionId)
    {
        return this.players.Find(p => p.connectionId == connectionId);
    }

    public Player? FindPlayerByName(String playerName)
    {
        return this.players.Find(p => p.playerName.ToLower() == playerName.ToLower());
    }

    public void ReconnectConnectionId(String newConnectionId, String oldConnectionId)
    {
        Player? player = this.players.Find(p => p.connectionId == oldConnectionId);
        if (player == null)
        {
            return;
        }
        player.Reconnect(newConnectionId);
    }

    public bool IsConnectionInGroup(String connectionId)
    {
        return this.players.Exists(p => p.connectionId == connectionId);
    }
}
