const canvas = document.getElementById("canvas");
var content = canvas.getContext("2d");

content.strokeStyle = "#383428";
var x;
var y;
var move;
var sig = document.getElementById("sig");

canvas.addEventListener("mousedown", function(e) {
    e.stopPropagation();
    x = e.offsetX;
    y = e.offsetY;
    canvas.addEventListener(
        "mousemove",
        (move = function(e) {
            content.moveTo(x, y);
            x = e.offsetX;
            y = e.offsetY;
            content.lineTo(x, y);
            content.stroke();
        })
    );
});

document.addEventListener("mouseup", function() {
    canvas.removeEventListener("mousemove", move);
    sig.value = canvas.toDataURL();
});

canvas.addEventListener("mousedown", function(e) {
    e.stopPropagation();
    x = e.offsetX;
    y = e.offsetY;
    canvas.addEventListener(
        "mousemove",
        (move = function(e) {
            content.moveTo(x, y);
            x = e.offsetX;
            y = e.offsetY;
            content.lineTo(x, y);
            content.stroke();
        })
    );
});

window.alert = function(title, message) {
    var myElementToShow = document.getElementById("deleteSign");
    myElementToShow.innerHTML = title + "</br>" + message;
};

function sendMail() {
    var link =
        "mailto:me@example.com" +
        "?cc=myCCaddress@example.com" +
        "&subject=" +
        escape("This is my subject") +
        "&body=" +
        escape(document.getElementById("myText").value);

    window.location.href = link;
}

// // When the user scrolls the page, execute myFunction
// window.onscroll = function() {
//     myFunction();
// };
//
// // Get the navbar
// var nav = document.getElementsByName("nav");
//
// // Get the offset position of the navbar
// var sticky = nav.offsetTop;
//
// // Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
// function myFunction() {
//     if (window.pageYOffset >= sticky) {
//         nav.classList.add("sticky");
//     } else {
//         nav.classList.remove("sticky");
//     }
// }
