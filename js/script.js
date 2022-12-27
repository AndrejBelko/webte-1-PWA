var abeceda = document.getElementById("abeceda")
var dragged;
var actDrag = false;

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
                charDiv.style.visibility = "visible";

            }

        })
        abeceda.appendChild(charDiv);
    }
}

function allowDrop(ev) {
    ev.preventDefault();
    console.log(1);
}


