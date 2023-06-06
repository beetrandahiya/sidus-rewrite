//SIDUS 2D PLOTTER

//plot colors
var colors = ["#c5a3ff", "#ffb3ba", "#bae1ff"]

const rainbowColors = ["#c5a3ff", "#bae1ff", "#e60049", "#0bb4ff", "#50e991", "#e6d800", "#ffb3ba", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"];

var paper = document.getElementsByClassName("paper")[0];
paper.innerHTML = "";

var width = paper.clientWidth;
var height = paper.clientHeight;
var paper_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
paper_svg.setAttribute("width", width);
paper_svg.setAttribute("height", height);

domain_init_x = [-10, 10];
domain_init_y = [domain_init_x[0] * height / width, domain_init_x[1] * height / width];


//grid
//make svg group
var grid = document.createElementNS("http://www.w3.org/2000/svg", "g");
var axes = document.createElementNS("http://www.w3.org/2000/svg", "g");
var axis_labels = document.createElementNS("http://www.w3.org/2000/svg", "g");
grid.setAttribute("id", "grid");
axes.setAttribute("id", "axes");
axis_labels.setAttribute("id", "axis_labels");

function makeGrid([xi, xf], [yi, yf]) {

    //find the point on the x axis that is closest to 0
    var x0 = Math.round((0 - xi) / (xf - xi) * width);
    //find the point on the y axis that is closest to 0
    var y0 = Math.round(((yf - 0) / (yf - yi)) * height);
    //make the x axis
    var xaxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xaxis.setAttribute("x1", 0);
    xaxis.setAttribute("y1", y0);
    xaxis.setAttribute("x2", width);
    xaxis.setAttribute("y2", y0);
    xaxis.setAttribute("stroke", "black");
    xaxis.setAttribute("stroke-width", "1");
    axes.appendChild(xaxis);

    //make the y axis
    var yaxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yaxis.setAttribute("x1", x0);
    yaxis.setAttribute("y1", 0);
    yaxis.setAttribute("x2", x0);
    yaxis.setAttribute("y2", height);
    yaxis.setAttribute("stroke", "black");
    yaxis.setAttribute("stroke-width", "1");
    axes.appendChild(yaxis);

    //make the x grid
    var n_gl_x = 20;
    var x_grid_values = getGridValues([xi, xf], n_gl_x, width);
    for (var i = 0; i < x_grid_values.gridValues.length; i++) {
        var xgrid = document.createElementNS("http://www.w3.org/2000/svg", "line");
        //map the grid values to the screen
        var xgrid_x1 = Math.round((x_grid_values.gridValues[i] - xi) / (xf - xi) * width);
        var xgrid_x2 = Math.round((x_grid_values.gridValues[i] - xi) / (xf - xi) * width);
        xgrid.setAttribute("x1", xgrid_x1);
        xgrid.setAttribute("y1", 0);
        xgrid.setAttribute("x2", xgrid_x2);
        xgrid.setAttribute("y2", height);
        xgrid.setAttribute("stroke", "black");
        xgrid.setAttribute("stroke-width", "0.2");
        grid.appendChild(xgrid);
    }

    //make the y grid
    var y_grid_values = getGridValues([yi, yf], n_gl_x * height / width, height);
    for (var i = 0; i < y_grid_values.gridValues.length; i++) {
        var ygrid = document.createElementNS("http://www.w3.org/2000/svg", "line");
        //map the grid values to the screen
        var ygrid_y1 = Math.round((yf - y_grid_values.gridValues[i]) / (yf - yi) * height);
        var ygrid_y2 = Math.round((yf - y_grid_values.gridValues[i]) / (yf - yi) * height);
        ygrid.setAttribute("x1", 0);
        ygrid.setAttribute("y1", ygrid_y1);
        ygrid.setAttribute("x2", width);
        ygrid.setAttribute("y2", ygrid_y2);
        ygrid.setAttribute("stroke", "black");
        ygrid.setAttribute("stroke-width", "0.2");
        grid.appendChild(ygrid);
    }

    //make the x labels
    for (var i = 0; i < x_grid_values.domainValues.length; i++) {
        var x_label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        //map the grid values to the screen
        var x_label_x = Math.round((x_grid_values.gridValues[i] - xi) / (xf - xi) * width);
        //if the label has nothing in decimal part, remove the decimal part
        if (x_grid_values.domainValues[i] == Math.round(x_grid_values.domainValues[i])) {
            x_grid_values.domainValues[i] = Math.round(x_grid_values.domainValues[i]);
        }
        //if the label is too close to the axis, move it a bit
        if (Math.abs(x_label_x - x0) < 15) {
            if (x_label_x < x0) {
                x_label_x += 15;
            } else {
                x_label_x -= 15;
            }
        }
        x_label.setAttribute("x", x_label_x);
        x_label.setAttribute("y", y0 + 15);
        x_label.setAttribute("font-size", "12");
        x_label.setAttribute("font-family", "Inter");
        x_label.setAttribute("text-anchor", "middle");
        x_label.setAttribute("dominant-baseline", "middle");
        x_label.innerHTML = x_grid_values.domainValues[i];
        axis_labels.appendChild(x_label);
    }

    //make the y labels
    for (var i = 0; i < y_grid_values.domainValues.length; i++) {
        if (y_grid_values.domainValues[i] == 0) continue; //don't show 0 (it's already on the axis)
        var y_label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        //map the grid values to the screen
        var y_label_y = Math.round((y_grid_values.gridValues[i] - yi) / (yf - yi) * height);
        //if the label has nothing in decimal part, remove the decimal part
        if (y_grid_values.domainValues[i] == Math.round(y_grid_values.domainValues[i])) {
            y_grid_values.domainValues[i] = Math.round(y_grid_values.domainValues[i]);
        }
        y_label.setAttribute("x", x0 - 15);
        y_label.setAttribute("y", height - y_label_y);
        y_label.setAttribute("font-size", "12");
        y_label.setAttribute("font-family", "Inter");
        y_label.setAttribute("text-anchor", "middle");
        y_label.setAttribute("dominant-baseline", "middle");
        y_label.innerHTML = y_grid_values.domainValues[i];
        axis_labels.appendChild(y_label);
    }

    paper_svg.appendChild(grid);
    paper_svg.appendChild(axes);
    paper_svg.appendChild(axis_labels);
};



//make the plot
//make plot group
var plot = document.createElementNS("http://www.w3.org/2000/svg", "g");
plot.setAttribute("id", "plot");
var plots_dir = [];

function makePlot(eq_elem, [xi, xf], [yi, yf], id, scope) {
var scope = scope;
/*
    n = width * 2;
    //make a list of pixels along the x axis
    var x = [];
    for (var i = 0; i < width; i += width / n) {
        x.push(i);
    }
    //map the x values to the domain
    var xval = x.map(function (x) {
        return (x * (xf - xi) / width + xi);
    });
    var x = x.map(function (x) {
        return x;
    });
*/
    //check cases of different types of functions and expressions
    try{
    var f = getEquation(eq_elem);
    var inpE=f.string;
    }
    catch(err){
        var MQ = MathQuill.getInterface(2);
        var eq = MQ(eq_elem).latex();
        var eq = convertLatexToAsciiMath(eq);
        var inpE=eq;
    }
    if (/^[a-zA-Z]+\([a-zA-Z]+\)=/.test(inpE)) {
        // Function initialization input
        var y = math.evaluate(inpE, scope);
        plotSimple(f,scope)
    }
    else if (/^[a-zA-Z]+=/.test(inpE)) {
        // Constant input
        setConstant(inpE, [xi, xf], [yi, yf], id, scope);
    }
    else if (/^{.*}$/.test(inpE)) {
        // Parametric input
        const parametersString = inpE.slice(1, -1);
    const parameters = parametersString.split(',')
      .map((param) => {
        if (param.includes('=')) {
        const [paramName, paramValue] = param.split('=');
        return { paramName, paramValue };

        }
        else {
        const paramValue = param;
        return { paramValue };
        }
      });
      plotParametric(parameters, [xi, xf], [yi, yf], id, scope);
    }
    else if(inpE.includes("=")&&inpE.includes("x")&&inpE.includes("y")){
        //implicit input
        const equationSides = inpE.split('=');
        const eq_eval = equationSides[0] + '-' + equationSides[1];

        plotImplicit(eq_eval, [xi, xf], [yi, yf], id, scope);
    }
    /*else if(inpE.includes("=")&&inpE.includes("x")){
        //implicit input with just x
        const equationSides = inpE.split('=');
        const eq_eval = equationSides[0] + '-' + equationSides[1];
    }*/
    else {
        //normal input
        plotSimple(f,[xi,xf],[yi,yf],id,scope);
    }

    /*
    //map the y values to the range
    var y = y.map(function (y) {

        //find center of the y axis
        var y0 = (yf - 0) / (yf - yi) * height;
        y0 = y0 - y * height / (yf - yi);

        if (y0 < 0) y0 = -height;
        if (y0 > height) y0 = 2 * height;
        return y0;

    });

    //make a list of points
    var points = [];
    for (var i = 0; i < x.length; i++) {
        points.push([x[i], y[i]]);
    }

    //make a path
    //if the first point is undefined, don't draw a line
    if (!isNaN(points[0][1])) {
        var dpath = " M " + points[0][0] + "," + points[0][1];
    } else {
        var dpath = "";
    }

    for (var i = 1; i < points.length; i++) {
        //if the point is undefined, don't draw a line
        if (isNaN(points[i][1])) {
            continue;
        }
        // start the path if the previous points were undefined
        else if (!isNaN(points[i][1]) && isNaN(points[i - 1][1])) {
            dpath += " M " + points[i][0] + "," + points[i][1];
        }
        //if the point is too far from the previous point, don't draw a line
        else if (Math.abs(points[i][1] - points[i - 1][1]) > 100 * (yf - yi)) {
            dpath += " M " + points[i][0] + "," + points[i][1];
        }
        //simply add the point to the path
        else {
            dpath += " L " + points[i][0] + "," + points[i][1];
        }
    }

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", dpath);
    path.setAttribute("stroke", document.getElementById("color" + id).value);
    path.setAttribute("stroke-width", "3");
    path.setAttribute("fill", "none");
    path.setAttribute("id", "plot" + id);
    plot.appendChild(path);

    paper_svg.appendChild(plot);
    */

    //if same then make a div to show the value and y is a number or infinity
   
   /* if (same && !isNaN(y_val)) {
        //get the answer div
        var answer = document.getElementById("answer" + id);
        //if it doesn't exist, make it
        if (!answer) {
            var answer = document.createElement("div");
            answer.className = "answer";
            answer.id = "answer" + id;
            document.getElementById("inp_group" + id).appendChild(answer);
        }
        //set the value
        if (y_val < 0.0000000001 && y_val > -0.0000000001) {
            y_val = 0;
        }
        answer.innerHTML = y_val;
        answer.style.color = document.getElementById("color" + id).value;
    } else {
        //remove the answer div
        var answer = document.getElementById("answer" + id);
        if (answer) {
            answer.remove();
        }
    } */

}


function plotSimple(f,[xi,xf],[yi,yf],id,scope){
    n = width * 2;
    //make a list of pixels along the x axis
    var x = [];
    for (var i = 0; i < width; i += width / n) {
        x.push(i);
    }
    //map the x values to the domain
    var xval = x.map(function (x) {
        return (x * (xf - xi) / width + xi);
    });
   

    var y = xval.map(function(x){
    if(x<=f.domain[0] || x>=f.domain[1]){
        return 0;
    }else{
          //handle errors
        try{
            scope['x'] = x;
            var y = f.equation.evaluate(scope);
            //check for discontinuity
            //for y_minus
            scope['x'] = x - 0.000001;
            var y_minus = f.equation.evaluate(scope);
            //for y_plus
            scope['x'] = x + 0.000001;
            var y_plus = f.equation.evaluate(scope);

            //if the function is discontinuous, set y to NaN
            if (Math.abs(y_minus - y_plus) > 0.1) {
                console.log("discontinuity");
                y = NaN;
            }
        }catch(e){
            //if there is an error
            return NaN;
        }
        //if infinity, set to a large number
        if (y == Infinity) y = 999999999999;
        if (y == -Infinity) y = -999999999999;
     return y;
    }});
    //map the y values to the range
    var y = y.map(function (y) {

        //find center of the y axis
        var y0 = (yf - 0) / (yf - yi) * height;
        y0 = y0 - y * height / (yf - yi);

        if (y0 < 0) y0 = -height;
        if (y0 > height) y0 = 2 * height;
        return y0;
    });
    //make a list of points
    var points = [];
    for (var i = 0; i < x.length; i++) {
        points.push([x[i], y[i]]);
    }
    //make a path
    //if the first point is undefined, don't draw a line
    if (!isNaN(points[0][1])) {
        var dpath = " M " + points[0][0] + "," + points[0][1];
    } else {
        var dpath = "";
    }

    for (var i = 1; i < points.length; i++) {
        //if the point is undefined, don't draw a line
        if (isNaN(points[i][1])) {
            continue;
        }
        // start the path if the previous points were undefined
        else if (!isNaN(points[i][1]) && isNaN(points[i - 1][1])) {
            dpath += " M " + points[i][0] + "," + points[i][1];
        }
        //if the point is too far from the previous point, don't draw a line
        else if (Math.abs(points[i][1] - points[i - 1][1]) > 100 * (yf - yi)) {
            dpath += " M " + points[i][0] + "," + points[i][1];
        }
        //simply add the point to the path
        else {
            dpath += " L " + points[i][0] + "," + points[i][1];
        }
    }

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", dpath);
    path.setAttribute("stroke", document.getElementById("color" + id).value);
    path.setAttribute("stroke-width", "3");
    path.setAttribute("fill", "none");
    path.setAttribute("id", "plot" + id);
    plot.appendChild(path);

    paper_svg.appendChild(plot);
}

function setConstant(f_string,[xi,xf],[yi,yf],id,scope){
    try{
        var y=math.evaluate(f_string,scope);

        var y0 = (yf - 0) / (yf - yi) * height;
        y0 = y0 - y * height / (yf - yi);

        if (y0 < 0) y0 = -height;
        if (y0 > height) y0 = 2 * height;
        y=y0;
       
        //make the path
        var dpath = " M " + 0 + "," + y;
        dpath += " L " + width + "," + y;

        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", dpath);
        path.setAttribute("stroke", document.getElementById("color" + id).value);
        path.setAttribute("stroke-width", "3");
        path.setAttribute("fill", "none");
        path.setAttribute("id", "plot" + id);
        plot.appendChild(path);

        paper_svg.appendChild(plot);
    }catch(e){
        console.log("error in setting constant");
        console.log(e);
    }
    //make y an array of the same length as x
    
}

function setFunction(f_name,f_exp,x,scope){
    try{
        var y = math.evaluate(f_exp,scope);
    }catch(e){
        console.log("error in setting function");
        console.log(e);
    }
    return y;
}

function plotParametric(params, [xi, xf], [yi, yf], id, scope) {
    //get the x and y expressions
    var x_exp = params[0].paramValue;
    var y_exp = params[1].paramValue;
    //get the x and y arrays
    t_min = 0;
    t_max = 2 * Math.PI;
    var t = math.range(t_min, t_max, 0.01).toArray();
    //set the x and y values
    var xval= t.map(function (t) {
        scope['t'] = t;
        return math.evaluate(x_exp, scope);
    }
    );
    var yval = t.map(function (t) {
        scope['t'] = t;
        return math.evaluate(y_exp, scope);
    }
    );
    //map the x values to the range
    var x = xval.map(function (x) {
        var x0 = (xi - 0) / (xi - xf) * width;
        x0 = x0 - x * width / (xi - xf);
        if (x0 < 0) x0 = -width;
        if (x0 > width) x0 = 2 * width;
        return x0;
    }
    );
    //map the y values to the range
    var y = yval.map(function (y) {
        var y0 = (yf - 0) / (yf - yi) * height;
        y0 = y0 - y * height / (yf - yi);
        if (y0 < 0) y0 = -height;
        if (y0 > height) y0 = 2 * height;
        return y0;
    }
    );
    //make a list of points
    var points = [];
    for (var i = 0; i < x.length; i++) {
        points.push([x[i], y[i]]);
    }
    //make a path
    //if the first point is undefined, don't draw a line
    if (isNaN(points[0][1])) {
        var dpath = " M " + points[0][0] + "," + points[0][1];
    }
    //if the first point is defined, start the path
    else {
        var dpath = " M " + points[0][0] + "," + points[0][1];
    }
    //for each point
    for (var i = 1; i < points.length; i++) {
        //if the point is undefined, don't draw a line
        if (isNaN(points[i][1])) {
            dpath += " M " + points[i][0] + "," + points[i][1];
        }
        //if the previous point was undefined, start the path
        else if (isNaN(points[i - 1][1])) {
            dpath += " M " + points[i][0] + "," + points[i][1];
        }
        //if the point is too far from the previous point, don't draw a line
        else if (Math.abs(points[i][1] - points[i - 1][1]) > 100 * (yf - yi)) {
            dpath += " M " + points[i][0] + "," + points[i][1];
        }
        //simply add the point to the path
        else {
            dpath += " L " + points[i][0] + "," + points[i][1];
        }
    }
    //make the path
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", dpath);
    path.setAttribute("stroke", document.getElementById("color" + id).value);
    path.setAttribute("stroke-width", "3");
    path.setAttribute("fill", "none");
    path.setAttribute("id", "plot" + id);
    plot.appendChild(path);
    paper_svg.appendChild(plot);

}
function plotImplicit(eq_eval, [xi, xf], [yi, yf], id, scope) {
    //map the x and y values to the domain
    dx=xf - xi;
    dy=yf - yi;
    var c = 0;
    quadtree(eq_eval, c, xi, yi, dx, dy, 0, [xi, xf], [yi, yf], id, scope);
}

function quadtree(zFunc, c, x, y, dx, dy, depth, [xi, xf], [yi, yf], id, scope) {
    var SEARCH_DEPTH = 1;
    var PLOT_DEPTH = 3;
	//console.log("quadtree");
	//console.log(depth);
    //map the x and y values to the domain
    
	if (depth < SEARCH_DEPTH) {
		dx = dx / 2;
		dy = dy / 2;
		quadtree(zFunc, c, x, y, dx, dy, depth + 1, [xi, xf], [yi, yf], id, scope);
		quadtree(zFunc, c, x + dx, y, dx, dy, depth + 1, [xi, xf], [yi, yf], id, scope);
		quadtree(zFunc, c, x, y + dy, dx, dy, depth + 1, [xi, xf], [yi, yf], id, scope);
		quadtree(zFunc, c, x + dx, y + dy, dx, dy, depth + 1, [xi, xf], [yi, yf], id, scope);
		//console.log("searching 1");
	} else {
		if (hasSegment(zFunc, c, x, y, dx, dy)) {
			if (depth >= PLOT_DEPTH) {
               // console.log("plotting");
				a=addSegment(zFunc, c, x, y, dx, dy, [xi, xf], [yi, yf], id, scope);
			} else {
				dx = dx / 2;
				dy = dy / 2;
				quadtree(zFunc, c, x, y, dx, dy, depth + 1, [xi, xf], [yi, yf], id, scope);
				quadtree(zFunc, c, x + dx, y, dx, dy, depth + 1, [xi, xf], [yi, yf], id, scope);
				quadtree(zFunc, c, x, y + dy, dx, dy, depth + 1, [xi, xf], [yi, yf], id, scope);
				quadtree(zFunc, c, x + dx, y + dy, dx, dy, depth + 1, [xi, xf], [yi, yf], id, scope);
			}
		}
		else{
			//console.log("no segment");
		}
	}
}

function hasSegment(zFunc, c, x, y, dx, dy) {
    var scope = {};
    scope['x'] = x;
    scope['y'] = y;
	var z1 = math.evaluate(zFunc, scope); // bottom left corner
	scope['x'] = x + dx;
    scope['y'] = y;
    var z2 = math.evaluate(zFunc, scope); // bottom right corner
    scope['x'] = x + dx;
    scope['y'] = y + dy;
    var z4 = math.evaluate(zFunc, scope); // top right corner
    scope['x'] = x;
    scope['y'] = y + dy;
    var z8 = math.evaluate(zFunc, scope); // top left corner
	var n = 0;
    //console.log(z1,z2,z4,z8);
	if (z1 > c) n += 1;
	if (z2 > c) n += 2;
	if (z4 > c) n += 4;
	if (z8 > c) n += 8;
	//console.log(n != 0 && n != 15);
	return n != 0 && n != 15;
}

function addSegment(zFunc, c, x, y, dx, dy,[xi,xf],[yi,yf],id,scope) {
    var scope = {};
	var xStep = dx;
	var yStep = dy;
	var points = [];
	scope['x'] = x;
    scope['y'] = y;
    var z1 = math.evaluate(zFunc, scope); // bottom left corner
    scope['x'] = x + dx;
    scope['y'] = y;
    var z2 = math.evaluate(zFunc, scope); // bottom right corner
    scope['x'] = x + dx;
    scope['y'] = y + dy;
    var z4 = math.evaluate(zFunc, scope); // top right corner
    scope['x'] = x;
    scope['y'] = y + dy;
    var z8 = math.evaluate(zFunc, scope); // top left corner
	var n = 0;
	if (z1 > c) n += 1;
	if (z2 > c) n += 2;
	if (z4 > c) n += 4;
	if (z8 > c) n += 8;

	// calculate linear interpolation values along the given sides.
	//  to simplify, could assume each is 0.5*xStep or 0.5*yStep accordingly.
	var bottomInterp = (c - z1) / (z2 - z1) * xStep;
	var topInterp = (c - z8) / (z4 - z8) * xStep;
	var leftInterp = (c - z1) / (z8 - z1) * yStep;
	var rightInterp = (c - z2) / (z4 - z2) * yStep;

	// for a visual diagram of cases: https://en.wikipedia.org/wiki/Marching_squares
	if (n == 1 || n == 14) // lower left corner
		points.push([
			[x, y + leftInterp, c],
			[x + bottomInterp, y, c]
		]);

	else if (n == 2 || n == 13) // lower right corner
		points.push([
			[x + bottomInterp, y, c],
			[x + xStep, y + rightInterp, c]
		]);

	else if (n == 4 || n == 11) // upper right corner
		points.push([
			[x + topInterp, y + yStep, c],
			[x + xStep, y + rightInterp, c]
		]);

	else if (n == 8 || n == 7) // upper left corner
		points.push([
			[x, y + leftInterp, c],
			[x + topInterp, y + yStep, c]
		]);

	else if (n == 3 || n == 12) // horizontal
		points.push([
			[x, y + leftInterp, c],
			[x + xStep, y + rightInterp, c]
		]);

	else if (n == 6 || n == 9) // vertical
		points.push([
			[x + bottomInterp, y, c],
			[x + topInterp, y + yStep, c]
		]);

	else if (n == 5) // should do subcase // lower left & upper right
		points.push([
			[x, y + leftInterp, c],
			[x + bottomInterp, y, c],
			[x + topInterp, y + yStep, c],
			[x + xStep, y + rightInterp, c]
		]);

	else if (n == 10) // should do subcase // lower right & upper left
		points.push([
			[x + bottomInterp, y, c],
			[x + xStep, y + rightInterp, c],
			[x, y + yStep / 2, c],
			[x, y + leftInterp, c],
			[x + topInterp, y + yStep, c]
		]);

	else if (n == 0 || n == 15) // no line segments appear in this grid square.
		points.push();



	//draw the line segments
	for (var i = 0; i < points.length; i++) {
		var p1=points[i][0];
		var p2=points[i][1];
        //map the x values from the domain to the screen
        //map x=0 on the screen
        var x0 = (xi - 0) / (xi - xf) * width;
        var x0 = x0 + p1[0] * width / (xf - xi);
        //x0 = x0 + p1[0] * width / (xf - xi);
        if (x0 < 0) x0 = -width;
        if (x0 > width) x0 = 2 * width;
        p1[0]=x0;
        //map the x values to the screen
        var x0 = (xi - 0) / (xi - xf) * width;
        var x0 = x0 + p2[0] * width / (xf - xi);
       // x0 = x0 + p2[0] * width / (xf - xi);
        if (x0 < 0) x0 = -width;
        if (x0 > width) x0 = 2 * width;
        p2[0]=x0;
        //map the y values to the screen
        var y0 = (yf - 0) / (yf - yi) * height;
        y0 = y0 - p1[1] * height / (yf - yi);
        if (y0 < 0) y0 = -height;
        if (y0 > height) y0 = 2 * height;
        p1[1]=y0;
        var y0 = (yf - 0) / (yf - yi) * height;
        y0 = y0 - p2[1] * height / (yf - yi);
        if (y0 < 0) y0 = -height;
        if (y0 > height) y0 = 2 * height;
        p2[1]=y0;
        //make the path
		var dpath = " M " + p1[0] + "," + p1[1];
        dpath += " L " + p2[0] + "," + p2[1];
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", dpath);
        path.setAttribute("stroke", "black");
        path.setAttribute("stroke-width", "3");
        path.setAttribute("fill", "none");
        plot.appendChild(path);

		
	}
	return points;
}

//draw all plots
function makeAllPlots() {
    //remove all plots
    // t0 = performance.now();
    var plot = document.getElementById("plot");
    if (plot) {
        plot.innerHTML = "";
    }
    //get the list of all equations
    var eqs = document.getElementsByClassName("eq-input");
    //for each equation, make a plot
    var sidus_scope = {};
    for (var i = 0; i < eqs.length; i++) {
        makePlot(eqs[i], domain_init_x, domain_init_y, i, sidus_scope);
    }
    // t1 = performance.now();
    //console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
    //console.log(sidus_scope);
}

//add the event listeners
//change the plot when the equation is changed
/*
document.getElementById("fn_inputs").addEventListener("mousedown", function () {
    var eq_inputs = document.getElementsByClassName("eq-input");
    for (var i = 0; i < eq_inputs.length; i++) {
        eq_inputs[i].addEventListener("input", function () {
            makeAllPlots();
        });
    }
});
*/

// add scroll functionality to zoom on the paper
paper.addEventListener("wheel", zoom);

function zoom(e) {
    //dont scroll the page
    e.preventDefault();
    //on scroll, get the amount scrolled
    var w = width;
    var h = height;
    var delta = -e.deltaY;
    //for one scroll unit, zoom in or out by 1%
    var delta_x = w * (delta / 10000);
    var delta_y = h * (delta / 10000);

    //get mouse position
    var x = e.clientX;
    var y = e.clientY;

    domain_init_x[0] = domain_init_x[0] + (x / w) * (delta_x);
    domain_init_x[1] = domain_init_x[1] - (1 - x / w) * (delta_x);
    domain_init_y[0] = domain_init_y[0] + (1 - y / h) * (delta_y);
    domain_init_y[1] = domain_init_y[1] - (y / h) * (delta_y);

    //clear the grid and plot
    grid.innerHTML = "";
    plot.innerHTML = "";
    axes.innerHTML = "";
    axis_labels.innerHTML = "";
    //make the grid and plot
    makeGrid(domain_init_x, domain_init_y);
    makeAllPlots();
}


// add pan functionality to the paper
paper.addEventListener("mousedown", handlePan);

function handlePan(e) {
    //get the mouse position
    x = e.clientX;
    y = e.clientY;
    //add the event listeners
    paper.addEventListener("mousemove", pan);
    paper.addEventListener("mouseup", function () {
        paper.removeEventListener("mousemove", pan);
    });
}

//function to pan the paper
function pan(e) {
    //get the mouse position
    var x2 = e.clientX;
    var y2 = e.clientY;
    //ge the difference in mouse position
    var dx = x2 - x;
    var dy = y2 - y;
    //update the mouse position
    x = x2;
    y = y2;
    //update the domain
    domain_init_x[0] = domain_init_x[0] - dx / width * (domain_init_x[1] - domain_init_x[0]);
    domain_init_x[1] = domain_init_x[1] - dx / width * (domain_init_x[1] - domain_init_x[0]);
    domain_init_y[0] = domain_init_y[0] + dy / height * (domain_init_y[1] - domain_init_y[0]);
    domain_init_y[1] = domain_init_y[1] + dy / height * (domain_init_y[1] - domain_init_y[0]);
    //clear the grid and plot
    grid.innerHTML = "";
    plot.innerHTML = "";
    axes.innerHTML = "";
    axis_labels.innerHTML = "";
    //make the grid and plot
    makeGrid(domain_init_x, domain_init_y);
    makeAllPlots();
};

//use the arrow keys to pan the paper
document.addEventListener("keydown", panKeys);

function panKeys(e) {

    if (e.keyCode == 37) {
        //left arrow
        domain_init_x[0] -= (domain_init_x[1] - domain_init_x[0]) / 100;
        domain_init_x[1] -= (domain_init_x[1] - domain_init_x[0]) / 100;

    } else if (e.keyCode == 38) {
        //up arrow
        domain_init_y[0] += (domain_init_y[1] - domain_init_y[0]) / 100;
        domain_init_y[1] += (domain_init_y[1] - domain_init_y[0]) / 100;

    } else if (e.keyCode == 39) {
        //right arrow
        domain_init_x[0] += (domain_init_x[1] - domain_init_x[0]) / 100;
        domain_init_x[1] += (domain_init_x[1] - domain_init_x[0]) / 100;
    } else if (e.keyCode == 40) {
        //down arrow
        domain_init_y[0] -= (domain_init_y[1] - domain_init_y[0]) / 100;
        domain_init_y[1] -= (domain_init_y[1] - domain_init_y[0]) / 100;
    }
    //clear the grid and plot
    grid.innerHTML = "";
    plot.innerHTML = "";
    axes.innerHTML = "";
    axis_labels.innerHTML = "";
    //make the grid and plot
    makeGrid(domain_init_x, domain_init_y);
    makeAllPlots();
};
//use ctrl + arrow keys to zoom in and out
document.addEventListener("keydown", zoomKeys);

function zoomKeys(e) {

    if (e.ctrlKey) {
        //if up arrow, zoom in
        if (e.keyCode == 38) {
            //up arrow
            domain_init_x[0] += (domain_init_x[1] - domain_init_x[0]) / 10;
            domain_init_x[1] -= (domain_init_x[1] - domain_init_x[0]) / 10;
            domain_init_y[0] += (domain_init_y[1] - domain_init_y[0]) / 10;
            domain_init_y[1] -= (domain_init_y[1] - domain_init_y[0]) / 10;
        }
        //if down arrow, zoom out
        else if (e.keyCode == 40) {
            //down arrow
            domain_init_x[0] -= (domain_init_x[1] - domain_init_x[0]) / 10;
            domain_init_x[1] += (domain_init_x[1] - domain_init_x[0]) / 10;
            domain_init_y[0] -= (domain_init_y[1] - domain_init_y[0]) / 10;
            domain_init_y[1] += (domain_init_y[1] - domain_init_y[0]) / 10;
        }
        //clear the grid and plot
        grid.innerHTML = "";
        plot.innerHTML = "";
        axes.innerHTML = "";
        axis_labels.innerHTML = "";
        //make the grid and plot
        makeGrid(domain_init_x, domain_init_y);
        makeAllPlots();
    }
}
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
    return {
        domainValues,
        gridValues
    };
}

//function to get the equation
function getEquation(elem) {
    //get mathquill object
    var MQ = MathQuill.getInterface(2);

    //get the latex
    var equation = MQ(elem).latex();
    //convert to mathjs format

    var equation = convertLatexToAsciiMath(equation);
   // console.log(equation);
    var string = equation;
   // console.log(string);
    
    try{
        //get the domain
        var domain = getDomain(equation);
            //parse the equation
    equation = math.parse(equation);
    //compile the equation
    equation = equation.compile();
    }
    catch(err){
        return null;
    }
    //return the equation and the domain
    return {
        equation: equation,
        domain: domain,
        string: string
    }

}

//function to get the domain
function getDomain(fn) {
    if (!fn.includes("x")) return [-Infinity, Infinity];
    const node = math.parse(fn);

    const xNode = node.filter(node => {
        return node.isSymbolNode && node.name === 'x';
    })[0];

    if (!xNode) {
        return null;
    }

    let domain = {
        min: -Infinity,
        max: Infinity
    };

    node.traverse(node => {
        if (node.isFunctionNode) {
            const name = node.name.toLowerCase();
            if (name === 'log' || name === 'sqrt') {
                const arg = node.args[0];
                if (arg.isSymbolNode && arg.name === 'x') {
                    const factor = name === 'log' ? Math.E : 1;
                    domain.min = Math.max(domain.min, 0);
                }
            }
        }
        if (node.isOperatorNode && node.op === '/') {
            const num = node.args[0];
            const den = node.args[1];
            if (num.isSymbolNode && num.name === 'x') {
                if (den.isConstantNode) {
                    domain.min = Math.max(domain.min, -Math.abs(den.value));
                    domain.max = Math.min(domain.max, Math.abs(den.value));
                }
            }
        }
    });

    return domain.min <= domain.max ? domain : null;
}

//function to add functions
function addFunction() {
    //add the input field
    var input = document.createElement("div");
    // input.type = "text";
    //  input.placeholder = "f(x)";
    input.className = "eq-input";
    //get current number of equations
    var num = document.getElementsByClassName("eq-input").length;
    input.id = "input" + num;
    //change the input field to mathquill
    var MQ = MathQuill.getInterface(2);
    var mathField = MQ.MathField(input, {
        handlers: {
            edit: function () {
                makeAllPlots();
            }
        }
    });
    //configure mathquill
    MQ.config({
        autoCommands: 'pi theta sqrt sum',
        autoOperatorNames: 'sin cos tan log floor',
    });


    //add the color picker
    var color = document.createElement("input");
    color.type = "color";
    color.className = "color-input";
    color.id = "color" + num;
    color.value = rainbowColors[num % rainbowColors.length];
    var color_container = document.createElement("div");
    color_container.className = "color-container";
    color_container.appendChild(color);
    //add the remove button
    var remove = document.createElement("button");
    remove.innerHTML = "<i class='ph ph-x'></i>";
    remove.className = "remove";
    remove.id = "remove" + num;

    var div = document.createElement("div");
    div.className = "inp-val";

    remove.addEventListener("click", function () {
        //remove the input field
        input.remove();
        //remove the color picker
        color.remove();
        //remove the remove button
        remove.remove();
        //remove the div
        div.remove();
        //remove the plot
        var plot = document.getElementById("plot" + num);
        if (plot) {
            plot.remove();
        }
        //remove the equation from the list
        var eqs = document.getElementsByClassName("eq-input");
        for (var i = 0; i < eqs.length; i++) {
            eqs[i].id = "input" + i;
        }
    });


    div.appendChild(input);
    div.appendChild(color_container);
    div.appendChild(remove);

    div_answer = document.createElement("div");
    div_answer.className = "answer";
    div_answer.id = "answer" + num;

    div_final = document.createElement("div");
    div_final.className = "inp-group";
    div_final.id = "inp_group" + num;
    div_final.appendChild(div);
    div_final.appendChild(div_answer);


    //add it to the equation list above the button
    document.getElementById("fn_inputs").appendChild(div_final);
}

//add the event listener to the color picker
document.getElementById("fn_inputs").addEventListener("mousedown", function () {
    var color_inputs = document.getElementsByClassName("color-input");
    for (var i = 0; i < color_inputs.length; i++) {
        color_inputs[i].addEventListener("input", function () {
            makeAllPlots();
        });
    }
});


makeGrid(domain_init_x, domain_init_y);

//make the plot
makeAllPlots();
paper.appendChild(paper_svg);


//add the first input field
addFunction();


// plot the y value as a circle on x = muose value
/*
paper.addEventListener("mousemove", function (e) {
    //get the mouse position
    var x = e.clientX;

    //get the list of all equations
    var eqs = document.getElementsByClassName("eq-input");
    //for each equation, make a plot
    for (var i = 0; i < eqs.length; i++) {
        var eq = getEquation(eqs[i]);
        var y = eq.equation.evaluate({
            x: x * (domain_init_x[1] - domain_init_x[0]) / width + domain_init_x[0]
        });
        //if infinity, set to a large number
        if (y == Infinity) y = 99999999999;
        if (y == -Infinity) y = -99999999999;
        //map the y value to the range
        var y = (domain_init_y[1] - y) / (domain_init_y[1] - domain_init_y[0]) * height;
        //make a circle
        if (isNaN(y)) continue;
        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", "5");
        circle.setAttribute("fill", document.getElementById("color" + i).value);
        circle.setAttribute("id", "circle" + i);
        //remove the previous circle
        var prev_circle = document.getElementById("circle" + i);
        if (prev_circle) {
            prev_circle.remove();
        }
        plot.appendChild(circle);
    }
});

*/


//function to convert latex to ascii math
function convertLatexToAsciiMath(latex) {
    // Replace common LaTeX symbols with ASCII Math equivalents
    latex = latex.replace(/\\sqrt{([^}]*)}/g, 'sqrt($1)');
    latex = latex.replace(/\\frac{([^}]*)}{([^}]*)}/g, '(($1)/($2))');
    latex = latex.replace(/\\pi/g, 'pi');
    latex = latex.replace(/\\sin/g, 'sin');
    latex = latex.replace(/\\cos/g, 'cos');
    latex = latex.replace(/\\tan/g, 'tan');
    latex = latex.replace(/\\log/g, 'log');
    latex = latex.replace(/\\ln/g, 'ln');
    latex = latex.replace(/\\infty/g, 'infinity');
    latex = latex.replace(/\\left/g, '');
    latex = latex.replace(/\\right/g, '');
    latex = latex.replace(/\\cdot/g, '*');
    latex = latex.replace(/\\times/g, '*');
    latex = latex.replace(/\\div/g, '/');
    latex = latex.replace(/\\operatorname{floor}/g, 'floor');
    //curly braces
    latex = latex.replace(/\\{/g, '{');
    latex = latex.replace(/\\}/g, '}');


    return latex;
}

// Example usage
const latexExpression = '\\frac{1}{2} \\sqrt{4}';
const asciiMathExpression = convertLatexToAsciiMath(latexExpression);



/* export to png */
function download() {
    var svgData = paper_svg.outerHTML;
    //exclude the circle
    svgData = svgData.replace(/<circle.*?\/circle>/g, "");
    var svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8"
    });
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "plot.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

//add the event listener to the download button
document.getElementById("download").addEventListener("click", function () {
    download();
});


//set settings
//toggle grid
document.getElementById("grid_toggle").addEventListener("click", function () {
    if (document.getElementById("grid_toggle").checked) {
        grid.style.display = "block";

    } else {
        grid.style.display = "none";
    }
});

//toggle axes
document.getElementById("axes_toggle").addEventListener("click", function () {
    if (document.getElementById("axes_toggle").checked) {
        axes.style.display = "block";

    } else {
        axes.style.display = "none";
    }
});

//toggle axis labels
document.getElementById("axis_labels_toggle").addEventListener("click", function () {
    if (document.getElementById("axis_labels_toggle").checked) {
        axis_labels.style.display = "block";

    } else {
        axis_labels.style.display = "none";
    }
});


document.getElementsByClassName("settings_button")[1].addEventListener("click", function () {
    if (document.querySelector(".settings_item").classList.contains("show") == false) {
        console.log("show");
        //animate the settings button
        btn = document.getElementsByClassName("settings_button")[1];
        btn.getElementsByTagName("i")[0].style.transform = "rotate(90deg)";
        btn.getElementsByTagName("i")[0].style.transition = "transform 0.5s";
        //animate the settings menu to slide up
        document.querySelector(".settings_item").classList.toggle("show");

    } else {
        console.log("hide");
        //animate the settings button
        btn = document.getElementsByClassName("settings_button")[1];
        btn.getElementsByTagName("i")[0].style.transform = "rotate(0deg)";
        btn.getElementsByTagName("i")[0].style.transition = "transform 0.5s";
        //animate the settings menu to slide down
        document.querySelector(".settings_item").classList.toggle("show");

    }
});


/* lock view */
var lock = false;
document.getElementById("lock_button").addEventListener("click", function () {
    if (lock == false) {
        //disable the scroll event listener
        paper.removeEventListener("wheel", zoom);
        //disable the pan event listener
        paper.removeEventListener("mousedown", handlePan);
        //disable the pan keys event listener
        document.removeEventListener("keydown", panKeys);
        //disable the zoom keys event listener
        document.removeEventListener("keydown", zoomKeys);
        document.querySelector('.lock').classList.toggle('unlocked');
        lock = true;
    } else {
        //enable the scroll event listener
        paper.addEventListener("wheel", zoom);
        //enable the pan event listener
        paper.addEventListener("mousedown", handlePan);
        //enable the pan keys event listener
        document.addEventListener("keydown", panKeys);
        //enable the zoom keys event listener
        document.addEventListener("keydown", zoomKeys);

        document.querySelector('.lock').classList.toggle('unlocked');
        lock = false;
    }
});


// mathjs vs my parser
function compare() {
    //make a list 1 to 100
    var list = [];
    for (var i = 0; i < 100; i++) {
        list.push(i);
    }

    t0 = performance.now();
    //mathjs
    for (var i = 0; i < list.length; i++) {
        var scope = {
            x: list[i]
        };
        var y = math.evaluate("sin(x)", scope);
    }
    t1 = performance.now();
    console.log("Call to mathjs took " + (t1 - t0) + " milliseconds.")

    t0 = performance.now();
    //my parser
    for (var i = 0; i < list.length; i++) {
        var scope = {
            x: list[i]
        };
        var y = evaluateExpression("sin(x)", scope);
    }
    t1 = performance.now();
    console.log("Call to my parser took " + (t1 - t0) + " milliseconds.")
}

compare();