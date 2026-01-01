let cdI = null;       
let originBox = null;
let touchItem = null;   
let offsetX = 0, offsetY = 0;

document.querySelectorAll(".item").forEach(setupPerson);

document.querySelectorAll(".box").forEach(box => {
    box.ondragover = e => e.preventDefault();
    box.ondrop = function () {
        if (!cdI) return;
        this.append(cdI);
        handleLabel(cdI, this.id);
        cdI = null;
    };
});

function dragStart() {
    cdI = this;
    originBox = this.parentElement;
    setTimeout(() => this.style.display = "none");
}

function dragEnd() {
    this.style.display = "block";
    const parentId = this.parentElement.id;
    if (parentId !== "shop" && parentId !== "house") {
        const tag = this.querySelector(".tag");
        if (tag) tag.remove();
    }
    cdI = null;
    originBox = null;
}
function setupPerson(person) {
    person.ondragstart = dragStart;
    person.ondragend = dragEnd;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.classList.add("delete");
    deleteBtn.onclick = e => {
        e.stopPropagation();
        person.remove();
    };
    person.append(deleteBtn);
    person.addEventListener("touchstart", e => {
        touchItem = person;
        const rect = person.getBoundingClientRect();
        offsetX = e.touches[0].clientX - rect.left;
        offsetY = e.touches[0].clientY - rect.top;
        person.style.position = "absolute";
        person.style.zIndex = 1000;
    });

    person.addEventListener("touchmove", e => {
        e.preventDefault();
        if (!touchItem) return;
        touchItem.style.left = e.touches[0].clientX - offsetX + "px";
        touchItem.style.top = e.touches[0].clientY - offsetY + "px";
    });

    person.addEventListener("touchend", e => {
        if (!touchItem) return;

        touchItem.style.position = "static";
        touchItem.style.zIndex = "";

        const boxes = document.querySelectorAll(".box");
        let dropped = false;

        boxes.forEach(box => {
            const rect = box.getBoundingClientRect();
            const x = e.changedTouches[0].clientX;
            const y = e.changedTouches[0].clientY;

            if (x >= rect.left && x <= rect.right &&
                y >= rect.top && y <= rect.bottom) {
                box.append(touchItem);
                handleLabel(touchItem, box.id);
                dropped = true;
            }
        });
        const parentId = touchItem.parentElement.id;
        if (parentId !== "shop" && parentId !== "house") {
            const tag = touchItem.querySelector(".tag");
            if (tag) tag.remove();
        }

        touchItem = null;
    });
}
function handleLabel(person, boxId) {
    if (boxId === "shop" || boxId === "house") {
        let label = prompt(boxId === "shop" ? "Shop?" : "House?");
        if (label && label.trim() !== "") addTag(person, label);
    }
}
function addTag(person, text) {
    let existing = person.querySelector(".tag");
    if (existing) existing.remove();

    const span = document.createElement("span");
    span.classList.add("tag");
    span.textContent = `(${text})`;
    person.append(span);
}
function addPeople() {
    const name = prompt("Who would you like to add?");
    if (!name || name.trim() === "") return;

    const person = document.createElement("p");
    person.classList.add("item");
    person.textContent = name;

    setupPerson(person);
    document.getElementById("unemployed").append(person);
}
