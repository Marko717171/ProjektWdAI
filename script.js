function lockActivities(){
    let activities = Array.prototype.slice.call(document.getElementById("activities-grid").children);

    lock(activities);
}

function lockCallToActionCards(){
    let cards = Array.prototype.slice.call(document.getElementById("call-to-action-inner").children);

    lock(cards);
}

function loaded(){
    lockActivities();
    lockCallToActionCards();
}

function onResize(){
    lockActivities();
    lockCallToActionCards();
}

window.addEventListener("DOMContentLoaded", loaded);
window.addEventListener("resize",onResize);
