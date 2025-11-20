const dropZone = document.getElementById("dropZone");

// Prevent default drag behaviors on the entire document
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight drop zone when dragging over it
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropZone.classList.add('dragging');
    dropZone.style.borderColor = 'hsl(var(--active-h), 50%, 50%)';
    dropZone.style.backgroundColor = 'hsl(var(--active-h), 50%, 95%)';
}

function unhighlight(e) {
    dropZone.classList.remove('dragging');
    dropZone.style.borderColor = 'hsl(var(--active-h), 25%, 65%)';
    dropZone.style.backgroundColor = 'transparent';
}

dropZone.addEventListener('mouseenter', function() {
    if (!dropZone.classList.contains('dragging')) {
        dropZone.style.borderColor = 'hsl(var(--active-h), 50%, 50%)';
        dropZone.style.backgroundColor = 'hsl(var(--active-h), 50%, 95%)';
    }
});

dropZone.addEventListener('mouseleave', function() {
    if (!dropZone.classList.contains('dragging')) {
        dropZone.style.borderColor = 'hsl(var(--active-h), 25%, 65%)';
        dropZone.style.backgroundColor = 'transparent';
    }
});

// Handle dropped files
dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        const file = files[0];
        
        // Check if it's an image
        if (file.type.startsWith('image/')) {
            // Create a new FileList-like object and assign it to the input
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            imageUpload.files = dataTransfer.files;
            
            // Trigger the change event to fire existing handlers
            const event = new Event('change', { bubbles: true });
            imageUpload.dispatchEvent(event);
        }
    }
}