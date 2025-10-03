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
                <img src="https://cdn.michael.markov.uk/icons/000000ff/phone.svg" alt="phone" width="20" height="20" style="vertical-align: middle;">
            </td>
            <td style="padding: 2px 0; vertical-align: middle;">
                <a href="tel:+49 1515 6526597" style="text-decoration: none; color: #0078d4; font-size: 12px;">+49 1515 6526597</a>
            </td>
        </tr>
        <tr>
            <td style="padding: 0; vertical-align: middle; width: 20px; text-align: center;">
                <img src="https://cdn.michael.markov.uk/icons/000000ff/mail.svg" alt="mail" width="18" height="18" style="vertical-align: middle;">
            </td>
            <td style="padding: 2px 0; vertical-align: middle;">
                <a href="mailto:michael@markov.uk" style="text-decoration: none; color: #0078d4; font-size: 12px;">michael@markov.uk</a>
            </td>
        </tr>
        <tr>
            <td style="padding: 0; vertical-align: middle; width: 20px; text-align: center;">
                <img src="https://cdn.michael.markov.uk/icons/000000ff/location.svg" alt="location" width="20" height="20" style="vertical-align: middle;">
            </td>
            <td style="padding: 2px 0; vertical-align: middle; color: #000000; font-size: 12px;">Steinkamp 10i, 28717 Bremen, Germany</td>
        </tr>
        <tr>
            <td style="padding: 0; vertical-align: middle; width: 20px; text-align: center;">
                <img src="https://cdn.michael.markov.uk/icons/000000ff/globe.svg" alt="location" width="20" height="20" style="vertical-align: middle;">
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