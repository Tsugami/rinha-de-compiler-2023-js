const fs = require('fs')
const path = require('path')

const evalOperator = (op, lhs, rhs) => {
  switch (op) {
    case 'Add': return lhs + rhs
    case 'Sub': return lhs - rhs
    case 'Mul': return lhs * rhs
    case 'Div': return lhs / rhs
    case 'Rem': return lhs % rhs
    case 'Eq': return lhs === rhs
    case 'Neq': return lhs !== rhs
    case 'Lt': return lhs < rhs
    case 'Gt': return lhs > rhs
    case 'Lte': return lhs <= rhs
    case 'Gte': return lhs >= rhs
    case 'And': return lhs && rhs
    case 'Or': return lhs || rhs
    default: throw new Error(`Unknown operator ${op}`)
  }
}

const interpreter = term => {
  switch (term.kind) {
    case 'Print': {
      return console.log(interpreter(term.value))
    }

    case 'Binary': {
      const rhs = interpreter(term.rhs)
      const lhs = interpreter(term.lhs)

      return evalOperator(term.op, lhs, rhs)
    }

    case 'Int': {
      return Number(term.value)
    }
  }
}

const readRinhaAstFile = filepath => {
  const contents = fs.readFileSync(filepath, { encoding: 'utf-8' });
  const ast = JSON.parse(contents);

  return interpreter(ast.expression);
}

const filepath = path.join(__dirname, 'var/rinha', 'sample-sum.json');

readRinhaAstFile(filepath)
