namespace SimpleWorldGen.Entities;

public class UserSettings {
    public int Id { get; set; }
    public int LocaleId { get; set; }

    // Navigation Properties
    public Locale Locale { get; set; }
}