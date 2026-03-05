using System.Text.Json.Serialization;

namespace backend.Models;

public class Superhero
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    [JsonPropertyName("fullName")]
    public string FullName { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public Powerstats Powerstats { get; set; } = new Powerstats();
}

public class Powerstats
{
    public int Intelligence { get; set; }
    public int Strength { get; set; }
    public int Speed { get; set; }
    public int Durability { get; set; }
    public int Power { get; set; }
    public int Combat { get; set; }
}
