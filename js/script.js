var abeceda = document.getElementById("abeceda");
var difficulty = document.getElementById("difficulty");
var hint = document.getElementById("hint");
var wordPlace = document.getElementById("wordPlace");
var hintDiv = document.getElementById("hintDiv");
var result = document.getElementById("result");
var resultDiv = document.getElementById("resultDiv");
var hangman = document.getElementById("hangman");
var reset = document.getElementById("reset");

var modal = document.getElementById("modal")
var message = document.getElementById("message");
var next = document.getElementById("next");
var retry = document.getElementById("retry");
var closeBtn = document.getElementById("closeBtn");

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
    let device = navigator.userAgent;
    let regexp = /android|iphone|kindle|ipad/i;
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
        charDiv.addEventListener("dragenter",(e) => {
            if(!actDrag) {
                actDrag = true;
                dragged = e.target;
                console.log(dragged);
                //charDiv.style.visibility = "hidden";
            }
        })
        charDiv.addEventListener("dragend",(e) => {
            if(actDrag){
                actDrag = false;

                //nejako ze ak to draggol do end zony, nak zmizne, ak inde tak nak ostane, akoze to pismeno aktiualne tahane ved ty vies, ty vies
                //potom zistic co draggol do end zony a ci sa to nechadza v slove, ak hej span zmenit na pismeno :)

                console.log(e);
                //charDiv.style.visibility = "hidden";

            }

        })
        if (regexp.test(device)) {
            charDiv.addEventListener("click", (e) => {

                dragged = e.target;
                check(dragged);
            })
        }
        abeceda.appendChild(charDiv);
    }
    console.log(medium);
    console.log(hard);
}


document.getElementById("wordPlace").addEventListener('dragover',(e) =>{
    e.preventDefault();
})

document.getElementById("wordPlace").addEventListener('drop',(e) =>{
    //this.append(dragged);
    e.preventDefault();
    if(e.target.id === "wordPlace"){
        dragged.style.visibility = "visible";
        check(dragged);
    }
})

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
    char.style.visibility = "hidden";

    testCompletedLevel();

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

function testCompletedLevel(){
    let correct = 0;

    for (let i = 0; i < current.word.length;i++){
        if( actWordState[i] !== '_'){
            correct++;
        }
    }
    console.log(correct);
    console.log(current.word.length);

    if(correct === current.word.length){
        completedLevel("You win!");
    }
}

function completedLevel(text){
    modal.style.display = "block";
    message.innerHTML = text;
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
    if ( currImage === 9 ){
        completedLevel("You lost!")
    }
    currImage++;
    let tmp = document.createElement("img");
    let value = "images/" + currImage.toString() + ".png";
    tmp.setAttribute("src",value);
    tmp.setAttribute("alt","hangman state");
    tmp.style.border = "2px solid black";
    tmp.style.borderRadius = "10px";
    hangman.innerHTML = "";
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

result.onmouseover = function (){
    resultDiv.innerHTML = current.word;
    resultDiv.style.visibility = "visible"
}


result.onmouseout = function (){
    resultDiv.style.visibility = "hidden";
}

//modal
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

next.addEventListener("click", () => {
    modal.style.display = "none";
    wordPlace.replaceChildren();
    nextLevel();
});

retry.addEventListener("click", () => {
    modal.style.display = "none";
    wordPlace.replaceChildren();
    restartLevel();
});