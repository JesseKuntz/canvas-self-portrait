/*
 * gasket v2: draw a Sierpinski gasket by drawing lots of dots,
 * where each is the average of the previous and a random vertex
 * For CS 352, Calvin College Computer Science
 *
 * Jesse Kuntz -- February 2019
 */

var gasket = {
    particles: [],
    max: 50,
    speed: 3,
    size: 20,
    isMagic: false,
    timer: null,
    redMagic: 260,
    blueMagic: 0,
    gradient: null
}

$(document).ready(function () { gasket.init(); });

gasket.init = function () {
    gasket.canvas = $('#canvas1')[0];
    gasket.cx = gasket.canvas.getContext('2d');	// get the drawing canvas
    gasket.cx.fillStyle = 'rgba(250,0,0,0.7)';
    gasket.cx.globalCompositeOperation = "lighter";
    // IMAGE PRIMITIVE
    gasket.image = $('#source')[0];
    gasket.cx.drawImage(gasket.image, 0, 0, gasket.canvas.width, gasket.canvas.height);
    gasket.cx.font = "30px Arial";

    // Red Gradient
    gasket.redGrad = gasket.cx.createLinearGradient(0, 0, 170, 0);
    gasket.redGrad.addColorStop(0, "red");
    gasket.redGrad.addColorStop(1, "yellow");

    // Blue Gradient
    gasket.blueGrad = gasket.cx.createLinearGradient(0, 0, 170, 0);
    gasket.blueGrad.addColorStop(0, "blue");
    gasket.blueGrad.addColorStop(1, "teal");

    // bind functions to events, button clicks
    $('#slider1').bind('change', gasket.slider);
    $('#magicbutton').bind('click', gasket.magic);
}

gasket.draw = function (ev) {
    // pick a random point along the bottom edge
    p = Vector.create([Math.random(), 0]);
    $('#messages').prepend("Starting point: (" + p.e(1) + "," + p.e(2) + ")<br>");

    for (i = 0; i < $('#slider1').val(); i++) {
        v = Math.floor(Math.random() * 3);		// random integer from 0 to 2
        p = (vertex[v].add(p)).multiply(0.5);	// average p with chosen vertex
        if (i < 5) {
            $('#messages').prepend("Avg with vertex[" + v + "]->[" + p.e(1) + "," + p.e(2) + "]<br>");
        }

        gasket.circle(p.e(1), p.e(2), gasket.radius);
    }
}

function Particle(x, y, xs, ys) {
    this.x=x;
    this.y=y;
    this.xs=xs;
    this.ys=ys;
    this.life=0;
}

gasket.magic = function (ev) {
    gasket.isMagic = !gasket.isMagic;

    if (gasket.isMagic) {
        gasket.timer = setInterval(gasket.fire, 40);
        $('#magicbutton').html("No More Magic!");
    }
    else {
        $('#magicbutton').html("Turn Magic On!");
        clearInterval(gasket.timer);
        gasket.particles = [];
        gasket.cx.clearRect(0, 0, gasket.canvas.width, gasket.canvas.height);
        gasket.cx.drawImage(gasket.image, 0, 0, gasket.canvas.width, gasket.canvas.height);
    }
}

// Code inspired/adapted by: https://www.davepagurek.com/blog/fire-particles-for-html5-canvas/
gasket.fire = function(ev) {
    gasket.size = $("#slider1").val();
    gasket.speed = gasket.size / 6.6666666667;

    if ($("#checkbox1")[0].checked) {
        gasket.blueMagic = 260;
        gasket.redMagic = 0;
        gasket.gradient = gasket.blueGrad;
        $("body").css("background-color", "teal")
    } else {
        gasket.blueMagic = 0;
        gasket.redMagic = 260;
        gasket.gradient = gasket.redGrad;
        $("body").css("background-color", "#c88")
    }

    // Adds ten new particles every frame
    for (var i=0; i<10; i++) {
        // Adds a particle at the mouse position, with random horizontal and vertical speeds
        var p = new Particle(268, 170, (Math.random()*2*gasket.speed-gasket.speed)/2, 0-Math.random()*2*gasket.speed);
        gasket.particles.push(p);
    }

    // Clear the context so we can draw the new frame
    gasket.cx.clearRect(0, 0, gasket.canvas.width, gasket.canvas.height);

    // Draw the new frame
    gasket.cx.drawImage(gasket.image, 0, 0, gasket.canvas.width, gasket.canvas.height);

    // RECT PRIMITIVE
    gasket.cx.fillRect(6, 14, 150, 50);

    gasket.cx.fillStyle = gasket.gradient;
    // TEXT PRIMITIVE
    gasket.cx.fillText("Incendio...", 10, 50);

    // Cycle through all the particles to draw them
    for (var i=0; i<gasket.particles.length; i++) {

        // Set the fill color to an RGBA value where it starts off red-orange, but progressively
        // gets more grey and transparent the longer the particle has been alive for
        gasket.cx.fillStyle = "rgba("+(gasket.redMagic-(gasket.particles[i].life*2))+","+((gasket.particles[i].life*2)+50)+","+(gasket.blueMagic-(gasket.particles[i].life*2))+","+(((gasket.max-gasket.particles[i].life)/gasket.max)*0.4)+")";

        // PATH PRIMITIVE
        gasket.cx.beginPath();
        // Draw the particle as a circle, which gets slightly smaller the longer it's been alive for
        gasket.cx.arc(gasket.particles[i].x, gasket.particles[i].y, (gasket.max - gasket.particles[i].life)/gasket.max*(gasket.size/2)+(gasket.size/2),0,2*Math.PI);
        gasket.cx.fill();

        // Move the particle based on its horizontal and vertical speeds
        gasket.particles[i].x += gasket.particles[i].xs;
        gasket.particles[i].y += gasket.particles[i].ys;

        gasket.particles[i].life++;

        // If the particle has lived longer than we are allowing, remove it from the array.
        if (gasket.particles[i].life >= gasket.max) {
            gasket.particles.splice(i, 1);
            i--;
        }
    }
}

// update the message below the slider with its setting
gasket.slider = function (ev) {
    $('#pointcount').text($('#slider1').val());
}
