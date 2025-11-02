const exportButton = document.getElementById("exportButton");
const canvas = document.getElementById("canvas");

async function exportCanvasAsPNG() {
    // Import dom-to-image-more
    const domtoimage = (await import('https://cdn.jsdelivr.net/npm/dom-to-image-more@3.3.0/+esm')).default;
    
    try {
        // Capture at 2x scale
        const blob = await domtoimage.toBlob(canvas, {
            width: 540 * 2,
            height: 960 * 2,
            style: {
                transform: 'scale(2)',
                transformOrigin: 'top left',
                width: '540px',
                height: '960px'
            }
        });
        
        // Download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'story.png';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Export failed:', error);
    }
}

exportButton.addEventListener("click", exportCanvasAsPNG);