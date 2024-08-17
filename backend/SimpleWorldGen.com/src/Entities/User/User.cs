namespace SimpleWorldGen.Entities;

public class User {
    public int Id;
    public int CurrentUserDataId;
    public int UserSettingsId;
    public DateTime TokenExpiration;
    public DateTime CreatedAt;

    // Navigation Properties
    public UserData CurrentUserData;
    public UserSettings UserSettings;
    public List<BannedUser> Bans;
    public List<UserData> UserDataHistory;
    public List<UserModerationNote> UserModerationNotes;
    public List<PasswordResetRequest> PasswordResetRequests;
    public List<AccountDeletion> AccountDeletions;
    public List<World> Worlds;
}