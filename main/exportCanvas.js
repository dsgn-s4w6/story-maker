const exportButton = document.getElementById("exportButton");
const canvas = document.getElementById("canvas");

async function exportCanvasAsPNG() {
    // Import dom-to-image-more
    const domtoimage = (await import('https://cdn.jsdelivr.net/npm/dom-to-image-more@3.3.0/+esm')).default;
    
    try {
        // Store original border-radius
        const originalBorderRadius = canvas.style.borderRadius;
        
        // Temporarily remove border-radius for export
        canvas.style.borderRadius = '0';
        
        // Small delay to ensure style is applied
        await new Promise(resolve => setTimeout(resolve, 10));
        
        // Capture at 2x scale
        const blob = await domtoimage.toBlob(canvas, {
            width: 540 * 2,
            height: 960 * 2,
            style: {
                transform: 'scale(2)',
                transformOrigin: 'top left',
                width: '540px',
                height: '960px',
                borderRadius: '0' // Ensure no border-radius in export
            }
        });
        
        // Restore original border-radius
        canvas.style.borderRadius = originalBorderRadius;
        
        // Download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'story.png';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Export failed:', error);
        // Restore border-radius even if export fails
        canvas.style.borderRadius = originalBorderRadius || '';
    }
}

exportButton.addEventListener("click", exportCanvasAsPNG);