namespace SimpleWorldGen.Entities;

public class PasswordReset {
    public int Id { get; set; }
    public int PasswordResetRequestId { get; set; }
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation Properties
    public PasswordResetRequest PasswordResetRequest { get; set; }
}