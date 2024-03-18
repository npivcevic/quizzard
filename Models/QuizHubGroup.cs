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

    public Player AddPlayer(String connectionId, String playerName)
    {
        var player = new Player(connectionId, playerName);
        this.players.Add(player);
        return player;
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

    public void RemovePlayerFromGroup(String connectionId)
    {
        var player = players.Where(p=>p.connectionId == connectionId).FirstOrDefault();
        player.isRemovedByHost = true;
    }

    public Player? FindPlayer(String connectionId)
    {
        return this.players.Find(p => p.connectionId == connectionId);
    }

    public Player? FindPlayerByName(String playerName)
    {
        return this.players.Find(p => p.playerName.ToLower() == playerName.ToLower());
    }

    public Player? FindPlayerByClientId(Guid clientId)
    {
        return this.players.Find(p => p.clientId == clientId);
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
