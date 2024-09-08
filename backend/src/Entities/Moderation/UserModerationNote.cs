namespace SimpleWorldGen.Entities;

public class UserModerationNote {
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Note { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation Properties
    public User User { get; set; }
}