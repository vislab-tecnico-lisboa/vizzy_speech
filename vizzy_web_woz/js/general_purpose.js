window.onload = function() { 
     var svg = document.getElementById('general_purpose'),
//var svgObject = document.getElementById('svgObject');
//var svgDoc =  svgObject.contentDocument;
//var svg = svgDoc.getElementById('menu');
    itemsContainer = document.getElementById('itemsContainer'),
    trigger = document.getElementById('trigger'),
    label = trigger.querySelectorAll('#label')[0],
    items = Snap(itemsContainer),
    originalTransform = itemsContainer.getAttribute("transform"),
    open = false;



//close items
items.animate({
    transform: "s0,0,250,250",
    opacity: 0
}, .005);
svg.style.pointerEvents = "none";
//attach listener
trigger.addEventListener('click', toggleMenu, false);

//handle click
function toggleMenu(event) {
    if (!event) var event = window.event;
    event.stopPropagation();
    open = !open;

    if (!open) {
        items.animate({
            transform: "s0,0,250,250",
            opacity: 0
        }, 400, mina.backin);
        svg.style.pointerEvents = "none";
    } else {
        items.animate({
            transform: originalTransform,
            opacity: 1
        }, 1000, mina.elastic);
        svg.style.pointerEvents = "auto";
    }

}

svg.onclick = function (e) {
    e.stopPropagation();
}
//close the nav when document is clicked
document.onclick = function () {
    open = false;
    items.animate({
        transform: "s0,0,250,250",
        opacity: 0
    }, 400, mina.backin);
    svg.style.pointerEvents = "none";
};
}
