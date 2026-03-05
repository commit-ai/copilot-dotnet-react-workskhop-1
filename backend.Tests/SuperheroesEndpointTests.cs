using System.Collections.Generic;
using System.IO;
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
    [TestMethod]
    public async Task GetSuperheroes_ReturnsOkWithNonEmptyArray()
    {
        // Arrange
        var factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.UseContentRoot(Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "../../../../backend")));
            });

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
}

    
