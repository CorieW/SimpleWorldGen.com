namespace SimpleWorldGen.Entities;

using SimpleWorldGen.Data;

public class VisualizationSetting {
    public int Id { get; set; }
    public int WorldId { get; set; }
    public VisualizationSettingTypeEnum Type { get; set; }
    public int ValueId { get; set; }
    public int Order { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation Properties
    public World World { get; set; }
    public Color? ColorValue { get; set; }
    public Gradient? GradientValue { get; set; }
}