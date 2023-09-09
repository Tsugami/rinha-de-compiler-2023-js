const fs = require('fs')
const filepath = require('path')

const interpreter = term => {
  console.log(term);
}


const readRinhaAstFile = filepath => {
  const ast = fs.readdirSync(filepath, { encoding: 'utf-8' });
  return interpreter(ast.expression);
}

const filepath = path.join(__dirname, 'var/rinha', 'sample-sum.json');

readRinhaAstFile(filepath)
