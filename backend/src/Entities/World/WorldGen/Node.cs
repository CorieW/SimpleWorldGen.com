namespace SimpleWorldGen.Entities;

using SimpleWorldGen.Data;

public class Node {
    public int Id { get; set; }
    public int LayerId { get; set; }
    public int? NextNodeId { get; set; }
    public NodeTypeEnum Type { get; set; }
    public int ValueId { get; set; }
    public EffectTypeEnum Effect { get; set; }
    public string Seed { get; set; }
    public float Multiplier { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation Properties
    public Layer Layer { get; set; }
    public Node NextNode { get; set; }
}