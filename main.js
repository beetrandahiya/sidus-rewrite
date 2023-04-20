//SIDUS 2D PLOTTER

//plot colors
var colors = ["#c5a3ff", "#ffb3ba", "#bae1ff"]

const rainbowColors =["#e60049","#c5a3ff", "#bae1ff", "#0bb4ff", "#50e991", "#e6d800", "#ffb3ba","#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"];

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
grid.setAttribute("id", "grid");

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
    grid.appendChild(xaxis);

    //make the y axis
    var yaxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yaxis.setAttribute("x1", x0);
    yaxis.setAttribute("y1", 0);
    yaxis.setAttribute("x2", x0);
    yaxis.setAttribute("y2", height);
    yaxis.setAttribute("stroke", "black");
    yaxis.setAttribute("stroke-width", "1");
    grid.appendChild(yaxis);

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
        var ygrid_y1 = Math.round((yf-y_grid_values.gridValues[i] ) / (yf - yi) * height);
        var ygrid_y2 = Math.round((yf-y_grid_values.gridValues[i] ) / (yf - yi) * height);
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
        grid.appendChild(x_label);
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
        grid.appendChild(y_label);
    }
    paper_svg.appendChild(grid);
};



//make the plot
//make plot group
var plot = document.createElementNS("http://www.w3.org/2000/svg", "g");
plot.setAttribute("id", "plot");
var plots_dir = [];

function makePlot(f, [xi, xf], [yi, yf], id) {
    //get the real domain of the function
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

    //make a list of y values
    var y = xval.map(function (x) {
        //calculate y only if x is in the real domain
        if (x <= f.domain[0] || x >= f.domain[1]) {
            return 0;
        } else {
            //handle errors
            try {
                var y = f.equation.evaluate({
                    x: x
                });
            } catch (e) {
                var y = 0;
            }
            //if infinity, set to a large number
            if (y == Infinity) y = 99999999999;
            if (y == -Infinity) y = -99999999999;

            return y;
        }

    });
    //map the y values to the range
    var y = y.map(function (y) {

        //find center of the y axis
        var y0 = (yf - 0) / (yf - yi) * height;
        return (y0 - y * height / (yf - yi));

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
    path.setAttribute("stroke", rainbowColors[id % rainbowColors.length]);
    path.setAttribute("stroke-width", "3");
    path.setAttribute("fill", "none");
    path.setAttribute("id", "plot" + id);
    plot.appendChild(path);

    paper_svg.appendChild(plot);
}

//draw all plots
function makeAllPlots() {
    //remove all plots
    var plot = document.getElementById("plot");
    if (plot) {
        plot.innerHTML = "";
    }
    //get the list of all equations
    var eqs = document.getElementsByClassName("eq-input");
    //for each equation, make a plot
    for (var i = 0; i < eqs.length; i++) {
        makePlot(getEquation(eqs[i]), domain_init_x, domain_init_y, i);
    }
}

//add the event listeners
//change the plot when the equation is changed
document.getElementById("fn_inputs").addEventListener("mousedown", function () {
    var eq_inputs = document.getElementsByClassName("eq-input");
    for (var i = 0; i < eq_inputs.length; i++) {
        eq_inputs[i].addEventListener("input", function () {
            makeAllPlots();
        });
    }
});

// add scroll functionality to zoom on the paper
paper.addEventListener("wheel", function (e) {
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
    //make the grid and plot
    makeGrid(domain_init_x, domain_init_y);
    makeAllPlots();
});


// add pan functionality to the paper
paper.addEventListener("mousedown", function (e) {
    //get the mouse position
    x = e.clientX;
    y = e.clientY;
    //add the event listeners
    paper.addEventListener("mousemove", pan);
    paper.addEventListener("mouseup", function () {
        paper.removeEventListener("mousemove", pan);
    });
});

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

    //make the grid and plot
    makeGrid(domain_init_x, domain_init_y);
    makeAllPlots();
};


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
    var equation = elem.value;
    //get the domain
    var domain = getDomain(equation);
    //parse the equation
    equation = math.parse(equation);
    //compile the equation
    equation = equation.compile();
    //return the equation and the domain
    return {
        equation: equation,
        domain: domain
    }

}

//function to get the domain
function getDomain(fn) {
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
    var input = document.createElement("input");
    input.type = "text";
    input.placeholder = "f(x)";
    input.className = "eq-input";
    //get current number of equations
    var num = document.getElementsByClassName("eq-input").length;
    input.id = "input" + num;

    //add it to the equation list above the button
    document.getElementById("fn_inputs").appendChild(input);
}




makeGrid(domain_init_x, domain_init_y);

//make the plot
makeAllPlots();
paper.appendChild(paper_svg);



//color picker
Coloris({
    themeMode: 'light',
    margin:10,
    defaultColor: '#333',
})