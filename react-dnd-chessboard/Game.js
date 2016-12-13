var knightPosition = [1, 7]

exports.observe = function(o) {
    throw new Error('TODO fire actions upon events')
}

exports.moveKnight = function (toX, toY) {
  knightPosition = [toX, toY]
  console.log('TODO raise event of moving, and generalize to knight', [toX, toY])
}

exports.canMoveKnight = function (toX, toY) {
  const x = knightPosition[0]
  const y = knightPosition[1]
  const dx = toX - x
  const dy = toY - y

  return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
         (Math.abs(dx) === 1 && Math.abs(dy) === 2)
}
