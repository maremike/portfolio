export function getTimeFactor(timeZone = "Europe/Berlin") {
    // Get current time in the specified timezone
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
        timeZone: timeZone,
    });
    
    // Extract hours and minutes
    const parts = formatter.formatToParts(now);
    let hour = 0, minute = 0;
    parts.forEach(part => {
        if (part.type === "hour") hour = parseInt(part.value, 10);
        if (part.type === "minute") minute = parseInt(part.value, 10);
    });

    const timeFactor = (hour + minute / 60) / 24;
    return timeFactor;
    // Mapping of hours to factor:
    //  0:00 → 0 / 24 = 0
    //  1:00 → 1 / 24 ≈ 0.0417
    //  2:00 → 2 / 24 ≈ 0.0833
    //  3:00 → 3 / 24 ≈ 0.1250
    //  4:00 → 4 / 24 ≈ 0.1667
    //  5:00 → 5 / 24 ≈ 0.2083
    //  6:00 → 6 / 24 = 0.25
    //  7:00 → 7 / 24 ≈ 0.2917
    //  8:00 → 8 / 24 ≈ 0.3333
    //  9:00 → 9 / 24 = 0.3750
    // 10:00 → 10 / 24 ≈ 0.4167
    // 11:00 → 11 / 24 ≈ 0.4583
    // 12:00 → 12 / 24 = 0.5
    // 13:00 → 13 / 24 ≈ 0.5417
    // 14:00 → 14 / 24 ≈ 0.5833
    // 15:00 → 15 / 24 ≈ 0.6250
    // 16:00 → 16 / 24 ≈ 0.6667
    // 17:00 → 17 / 24 ≈ 0.7083
    // 18:00 → 18 / 24 = 0.75
    // 19:00 → 19 / 24 ≈ 0.7917
    // 20:00 → 20 / 24 ≈ 0.8333
    // 21:00 → 21 / 24 ≈ 0.8750
    // 22:00 → 22 / 24 ≈ 0.9167
    // 23:00 → 23 / 24 ≈ 0.9583
    // 24:00 → 24 / 24 = 1

    // Time of day mapping:
    // 21:00 - 6:00 = night
    // 6:00 - 9:00 = sunrise
    // 9:00 - 12:00 = morning
    // 12:00 - 15:00 = noon
    // 15:00 - 18:00 = afternoon
    // 18:00 - 21:00 = sunset
}
