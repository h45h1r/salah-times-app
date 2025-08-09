const apiKey = 'cde641ff-cdde-4d25-8a62-4ec8cabc7f57'; // Replace with your API key
let currentDate = new Date();
let selectedDate = new Date();

// DOM Elements
const nextPrayerName = document.getElementById('next-prayer-name');
const countdownTimer = document.getElementById('countdown-timer');
const gregorianDate = document.querySelector('.gregorian-date');
const hijriDate = document.querySelector('.hijri-date');
const currentTimeElement = document.querySelector('.current-time');

// Prayer time elements
const prayerTimes = {
    fajr: document.getElementById('fajr-time'),
    dhuhr: document.getElementById('dhuhr-time'),
    asr: document.getElementById('asr-time'),
    maghrib: document.getElementById('maghrib-time'),
    isha: document.getElementById('isha-time')
};

// Sunrise/Tahajjud elements
const sunriseTimeElement = document.getElementById('sunrise-time');
const tahajjudTimeElement = document.getElementById('tahajjud-time');
const sunriseTahajjudCard = document.getElementById('sunriseTahajjudCard');

// Prayer cards
const prayerCards = {
    fajr: document.getElementById('fajr-card'),
    dhuhr: document.getElementById('dhuhr-card'),
    asr: document.getElementById('asr-card'),
    maghrib: document.getElementById('maghrib-card'),
    isha: document.getElementById('isha-card')
};

// Add today button functionality
const todayBtn = document.getElementById('todayBtn');

// Function to update today button visibility
function updateTodayButtonVisibility() {
    const today = new Date();
    if (isSameDay(selectedDate, today)) {
        todayBtn.classList.add('hidden');
    } else {
        todayBtn.classList.remove('hidden');
    }
}

// Add click handler for today button
todayBtn.addEventListener('click', () => {
    selectedDate = new Date();
    fetchPrayerTimes(selectedDate);
    updateTodayButtonVisibility();
});

// Get current date and time in London timezone
function getLondonTime() {
    return new Date(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }));
}

// Update current time
function updateCurrentTime() {
    const now = new Date();
    currentTimeElement.textContent = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

// Fetch Islamic date from Aladhan API
async function fetchIslamicDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const url = `https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.code === 200) {
            const hijri = data.data.hijri;
            hijriDate.textContent = `${hijri.day} ${hijri.month.en} ${hijri.year}`;
        } else {
            hijriDate.textContent = 'Error loading date';
        }
    } catch (error) {
        console.error('Error fetching Islamic date:', error);
        hijriDate.textContent = 'Error loading date';
    }
}

// Add event listeners for date navigation
const prevDateBtn = document.getElementById('prevDate');
const nextDateBtn = document.getElementById('nextDate');

prevDateBtn.addEventListener('click', () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    selectedDate = newDate;
    fetchPrayerTimes(selectedDate);
});

nextDateBtn.addEventListener('click', () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    selectedDate = newDate;
    fetchPrayerTimes(selectedDate);
});

// Fetch today's prayer times specifically for the next prayer box
async function fetchTodaysPrayerTimesForNextPrayer() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;

    const apiKey = 'cde641ff-cdde-4d25-8a62-4ec8cabc7f57';
    const url = `https://www.londonprayertimes.com/api/times/?format=json&key=${apiKey}&date=${formattedDate}&24hours=true`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data) {
            const todaysData = {
                fajr: data.fajr,
                dhuhr: data.dhuhr,
                asr: data.asr,
                maghrib: data.magrib,
                isha: data.isha
            };

            // Update only the next prayer box with today's data
            updateNextPrayer(todaysData);
        }
    } catch (error) {
        console.error('Error fetching today\'s prayer times for next prayer:', error);
        // Keep showing current next prayer data on error
    }
}

// Fetch prayer times using London Prayer Times API
async function fetchPrayerTimes(date) {
    // Format date for API (YYYY-MM-DD)
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;

    const apiKey = 'cde641ff-cdde-4d25-8a62-4ec8cabc7f57';
    const url = `https://www.londonprayertimes.com/api/times/?format=json&key=${apiKey}&date=${formattedDate}&24hours=true`;

    try {
        console.log('[PWA] Fetching prayer times for:', formattedDate);
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache', // Force fresh data for prayer times
            credentials: 'omit'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        if (data) {
            console.log('[PWA] Prayer times loaded successfully');
            // Update Gregorian date
            gregorianDate.textContent = date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Fetch and display Islamic date
            await fetchIslamicDate(date);

            // Format the data
            const formattedData = {
                fajr: data.fajr,
                dhuhr: data.dhuhr,
                asr: data.asr,
                maghrib: data.magrib,
                isha: data.isha
            };

            // Update the prayer times first
            updatePrayerTimes(formattedData);

            // Always update next prayer with today's data for current time context
            const today = new Date();
            if (isSameDay(selectedDate, today)) {
                // If viewing today, update next prayer with current data
                updateNextPrayer(formattedData);
            } else {
                // If viewing another day, fetch today's data for next prayer box
                fetchTodaysPrayerTimesForNextPrayer();
            }

            updateTodayButtonVisibility();
        }
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        Object.values(prayerTimes).forEach(element => {
            element.textContent = 'Error';
        });
        nextPrayerName.textContent = 'Error';
        countdownTimer.textContent = '--:--:--';
    }
}

// Helper function to convert time to 24-hour format
function ensureTimeFormat(timeStr) {
    if (!timeStr) return '--:--';

    // If time is already in 24h format, return as is
    if (!timeStr.includes('AM') && !timeStr.includes('PM')) {
        return timeStr;
    }

    // Convert from AM/PM to 24h format
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// Helper function to convert time to 12-hour format with AM/PM
function convertTo12HourFormat(timeStr) {
    if (!timeStr) return '--:--';

    let hours, minutes;
    
    // Handle both 24h and AM/PM formats
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
        return timeStr; // Already in 12-hour format
    }
    
    // Parse 24-hour format
    [hours, minutes] = timeStr.split(':').map(Number);
    
    let period = 'AM';
    let displayHours = hours;
    
    if (hours === 0) {
        displayHours = 12;
    } else if (hours === 12) {
        period = 'PM';
    } else if (hours > 12) {
        displayHours = hours - 12;
        period = 'PM';
    }
    
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

// Fetch accurate sunrise time for London using sunrise-sunset.org API
async function fetchSunriseTime(date) {
    // London coordinates
    const lat = 51.5074;
    const lng = -0.1278;
    
    // Format date for API (YYYY-MM-DD)
    const formattedDate = date.toISOString().split('T')[0];
    
    const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${formattedDate}&formatted=0`;
    
    try {
        console.log('[PWA] Fetching sunrise time for:', formattedDate);
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'default', // Allow some caching for sunrise times
            credentials: 'omit'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'OK') {
            console.log('[PWA] Sunrise time loaded successfully');
            // Parse the UTC sunrise time
            const sunriseUTC = new Date(data.results.sunrise);
            
            // Convert to London local time
            const londonTime = new Date(sunriseUTC.toLocaleString('en-US', { timeZone: 'Europe/London' }));
            
            // Format as HH:MM
            const hours = londonTime.getHours();
            const minutes = londonTime.getMinutes();
            
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        } else {
            console.error('Sunrise API error:', data.status);
            return '--:--';
        }
    } catch (error) {
        console.error('Error fetching sunrise time:', error);
        return '--:--';
    }
}

// Calculate Tahajjud time using exact steps provided
function calculateTahajjudTime(maghribTime, ishaTime, fajrTime) {
    // Step 1: Convert both times to minutes from midnight
    const maghribMinutes = convertToMinutes(maghribTime);
    let fajrMinutes = convertToMinutes(fajrTime);
    
    // Step 2: If Fajr is after midnight, add 24 hours to Maghrib if necessary
    if (fajrMinutes <= maghribMinutes) {
        fajrMinutes += 24 * 60;
    }
    
    // Step 3: Find total night duration = Fajr - Maghrib
    const totalNightDuration = fajrMinutes - maghribMinutes;
    
    // Step 4: Divide the duration by 3
    const oneThirdDuration = totalNightDuration / 3;
    
    // Step 5: Subtract that third from Fajr time to get start of last third
    let tahajjudMinutes = fajrMinutes - oneThirdDuration;
    
    // Handle day rollover for display
    if (tahajjudMinutes >= 24 * 60) {
        tahajjudMinutes -= 24 * 60;
    }
    
    // Step 6: Convert back to HH:MM format in 24-hour time, rounded to nearest minute
    const roundedMinutes = Math.round(tahajjudMinutes);
    const hours = Math.floor(roundedMinutes / 60);
    const mins = roundedMinutes % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// Update prayer times display
function updatePrayerTimes(data) {
    // Reset all active states
    Object.values(prayerCards).forEach(card => card.classList.remove('active'));

    // Update each prayer time with AM/PM
    prayerTimes.fajr.textContent = ensureTimeFormat(data.fajr);
    prayerTimes.dhuhr.textContent = ensureTimeFormat(data.dhuhr);
    prayerTimes.asr.textContent = ensureTimeFormat(data.asr);
    prayerTimes.maghrib.textContent = ensureTimeFormat(data.maghrib);
    prayerTimes.isha.textContent = ensureTimeFormat(data.isha);
    
    // Update sunrise using sunrise-sunset.org API and calculate tahajjud
    if (sunriseTimeElement) {
        fetchSunriseTime(selectedDate).then(sunriseTime => {
            sunriseTimeElement.textContent = sunriseTime;
        });
    }
    
    if (data.maghrib && data.isha && data.fajr && tahajjudTimeElement) {
        const tahajjudTime = calculateTahajjudTime(data.maghrib, data.isha, data.fajr);
        tahajjudTimeElement.textContent = tahajjudTime;
    }
}

// Calculate and update next prayer (always uses today's data)
function updateNextPrayer(data) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
        { name: 'Fajr', time: convertToMinutes(data.fajr), icon: 'dark_mode' },
        { name: 'Dhuhr', time: convertToMinutes(data.dhuhr), icon: 'light_mode' },
        { name: 'Asr', time: convertToMinutes(data.asr), icon: 'wb_twilight' },
        { name: 'Maghrib', time: convertToMinutes(data.maghrib), icon: 'nights_stay' },
        { name: 'Isha', time: convertToMinutes(data.isha), icon: 'bedtime' }
    ];

    let nextPrayer = null;

    // First, check if any prayer has passed within the last 30 minutes
    for (let prayer of prayers) {
        const prayerTime = new Date(now);
        const hours = Math.floor(prayer.time / 60);
        const minutes = prayer.time % 60;
        prayerTime.setHours(hours);
        prayerTime.setMinutes(minutes);
        prayerTime.setSeconds(0);
        
        const diff = prayerTime - now;
        
        // If prayer time has passed within the last 30 minutes, use this prayer
        if (diff < 0 && diff > -30 * 60 * 1000) {
            nextPrayer = prayer;
            break;
        }
    }

    // If no prayer has passed within 30 minutes, find the next prayer
    if (!nextPrayer) {
        nextPrayer = prayers.find(prayer => prayer.time > currentTime);
        
        if (!nextPrayer) {
            nextPrayer = { ...prayers[0], time: prayers[0].time };
            nextPrayer.isTomorrow = true;
        }
    }

    // Update next prayer display
    const nextPrayerElement = document.querySelector('.next-prayer');
    nextPrayerName.textContent = nextPrayer.name;

    // Update prayer-specific styles and icon based on current time
    const currentHour = now.getHours();
    let timeBasedClass = '';
    
    // Determine background color based on current time
    if (currentHour >= 20 || currentHour < 6) {
        // Night time (8 PM - 6 AM) - use night theme
        timeBasedClass = 'night';
    } else if (currentHour >= 6 && currentHour < 12) {
        // Morning (6 AM - 12 PM) - use morning theme
        timeBasedClass = 'morning';
    } else if (currentHour >= 12 && currentHour < 17) {
        // Afternoon (12 PM - 5 PM) - use afternoon theme
        timeBasedClass = 'afternoon';
    } else {
        // Evening (5 PM - 8 PM) - use evening theme
        timeBasedClass = 'evening';
    }
    
    nextPrayerElement.className = `next-prayer ${timeBasedClass}`;
    const iconElement = document.querySelector('.next-prayer-icon i');
    iconElement.className = 'material-symbols-rounded';
    iconElement.textContent = nextPrayer.icon;

    // Mark active prayer card only if viewing today
    const today = new Date();
    if (isSameDay(selectedDate, today)) {
        const activePrayerCard = prayerCards[nextPrayer.name.toLowerCase()];
        if (activePrayerCard) {
            Object.values(prayerCards).forEach(card => card.classList.remove('active'));
            activePrayerCard.classList.add('active');
        }
    } else {
        // Remove active states when viewing other dates
        Object.values(prayerCards).forEach(card => card.classList.remove('active'));
    }

    // Start countdown
    startCountdown(nextPrayer);
}

// Convert time string to decimal hours
function convertToMinutes(timeStr) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes; // Return total minutes instead of decimal hours
}

// Start countdown timer (always for today's prayers)
function startCountdown(nextPrayer) {
    // Clear any existing countdown
    if (window.countdownInterval) {
        clearInterval(window.countdownInterval);
    }

    function updateDisplay() {
        const now = new Date();
        const prayerTime = new Date(now);

        // Convert prayer time from minutes to hours and minutes
        const hours = Math.floor(nextPrayer.time / 60);
        const minutes = nextPrayer.time % 60;

        prayerTime.setHours(hours);
        prayerTime.setMinutes(minutes);
        prayerTime.setSeconds(0);

        if (nextPrayer.isTomorrow) {
            prayerTime.setDate(prayerTime.getDate() + 1);
        }

        const diff = prayerTime - now;

        // If prayer time has passed within the last 30 minutes, show +time
        if (diff < 0 && diff > -30 * 60 * 1000) {
            // Prayer time has passed but within 30 minutes
            const totalSecondsPassed = Math.floor(Math.abs(diff) / 1000);
            const hoursPassed = Math.floor(totalSecondsPassed / 3600);
            const minutesPassed = Math.floor((totalSecondsPassed % 3600) / 60);
            const secondsPassed = totalSecondsPassed % 60;
            
            // Show +hours:minutes:seconds (e.g., +00:09:23) for consistency
            countdownTimer.textContent = `+${String(hoursPassed).padStart(2, '0')}:${String(minutesPassed).padStart(2, '0')}:${String(secondsPassed).padStart(2, '0')}`;
        } else if (diff < -30 * 60 * 1000) {
            // More than 30 minutes have passed, refresh prayer times to get next prayer
            fetchPrayerTimes(new Date());
            return;
        } else if (diff >= 0) {
            // Prayer time is in the future, show countdown
            // Calculate hours, minutes, seconds
            const hours_remaining = Math.floor(diff / (1000 * 60 * 60));
            const minutes_remaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds_remaining = Math.floor((diff % (1000 * 60)) / 1000);

            // Update display with - prefix for countdown
            countdownTimer.textContent = `-${String(hours_remaining).padStart(2, '0')}:${String(minutes_remaining).padStart(2, '0')}:${String(seconds_remaining).padStart(2, '0')}`;
        }
    }

    // Update immediately
    updateDisplay();

    // Update every second
    window.countdownInterval = setInterval(updateDisplay, 1000);
}

// Add helper function to compare dates
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// Add flip animation for sunrise/tahajjud card
function initSunriseTahajjudCard() {
    if (sunriseTahajjudCard) {
        const flipCard = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            console.log('Flipping card, current state:', sunriseTahajjudCard.classList.contains('flipped'));
            sunriseTahajjudCard.classList.toggle('flipped');
            console.log('Card flipped to:', sunriseTahajjudCard.classList.contains('flipped') ? 'tahajjud' : 'sunrise');
        };

        // Clear any existing listeners
        sunriseTahajjudCard.onclick = null;
        sunriseTahajjudCard.ontouchend = null;

        // Add click event
        sunriseTahajjudCard.addEventListener('click', flipCard);
        
        // Add touch event for mobile
        sunriseTahajjudCard.addEventListener('touchend', flipCard);

        // Force proper 3D rendering
        sunriseTahajjudCard.style.transformStyle = 'preserve-3d';
        sunriseTahajjudCard.style.webkitTransformStyle = 'preserve-3d';
        
        // Ensure all card faces have proper settings
        const cardFaces = sunriseTahajjudCard.querySelectorAll('.card-face');
        cardFaces.forEach((face, index) => {
            face.style.backfaceVisibility = 'hidden';
            face.style.webkitBackfaceVisibility = 'hidden';
            face.style.transformStyle = 'preserve-3d';
            face.style.webkitTransformStyle = 'preserve-3d';
            console.log(`Card face ${index} configured for 3D`);
        });
        
        console.log('Sunrise/Tahajjud card initialization complete');
    }
}

// Initialize
// Check if running as PWA
function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true ||
           document.referrer.includes('android-app://');
}

// Initialize PWA-specific features
function initPWA() {
    if (isPWA()) {
        console.log('[PWA] Running in PWA mode');
        document.body.classList.add('pwa-mode');
        
        // Force hardware acceleration for all animated elements
        const animatedElements = document.querySelectorAll('.sunrise-tahajjud-card, .card-face, .flip-indicator');
        animatedElements.forEach(element => {
            element.style.transform = 'translateZ(0)';
            element.style.willChange = 'transform';
            element.style.transformStyle = 'preserve-3d';
            element.style.webkitTransformStyle = 'preserve-3d';
            element.style.backfaceVisibility = 'hidden';
            element.style.webkitBackfaceVisibility = 'hidden';
        });
        
        // Add PWA-specific touch handling
        document.addEventListener('touchstart', () => {}, { passive: true });
        
        // Additional PWA viewport handling
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
        }
    } else {
        console.log('[PWA] Running in browser mode');
    }
}

function init() {
    // Initialize PWA features first
    initPWA();
    
    selectedDate = new Date(); // Start with today's date
    updateCurrentTime();
    fetchPrayerTimes(selectedDate);
    updateTodayButtonVisibility();
    initSunriseTahajjudCard();

    // Update current time every second
    setInterval(updateCurrentTime, 1000);

    // Update prayer times every minute only if viewing current date
    setInterval(() => {
        const now = new Date();
        if (isSameDay(selectedDate, now)) {
            fetchPrayerTimes(now);
        }
    }, 60000);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/pwabuilder-sw.js')
      .then(reg => console.log('Service Worker registered:', reg.scope))
      .catch(err => console.error('Service Worker registration failed:', err));
  });
}

// Start the app
init();
