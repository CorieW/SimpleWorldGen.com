namespace SimpleWorldGen.Entities;

public class Layer {
    public int Id { get; set; }
    public int WorldId { get; set; }
    public int BeginningNodeId { get; set; }
    public string Name { get; set; }
    public int Order { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation Properties
    public World World { get; set; }
    public Node BeginningNode { get; set; }
    public List<Node> Nodes { get; set; }
}