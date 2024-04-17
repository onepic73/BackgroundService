using BackgroundService.Hubs;
using Microsoft.AspNetCore.SignalR;
using System;

namespace BackgroundService.Services
{
    public class Game
    {
        private GameHub _gameHub;

        public Match(IHubContext<GameHub> gameHub)
        {
            _gameHub = gameHub;
        }
    }
}
