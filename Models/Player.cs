using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace quizzard.Models;

public class Player
{
    public string connectionId { get; set; }
    public Guid clientId { get; set; }
    public bool isActive { get; set; }

    public string playerName { get; set; }
    public bool isRemovedByHost { get; set; } = false;


    public Player(String connectionId, String playerName)
    {
        this.connectionId = connectionId;
        this.clientId = Guid.NewGuid();
        this.isActive = true;
        this.playerName = playerName;
    }

    public void Deactivate()
    {
        this.isActive = false;
    }

    public void Reconnect(String newConnectionId)
    {
        this.connectionId = newConnectionId;
        this.isActive = true;
    }
}
