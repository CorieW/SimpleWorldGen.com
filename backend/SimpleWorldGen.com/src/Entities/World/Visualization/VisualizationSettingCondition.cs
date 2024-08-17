namespace SimpleWorldGen.Entities;

public class VisualizationSettingCondition {
    public int Id { get; set; }
    public int VisualizationSettingId { get; set; }
    public int Order { get; set; }
    public float MinValue { get; set; }
    public float MaxValue { get; set; }
    public bool MinInclusive { get; set; }
    public bool MaxInclusive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation Properties
    public VisualizationSetting VisualizationSetting { get; set; }
}