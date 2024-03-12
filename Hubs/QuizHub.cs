using Microsoft.AspNetCore.SignalR;
using quizzard.Models;
using System.Text.Json;

namespace quizzard.Hubs;

public class QuizHub : Hub
{
    static QuizData quizData = new QuizData();

    public async Task BroadcastData(String data) =>
            await Clients.All.SendAsync("transferdata", data);

    public string GetConnectionId()
    {
        return Context.ConnectionId;
    }

    public async Task HostQuiz()
    {
        string groupName = quizData.CreateGroup(Context.ConnectionId);
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        await Clients.Group(groupName).SendAsync("transferdata",
            $"{{\"action\":\"{ActionTypes.GroupCreated}\", \"data\":\"{groupName}\"}}");
    }

    public async Task JoinQuiz(String groupName, String playerName)
    {
        QuizHubGroup? group = quizData.FindGroup(groupName);
        if (group == null)
        {
            await Clients.Client(Context.ConnectionId).SendAsync("transferdata",
                $"{{\"action\":\"{ActionTypes.ErrorTryingToJoinNonExistingGroup}\", \"data\":\"{groupName}\"}}");
            return;
        }

        if (group.FindPlayerByName(playerName) != null) {
            await Clients.Client(Context.ConnectionId).SendAsync("transferdata",
                $"{{\"action\":\"{ActionTypes.ErrorGroupHasPlayerWithSameName}\", \"data\":\"{groupName}\"}}");
            return;
        }

        group.AddPlayer(Context.ConnectionId, playerName);
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

        var playerJoinedDTO = new
        {
            action = ActionTypes.PlayerJoined,
            data = new
            {
                name = playerName,
                connectionId = Context.ConnectionId
            }
        };
        await Clients.Client(group.HostConnectionId).SendAsync("transferdata", JsonSerializer.Serialize(playerJoinedDTO));


        var succesfullyJoinedGroupDTO = new
        {
            action = ActionTypes.SuccesfullyJoinedGroup,
            data = groupName
        };
        await Clients.Client(Context.ConnectionId).SendAsync("transferdata", JsonSerializer.Serialize(succesfullyJoinedGroupDTO));
    }

    public async Task SendToGroup(String data)
    {
        QuizHubGroup? group = quizData.FindGroupOfConnectionId(Context.ConnectionId);
        if (group == null || !quizData.IsConnectionHostOfGroup(group.Name, Context.ConnectionId))
        {
            await Clients.Client(Context.ConnectionId).SendAsync("transferdata",
                $"{{\"action\":\"{ActionTypes.ErrorSendingToGroup}\", \"data\":\"You are either not a part of a group or you are not the host of the group.\"}}");
            return;
        }
        await Clients.Group(group.Name).SendAsync("transferdata", data);
    }

    public async Task SendToHost(String data)
    {
        QuizHubGroup? group = quizData.FindGroupOfConnectionId(Context.ConnectionId);
        if (group == null)
        {
            await Clients.Client(Context.ConnectionId).SendAsync("transferdata",
                $"{{\"action\":\"{ActionTypes.ErrorSendingToHost}\", \"data\":\"You are not a part of any group. Please join a group before you can send to a host\"}}");
            return;
        }

        await Clients.Client(group.HostConnectionId).SendAsync("transferdata", data, Context.ConnectionId);
    }

    public async Task SendToPlayer(String data, String playerConnectionId)
    {
        QuizHubGroup? group = quizData.FindGroupOfConnectionId(Context.ConnectionId);
        if (group == null || !quizData.IsConnectionHostOfGroup(group.Name, Context.ConnectionId))
        {
            await Clients.Client(Context.ConnectionId).SendAsync("transferdata",
                $"{{\"action\":\"{ActionTypes.ErrorSendingToPlayer}\", \"data\":\"You are either not a part of a group or you are not the host of the group.\"}}");
            return;
        }
        if (!group.IsConnectionInGroup(playerConnectionId)) {
            await Clients.Client(Context.ConnectionId).SendAsync("transferdata",
                $"{{\"action\":\"{ActionTypes.ErrorSendingToPlayer}\", \"data\":\"The player conneciton id doesn't exist or it's not a part of your group.\"}}");
            return;
        }

        await Clients.Client(playerConnectionId).SendAsync("transferdata", data);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        QuizHubGroup? group = quizData.FindGroupOfConnectionId(Context.ConnectionId);
        if (group == null)
        {
            return;
        }

        if (group.HostConnectionId == Context.ConnectionId)
        {
            quizData.DeleteGroup(group.Name);
            await Clients.Group(group.Name).SendAsync("transferdata",
                $"{{\"action\":\"{ActionTypes.HostDisconnected}\", \"data\":\"Host disconnected. Game is terminated.\"}}");
        } else {
            quizData.DeactivateConnectionFromGroup(group.Name, Context.ConnectionId);
            await Clients.Client(group.HostConnectionId).SendAsync("transferdata",
                    $"{{\"action\":\"{ActionTypes.PlayerDisconnected}\", \"data\":\"{Context.ConnectionId}\"}}");
        }

        await base.OnDisconnectedAsync(exception);
    }

    public string ReconnectCheck(String groupName, String playerName, String oldConnectionId)
    {
        QuizHubGroup? group = quizData.FindGroup(groupName);
        if (group == null)
        {
            return $"{{\"action\":\"{ActionTypes.ReconnectNotPossible}\", \"data\":\"Group not found\"}}";
        }

        Player? player = group.FindPlayer(oldConnectionId);

        if (player == null) {
            return $"{{\"action\":\"{ActionTypes.ReconnectNotPossible}\", \"data\":\"ConnectionId not found in group\"}}";
        }

        if (player.isActive) {
            return $"{{\"action\":\"{ActionTypes.ReconnectPossibleOldClientConnected}\", \"data\":\"Player not found in group\"}}";
        }

        return $"{{\"action\":\"{ActionTypes.ReconnectPossibleOldClientDisconnected}\", \"data\":\"Player not found in group\"}}";
    }

    public async Task Reconnect(String groupName, String playerName, String oldConnectionId)
    {
        QuizHubGroup? group = quizData.FindGroup(groupName);
        if (group == null)
        {
            await Clients.Client(Context.ConnectionId).SendAsync("transferdata",
                $"{{\"action\":\"{ActionTypes.ReconnectNotPossible}\", \"data\":\"Group not found\"}}");
            return;
        }

        Player? player = group.FindPlayer(oldConnectionId);

        if (player == null) {
            await Clients.Client(Context.ConnectionId).SendAsync("transferdata",
                $"{{\"action\":\"{ActionTypes.ReconnectNotPossible}\", \"data\":\"ConnectionId not found in group\"}}");
            return;
        }

        await Groups.RemoveFromGroupAsync(player.connectionId, groupName);
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

        if (player.isActive) {
            var RejoinedInADifferentTabDTO = new
            {
                action = ActionTypes.RejoinedInADifferentTab,
                data = groupName
            };
            await Clients.Client(oldConnectionId).SendAsync("transferdata", JsonSerializer.Serialize(RejoinedInADifferentTabDTO));
        }
        player.Reconnect(Context.ConnectionId);

        var playerReconnectedDTO = new
        {
            action = ActionTypes.PlayerReconnected,
            data = new
            {
                name = playerName,
                connectionId = Context.ConnectionId,
                oldConnectionId = oldConnectionId
            }
        };
        await Clients.Client(group.HostConnectionId).SendAsync("transferdata", JsonSerializer.Serialize(playerReconnectedDTO));

        var succesfullyReconnectedDTO = new
        {
            action = ActionTypes.SuccesfullyReconnected,
            data = groupName
        };
        await Clients.Client(Context.ConnectionId).SendAsync("transferdata", JsonSerializer.Serialize(succesfullyReconnectedDTO));
    }
}

static class ActionTypes
{
    public const string GroupCreated = "GroupCreated";
    public const string PlayerJoined = "PlayerJoined";
    public const string PlayerDisconnected = "PlayerDisconnected";
    public const string ErrorTryingToJoinNonExistingGroup = "ErrorTryingToJoinNonExistingGroup";
    public const string ErrorGroupHasPlayerWithSameName = "ErrorGroupHasPlayerWithSameName";
    public const string ErrorSendingToHost = "ErrorSendingToHost";
    public const string ErrorSendingToPlayer = "ErrorSendingToPlayer";
    public const string HostDisconnected = "HostDisconnected";
    public const string SuccesfullyJoinedGroup = "SuccesfullyJoinedGroup";
    public const string ErrorSendingToGroup = "ErrorSendingToGroup";
    public const string ReconnectNotPossible = "ReconnectNotPossible";
    public const string ReconnectPossibleOldClientConnected = "ReconnectPossibleOldClientConnected";
    public const string ReconnectPossibleOldClientDisconnected = "ReconnectPossibleOldClientDisconnected";
    public const string SuccesfullyReconnected = "SuccesfullyReconnected";
    public const string RejoinedInADifferentTab = "RejoinedInADifferentTab";
    public const string PlayerReconnected = "PlayerReconnected";
}
