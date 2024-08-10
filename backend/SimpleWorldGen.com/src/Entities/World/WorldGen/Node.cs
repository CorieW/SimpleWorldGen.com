public class Node {
    public int Id { get; set; }
    public int LayerId { get; set; }
    public int? NextNodeId { get; set; }
    public int TypeId { get; set; }
    public int Seed { get; set; }
    public float Multiplier { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation Properties
    public Layer Layer { get; set; }
    public Node NextNode { get; set; }
    public NodeType Type { get; set; }
}