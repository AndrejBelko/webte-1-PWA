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

var actHMImage;

var actDifficulty;

var usedWords = [];
var actWordState = [];

navigator.serviceWorker.register('./sw.js')
    .then((reg) => console.log('registered',reg))
    .catch((err) => console.log('not registered',err))


if(localStorage.getItem("usedLevels") === null){
    fetch("./levels.json")
        .then(res => res.json())
        .then(data => {

            data.medium.forEach(level => {
                medium.push(level);
            })

            data.hard.forEach(level => {
                hard.push(level);
            })

            localStorage.setItem("mediumLevels", JSON.stringify(medium));
            localStorage.setItem("hardLevels",JSON.stringify(hard));
            localStorage.setItem("usedLevels",JSON.stringify(usedWords));
            actDifficulty = "Medium";
            localStorage.setItem("difficulty",JSON.stringify(actDifficulty));
            difficulty.innerHTML = actDifficulty;
            nextLevel();
        })
}else{
    medium = JSON.parse(localStorage.getItem("mediumLevels"));
    hard = JSON.parse(localStorage.getItem("hardLevels"));
    usedWords = JSON.parse(localStorage.getItem("usedLevels"));
    actDifficulty  = JSON.parse(localStorage.getItem("difficulty"));
    difficulty.innerHTML = actDifficulty;
    nextLevel();
}

function loadChars(){
    abeceda.style.visibility = "visible";
    abeceda.innerHTML = "";
    for(let i = 65; i < 91; i++){
        const charDiv = document.createElement("div");
        charDiv.setAttribute("value",String.fromCharCode(i));
        charDiv.setAttribute("class","letters");
        charDiv.innerHTML = String.fromCharCode(i);
        charDiv.style.border = "2px solid black";
        charDiv.style.borderRadius = "10px";
        charDiv.style.textAlign = "center";
        charDiv.style.background = "white";
        charDiv.draggable = "true";
        charDiv.addEventListener("dragstart",(e) => {
            if(!actDrag) {
                actDrag = true;
                dragged = e.target;
            }
        })

        charDiv.addEventListener("dragend",() => {
            if(actDrag){
                actDrag = false;
            }
        })

        charDiv.addEventListener('touchstart',(e) => {
            dragged = e.target;
            disableScroll();
        })

        charDiv.addEventListener('touchend',(e) => {
            var changedTouch = e.changedTouches[0];
            var elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
            if(elem.id === wordPlace.id || elem.parentElement.id === wordPlace.id){
                check(dragged);
            }
            enableScroll();
        })

        abeceda.appendChild(charDiv);
    }
    console.log(medium);
    console.log(hard);
}

function disableScroll() {
    document.body.classList.add("stop-scrolling");
}

function enableScroll() {
    document.body.classList.remove("stop-scrolling");
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
        console.log("usedwords length", usedWords.length);
        for (let i = 0; i < usedWords.length; i++) {
            console.log("for used words [i]", usedWords[i]);
            console.log("current", current);
            if (usedWords[i].word === current.word) {
                console.log("current", current);
                current = null;
                break;
            }
        }
    }

    if(current == null) {
        getRandomLevel();
    }else{
        usedWords.push(current);
        localStorage.setItem("usedLevels",JSON.stringify(usedWords));

        for (let i = 0; i < current.word.length;i++){
            actWordState[i] = '_';
        }
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
    abeceda.style.visibility = "hidden";
}

function resetHangman(){
    currImage = 0;
    hangman.innerHTML = "";
    let tmp = document.createElement("img");
    tmp.setAttribute("src","images/0.png");
    tmp.setAttribute("alt","hangman state");
    tmp.setAttribute("class","img-fluid");
    tmp.style.borderRadius = "10px";
    actHMImage = tmp;
    hangman.appendChild(tmp);
}

function incrementHangman(){
    if ( currImage >= 9 ){
        completedLevel("You lost!")
    }
    currImage++;
    actHMImage.src = "images/" + currImage.toString() + ".png";
}


difficulty.addEventListener("click", () => {
    if (actDifficulty === "Medium"){
        actDifficulty = "Hard";
        difficulty.innerHTML = actDifficulty;
    }
    else{
        actDifficulty = "Medium";
        difficulty.innerHTML = actDifficulty;
    }
    usedWords = [];
    localStorage.setItem("usedLevels",JSON.stringify(usedWords));
    localStorage.setItem("difficulty",JSON.stringify(actDifficulty));
    wordPlace.replaceChildren();
    nextLevel();
})

reset.addEventListener("click", () => {
    wordPlace.replaceChildren();
    restartLevel();
})


hint.onclick = function (){
    offcanvasLabel.innerHTML = "Hint";
    offcanvasText.innerHTML = current.clue;
}

result.onclick = function (){
    offcanvasLabel.innerHTML = "Result";
    offcanvasText.innerHTML = current.word.toUpperCase();
}

tutorial.onclick = function (){
    offcanvasLabel.innerHTML = "Tutorial";
    offcanvasText.innerHTML = "Cieľom hry je nájsť skryté slovo, pred tým ako obesia obesenca. Vybrané písmeno pretiahnite na ľubovoľné miesto do priestoru so skrytým slovom. Ak sa v skrytom slove nachádza toto písmeno, odokryje sa. Ak však skryté slovo toto písmeno neobsahuje, v obrázku sa dokreslí čiara. Hra konči uhádnutím skrytého slova alebo obesením. Na mobilnom zariadení stačí pre reštart hry zatriasť mobilom.";
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

nextMenu.addEventListener("click", () => {
    wordPlace.replaceChildren();
    nextLevel();
});


const acl = new Accelerometer({ frequency: 10 });
acl.addEventListener("reading", () => {
    if(acl.x > 12 || acl.y > 12){
        wordPlace.replaceChildren();
        restartLevel();
    }

    console.log(`Acceleration along the X-axis ${acl.x}`);
    console.log(`Acceleration along the Y-axis ${acl.y}`);
    console.log(`Acceleration along the Z-axis ${acl.z}`);
});

acl.start();
