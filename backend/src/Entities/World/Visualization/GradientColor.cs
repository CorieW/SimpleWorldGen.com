namespace SimpleWorldGen.Entities;

public class GradientColor {
    public int Id { get; set; }
    public int GradientId { get; set; }
    public string ColorHex { get; set; }
    public double Position { get; set; }

    // Navigation Properties
    public Gradient Gradient { get; set; }
}