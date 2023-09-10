const getOperatorJs = (op) => {
  switch (op) {
    case 'Add': return '+'
    case 'Sub': return '-'
    case 'Mul': return '*'
    case 'Div': return '/'
    case 'Rem': return '%'
    case 'Eq': return '==='
    case 'Neq': return '!=='
    case 'Lt': return '<'
    case 'Gt': return '>'
    case 'Lte': return '<='
    case 'Gte': return '>='
    case 'And': return '&&'
    case 'Or': return '||'
    default: throw new Error(`Unknown operator ${op}`)
  }
}

const compilerToJs = (term) => {
  switch (term.kind) {
    case 'Print': {
      return `console.log(${compilerToJs(term.value)})`
    }

    case 'Binary': {
      const rhs = compilerToJs(term.rhs)
      const lhs = compilerToJs(term.lhs)
      const op = getOperatorJs(term.op)

      return `(${lhs} ${op} ${rhs})`
    }

    case 'Int':
      return term.value;

    case 'Str':
      return `"${term.value}"`

    case 'Let': {
      return `const ${term.name.text} = ${compilerToJs(term.value)};${compilerToJs(term.next)}`
    }

    case 'Function': {
      return `(${term.parameters.map(param => param.text).join(', ')}) => {${compilerToJs(term.value)}}`
    }

    case 'If': {
      const condition = compilerToJs(term.condition)
      const then = compilerToJs(term.then)
      const otherwise = compilerToJs(term.otherwise)

      return `if (${condition}) { return ${then} } else { return ${otherwise} }`
    }

    case 'Var': {
      return term.text
    }

    case 'Call': {
      return `${compilerToJs(term.callee)}(${term.arguments.map(compilerToJs).join(', ')})`
    }

    default:
      throw new Error(`Unknown term ${term.kind}`)
  }
}

const exec = (expression) => {
  const code = compilerToJs(expression)
  console.log(code)
  return eval(code)
}

module.exports = { compilerToJs: exec }
