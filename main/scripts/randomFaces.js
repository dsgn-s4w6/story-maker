const face1 = actor1Field.previousElementSibling.querySelector('span');
const face2 = actor2Field.previousElementSibling.querySelector('span');
var icons = [];

for(let step = 0; step < 2; step++){
    var variant = "_" + Math.floor(Math.random() * (1 - 6) + 6);
    if(variant == "_1"){
        icons.push("face");
    }
    else{
        icons.push("face" + variant);
    }
}

face1.innerHTML = icons[0];
face2.innerHTML = icons[1];

console.log(icons[0]);