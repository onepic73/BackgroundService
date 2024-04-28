using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackgroundService.Data;

namespace BackgroundService.Controllers
{
    public class PlayersController : Controller
    {
        private readonly BackgroundServiceContext _context;

        public PlayersController(BackgroundServiceContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var backgroundServiceContext = _context.Player.Include(p => p.User);
            return View(await backgroundServiceContext.ToListAsync());
        }
    }
}
