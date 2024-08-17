namespace SimpleWorldGen.Entities;

public class UserDetailsModification {
    public int Id { get; set; }
    public int UserId { get; set; }
    public int OldUserDataId { get; set; }
    public int NewUserDataId { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation Properties
    public User User { get; set; }
    public UserData OldUserData { get; set; }
    public UserData NewUserData { get; set; }
}