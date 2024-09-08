namespace SimpleWorldGen.Data;

public class Node {
    public NodeTypeEnum Type { get; set; }
    public EffectTypeEnum Effect { get; set; }
    public string Seed { get; set; }
    public float Multiplier { get; set; }
    public Node NextNode { get; set; }

    // Simplex Noise
    public int Octaves { get; set; }
    public float Scale { get; set; }
    public float Persistence { get; set; }
    public float Lacunarity { get; set; }
    public float XOffset { get; set; }
    public float YOffset { get; set; }
}