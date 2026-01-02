const allItems = document.querySelectorAll('p');
const allBoxes = document.querySelectorAll('.box');
let cdI = null;
let originBox = null;

allItems.forEach(item => {
    item.ondragstart = dragStart
    item.ondragend = dragEnd
    setupPerson(item);
})

allBoxes.forEach(box => {
    box.ondragover = (e) => e.preventDefault();
    box.ondrop = function(){
        this.append(cdI);
        if (this.id === "shop" || this.id === "house") {
            let label = prompt(this.id === "shop" ? "Shop?" : "House?");
            if (label && label.trim() !== "") {
                addTag(cdI, label);
            }
        }
    }
})

function addTag(person, text) {
    let existing = person.querySelector(".tag");
    if (existing) existing.remove();

    const span = document.createElement("span");
    span.classList.add("tag");
    span.textContent = `(${text})`;
    person.append(span);
}


function dragStart(){
    cdI = this
    originBox = this.getParentElement;
    setTimeout(() => this.style.display = 'none')
}
function dragEnd(){
    setTimeout(() => this.style.display = 'block')
    const parentId = this.parentElement.id;
    if (parentId !== "shop" && parentId !== "house") {
        const tag = this.querySelector(".tag");
        if (tag) tag.remove();
    }
    cdI = null
    originBox = null;
}

function setupPerson(person) {
    person.ondragstart = dragStart;
    person.ondragend = dragEnd;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "x";
    deleteBtn.classList.add("delete");

    deleteBtn.onclick = function (e) {
        e.stopPropagation(); 
        person.remove();
    };

    person.append(deleteBtn);
}

function addPeople(){
    var newName = prompt("Who would you like to add?")
    if(newName.trim() === "") return;
    const newPerson = document.createElement("p");
    newPerson.textContent = newName;
    newPerson.classList.add("item");
    newPerson.setAttribute("draggable", "true");
    setupPerson(newPerson);
    unemployed.append(newPerson);
}

