namespace SimpleWorldGen.DTO;

using SimpleWorldGen.Data;

public class UpdateWorldDTO {
    public string WorldId { get; set; }
    public WorldInfo WorldInfo { get; set; }
    public Layer[] Layers { get; set; }
    public VisualizationSetting[] VisualizationSettings { get; set; }
}