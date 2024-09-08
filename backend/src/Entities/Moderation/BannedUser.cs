namespace SimpleWorldGen.Entities;

public class BannedUser {
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Reason { get; set; }
    public string Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? LiftedAt { get; set; }

    // Navigation Properties
    public User User { get; set; }
}