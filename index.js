const allBoxes = document.querySelectorAll(".box");
let draggedItem = null;
let touchItem = null;
let offsetX = 0;
let offsetY = 0;

document.querySelectorAll(".item").forEach(item => {
    setupPerson(item, item.textContent);
});

function setupPerson(person, name) {
    person.dataset.name = name;
    renderPerson(person);

    person.ondragstart = dragStart;
    person.ondragend = dragEnd;

    person.addEventListener("touchstart", touchStart);
    person.addEventListener("touchmove", touchMove);
    person.addEventListener("touchend", touchEnd);
}

function renderPerson(person) {
    person.innerHTML = "";

    const text = document.createTextNode(person.dataset.name);
    person.appendChild(text);

    if (person.dataset.tag) {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = ` (${person.dataset.tag})`;
        person.appendChild(span);
    }

    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "✖";
    del.onclick = e => {
        e.stopPropagation();
        person.remove();
    };

    person.appendChild(del);
}

function dragStart() {
    draggedItem = this;
    setTimeout(() => this.style.display = "none");
}

function dragEnd() {
    this.style.display = "block";
    draggedItem = null;
}

allBoxes.forEach(box => {
    box.ondragover = e => e.preventDefault();
    box.ondrop = function () {
        this.append(draggedItem);
        handleLabel(draggedItem, this.id);
    };
});

function handleLabel(person, boxId) {
    if (boxId === "shop" || boxId === "house") {
        const label = prompt(boxId === "shop" ? "Shop?" : "House?");
        if (label && label.trim() !== "") {
            person.dataset.tag = label;
        }
    } else {
        delete person.dataset.tag;
    }
    renderPerson(person);
}

function touchStart(e) {
    e.preventDefault();
    touchItem = this;

    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;

    touchItem.style.transition = "none";
    touchItem.style.zIndex = 1000;
}

function touchMove(e) {
    if (!touchItem) return;
    e.preventDefault();

    const touch = e.touches[0];
    currentX = touch.clientX - startX;
    currentY = touch.clientY - startY;

    touchItem.style.transform = `translate(${currentX}px, ${currentY}px)`;
}

function touchEnd(e) {
    if (!touchItem) return;

    touchItem.style.transition = "";
    touchItem.style.transform = "";
    touchItem.style.zIndex = "";

    const x = e.changedTouches[0].clientX;
    const y = e.changedTouches[0].clientY;

    document.querySelectorAll(".box").forEach(box => {
        const r = box.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
            box.appendChild(touchItem);
            handleLabel(touchItem, box.id);
        }
    });

    touchItem = null;
}

function addPeople() {
    const newName = prompt("Who would you like to add?");
    if (!newName || newName.trim() === "") return;

    const p = document.createElement("p");
    p.className = "item";
    setupPerson(p, newName.trim());
    document.getElementById("unemployed").appendChild(p);
}

