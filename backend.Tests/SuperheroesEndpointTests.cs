using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
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
    private static WebApplicationFactory<Program> CreateFactory() =>
        new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.UseContentRoot(Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "../../../../backend")));
            });

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
    public async Task GetSuperheroes_ImageValues_AreLocalFilenamesWithoutExternalUrls()
    {
        // Arrange
        var factory = CreateFactory();
        var client = factory.CreateClient();
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        // Act
        var response = await client.GetAsync("/api/superheroes");
        var json = await response.Content.ReadAsStringAsync();
        var superheroes = JsonSerializer.Deserialize<List<JsonElement>>(json);

        // Assert
        superheroes.Should().NotBeNull();
        foreach (var hero in superheroes!)
        {
            var image = hero.GetProperty("image").GetString();
            image.Should().NotBeNullOrWhiteSpace();

            // Must not contain external URLs (prevents reintroduction of CDN dependencies)
            image.Should().NotContain("http://", "image should not reference an external URL");
            image.Should().NotContain("https://", "image should not reference an external URL");
            image.Should().NotContain("cdn.jsdelivr.net", "image should not reference the jsdelivr CDN");

            // Must be a plain filename (no path separators), keeping backend decoupled from frontend hosting layout
            image.Should().NotContain("/", "image should be a plain filename without path segments");
            image.Should().NotContain("\\", "image should be a plain filename without path segments");

            // Must end with a known image extension
            Path.GetExtension(image).Should().BeOneOf(".jpg", ".jpeg", ".png", ".webp", ".svg",
                "image filename should have a recognized image extension");
        }
    }
}

