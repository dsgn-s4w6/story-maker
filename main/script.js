var titleField = document.getElementById("titleField");
var directorField = document.getElementById("directorField");
var actor1Field = document.getElementById("actor1Field");
var actor2Field = document.getElementById("actor2Field");
var titleOutput = document.getElementById("title");
var directorOutput = document.getElementById("director");
var actor1Output = document.getElementById("actor1");
var actor2Output = document.getElementById("actor2");

function refreshOutputs(field, output){
    output.innerHTML = field.value;
    if(field.value == ""){
        output.parentNode.style.display = "none";
    }
    else{
        output.parentNode.style.display = "block";
    }
}

titleField.addEventListener("input", function(){refreshOutputs(titleField, titleOutput)});
directorField.addEventListener("input", function(){refreshOutputs(directorField, directorOutput)});
actor1Field.addEventListener("input", function(){refreshOutputs(actor1Field, actor1Output)});
actor2Field.addEventListener("input", function(){refreshOutputs(actor2Field, actor2Output)});