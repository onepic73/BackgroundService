using BackgroundService.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace BackgroundService.Hubs
{
    [Authorize]
    public class GameHub : Hub
    {
        public static Dictionary<string, int> Data = new();

        public GameHub()
        {
            
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            Data[Context.UserIdentifier!] = 0;
        }

        public void Increment()
        {
            Data[Context.UserIdentifier!]++;
        }
    }
}
