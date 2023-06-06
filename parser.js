
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

function isFunction(value) {
  return mathMethods.includes(value);
}

function isNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

function buildExpressionTree(tokens) {
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
      return buildExpressionTree(tokens.slice(1, -1));
    }
    if (isFunction(tokens[0])) {
      const node = new Node("fn");
      node.left = tokens[0];
      node.right = buildExpressionTree(tokens.slice(1));
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
    node.left = buildExpressionTree(tokens.slice(0, operatorIndex));
    node.right = buildExpressionTree(tokens.slice(operatorIndex + 1));
  }

  return node;
}



function evaluateExpressionTree(root, scope) {
  if (!root) {
    return null;
  }

  if (isNumber(root.value)) {
    return root.value;
  }

  if (root.value=="fn") {
    //left is the function name
    //right is the argument
    const fnName=root.left;
    const arg=evaluateExpressionTree(root.right,scope);

    switch (fnName) {
      //use math methods
      case 'abs':
        return Math.abs(arg);
      case 'acos':
        return Math.acos(arg);
      case 'acosh':
        return Math.acosh(arg);
      case 'asin':
        return Math.asin(arg);
      case 'asinh':
        return Math.asinh(arg);
      case 'atan':
        return Math.atan(arg);
      case 'atan2':
        return Math.atan2(arg);
      case 'atanh':
        return Math.atanh(arg);
      case 'cbrt':
        return Math.cbrt(arg);
      case 'ceil':
        return Math.ceil(arg);
      case 'clz32':
        return Math.clz32(arg);
      case 'cos':
        return Math.cos(arg);
      case 'cosh':
        return Math.cosh(arg);
      case 'exp':
        return Math.exp(arg);
      case 'expm1':
        return Math.expm1(arg);
      case 'floor':
        return Math.floor(arg);
      case 'fround':
        return Math.fround(arg);
      case 'hypot':
        return Math.hypot(arg);
      case 'imul':
        return Math.imul(arg);
      case 'log':
        return Math.log(arg);
      case 'log10':
        return Math.log10(arg);
      case 'log1p':
        return Math.log1p(arg);
      case 'log2':
        return Math.log2(arg);
      case 'max':
        return Math.max(arg);
      case 'min':
        return Math.min(arg);
      case 'pow':
        return Math.pow(arg);
      case 'random':
        return Math.random(arg);
      case 'round':
        return Math.round(arg);
      case 'sign':
        return Math.sign(arg);
      case 'sin':
        return Math.sin(arg);
      case 'sinh':
        return Math.sinh(arg);
      case 'sqrt':
        return Math.sqrt(arg);
      case 'tan':
        return Math.tan(arg);
      case 'tanh':
        return Math.tanh(arg);
      case 'trunc':
        return Math.trunc(arg);
      default:
        return null;
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
  const root = buildExpressionTree(tokens);
  //console.log(root);
  const result = evaluateExpressionTree(root, scope);
  return result;
}

function tokenize(expression) {
  const regex = /(\d+(\.\d+)?|\w+|\S)/g;
  return expression.match(regex);
}


// Example usage
//const expression='(sin(x-y)+65)*log(y)';
//const tokens = tokenize(expression);
//const root = buildExpressionTree(tokens);
//console.log(root);
// Example usage

const e = 'tan((x+y)/4)';
const scope = {
  x: 6,
  y: 1,
  a: 5
};
const result = evaluateExpression(e, scope);

console.log(result); // Output: 6.841470984807897
