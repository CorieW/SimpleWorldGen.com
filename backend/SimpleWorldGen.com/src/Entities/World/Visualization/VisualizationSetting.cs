public class VisualizationSetting {
    public int Id { get; set; }
    public int WorldId { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }
    public int Order { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation Properties
    public World World { get; set; }
}