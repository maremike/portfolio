export function renderSignaturePage() {
    const section = document.createElement("section");
    section.className = "section";

    section.innerHTML = `
    <p style="font-family: Arial; font-size: 14px; color: #000000;">Mit freundlichen Grüßen / Kind Regards</p>
    <br>

    <table style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.2;">
        <!-- Name and title section with reduced padding -->
        <tr>
            <td colspan="2" style="padding: 2px 0;">
                <strong style="font-family: Arial; font-size: 16px; color: #004870;">Michael Markov</strong>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="padding: 2px 0;">
                <em style="font-family: Arial; font-size: 14px; color: #464646;">Student — Informatik: Software- und Systemtechnik — Hochschule Bremen</em>
            </td>
        </tr>
        <!-- Horizontal line with reduced margin -->
        <tr>
            <td colspan="2">
                <hr style="border: 0; border-top: 1px solid #000000; margin: 4px 0;">
            </td>
        </tr>
        <!-- Contact information with updated icons -->
        <tr>
            <td style="padding: 0; vertical-align: middle; width: 20px; text-align: center;">
                <img src="https://cdn.michael.markov.uk/icons/000000/phone.svg" alt="phone" width="20" height="20" style="vertical-align: middle;">
            </td>
            <td style="padding: 2px 0; vertical-align: middle;">
                <a href="tel:+49 1515 6526597" style="text-decoration: none; color: #0078d4; font-size: 12px;">+49 1515 6526597</a>
            </td>
        </tr>
        <tr>
            <td style="padding: 0; vertical-align: middle; width: 20px; text-align: center;">
                <img src="https://cdn.michael.markov.uk/icons/000000/mail.svg" alt="mail" width="18" height="18" style="vertical-align: middle;">
            </td>
            <td style="padding: 2px 0; vertical-align: middle;">
                <a href="mailto:michael@markov.uk" style="text-decoration: none; color: #0078d4; font-size: 12px;">michael@markov.uk</a>
            </td>
        </tr>
        <tr>
            <td style="padding: 0; vertical-align: middle; width: 20px; text-align: center;">
                <img src="https://cdn.michael.markov.uk/icons/000000/location.svg" alt="location" width="20" height="20" style="vertical-align: middle;">
            </td>
            <td style="padding: 2px 0; vertical-align: middle; color: #000000; font-size: 12px;">Steinkamp 10i, 28717 Bremen, Germany</td>
        </tr>
        <tr>
            <td style="padding: 0; vertical-align: middle; width: 20px; text-align: center; color: #ff0000;">
                <svg width="18" height="18" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;">
                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                    <path d="M521 3645 c-54 -25 -54 -26 -35 -44 10 -10 479 -401 1041 -869 l1022 -851 1033 860 c568 474 1037 865 1042 870 6 5 -13 19 -45 34 l-54 25 -1975 0 -1975 0 -54 -25z"/>
                    <path d="M372 2113 c3 -1072 5 -1192 19 -1224 23 -51 75 -107 123 -132 l41 -22 1974 -3 c1339 -1 1986 1 2012 8 60 16 121 68 152 130 l27 55 -2 1188 -3 1188 -1083 -902 -1083 -901 -42 35 c-23 19 -510 424 -1082 901 -571 476 -1043 866 -1047 866 -5 0 -7 -534 -6 -1187z"/>
                    </g>
                </svg>
            </td>
            <td style="padding: 2px 0; vertical-align: middle;">
                <a href="https://www.michael.markov.uk" style="text-decoration: none; color: #0078d4; font-size: 12px;">www.michael.markov.uk</a>
            </td>
        </tr>
        <!-- Horizontal line with reduced margin -->
        <tr>
            <td colspan="2">
                <hr style="border: 0; border-top: 1px solid #000000; margin: 4px 0;">
            </td>
        </tr>
        <!-- Disclaimer text -->
        <tr>
            <td colspan="2" style="color: #464646; font-size: 10px;">
                <strong><u>Disclaimer:</u></strong> This email and any attachments are intended solely for the person or entity to whom they are addressed and may contain confidential or private information. If you have received this email in error, please notify the sender immediately, delete it from your system, and refrain from sharing or using its contents in any way. Thank you for your understanding.
            </td>
        </tr>
        <!-- TODO: Add Webpage, Linkedin, Github, Gitlab, Instagram -->
    </table>
    `;
    
    return section;
}