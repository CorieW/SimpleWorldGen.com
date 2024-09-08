namespace SimpleWorldGen.DTO;

using SimpleWorldGen.Data;

public class CreateWorldDTO {
    public WorldInfo WorldInfo { get; set; }
    public Layer[] Layers { get; set; }
    public VisualizationSetting[] VisualizationSettings { get; set; }
}