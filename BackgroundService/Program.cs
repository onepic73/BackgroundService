using Microsoft.EntityFrameworkCore;
using BackgroundService.Data;
using BackgroundService.Hubs;
using BackgroundService.Services;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<BackgroundServiceContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("BackgroundServiceContext") ?? throw new InvalidOperationException("Connection string 'BackgroundServiceContext' not found.")));

// Permet d'obtenir des erreurs de BD plus claires et même d'appliquer des migrations manquantes
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<IdentityUser>()
    .AddEntityFrameworkStores<BackgroundServiceContext>();

// Add services to the container.
builder.Services.AddControllersWithViews();

//builder.Services.AddHostedService<Game>();
builder.Services.AddSingleton<Game>();
builder.Services.AddHostedService<Game>(p => p.GetService<Game>());

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder => builder
        .WithOrigins("http://localhost:4200", "https://localhost:4200")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
});

builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseCors("CorsPolicy");

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

app.MapHub<GameHub>("/game");

app.Run();
