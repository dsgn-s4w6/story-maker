import { squircleObserver } from 'https://cdn.jsdelivr.net/npm/corner-smoothing@0.1.5/+esm';

const imageUpload = document.getElementById("imageUpload");
const imageOutput = document.getElementById("image");

let squircleRenderer = null;

/**
 * Applies corner smoothing to the image element
 * This creates a "squircle" effect that's more visually pleasing than standard border-radius
 */
function applyCornerSmoothing() {
    // Disconnect any existing observer
    if (squircleRenderer && squircleRenderer.disconnect) {
        squircleRenderer.disconnect();
    }
    
    // Apply squircle with corner smoothing
    // cornerRadius: the radius in pixels
    // cornerSmoothing: 0-1, higher = smoother (0.6 is a good balance)
    squircleRenderer = squircleObserver(imageOutput, {
        cornerRadius: 40,
        cornerSmoothing: 0.6,
    });
    
    console.log('Corner smoothing applied');
}

/**
 * When an image is uploaded, apply corner smoothing after it loads
 */
function displayImageWithSmoothing(input) {
    imageOutput.style.display = "block";
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageOutput.style.backgroundImage = "url(\"" + e.target.result + "\")";
            
            // Apply corner smoothing after the image is set
            applyCornerSmoothing();
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Apply corner smoothing on page load (in case the image is already displayed)
if (imageOutput.style.display !== "none") {
    applyCornerSmoothing();
}

// Listen for image uploads
imageUpload.addEventListener("change", function() {
    displayImageWithSmoothing(this);
});