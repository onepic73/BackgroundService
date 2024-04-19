using BackgroundService.Data;
using BackgroundService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace BackgroundService.Hubs
{
    [Authorize]
    public class GameHub : Hub
    {
        public Game _game;

        public GameHub(Game game)
        {
            _game = game;
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            _game.AddUser(Context.UserIdentifier!);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _game.RemoveUser(Context.UserIdentifier!);
            await base.OnDisconnectedAsync(exception);
        }

        public void Increment()
        {
            _game.Increment(Context.UserIdentifier!);
        }
    }
}
