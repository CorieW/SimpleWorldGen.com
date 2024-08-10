public class PasswordResetRequest {
    public int Id { get; set; }
    public int UserId { get; set; }
    public string ResetToken { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? UsedAt { get; set; }
    
    // Navigation Properties
    public User User { get; set; }
    public PasswordReset PasswordReset { get; set; }
}