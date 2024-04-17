using Microsoft.AspNetCore.Identity;

namespace BackgroundService.Models
{
    public class Player
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public IdentityUser User { get; set; }
        public int NbWins { get; set; }
    }
}
