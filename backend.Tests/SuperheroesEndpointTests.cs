using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace backend.Tests;

[TestClass]
public class SuperheroesEndpointTests
{
    private static WebApplicationFactory<Program> CreateFactory()
    {
        return new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.UseContentRoot(Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "../../../../backend")));
            });
    }

    [TestMethod]
    public async Task GetSuperheroes_ReturnsOkWithNonEmptyArray()
    {
        // Arrange
        var factory = CreateFactory();
        var client = factory.CreateClient();

        // Act
        var response = await client.GetAsync("/api/superheroes");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Content.Headers.ContentType?.MediaType.Should().Be("application/json");

        var json = await response.Content.ReadAsStringAsync();
        var superheroes = JsonSerializer.Deserialize<List<object>>(json);
        
        superheroes.Should().NotBeNull();
        superheroes.Should().NotBeEmpty();
    }

    [TestMethod]
    public async Task GetSuperheroById_ReturnsExpectedHero()
    {
        var factory = CreateFactory();
        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/superheroes/4");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var hero = await response.Content.ReadFromJsonAsync<JsonElement>();

        hero.GetProperty("id").GetInt32().Should().Be(4);
        hero.GetProperty("name").GetString().Should().Be("Batman");
    }

    [TestMethod]
    public async Task GetSuperheroPowerstats_ReturnsExpectedStats()
    {
        var factory = CreateFactory();
        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/superheroes/8/powerstats");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var powerstats = await response.Content.ReadFromJsonAsync<JsonElement>();

        powerstats.GetProperty("intelligence").GetInt32().Should().Be(81);
        powerstats.GetProperty("power").GetInt32().Should().Be(100);
    }

    [TestMethod]
    public async Task GetSuperheroById_WhenNotFound_Returns404()
    {
        var factory = CreateFactory();
        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/superheroes/9999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [TestMethod]
    public async Task PostBattleNarration_ReturnsNarrationForTwoHeroes()
    {
        var factory = CreateFactory();
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/battle-narration", new
        {
            hero1 = new
            {
                id = 4,
                name = "Batman",
                image = "https://example.com/batman.jpg",
                powerstats = new
                {
                    intelligence = 100,
                    strength = 26,
                    speed = 27,
                    durability = 50,
                    power = 47,
                    combat = 100
                }
            },
            hero2 = new
            {
                id = 10,
                name = "Iron Man",
                image = "https://example.com/iron-man.jpg",
                powerstats = new
                {
                    intelligence = 100,
                    strength = 85,
                    speed = 58,
                    durability = 85,
                    power = 100,
                    combat = 64
                }
            }
        });

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var payload = await response.Content.ReadFromJsonAsync<JsonElement>();
        var narration = payload.GetProperty("narration").GetString();

        narration.Should().Contain("Batman");
        narration.Should().Contain("Iron Man");
    }

    [TestMethod]
    public async Task PostBattleNarration_WhenHeroesMissing_ReturnsBadRequest()
    {
        var factory = CreateFactory();
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/battle-narration", new
        {
            hero1 = new
            {
                id = 4,
                name = "Batman"
            }
        });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}

    
