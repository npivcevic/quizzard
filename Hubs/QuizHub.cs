using Microsoft.AspNetCore.SignalR;
using quizzard.Models;

namespace quizzard.Hubs;

public class QuizHub : Hub
{
    List<QuizHubGroup> groups = new List<QuizHubGroup>();

    public async Task BroadcastData(String data) =>
            await Clients.All.SendAsync("transferdata", data);

    public string GetConnectionId() {
        return Context.ConnectionId;
    } 

    public async Task HostQuiz(String groupName)
    {
        this.groups.Add(new QuizHubGroup(groupName, Context.ConnectionId));
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        await Clients.Group(groupName).SendAsync("transferdata", "Group created:" + groupName);
    }
    public async Task JoinQuiz(String groupName, String playerName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        await Clients.Group(groupName).SendAsync("transferdata",
        $"{{\"action\":\"PlayerJoined\", \"data\":\"{playerName}\"}}");
    }

    public async Task sendToGroup(String groupName, String data)
    {
        // QuizHubGroup? group = this.groups.Find(x => x.Name == groupName);
        // if (group == null || group.HostConnectionId != Context.ConnectionId)
        // {
        //     return;
        // }
        await Clients.Group(groupName).SendAsync("transferdata", data);
    }

    public async Task sendToHost(String connectionId, String data)
    {
        // await Clients.All.SendAsync("transferdata", data);
        await Clients.Client(connectionId).SendAsync("transferdata", data);
    }
}

/*
1. Host se spoji
2. Host kreira grupu: createQuiz(string code)
3. Na hostu se prikaze kod kviza za spojit se, i listu igraca

4. Player se spoji
5. Player joina grupu: joinQuiz(string code, string playerName)
6. To se brodcasta svima u grupi
7. Host kad primi poruku "PlayerJoined" prikaze igraca na fronendu i posalje svima u grupi svoj connectionId

8. Kad player dobije poruku "HostConnectionId", zapamti konekciju hosta


*/