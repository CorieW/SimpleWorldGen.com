public class User {
    public int Id;
    public int CurrentUserDataId;
    public DateTime CreatedAt;

    // Navigation Properties
    public UserData CurrentUserData;
    public List<UserData> UserDataHistory;
    public List<PasswordResetRequest> PasswordResetRequests;
    public List<AccountDeletion> AccountDeletions;
    public List<World> Worlds;
}