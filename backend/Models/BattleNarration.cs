namespace backend.Models;

public class BattleNarrationRequest
{
    public Superhero? Hero1 { get; set; }
    public Superhero? Hero2 { get; set; }
}

public class BattleNarrationResponse
{
    public string Narration { get; set; } = string.Empty;
}
