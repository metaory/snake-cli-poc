const Table = require('tty-table');
const chalk = require('chalk');
const prompts = require('./prompts')
const { DIRECTION, ICON, MOTION } = require('./utils')

function render({
  width,
  height,
  direction = DIRECTION.RIGHT,
  coordinate = { x: 0, y: 0 },
  outOfBound
}) {

  console.clear()

  const cols = Array
    .from({ length: width })
    .fill({
      width: 3,
      formatter: (status) => chalk.bold.black[getCellColor(status)]
        (getDirectionIcon(status))
    })

  const getDirectionIcon = status => status ? ICON[direction] : 'x'
  const getCellColor = status => status ? outOfBound ? 'bgRed' : 'bgGreen' : 'bgBlack'

  const rows = Array
    .from({ length: height })
    .map((row, y) => Array
      .from({ length: width })
      .map((col, x) => x === coordinate.x && y === coordinate.y ? 1 : 0)
    )

  const table = Table(cols, rows, {
    borderStyle: 0,
    borderColor: "blue",
    align: "center",
    color: "white",
    marginTop: 0,
  })

  console.log(table.render())
  console.log('   ', chalk[outOfBound ? 'red' : 'green']
    (`x: ${coordinate.x+1} y: ${coordinate.y + 1}`))
  console.log('   ',
    Object.keys(ICON).reduce((acc, cur, i, arr) => {
      return acc +=
        chalk.bold[direction === cur ? outOfBound ? 'red' : 'green' : 'bold'](ICON[cur]) +
        (i === arr.length - 1 ? '' : ' ')
    }, ''), chalk.bold.red('x'))
}

async function start(opt) {
  render(opt)
  const direction = await prompts.directionInput(opt)

  if (!direction) return start(opt)

  const [xMotion, yMotion] = MOTION[direction] || [0, 0]
  const { coordinate: oldCoordinate } = opt

  const newCoordinate = {
    x: oldCoordinate.x + xMotion,
    y: oldCoordinate.y + yMotion
  }

  const outOfBound =
    (newCoordinate.x > opt.width - 1 || newCoordinate.x < 0) ||
    (newCoordinate.y > opt.height - 1 || newCoordinate.y < 0)


  if (opt.direction !== direction) return start({ ...opt, direction, outOfBound })

  const coordinate = outOfBound ? oldCoordinate : newCoordinate

  start({ ...opt, direction, coordinate, outOfBound })
}

module.exports = async () => {
  const width = await prompts.textInput({ name: 'grid width', defaultValue: 3, regex: /^[3-9]{1}$/ })
  const height = await prompts.textInput({ name: 'grid height', defaultValue: 4, regex: /^[3-9]{1}$/ })
  await start({ width, height, coordinate: { x: 0, y: 0 } })
}
