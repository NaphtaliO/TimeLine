export const maskEmail = (email) => {
    const [localPart, domainPart] = email.split('@');

    // Get the first three characters of the local part
    const firstThreeChars = localPart.slice(0, 3);

    // Get the last character of the local part
    const lastChar = localPart.slice(-2);

    // Calculate the number of asterisks needed in between
    const asterisksCount = localPart.length - 4;

    // Create the masked local part with asterisks
    const maskedLocalPart = firstThreeChars + '*'.repeat(asterisksCount) + lastChar;

    // Concatenate the masked local part with the domain part
    const maskedEmail = maskedLocalPart + '@' + domainPart;

    return maskedEmail;
}