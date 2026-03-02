var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => Results.Text("Save the World!", "text/plain"));

app.MapGet("/api/superheroes/", () =>
{
    var dataPath = Path.Combine(app.Environment.ContentRootPath, "data", "superheroes.json");

    if (!File.Exists(dataPath))
    {
        return Results.Text("Internal Server Error", "text/plain", statusCode: 500);
    }

    var json = File.ReadAllText(dataPath);
    return Results.Content(json, "application/json");
});

app.Run("http://localhost:3000");
