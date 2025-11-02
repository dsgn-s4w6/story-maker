const sourceImage = document.getElementById("imageUpload");

function refreshColours(input){
    var reader = new FileReader();
    reader.onload = function(e){
        const img = new Image();
        img.src = e.target.result;
        img.onload = function(){
            const vibrant = new Vibrant(img)
            const hsl = vibrant.getHsl()
            console.log(hsl)
        }
        img.onerror = function() {
            console.error("Failed to load image from data URL.");
        }
    }
    reader.readAsDataURL(input.files[0]);
}

imageUpload.addEventListener("change", function(){refreshColours(sourceImage)})