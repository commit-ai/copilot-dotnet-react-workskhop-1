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
    var superheroes = await LoadSuperheroesAsync();

    return superheroes == null
        ? Results.Problem("Internal Server Error", statusCode: 500)
        : Results.Ok(superheroes);
});

app.MapGet("/api/superheroes/{id:int}", async (int id) =>
{
    var superheroes = await LoadSuperheroesAsync();

    if (superheroes == null)
    {
        return Results.Problem("Internal Server Error", statusCode: 500);
    }

    var superhero = superheroes.FirstOrDefault(hero => hero.Id == id);

    return superhero == null
        ? Results.NotFound("Superhero not found")
        : Results.Ok(superhero);
});

app.MapGet("/api/superheroes/{id:int}/powerstats", async (int id) =>
{
    var superheroes = await LoadSuperheroesAsync();

    if (superheroes == null)
    {
        return Results.Problem("Internal Server Error", statusCode: 500);
    }

    var superhero = superheroes.FirstOrDefault(hero => hero.Id == id);

    return superhero == null
        ? Results.NotFound("Superhero not found")
        : Results.Ok(superhero.Powerstats);
});

app.MapPost("/api/battle-narration", (BattleNarrationRequest? request) =>
{
    var hero1 = request?.Hero1;
    var hero2 = request?.Hero2;

    if (!IsValidHero(hero1) || !IsValidHero(hero2))
    {
        return Results.BadRequest(new { error = "Both heroes must be provided with valid data" });
    }

    return Results.Ok(new BattleNarrationResponse
    {
        Narration = GenerateBattleNarration(hero1!, hero2!)
    });
});

app.Run("http://localhost:3000");

async Task<List<Superhero>?> LoadSuperheroesAsync()
{
    try
    {
        var dataPath = Path.Combine(app.Environment.ContentRootPath, "data", "superheroes.json");

        if (!File.Exists(dataPath))
        {
            return null;
        }

        var json = await File.ReadAllTextAsync(dataPath);

        return JsonSerializer.Deserialize<List<Superhero>>(json, jsonOptions);
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"Error loading superheroes data: {ex.Message}");
        return null;
    }
}

static string GenerateBattleNarration(Superhero hero1, Superhero hero2)
{
    var hero1Advantages = new List<string>();
    var hero2Advantages = new List<string>();

    CompareStat("intelligence", hero1.Powerstats.Intelligence, hero2.Powerstats.Intelligence);
    CompareStat("strength", hero1.Powerstats.Strength, hero2.Powerstats.Strength);
    CompareStat("speed", hero1.Powerstats.Speed, hero2.Powerstats.Speed);
    CompareStat("durability", hero1.Powerstats.Durability, hero2.Powerstats.Durability);
    CompareStat("power", hero1.Powerstats.Power, hero2.Powerstats.Power);
    CompareStat("combat", hero1.Powerstats.Combat, hero2.Powerstats.Combat);

    var outcome = hero1Advantages.Count switch
    {
        _ when hero1Advantages.Count > hero2Advantages.Count => $"{hero1.Name} takes the win by controlling more categories.",
        _ when hero2Advantages.Count > hero1Advantages.Count => $"{hero2.Name} takes the win by controlling more categories.",
        _ => "Neither hero gives an inch, and the clash ends in a dramatic draw."
    };

    var hero1Summary = hero1Advantages.Count == 0
        ? $"{hero1.Name} cannot claim a clear statistical edge."
        : $"{hero1.Name} leads in {string.Join(", ", hero1Advantages)}.";
    var hero2Summary = hero2Advantages.Count == 0
        ? $"{hero2.Name} cannot claim a clear statistical edge."
        : $"{hero2.Name} leads in {string.Join(", ", hero2Advantages)}.";

    return $"{hero1.Name} collides with {hero2.Name} in a blockbuster showdown. {hero1Summary} {hero2Summary} {outcome}";

    void CompareStat(string statName, int hero1Stat, int hero2Stat)
    {
        if (hero1Stat > hero2Stat)
        {
            hero1Advantages.Add(statName);
        }
        else if (hero2Stat > hero1Stat)
        {
            hero2Advantages.Add(statName);
        }
    }
}

static bool IsValidHero(Superhero? hero)
{
    return hero is not null
        && hero.Id > 0
        && !string.IsNullOrWhiteSpace(hero.Name)
        && hero.Powerstats is not null;
}

public partial class Program { }
