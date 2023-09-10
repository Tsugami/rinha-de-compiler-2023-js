const fs = require('fs')
const path = require('path')
const interpreter = require('./interpreter')

const readRinhaAstFile = filepath => {
  const contents = fs.readFileSync(filepath, { encoding: 'utf-8' });
  const ast = JSON.parse(contents);

  return interpreter(ast.expression);
}

const filepath = path.join(__dirname, 'var/rinha', 'source.rinha.json');

readRinhaAstFile(filepath)
