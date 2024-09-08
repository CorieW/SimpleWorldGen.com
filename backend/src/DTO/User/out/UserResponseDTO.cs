namespace SimpleWorldGen.DTO;

public class UserResponseDTO
{
    public string Username { get; set; }
    public string DisplayName { get; set; }
    public string ProfileImageUri { get; set; }
    public string Token { get; set; }
    public DateTime TokenExpiration { get; set; }
}