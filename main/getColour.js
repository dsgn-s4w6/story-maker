// Get reference to the image upload input
const imageUpload = document.getElementById("imageUpload");

/**
 * Converts RGB color values to HSL (Hue, Saturation, Lightness)
 * This helps us identify which colors are "vibrant" (high saturation)
 * 
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {object} Object with h, s, l properties
 */
function rgbToHsl(r, g, b) {
    // Normalize RGB values to 0-1 range
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // grayscale
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return {
        h: Math.round(h * 360),  // Hue in degrees (0-360)
        s: Math.round(s * 100),  // Saturation in percent (0-100)
        l: Math.round(l * 100)   // Lightness in percent (0-100)
    };
}

/**
 * Extracts the most vibrant color from an uploaded image
 * A vibrant color has high saturation and medium lightness
 * 
 * @param {File} file - The uploaded image file
 */
function extractVibrantColor(file) {
    // Create a FileReader to read the image file
    const reader = new FileReader();
    
    reader.onload = function(e) {
        // Create an Image element to load the file
        const img = new Image();
        
        img.onload = function() {
            // Create a canvas to analyze the image pixels
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size (we can use a smaller size for faster processing)
            const maxSize = 100;
            const scale = Math.min(maxSize / img.width, maxSize / img.height);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            
            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Get all pixel data from the canvas
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data; // Array of [R, G, B, A, R, G, B, A, ...]
            
            let mostVibrantColor = { r: 0, g: 0, b: 0 };
            let highestVibrancy = 0;
            
            // Loop through every 4th value (since each pixel is 4 values: R, G, B, A)
            // We sample every 10 pixels to speed up processing
            for (let i = 0; i < pixels.length; i += 40) {
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];
                const a = pixels[i + 3]; // Alpha (transparency)
                
                // Skip transparent pixels
                if (a < 128) continue;
                
                // Convert to HSL to measure vibrancy
                const hsl = rgbToHsl(r, g, b);
                
                // Calculate "vibrancy score"
                // We want high saturation (s) and medium lightness (l between 30-70)
                const lightnessScore = 100 - Math.abs(hsl.l - 50); // Peaks at l=50
                const vibrancy = hsl.s * (lightnessScore / 100);
                
                // Keep track of the most vibrant color found
                if (vibrancy > highestVibrancy) {
                    highestVibrancy = vibrancy;
                    mostVibrantColor = { r, g, b };
                }
            }
            
            // Convert the most vibrant color to HSL for final output
            const vibrantHSL = rgbToHsl(
                mostVibrantColor.r, 
                mostVibrantColor.g, 
                mostVibrantColor.b
            );
            
            // Store the color in CSS custom properties (variables)
            // You can now use these in your CSS!
            document.documentElement.style.setProperty(
                '--vibrant-color', 
                `hsl(${vibrantHSL.h}, ${vibrantHSL.s}%, ${vibrantHSL.l}%)`
            );
            
            // Also store individual HSL values if you need them
            document.documentElement.style.setProperty('--vibrant-h', vibrantHSL.h);
            document.documentElement.style.setProperty('--vibrant-s', `${vibrantHSL.s}%`);
            document.documentElement.style.setProperty('--vibrant-l', `${vibrantHSL.l}%`);
            
            // Log the result for debugging
            console.log('Vibrant color extracted:', {
                hsl: `hsl(${vibrantHSL.h}, ${vibrantHSL.s}%, ${vibrantHSL.l}%)`,
                rgb: `rgb(${mostVibrantColor.r}, ${mostVibrantColor.g}, ${mostVibrantColor.b})`
            });
        };
        
        // Set the image source to the uploaded file
        img.src = e.target.result;
    };
    
    // Read the file as a data URL (base64 encoded string)
    reader.readAsDataURL(file);
}

// Listen for when the user uploads an image
imageUpload.addEventListener("change", function() {
    if (this.files && this.files[0]) {
        // Extract vibrant color from the uploaded image
        extractVibrantColor(this.files[0]);
    }
});