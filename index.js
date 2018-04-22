require('./src/grid')()

if (!process.stdin.isTTY) {
  console.error('Terminal is not a valid TTY')
  process.exit(1)
}
