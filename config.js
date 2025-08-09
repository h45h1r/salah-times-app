// API Configuration File
// Replace these with your own API keys

const CONFIG = {
    // London Prayer Times API
    // Get your free API key from: https://www.londonprayertimes.com/api/
    londonPrayerTimes: {
        apiKey: 'cde641ff-cdde-4d25-8a62-4ec8cabc7f57', // Replace with your API key
        url: 'https://www.londonprayertimes.com/api/times/'
    },
    
    // Aladhan API (Free, no API key needed)
    aladhan: {
        url: 'https://api.aladhan.com/v1/timings/',
        latitude: 51.5074, // London coordinates
        longitude: -0.1278,
        method: 2 // Muslim World League
    },
    
    // Sunrise/Sunset API (Free, no API key needed)
    sunriseSunset: {
        url: 'https://api.sunrise-sunset.org/json'
    },
    
    // Islamic Date API (Free, no API key needed)
    islamicDate: {
        url: 'https://api.aladhan.com/v1/gToH/'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
