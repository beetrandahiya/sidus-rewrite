//////////////////////////////////////////
///////////// SIDUS REWRITE //////////////

//test function

function f(x) {
    return Math.cos(x);
}
function plot(f,[xi,xf],[yi,yf]) {
    //get paper element
    var paper = document.getElementsByClassName("paper")[0];
    //get paper width and height
    var width = paper.clientWidth;
    var height = paper.clientHeight;

    //get position of paper element
    var rect = paper.getBoundingClientRect();
    var paperX = Math.round(rect.left);
    var paperY = Math.round(rect.top);
    console.log(paperX,paperY);
    
    //make a list of pixels along the x axis
    var x = [];
    for (var i = 0; i < width; i++) {
        x.push(i);
    }
    //map the x values to the domain
    var xval = x.map(function(x) {
        return (x*(xf-xi)/width + xi);
    });
    console.log(xval);
    
    var x= x.map(function(x) {
        return x;
    });
    console.log(x);

    //make a list of y values
    var y = xval.map(f);
    //map the y values to the range
    var y = y.map(function(y) {
        
        return (height/2 - y*height/(yf-yi));

    });

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

    console.log(path);
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

}

plot(f,[-10,10],[-2,2]);