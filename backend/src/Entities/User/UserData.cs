namespace SimpleWorldGen.Entities;

public class UserData {
    public int Id { get; set; }
    public string Username { get; set; }
    public string DisplayName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string ProfileImageUri { get; set; }
    public DateTime CreatedAt { get; set; }
}