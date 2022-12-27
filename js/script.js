var abeceda = document.getElementById("abeceda");
var difficulty = document.getElementById("difficulty");
var hint = document.getElementById("hint");
var wordPlace = document.getElementById("wordPlace");
var hintDiv = document.getElementById("hintDiv")
var dragged;
var actDrag = false;

var medium = [];
var hard = [];

var current;

fetch("./levels.json")
    .then(res => res.json())
    .then(data => {

        data.medium.forEach(level => {
            medium.push(level);
        })

        data.hard.forEach(level => {
            hard.push(level);
        })

        load();
        getRandomLevel();
        displayLevel();
    })

function load(){
    for(var i = 65; i < 91; i++){
        const charDiv = document.createElement("div");
        charDiv.setAttribute("value",String.fromCharCode(i));
        charDiv.innerHTML = String.fromCharCode(i);
        charDiv.style.height = "50px";
        charDiv.style.width = "50px";
        charDiv.style.border = "2px solid black";
        charDiv.style.borderRadius = "10px";
        charDiv.style.textAlign = "center";
        charDiv.style.lineHeight= "50px";
        charDiv.draggable = "true";
        charDiv.addEventListener("dragenter",() => {
            if(!actDrag) {
                actDrag = true;
                dragged = event.target;
                charDiv.style.visibility = "hidden";
            }
        })
        charDiv.addEventListener("dragend",() => {
            if(actDrag){
                actDrag = false;

                //nejako ze ak to draggol do end zony, nak zmizne, ak inde tak nak ostane, akoze to pismeno aktiualne tahane ved ty vies, ty vies
                //potom zistic co draggol do end zony a ci sa to nechadza v slove, ak hej span zmenit na pismeno :)
                charDiv.style.visibility = "visible";

            }

        })
        abeceda.appendChild(charDiv);
    }
    console.log(medium);
    console.log(hard);
}

function allowDrop(ev) {
    ev.preventDefault();
    console.log(1);
}



function getRandomLevel(){

    // toto random mozno nejako inak zistit lebo v zadani je nejaky divny iny random chcu...
    let random = Math.floor(Math.random() * 5);
    console.log(random);

    if (difficulty.innerHTML === "Medium"){
        for (let i = 0; i < medium.length;i++){
            if (i === random){
                current = medium[i];
            }
        }
    } else{
        for (let i = 0; i < hard.length;i++){
            if (i === random){
                current = hard[i];
            }
        }
    }
}

function displayLevel(){
    console.log(current);
    for (let i = 0; i < current.word.length;i++){
        let a = document.createElement("span");
        a.innerHTML = " _ ";
        wordPlace.appendChild(a);
    }
}


difficulty.addEventListener("click", () => {
    if (difficulty.innerHTML === "Medium"){
        difficulty.innerHTML = "Hard";
    }
    else{
        difficulty.innerHTML = "Medium";
    }
})

hint.onmouseover = function (){
    hintDiv.innerHTML = current.clue;
}

hint.onmouseout = function (){
    hintDiv.innerHTML = "";
}