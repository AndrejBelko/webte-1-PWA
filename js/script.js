var abeceda = document.getElementById("abeceda")
var dragged;
var actDrag = false;

function load(){
    for(var i = 97; i < 123; i++){
        const charDiv = document.createElement("div");
        charDiv.setAttribute("value",String.fromCharCode(i));
        charDiv.innerHTML = String.fromCharCode(i);
        charDiv.style.height = "50px";
        charDiv.style.width = "50px";
        charDiv.style.border = "2px solid black";
        charDiv.style.textAlign = "center";
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

