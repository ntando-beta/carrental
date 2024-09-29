// Helper function to add leading zero
function pad(num) {
    return num < 10 ? '0' + num : num;
}

// Get references to form elements
const pickupDateInput = document.getElementById('pickup-date');
const dropoffDateInput = document.getElementById('dropoff-date');
const pickupTimeSelect = document.getElementById('pickup-time');
const dropoffTimeSelect = document.getElementById('dropoff-time');

// Get today's date in YYYY-MM-DD format
const today = new Date();
const todayString = today.toISOString().split('T')[0];

// Disable past dates for pickup date
pickupDateInput.min = todayString;

// Listen for changes on pickup date
pickupDateInput.addEventListener('change', () => {
    const pickupDate = new Date(pickupDateInput.value);
    
    // Grey out times before the current time + 6 hours if the pickup date is today
    if (pickupDate.toISOString().split('T')[0] === todayString) {
        const minPickupTime = new Date(today.getTime() + 6 * 60 * 60 * 1000);
        populateTimeOptions(pickupTimeSelect, minPickupTime);
    } else {
        populateTimeOptions(pickupTimeSelect);
    }

    // Set the drop-off date's min to the pickup date
    dropoffDateInput.min = pickupDateInput.value;

    // Reset dropoff time when pickup date changes
    dropoffTimeSelect.innerHTML = '<option value="">Drop-off Time</option>';
});

dropoffDateInput.addEventListener('change', () => {
    const pickupDate = new Date(pickupDateInput.value);
    const dropoffDate = new Date(dropoffDateInput.value);

    // If dropoff is same day, grey out times before pickup time + 6 hours
    if (dropoffDate.getTime() === pickupDate.getTime()) {
        const pickupTime = new Date(pickupDateInput.value + 'T' + pickupTimeSelect.value);
        const minDropoffTime = new Date(pickupTime.getTime() + 6 * 60 * 60 * 1000);
        populateTimeOptions(dropoffTimeSelect, minDropoffTime);
    } else {
        populateTimeOptions(dropoffTimeSelect);
    }
});

// Function to populate time options (minTime is optional)
function populateTimeOptions(selectElement, minTime = null) {
    selectElement.innerHTML = '<option value="">Pick-up Time</option>';
    const openingTime = 6; // 06:00 AM
    const closingTime = 22; // 10:00 PM

    for (let hour = openingTime; hour <= closingTime; hour++) {
        const timeString = pad(hour) + ':00';
        const timeDate = new Date();
        timeDate.setHours(hour, 0, 0, 0);

        // Disable times before minTime if provided
        if (minTime && timeDate < minTime) {
            continue;
        }

        const option = document.createElement('option');
        option.value = timeString;
        option.textContent = timeString;
        selectElement.appendChild(option);
    }
}
