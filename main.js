//SIDUS 2D PLOTTER

var paper = document.getElementsByClassName("paper")[0];
paper.innerHTML = "";
        
var width = paper.clientWidth;
var height = paper.clientHeight;
 var paper_svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
paper_svg.setAttribute("width",width);
paper_svg.setAttribute("height",height);
//grid
function makeGrid([xi,xf],[yi,yf]){
       
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

        //make the x grid
        var n_gl_x = 20;
        var x_grid_values = getGridValues([xi,xf],n_gl_x,width);
        for (var i = 0; i < x_grid_values.gridValues.length; i++) {
            var xgrid = document.createElementNS("http://www.w3.org/2000/svg", "line");
            //map the grid values to the screen
            var xgrid_x1 = Math.round((x_grid_values.gridValues[i]-xi)/(xf-xi)*width);
            var xgrid_x2 = Math.round((x_grid_values.gridValues[i]-xi)/(xf-xi)*width);
            xgrid.setAttribute("x1",xgrid_x1);
            xgrid.setAttribute("y1",0);
            xgrid.setAttribute("x2",xgrid_x2);
            xgrid.setAttribute("y2",height);
            xgrid.setAttribute("stroke","black");
            xgrid.setAttribute("stroke-width","0.2");
            paper_svg.appendChild(xgrid);
        }

        //make the y grid
        var y_grid_values = getGridValues([yi,yf],n_gl_x*height/width,height);
        for (var i = 0; i < y_grid_values.gridValues.length; i++) {
            var ygrid = document.createElementNS("http://www.w3.org/2000/svg", "line");
            //map the grid values to the screen
            var ygrid_y1 = Math.round((y_grid_values.gridValues[i]-yi)/(yf-yi)*height);
            var ygrid_y2 = Math.round((y_grid_values.gridValues[i]-yi)/(yf-yi)*height);
            ygrid.setAttribute("x1",0);
            ygrid.setAttribute("y1",ygrid_y1);
            ygrid.setAttribute("x2",width);
            ygrid.setAttribute("y2",ygrid_y2);
            ygrid.setAttribute("stroke","black");
            ygrid.setAttribute("stroke-width","0.2");
            paper_svg.appendChild(ygrid);
        }

        //make the x labels
        for (var i = 0; i < x_grid_values.domainValues.length; i++) {
            var x_label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            //map the grid values to the screen
            var x_label_x = Math.round((x_grid_values.gridValues[i]-xi)/(xf-xi)*width);
            //if the label has nothing in decimal part, remove the decimal part
            if(x_grid_values.domainValues[i] == Math.round(x_grid_values.domainValues[i])){
                x_grid_values.domainValues[i] = Math.round(x_grid_values.domainValues[i]);
            }
            //if the label is too close to the axis, move it a bit
            if(Math.abs(x_label_x-x0) < 15){
                if(x_label_x < x0){
                    x_label_x += 15;
                }else{
                    x_label_x -= 15;
                }
            }
            x_label.setAttribute("x",x_label_x);
            x_label.setAttribute("y",y0+15);
            x_label.setAttribute("font-size","12");
            x_label.setAttribute("font-family","Inter");
            x_label.setAttribute("text-anchor","middle");
            x_label.setAttribute("dominant-baseline","middle");
            x_label.innerHTML = x_grid_values.domainValues[i];
            paper_svg.appendChild(x_label);
        }

        //make the y labels
        for (var i = 0; i < y_grid_values.domainValues.length; i++) {
            if(y_grid_values.domainValues[i] == 0) continue; //don't show 0 (it's already on the axis)
            var y_label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            //map the grid values to the screen
            var y_label_y = Math.round((y_grid_values.gridValues[i]-yi)/(yf-yi)*height);
            //if the label has nothing in decimal part, remove the decimal part
            if(y_grid_values.domainValues[i] == Math.round(y_grid_values.domainValues[i])){
                y_grid_values.domainValues[i] = Math.round(y_grid_values.domainValues[i]);
            }
            y_label.setAttribute("x",x0-15);
            y_label.setAttribute("y",height-y_label_y);
            y_label.setAttribute("font-size","12");
            y_label.setAttribute("font-family","Inter");
            y_label.setAttribute("text-anchor","middle");
            y_label.setAttribute("dominant-baseline","middle");
            y_label.innerHTML = y_grid_values.domainValues[i];
            paper_svg.appendChild(y_label);
        }
    };

//make the plot
function makePlot(f,[xi,xf],[yi,yf]){
    n=width*2;
    var x = [];
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

    
    var path = document.createElementNS("http://www.w3.org/2000/svg","path");
    path.setAttribute("d",dpath);
    path.setAttribute("stroke","#c5a3ff");
    path.setAttribute("stroke-width","3");
    path.setAttribute("fill","none");
    paper_svg.appendChild(path);

   
}



domain_init_x = [-10,10];
domain_init_y = [domain_init_x[0]*height/width,domain_init_x[1]*height/width];
makeGrid(domain_init_x,domain_init_y);

//make the plot
makePlot(getEquation(),domain_init_x,domain_init_y);
paper.appendChild(paper_svg);

////////////

//function to get grid values
function getGridValues(domain, numLines, screenRange) {
    let spacing = (domain[1] - domain[0]) / numLines;
    const minSpacing = (screenRange[1] - screenRange[0]) / numLines;
    while (spacing < minSpacing) {
      numLines *= 2;
      spacing = (domain[1] - domain[0]) / numLines;
    }
    const domainValues = [];
    const gridValues = [];
    const precision = Math.max(2, Math.abs(Math.ceil(Math.log10(spacing))));
    const start = Math.ceil(domain[0] / spacing) * spacing;
    const end = Math.floor(domain[1] / spacing) * spacing;
    for (let i = start; i <= end; i += spacing) {
      domainValues.push(i.toFixed(precision));
      gridValues.push(Math.round(i / spacing) * spacing);
    }
    return { domainValues, gridValues };
  }
  
//function to get the equation
function getEquation() {
    var equation = document.getElementById("eq-input").value;
    //parse the equation
    equation = math.parse(equation);
    //compile the equation
    equation = equation.compile();
    //return the equation
    return equation;
}

