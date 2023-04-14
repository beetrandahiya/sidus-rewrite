//SIDUS 2D PLOTTER

var paper = document.getElementsByClassName("paper")[0];
paper.innerHTML = "";
        
var width = paper.clientWidth;
var height = paper.clientHeight;
console.log(width,height);              //THIS IS THE ONE WITH EXTRA 17 PIXELS


var paper_svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
paper_svg.setAttribute("width",width);
paper_svg.setAttribute("height",height);
paper.appendChild(paper_svg);
//grid
function makeGrid(xi,xf,yi,yf){
      

        //find the point on the x axis that is closest to 0
        var x0 = Math.round((0-xi)/(xf-xi)*width);
        //find the point on the y axis that is closest to 0
        var y0 = Math.round((0-yi)/(yf-yi)*height);

        //make the x axis
        var xaxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
        xaxis.setAttribute("x1",0);
        xaxis.setAttribute("y1",y0);
        xaxis.setAttribute("x2",width);
        xaxis.setAttribute("y2",y0);
        xaxis.setAttribute("stroke","black");
        xaxis.setAttribute("stroke-width","2");
        paper_svg.appendChild(xaxis);

        //make the y axis
        var yaxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
        yaxis.setAttribute("x1",x0);
        yaxis.setAttribute("y1",0);
        yaxis.setAttribute("x2",x0);
        yaxis.setAttribute("y2",height);
        yaxis.setAttribute("stroke","black");
        yaxis.setAttribute("stroke-width","2");
        paper_svg.appendChild(yaxis);


    };

makeGrid(-10,10,-5,5);
////////////

console.log(paper.clientWidth,paper.clientHeight)   //OUTPUTS THE REAL WIDTH AND HEIGHT OF THE PAPER