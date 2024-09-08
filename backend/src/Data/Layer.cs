namespace SimpleWorldGen.Data;

public class Layer {
    public string Name { get; set; }
    public IEnumerable<Node> Nodes { get; set; }
}