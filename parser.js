
const mathMethods = [
  'abs',
  'acos',
  'acosh',
  'asin',
  'asinh',
  'atan',
  'atan2',
  'atanh',
  'cbrt',
  'ceil',
  'clz32',
  'cos',
  'cosh',
  'exp',
  'expm1',
  'floor',
  'fround',
  'hypot',
  'imul',
  'log',
  'log10',
  'log1p',
  'log2',
  'max',
  'min',
  'pow',
  'random',
  'round',
  'sign',
  'sin',
  'sinh',
  'sqrt',
  'tan',
  'tanh',
  'trunc'
];

const operators_precedence = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '^': 3
};

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function isOperator(value) {
  return ['+', '-', '*', '/', '^'].includes(value);
}

function isFunction(value, scope) {
  return mathMethods.includes(value) || (scope[value] instanceof Function);
}

function isNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

function buildExpressionTree(tokens, scope) {
  if (tokens.length === 0) {
    return null;
  }

  // Find the index of the first operator
  let operatorIndex = -1;
  let parenthesisCount = 0;
  for (let i = tokens.length - 1; i >= 0; i--) {
    const token = tokens[i];
    if (token === ')') {
      parenthesisCount++;
    } else if (token === '(') {
      parenthesisCount--;
    } else if (parenthesisCount === 0 && isOperator(token)) {
      operatorIndex = i;
      break;
    }
  }

  if (operatorIndex === -1) {
    // Check if it's a function expression
    if (tokens[0] === '(' && tokens[tokens.length - 1] === ')') {
      return buildExpressionTree(tokens.slice(1, -1), scope);
    }
    if (isFunction(tokens[0], scope)) {
      const node = new Node("fn");
      node.left = tokens[0];
      node.right = buildExpressionTree(tokens.slice(1), scope);
      return node;
    }
    // No operator found, create a leaf node with the value
    return new Node(tokens[0]);
  }

  const operator = tokens[operatorIndex];
  const node = new Node(operator);

  // Check if it's a function expression
 if (operator === '(' && tokens[tokens.length - 1] === ')') {
    node.value = 'fn';
    node.left = new Node(tokens[operatorIndex - 1]);
    node.right = buildExpressionTree(tokens.slice(operatorIndex + 1, -1));
  } else {
    // Recursively build left and right subtrees
    node.left = buildExpressionTree(tokens.slice(0, operatorIndex), scope);
    node.right = buildExpressionTree(tokens.slice(operatorIndex + 1), scope);
  }

  return node;
}



function evaluateExpressionTree(root, scope) {
  if (!root) {
    return null;
  }

  if (isNumber(root.value)) {
    return parseFloat(root.value);
    //return root.value;
  }

  if (root.value=="fn") {
    //left is the function name
    //right is the argument
    const fnName=root.left;
    const arg=evaluateExpressionTree(root.right,scope);

   for (let i = 0; i < mathMethods.length; i++) {
      if (fnName === mathMethods[i]) {
        return Math[fnName](arg);
      }
    }
    // Check if it's a user-defined function
    if (scope[fnName]) {
          return scope[fnName](arg);
    }
  }

  if (isOperator(root.value)) {
    const left = evaluateExpressionTree(root.left, scope);
    const right = evaluateExpressionTree(root.right, scope);

    switch (root.value) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        return left / right;
      case '^':
        return Math.pow(left, right);
      default:
        return null;
    }
  }
  // If the node is a variable, return its value from the scope
  if (scope[root.value]) {
    return scope[root.value];
  }

  return null;
}

function evaluateExpression(expression, scope) {
  const tokens = tokenize(expression);
  const root = buildExpressionTree(tokens,scope);
  const result = evaluateExpressionTree(root, scope);
  return result;
}

function tokenize(expression) {
  const regex = /(\d+(\.\d+)?|\w+|\S)/g;
  return expression.match(regex);
}


//simple evaluation
const e = 'tan((x+y)/4)+a';
const scope = {
  x: Math.PI / 2,
  y: Math.PI / 2,
  a: 5
};
const result = evaluateExpression(e, scope);





//Make a Parser class 
class Parser {
  constructor() {
    this.scope = {};
  }
  setScope(scope) {
    this.scope = scope;
  }
  
  evaluate(expression, scope) {
    // If a scope is passed, use it instead of the default one
    if (scope) {
      return evaluateExpression(expression, scope);
    }
    return evaluateExpression(expression, this.scope);
  }
  addFunction(fn) {
    // split the function into name and body
    const regex = /([a-z]+)\(([a-z, ]+)\)\s*=\s*(.+)\s*/g;
    const match = regex.exec(fn);
    const functionName = match[1];
    const params = match[2].split(',').map(param => param.trim());
    const expression = match[3];

    //check if the function name is a valid identifier
    if (!/^[a-z]+$/g.test(functionName)) {
      throw new Error('Invalid function name');
    }
    //check if the function name is not a math method
    if (mathMethods.includes(functionName)) {
      throw new Error('Function name cannot be a math method');
    }
    //check if the function name is not a variable in the scope
    if (this.scope[functionName]) {
      throw new Error('Function name cannot be a variable name');
    }
    //check if the function name is not a function in the scope
    if (this.scope[functionName] instanceof Function) {
      throw new Error('Function name cannot be a function name');
    }

    // add the function to the scope
    this.scope[functionName] = (...args) => {
      const scope = Object.assign({}, this.scope);
      params.forEach((param, index) => {
        scope[param] = args[index];
      });
      return evaluateExpression(expression, scope);
    };  }
  
}


//example of using the parser class
/*
const parser = new Parser();
parser.setScope({
  x:1,
  y:-1
});


console.log(parser.evaluate('(x^2)+(y^2)-100'));
    
*/