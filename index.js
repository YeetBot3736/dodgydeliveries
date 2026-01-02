const allBoxes = document.querySelectorAll(".box");
let draggedItem = null;
let touchItem = null;
let startX = 0;
let startY = 0;

document.querySelectorAll(".item").forEach(item => {
    setupPerson(item, item.textContent);
});

function setupPerson(person, name) {
    person.dataset.name = name;
    renderPerson(person);

    person.draggable = true;
    person.ondragstart = dragStart;
    person.ondragend = dragEnd;

    person.addEventListener("touchstart", touchStart, { passive: false });
    person.addEventListener("touchmove", touchMove, { passive: false });
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

function dragStart(e) {
    e.preventDefault();
    draggedItem = this;
    e.dataTransfer.setData("text/plain", "");
}

function dragEnd() {
    draggedItem = null;
}

allBoxes.forEach(box => {
    box.ondragover = e => e.preventDefault();
    box.ondrop = function () {
        if (!draggedItem) return;
        this.appendChild(draggedItem);
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

    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;

    touchItem.style.zIndex = 1000;
}

function touchMove(e) {
    if (!touchItem) return;
    e.preventDefault();

    const t = e.touches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    touchItem.style.transform = `translate(${dx}px, ${dy}px)`;
}

function touchEnd(e) {
    if (!touchItem) return;

    const x = e.changedTouches[0].clientX;
    const y = e.changedTouches[0].clientY;

    touchItem.style.transform = "";
    touchItem.style.zIndex = "";

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
    if (!newName || !newName.trim()) return;

    const p = document.createElement("p");
    p.className = "item";
    setupPerson(p, newName.trim());
    document.getElementById("unemployed").appendChild(p);
}

