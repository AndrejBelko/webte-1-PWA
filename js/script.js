var abeceda = document.getElementById("abeceda");
var difficulty = document.getElementById("difficulty");
var hint = document.getElementById("hint");
var wordPlace = document.getElementById("wordPlace");
var hintDiv = document.getElementById("hintDiv");
var hangman = document.getElementById("hangman");
var reset = document.getElementById("reset");
var dragged;
var actDrag = false;

var medium = [];
var hard = [];

var current;

var actWordState = [];

var currImage;

fetch("./levels.json")
    .then(res => res.json())
    .then(data => {

        data.medium.forEach(level => {
            medium.push(level);
        })

        data.hard.forEach(level => {
            hard.push(level);
        })

        nextLevel();
    })

function loadChars(){
    abeceda.innerHTML = "";
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

                check(charDiv);

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

function check(char){

    let index = 0;
    let count = 0;

    while(current.word.indexOf(char.getAttribute("value").toLowerCase(),index) >= 0){

        index = current.word.indexOf(char.getAttribute("value").toLowerCase(),index);
        actWordState[index] = char.getAttribute("value");
        wordPlace.replaceChildren();

        displayLevel();
        index++;
        count++;
    }

   if(count === 0){
        incrementHangman();
    }

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
    for (let i = 0; i < current.word.length;i++){
        actWordState[i] = '_';
    }
}

function displayLevel(){
    console.log(current);
    for (let i = 0; i < current.word.length;i++){
        let a = document.createElement("span");
        a.style.margin = "5px";
        a.innerHTML = actWordState[i];
        wordPlace.appendChild(a);
    }
}

function nextLevel(){
    loadChars();
    getRandomLevel();
    displayLevel();
    resetHangman();
}

function restartLevel(){
    loadChars();
    for (let i = 0; i < current.word.length;i++){
        actWordState[i] = '_';
    }
    displayLevel();
    resetHangman();
}

function resetHangman(){
    currImage = 0;
    hangman.innerHTML = "";
    let tmp = document.createElement("img");
    tmp.setAttribute("src","images/0.png");
    tmp.setAttribute("alt","hangman state");
    tmp.style.border = "2px solid black";
    tmp.style.borderRadius = "10px";
    hangman.appendChild(tmp);
}

function incrementHangman(){
    if ( currImage === 10 ){
        //prehral si
    }
    currImage++;
    hangman.innerHTML = "";
    let tmp = document.createElement("img");
    let value = "images/" + currImage.toString() + ".png";
    tmp.setAttribute("src",value);
    tmp.setAttribute("alt","hangman state");
    tmp.style.border = "2px solid black";
    tmp.style.borderRadius = "10px";
    hangman.appendChild(tmp);
}


difficulty.addEventListener("click", () => {
    if (difficulty.innerHTML === "Medium"){
        difficulty.innerHTML = "Hard";
    }
    else{
        difficulty.innerHTML = "Medium";
    }
    wordPlace.replaceChildren();
    nextLevel();
})

reset.addEventListener("click", () => {
    wordPlace.replaceChildren();
    restartLevel();
})

hint.onmouseover = function (){
    hintDiv.innerHTML = current.clue;
    hintDiv.style.visibility = "visible"
}


hint.onmouseout = function (){
    hintDiv.style.visibility = "hidden";
}