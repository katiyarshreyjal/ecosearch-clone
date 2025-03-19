let scrollPosition = 0;
let inputField = document.querySelector(".input-box input");

// Function to show the popup with animation
function showPopup() {
    let popupContainer = document.getElementById("thankYouPopup");

    // Store the current scroll position
    scrollPosition = window.scrollY;

    // Disable scrolling without changing position
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";

    // Show the overlay
    popupContainer.style.display = "flex";

    // Add 'show' class to trigger animation
    setTimeout(() => {
        popupContainer.classList.add("show");
    }, 10);

    // Clear the input field only after the popup appears
    setTimeout(() => {
        inputField.value = "";
    }, 500);
}

// Function to close the popup
function closePopup() {
    let popupContainer = document.getElementById("thankYouPopup");

    // Start animation for hiding
    popupContainer.classList.remove("show");

    // Wait for animation to complete before hiding
    setTimeout(() => {
        popupContainer.style.display = "none";

        // Enable scrolling and restore position
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollPosition);
    }, 500);
}

// Handle form submission with loading spinner
document.getElementById("waitlistForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    let submitButton = document.getElementById("submitButton");
    let buttonText = submitButton.innerHTML; // Store original button text
    const email = inputField.value.trim();

    // Validate email input (without showing messages)
    if (email === "") {
        return;
    }

    // Add loading spinner inside the button
    submitButton.innerHTML = `<div class="btn-spinner"></div> `;
    submitButton.disabled = true; // Disable button to prevent multiple clicks

    // Send the email to Netlify function
    try {
        const response = await fetch('/.netlify/functions/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email }) // Send email to the function
        });

        // Log the response status
        console.log("Response Status:", response.status);

        // Use response.json() and log it
        const data = await response.json();

        console.log("Response Body:", data);

        // Show popup only if the request was successful
        if (data.success) {
            showPopup(); 
        }
    } catch (error) {
        console.log("Error caught:", error);
    }

    // Restore button state after 1 second
    setTimeout(() => {
        submitButton.innerHTML = buttonText;
        submitButton.disabled = false;
    }, 1000);
});

// Close the popup when clicking outside the box
document.getElementById("thankYouPopup").addEventListener("click", function (event) {
    if (event.target === this) { // Close only when clicking outside the popup box
        closePopup();
    }
});

// Close button event
document.querySelector(".close-btn").addEventListener("click", function () {
    closePopup();
});
