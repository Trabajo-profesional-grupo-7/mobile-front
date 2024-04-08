

export const dateParser = (date: string) => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const [year, monthStr, dayStr] = date.split("-");
    const month = months[parseInt(monthStr, 10) - 1];
    const day = parseInt(dayStr, 10);

    let daySuffix = "";
    switch (day % 10) {
        case 1:
            daySuffix = "st";
            break;
        case 2:
            daySuffix = "nd";
            break;
        case 3:
            daySuffix = "rd";
            break;
        default:
            daySuffix = "th";
            break;
    }

    return `${month} ${day}${daySuffix}`;
}