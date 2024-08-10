public class AccountDeletion {
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UndoToken { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime CompletionAt { get; set; }
    public DateTime? UndoneAt { get; set; }

    // Navigation Properties
    public User User { get; set; }
}