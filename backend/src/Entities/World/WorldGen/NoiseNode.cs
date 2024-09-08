namespace SimpleWorldGen.Entities;

public class NoiseNode {
    public int Id { get; set; }
    public int Octaves { get; set; }
    public float Scale { get; set; }
    public float Persistance { get; set; }
    public float Lacunarity { get; set; }
    public float Frequency { get; set; }
    public float XOffset { get; set; }
    public float YOffset { get; set; }
}