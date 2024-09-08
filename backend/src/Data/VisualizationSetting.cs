namespace SimpleWorldGen.Data;

public class VisualizationSetting {
    public VisualizationSettingTypeEnum Type { get; set; }
    public IEnumerable<VisualizationSettingCondition> Conditions { get; set; }

    // Color
    public string Color { get; set; }

    // Gradient
    public GradientColor[] Gradient { get; set; }

    public class GradientColor {
        public float Position { get; set; }
        public string Color { get; set; }
    }
}