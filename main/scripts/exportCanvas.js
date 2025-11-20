const exportButton = document.getElementById("exportButton");
const canvas = document.getElementById("canvas");

async function exportCanvasAsPNG() {
    const domtoimage = (await import('https://cdn.jsdelivr.net/npm/dom-to-image-more@3.3.0/+esm')).default;
    
    try {
        const originalButtonHTML = exportButton.innerHTML;
        exportButton.disabled = true;
        exportButton.innerHTML = '<span class="material-symbols-rounded">pending</span>Exporting...';
        
        // Store original styles
        const originalBorderRadius = canvas.style.borderRadius;
        const originalBoxShadow = canvas.style.boxShadow;
        
        // Remove visual effects that don't export well
        canvas.style.borderRadius = '0';
        canvas.style.boxShadow = 'none';
        
        // Wait for styles to apply
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Force reflow
        canvas.offsetHeight;
        
        // Capture at approximately 2x resolution for better quality
        // 461*812 base -> ~922*1624 (or we can target exact 1080*1920)
        const scaleFactor = 1080 / 461; // ~2.34x scale to reach 1080px width
        
        const blob = await domtoimage.toBlob(canvas, {
            width: canvas.offsetWidth * scaleFactor,
            height: canvas.offsetHeight * scaleFactor,
            style: {
                transform: `scale(${scaleFactor})`,
                transformOrigin: 'top left',
                width: canvas.offsetWidth + 'px',
                height: canvas.offsetHeight + 'px'
            },
            quality: 1.0,
            cacheBust: true
        });
        
        // Restore original styles
        canvas.style.borderRadius = originalBorderRadius;
        canvas.style.boxShadow = originalBoxShadow;
        
        // Download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `story-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        
        // Reset button
        exportButton.innerHTML = originalButtonHTML;
        exportButton.disabled = false;
        
        console.log('Export successful! Resolution: ~1080x1920');
        
    } catch (error) {
        console.error('Export failed:', error);
        canvas.style.borderRadius = originalBorderRadius || '';
        canvas.style.boxShadow = originalBoxShadow || '';
        exportButton.innerHTML = '<span class="material-symbols-rounded">output_circle</span>Export Story';
        exportButton.disabled = false;
        alert('Export failed. Check console for details.');
    }
}

exportButton.addEventListener("click", exportCanvasAsPNG);