const imageUpload = document.getElementById("imageUpload");
const titleField = document.getElementById("titleField");
const directorField = document.getElementById("directorField");
const actor1Field = document.getElementById("actor1Field");
const actor2Field = document.getElementById("actor2Field");
const imageOutput = document.getElementById("image");
const titleOutput = document.getElementById("title");
const directorOutput = document.getElementById("director");
const actor1Output = document.getElementById("actor1");
const actor2Output = document.getElementById("actor2");

function refreshOutputs(field, output){
    output.innerHTML = field.value;
    if(field.value == ""){
        output.parentNode.style.display = "none";
    }
    else{
        output.parentNode.style.display = "block";
    }
}

function displayImage(input){
    imageOutput.style.display = "block";
    console.log("diplayed image")
    if(input.files && input.files[0]){
        var reader = new FileReader();
        reader.onload = function(e){
            imageOutput.style.backgroundImage = "url(\"" + e.target.result + "\")";
        }
        reader.readAsDataURL(input.files[0]);
    }
}

titleField.addEventListener("input", function(){refreshOutputs(titleField, titleOutput)});
directorField.addEventListener("input", function(){refreshOutputs(directorField, directorOutput)});
actor1Field.addEventListener("input", function(){refreshOutputs(actor1Field, actor1Output)});
actor2Field.addEventListener("input", function(){refreshOutputs(actor2Field, actor2Output)});
imageUpload.addEventListener("change", function(){displayImage(this)});