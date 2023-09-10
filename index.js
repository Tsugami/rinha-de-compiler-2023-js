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
class Closure {
  constructor(term, ctx) {
    this.term = term
    this.ctx = { ...ctx };
  }
}

const interpreter = (term, ctx = {}) => {
  if (!term) {
    throw new Error('Invalid term:' + term)
  }

  switch (term.kind) {
    case 'Print': {
      return console.log(interpreter(term.value, ctx))
    }

    case 'Binary': {
      const rhs = interpreter(term.rhs, ctx)
      const lhs = interpreter(term.lhs, ctx)

      return evalOperator(term.op, lhs, rhs)
    }

    case 'Int':
    case 'Str':
      return term.value

    case 'Let': {
      const name = term.name.text
      const value = interpreter(term.value, ctx)

      if (value instanceof Closure) {
        value.ctx[name] = value
      }

      return interpreter(term.next, { ...ctx, [name]: value })
    }

    case 'Function': {
      return new Closure(term, ctx)
    }

    case 'Call': {
      const result = interpreter(term.callee, ctx)

      if (result instanceof Closure) {
        const args = term.arguments.map(arg => interpreter(arg, ctx))
        const argsObj = result.term.parameters.reduce((acc, arg, i) => {
          acc[arg.text] = args[i]
          return acc
        }, {})

        const newCtx = { ...result.ctx, ...argsObj }

        return interpreter(result.term.value, newCtx)
      }

      throw new Error(`Invalid call ${result}`)
    }

    case 'Var': {
      const variable = ctx[term.text];

      if (variable === null) {
        throw new Error(`Undefined variable ${term.text}`)
      }

      return variable;
    }

    case 'If': {
      if (interpreter(term.condition, ctx)) {
        return interpreter(term.then, ctx)
      } else {
        return interpreter(term.otherwise, ctx)
      }
    }

    default: {
      throw new Error(`Unknown term ${term.kind}`)
    }
  }
}

const readRinhaAstFile = filepath => {
  const contents = fs.readFileSync(filepath, { encoding: 'utf-8' });
  const ast = JSON.parse(contents);

  return interpreter(ast.expression);
}

const filepath = path.join(__dirname, 'var/rinha', 'source.rinha.json');

readRinhaAstFile(filepath)
