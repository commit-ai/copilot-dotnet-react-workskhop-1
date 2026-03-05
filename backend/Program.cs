using backend.Models;
using System.Text.Json;

var jsonOptions = new JsonSerializerOptions
{
    PropertyNameCaseInsensitive = true,
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
};

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => Results.Text("Save the World!", "text/plain"));

app.MapGet("/api/superheroes", async () =>
{
    try
    {
        var dataPath = Path.Combine(app.Environment.ContentRootPath, "data", "superheroes.json");

        if (!File.Exists(dataPath))
        {
            return Results.Problem("Internal Server Error", statusCode: 500);
        }

        var json = await File.ReadAllTextAsync(dataPath);

        var superheroes = JsonSerializer.Deserialize<List<Superhero>>(json, jsonOptions);
        
        return superheroes == null
            ? Results.Problem("Internal Server Error", statusCode: 500)
            : Results.Ok(superheroes);
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"Error loading superheroes data: {ex.Message}");
        return Results.Problem("Internal Server Error", statusCode: 500);
    }
});

app.Run("http://localhost:3000");

public partial class Program { }