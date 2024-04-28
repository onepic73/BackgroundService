using BackgroundService.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackgroundService.Controllers
{
    public class ToolsController : Controller
    {
        private readonly BackgroundServiceContext _context;

        public ToolsController(BackgroundServiceContext context)
        {
            _context = context;
        }

        // GET: Admin/Matches
        public async Task<IActionResult> Index()
        {
            List<string> result = (await _context.Database.GetPendingMigrationsAsync()).ToList();
            this.ViewData["pendingmigrations"] = result;

            return View();
        }

        [HttpGet]
        public IActionResult ApplyMigrations()
        {
            _context.Database.Migrate();

            return RedirectToAction(nameof(Index));
        }


    }
}
