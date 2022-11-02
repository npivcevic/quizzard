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

        group.AddConnectionId(Context.ConnectionId);
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
        }

        await Clients.Client(group.HostConnectionId).SendAsync("transferdata",
                $"{{\"action\":\"{ActionTypes.PlayerDisconnected}\", \"data\":\"{Context.ConnectionId}\"}}");
        await base.OnDisconnectedAsync(exception);
    }
}

static class ActionTypes
{
    public const string GroupCreated = "GroupCreated";
    public const string PlayerJoined = "PlayerJoined";
    public const string PlayerDisconnected = "PlayerDisconnected";
    public const string ErrorTryingToJoinNonExistingGroup = "ErrorTryingToJoinNonExistingGroup";
    public const string ErrorSendingToHost = "ErrorSendingToHost";
    public const string ErrorSendingToPlayer = "ErrorSendingToPlayer";
    public const string HostDisconnected = "HostDisconnected";
    public const string SuccesfullyJoinedGroup = "SuccesfullyJoinedGroup";
    public const string ErrorSendingToGroup = "ErrorSendingToGroup";
}
