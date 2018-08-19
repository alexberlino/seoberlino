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
