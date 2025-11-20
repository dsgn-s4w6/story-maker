const exportButton = document.getElementById("exportButton");
const canvas = document.getElementById("canvas");

async function exportCanvasAsPNG() {
    const domtoimage = (await import('https://cdn.jsdelivr.net/npm/dom-to-image-more@3.3.0/+esm')).default;
    
    try {
        const originalButtonHTML = exportButton.innerHTML;
        exportButton.disabled = true;
        exportButton.innerHTML = '<span class="material-symbols-rounded">pending</span>Exporting...';
        
        // Store and remove border-radius
        const originalBorderRadius = canvas.style.borderRadius;
        canvas.style.borderRadius = '0';
        
        // Small delay to ensure style is applied
        await new Promise(resolve => setTimeout(resolve, 10));
        
        // Calculate actual padding in pixels for 1920px height
        // Your CSS: padding: 8.33vh 6.67vh 3.33vh 6.67vh
        const targetHeight = 1920;
        const targetWidth = 1080;
        const paddingTop = 190;
        const paddingRight = 128;
        const paddingBottom = 64;
        const paddingLeft = 128;
        
        // Capture at 2x scale for quality
        const blob = await domtoimage.toBlob(canvas, {
            width: targetWidth * 2,
            height: targetHeight * 2,
            style: {
                transform: 'scale(2)',
                transformOrigin: 'top left',
                width: `${targetWidth}px`,
                height: `${targetHeight}px`,
                borderRadius: '0',
                boxShadow: 'none',
                padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative'
            },
            quality: 1.0,
            cacheBust: true
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
        
        // Reset button
        exportButton.innerHTML = originalButtonHTML;
        exportButton.disabled = false;
        
    } catch (error) {
        console.error('Export failed:', error);
        canvas.style.borderRadius = originalBorderRadius || '';
        exportButton.innerHTML = '<span class="material-symbols-rounded">output_circle</span>Export Story';
        exportButton.disabled = false;
    }
}

exportButton.addEventListener("click", exportCanvasAsPNG);