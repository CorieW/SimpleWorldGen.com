using System;

public class World {
    public string Name { get; set; }
    public int CreatorId { get; set; }
    public bool Public { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation Properties
    public User Creator { get; set; }
    public List<Layer> Layers { get; set; }
    public List<VisualizationSetting> VisualizationSettings { get; set; }
}