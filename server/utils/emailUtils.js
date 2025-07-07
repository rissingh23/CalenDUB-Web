/**
 * Check if an email is a University of Washington email
 * @param {string} email - The email to check
 * @returns {boolean} - True if it's a UW email, false otherwise
 */
function isUWEmail(email) {
    if (!email || typeof email !== 'string') {
        return false;
    }
    
    // Convert to lowercase for case-insensitive comparison
    const normalizedEmail = email.toLowerCase();
    
    // Check for UW email domains
    const uwDomains = [
        '@uw.edu',
        '@washington.edu',
        '@u.washington.edu'
    ];
    
    return uwDomains.some(domain => normalizedEmail.endsWith(domain));
}

module.exports = {
    isUWEmail
}; 