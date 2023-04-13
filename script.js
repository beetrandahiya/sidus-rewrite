//////////////////////////////////////////
///////////// SIDUS REWRITE //////////////
//////////////////////////////////////////

//mathjs config

//test function
function plot(f,[xi,xf],[yi,yf],n) {
    var startTime = performance.now()
    //get paper element
    var paper = document.getElementsByClassName("paper")[0];
    //clear paper
    paper.innerHTML = "";
    //get paper width and height
    var width = paper.clientWidth;
    var height = paper.clientHeight;
    //set number of points
    if (n == undefined) {
        n = width;
    }

    
    //make a list of pixels along the x axis
    var x = [];
    for (var i = 0; i < width; i+=width/n) {
        x.push(i);
    }
    //map the x values to the domain
    var xval = x.map(function(x) {
        return (x*(xf-xi)/width + xi);
    });
    var x= x.map(function(x) {
        return x;
    });

    //make a list of y values
    var y = xval.map(function(x) {
        return f.evaluate({x:x});
    });
    //map the y values to the range
    var y = y.map(function(y) {
        
        return (height/2 - y*height/(yf-yi));

    });
    var endTime = performance.now()
    console.log(`eval took ${endTime - startTime} milliseconds`)
    
    var startTime = performance.now()

    //make a list of points
    var points = [];
    for (var i = 0; i < x.length; i++) {
        points.push([x[i],y[i]]);
    }

    //make a path
    var dpath = " M " + points[0][0] + "," + points[0][1];
    for (var i = 1; i < points.length; i++) {
        dpath += " L " + points[i][0] + "," + points[i][1];
    }
   
    //draw the path
    var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute("width",width);
    svg.setAttribute("height",height);
    var path = document.createElementNS("http://www.w3.org/2000/svg","path");
    path.setAttribute("d",dpath);
    path.setAttribute("stroke","black");
    path.setAttribute("stroke-width","2");
    path.setAttribute("fill","none");
    svg.appendChild(path);
    paper.appendChild(svg);
    var endTime = performance.now()
    console.log(`plot took ${endTime - startTime} milliseconds`)

}

function getEquation() {
    var equation = document.getElementById("eq-input").value;
    //parse the equation
    equation = math.parse(equation);
    //compile the equation
    equation = equation.compile();
    //return the equation
    return equation;
}

var eqn=getEquation();
var xi= -10;
var xf= 10;
var yi= -5;
var yf= 5;

plot(eqn,[xi,xf],[yi,yf],document.getElementById("n-val").value);

//set input box to update on change
document.getElementById("eq-input").addEventListener("change",function() {
    eqn = getEquation();
    plot(eqn,[xi,xf],[yi,yf],document.getElementById("n-val").value);
});

//set input box to update on change
document.getElementById("n-val").addEventListener("change",function() {
    eqn = getEquation();
    plot(eqn,[xi,xf],[yi,yf],document.getElementById("n-val").value);
});



// add scroll functionality to zoom on the paper
var paper = document.getElementsByClassName("paper")[0];
paper.addEventListener("wheel",function(e) {
    //dont scroll the page
    e.preventDefault();
    //on scroll, get the amount scrolled
    var delta = e.deltaY;
    console.log(delta);
    //for one scroll unit, zoom in or out by 1%
    var zoom = -delta/100;
    //get the current width and height
    xi=xi*(1-zoom);
    xf=xf*(1-zoom);
    yi=yi*(1-zoom);
    yf=yf*(1-zoom);
    plot(eqn,[xi,xf],[yi,yf],document.getElementById("n-val").value);
});

  