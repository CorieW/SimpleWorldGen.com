namespace SimpleWorldGen.DTO;

using SimpleWorldGen.Data;

public class WorldInfoResponseDTO
{
    public string WorldId { get; set; }
    public WorldInfo WorldInfo { get; set; }
    public User Creator { get; set; }
    public DateTime CreationDate { get; set; }
}