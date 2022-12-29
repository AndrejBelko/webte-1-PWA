var abeceda = document.getElementById("abeceda");
var difficulty = document.getElementById("difficulty");
var hint = document.getElementById("hint");
var wordPlace = document.getElementById("wordPlace");
var result = document.getElementById("result");
var hangman = document.getElementById("hangman");
var reset = document.getElementById("reset");
var nextMenu = document.getElementById("nextMenu");
var tutorial = document.getElementById("tutorial");
var offcanvasLabel = document.getElementById("offcanvasLabel");
var offcanvasText = document.getElementById("offcanvasText");

var modal = document.getElementById("modal");
var message = document.getElementById("message");
var next = document.getElementById("next");
var retry = document.getElementById("retry");
var closeBtn = document.getElementById("closeBtn");

var dragged;
var actDrag = false;

var medium = [];
var hard = [];

var current;
var currImage;


navigator.serviceWorker.register('./sw.js')
    .then((reg) => console.log('registered',reg))
    .catch((err) => console.log('not registered',err))


var usedWords = [];
var actWordState = [];


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
    for(let i = 65; i < 91; i++){
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
document.getElementById("wordPlace").addEventListener('dragleave',(e) =>{
    e.preventDefault();
})
document.getElementById("wordPlace").addEventListener('dragstart',(e) =>{
    e.preventDefault();
})

document.getElementById("wordPlace").addEventListener('drop',(e) =>{
    e.preventDefault();
    dragged.style.visibility = "visible";
    check(dragged);
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

    if(usedWords.length < 5) {
        for (let i = 0; i < usedWords.length; i++) {
            if (usedWords[i] === current) {
                current = null;
            }
        }
    }
    if(current === null) {
        getRandomLevel();
    }else{
        usedWords.push(current);
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
    // zamknut pismenka nech sa enda laej tahat/klikat
}

function resetHangman(){
    currImage = 0;
    hangman.innerHTML = "";
    let tmp = document.createElement("img");
    tmp.setAttribute("src","images/0.png");
    tmp.setAttribute("alt","hangman state");
    tmp.setAttribute("class","img-fluid");
    tmp.style.border = "2px solid black";
    tmp.style.borderRadius = "10px";
    hangman.innerHTML = "";
    hangman.appendChild(tmp);
}

function incrementHangman(){
    if ( currImage === 9 ){
        completedLevel("You lost!")
    }
    if ( currImage >= 10 ){ // positka lebo este neni zmeznene tahanie po skonceni levelu
        completedLevel("You lost! man wtf u doin")
        return;
    }
    currImage++;
    let tmp = document.createElement("img");
    let value = "images/" + currImage.toString() + ".png";
    tmp.setAttribute("src",value);
    tmp.setAttribute("alt","hangman state");
    tmp.setAttribute("class","img-fluid");
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
    usedWords = [];
    console.log(usedWords);
    wordPlace.replaceChildren();
    nextLevel();
})

reset.addEventListener("click", () => {
    wordPlace.replaceChildren();
    restartLevel();
})

hint.addEventListener("click", () => {
    offcanvasLabel.innerHTML = "Hint";
    offcanvasText.innerHTML = current.clue;
})

/*result.addEventListener("click", () => {
    console.log("aaaaaa");
    console.log(offcanvasLabel);
    offcanvasLabel.innerHTML = "Result";
    offcanvasText.innerHTML = current.word;
})*/

tutorial.addEventListener("click", () => {
    console.log(offcanvasLabel);
    offcanvasLabel.innerHTML = "Tutorial";
    offcanvasText.innerHTML = "Cieľom hry je nájsť skryté slovo, pred tým ako obesia obesenca. Vybrané písmeno pretiahnite na ľubovoľné miesto do priestoru so skrytým slovom. Ak sa v skrytom slove nachádza toto písmeno, odokryje sa. Ak však skryté slovo toto písmeno neobsahuje, v obrázku sa dokreslí čiara. Hra konči uhádnutím skrytého slova alebo obesením.";
})

function testResult(){
    console.log("aaaaaa");
    console.log(offcanvasLabel);
    offcanvasLabel.innerHTML = "Result";
    offcanvasText.innerHTML = current.word;
}

/*hint.onclick = function (){
    offcanvaLabel.innerHTML = "Hint";
    offcanvasText.innerHTML = current.clue;
}

result.onclick = function (){
    offcanvaLabel.innerHTML = "Result";
    offcanvasText.innerHTML = current.word;
}

tutorial.onclick = function (){
    offcanvaLabel.innerHTML = "Tutorial";
    offcanvasText.innerHTML = "Cieľom hry je nájsť skryté slovo, pred tým ako obesia obesenca. Vybrané písmeno pretiahnite na ľubovoľné miesto do priestoru so skrytým slovom. Ak sa v skrytom slove nachádza toto písmeno, odokryje sa. Ak však skryté slovo toto písmeno neobsahuje, v obrázku sa dokreslí čiara. Hra konči uhádnutím skrytého slova alebo obesením.";
}*/

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

nextMenu.addEventListener("click", () => {
    wordPlace.replaceChildren();
    nextLevel();
});