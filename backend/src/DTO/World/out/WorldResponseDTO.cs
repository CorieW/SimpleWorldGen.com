namespace SimpleWorldGen.DTO;

using SimpleWorldGen.Data;

public class WorldResponseDTO {
    public string WorldId { get; set; }
    public WorldInfo WorldInfo { get; set; }
    public User Creator { get; set; }
    public IEnumerable<IdentifiedLayer> Layers { get; set; }
    public IEnumerable<IdentifiedVisualizationSetting> VisualizationSettings { get; set; }
    public DateTime CreationDate { get; set; }

    public WorldResponseDTO() {
        // TODO: Implement constructor
    }

    public class IdentifiedLayer : Layer {
        public int LayerId { get; set; }
    }

    public class IdentifiedNode : Node {
        public int NodeId { get; set; }
    }

    public class IdentifiedVisualizationSetting : VisualizationSetting {
        public int VisualizationSettingId { get; set; }
    }

    public class IdentifiedVisualizationSettingCondition : VisualizationSettingCondition {
        public int VisualizationSettingConditionId { get; set; }
    }
}