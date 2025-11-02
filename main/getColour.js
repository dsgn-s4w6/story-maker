const imageUpload = document.getElementById("imageUpload");
const vibrantButton = document.getElementById("colorModeVibrant");
const dominantButton = document.getElementById("colorModeDominant");

let extractedColors = {
    vibrant: null,
    dominant: null
};

let currentMode = 'vibrant';

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
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
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
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

/**
 * Applies the selected color mode to CSS variables
 * 
 * @param {string} mode - Either 'vibrant' or 'dominant'
 */
function applyColorMode(mode) {
    currentMode = mode;
    
    const color = extractedColors[mode];
    if (!color) return;
    
    document.documentElement.style.setProperty(
        '--vibrant-color', 
        `hsl(${color.h}, ${color.s}%, ${color.l}%)`
    );
    document.documentElement.style.setProperty('--vibrant-h', color.h);
    document.documentElement.style.setProperty('--vibrant-s', `${color.s}%`);
    document.documentElement.style.setProperty('--vibrant-l', `${color.l}%`);
    
    // Update button states (add 'active' class to show which is selected)
    vibrantButton.classList.toggle('active', mode === 'vibrant');
    dominantButton.classList.toggle('active', mode === 'dominant');
    
    console.log(`Color mode switched to: ${mode}`, {
        hsl: `hsl(${color.h}, ${color.s}%, ${color.l}%)`,
        rgb: `rgb(${color.r}, ${color.g}, ${color.b})`
    });
}

/**
 * Extracts both vibrant and dominant colors from an uploaded image
 * 
 * @param {File} file - The uploaded image file
 */
function extractColors(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const maxSize = 100;
            const scale = Math.min(maxSize / img.width, maxSize / img.height);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            
            let mostVibrantColor = { r: 0, g: 0, b: 0 };
            let highestVibrancy = 0;
            
            const colorBuckets = {};
            
            for (let i = 0; i < pixels.length; i += 40) {
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];
                const a = pixels[i + 3];
                
                if (a < 128) continue;
                
                const hsl = rgbToHsl(r, g, b);
                
                if (hsl.l < 15 || hsl.l > 85) {
                } else {
                    const lightnessScore = 100 - Math.abs(hsl.l - 50);
                    const vibrancy = hsl.s * (lightnessScore / 100);
                    
                    if (vibrancy > highestVibrancy) {
                        highestVibrancy = vibrancy;
                        mostVibrantColor = { r, g, b };
                    }
                }
                
                const bucketR = Math.round(r / 20) * 20;
                const bucketG = Math.round(g / 20) * 20;
                const bucketB = Math.round(b / 20) * 20;
                const key = `${bucketR},${bucketG},${bucketB}`;
                
                if (!colorBuckets[key]) {
                    colorBuckets[key] = {
                        count: 0,
                        r: bucketR,
                        g: bucketG,
                        b: bucketB
                    };
                }
                colorBuckets[key].count++;
            }
            
            let mostDominantColor = { r: 0, g: 0, b: 0 };
            let highestCount = 0;
            
            for (const key in colorBuckets) {
                const bucket = colorBuckets[key];
                
                const hsl = rgbToHsl(bucket.r, bucket.g, bucket.b);
                if (hsl.l < 10 || hsl.l > 90) continue;
                
                if (bucket.count > highestCount) {
                    highestCount = bucket.count;
                    mostDominantColor = {
                        r: bucket.r,
                        g: bucket.g,
                        b: bucket.b
                    };
                }
            }
            
            const vibrantHSL = rgbToHsl(
                mostVibrantColor.r,
                mostVibrantColor.g,
                mostVibrantColor.b
            );
            
            const dominantHSL = rgbToHsl(
                mostDominantColor.r,
                mostDominantColor.g,
                mostDominantColor.b
            );
            
            extractedColors.vibrant = {
                ...mostVibrantColor,
                ...vibrantHSL
            };
            
            extractedColors.dominant = {
                ...mostDominantColor,
                ...dominantHSL
            };
            
            applyColorMode(currentMode);
            
            console.log('Colors extracted:', {
                vibrant: {
                    hsl: `hsl(${vibrantHSL.h}, ${vibrantHSL.s}%, ${vibrantHSL.l}%)`,
                    rgb: `rgb(${mostVibrantColor.r}, ${mostVibrantColor.g}, ${mostVibrantColor.b})`
                },
                dominant: {
                    hsl: `hsl(${dominantHSL.h}, ${dominantHSL.s}%, ${dominantHSL.l}%)`,
                    rgb: `rgb(${mostDominantColor.r}, ${mostDominantColor.g}, ${mostDominantColor.b})`
                }
            });
        };
        
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

imageUpload.addEventListener("change", function() {
    if (this.files && this.files[0]) {
        extractColors(this.files[0]);
    }
});

vibrantButton.addEventListener("click", function() {
    applyColorMode('vibrant');
});

dominantButton.addEventListener("click", function() {
    applyColorMode('dominant');
});