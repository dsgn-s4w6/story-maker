var titleField = document.getElementById("titleField");
var directorField = document.getElementById("directorField");
var actor1Field = document.getElementById("actor1Field");
var actor2Field = document.getElementById("actor2Field");

var titleOutput = document.getElementById("title");
var directorOutput = document.getElementById("director");
var actor1Output = document.getElementById("actor1");
var actor2Output = document.getElementById("actor2");

titleField.addEventListener("input", refreshOutputs(titleField,titleOutput));
directorField.addEventListener("input", function(){directorOutput.innerHTML=directorField.value;console.log("refreshed director")
});
actor1Field.addEventListener("input", function(){actor1Output.innerHTML=actor1Field.value
});
actor2Field.addEventListener("input", function(){actor2Output.innerHTML=actor2Field.value
});

function refreshOutputs(field, output){
    output.innerHTML = field.value
    output.style.display = "block"
}