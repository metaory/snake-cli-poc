const chalk = require('chalk')
const { DIRECTION } = require('./utils')

const __read = () => new Promise(resolve => {
  const stdin = process.stdin
  stdin.setEncoding('utf8')
  stdin.once('data', (data) => {
    resolve(data)
  })
})

const directionInput = () => new Promise((resolve) => {
  const stdin = process.stdin
  stdin.setRawMode(true)
  stdin.resume()
  stdin.setEncoding('utf8')
  stdin.once('data', (code) => {
    if (code === '\u0003' || code === 'x') process.exit()
    const direction = (() => {
      switch (code) {
        case '\u001B\u005B\u0041': return DIRECTION.UP
        case '\u001B\u005B\u0042': return DIRECTION.DOWN
        case '\u001B\u005B\u0043': return DIRECTION.RIGHT
        case '\u001B\u005B\u0044': return DIRECTION.LEFT
      }
    })()
    resolve(direction)
    stdin.setRawMode(false)
  })
})
const textInput = ({ name, defaultValue, regex = /^\w+$/ }) => new Promise((resolve, reject) => {
  const message =
    chalk.green('?') + ' ' +
    chalk.bold(name) + ' ' +
    chalk.dim(`(${defaultValue}) `)
  process.stdout.write(message)

  const readInput = () => {
    const res = __read()
      .then(input => {
        input = input.trim() || defaultValue
        const valid = regex.test(input)
        if (valid) {
          console.log(message + chalk.bold.green(input))
          return resolve(input)
        }
        console.log(chalk.red('! bad input'))
        process.stdout.write(message)
        readInput()
      })
  }
  readInput()
})


module.exports = {
  textInput,
  directionInput
}
