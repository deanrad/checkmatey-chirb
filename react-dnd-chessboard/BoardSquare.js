var React = require('react')
var PropTypes = React.PropTypes
var Square = require('./Square')
var ItemTypes = require('./Constants').ItemTypes
var DropTarget = require('react-dnd').DropTarget
var moveKnight = require('./Game').moveKnight
var canMoveKnight = require('./Game').canMoveKnight

var squareTarget = {
  drop: function (props, monitor) {
    moveKnight(props.x, props.y)
  },
  canDrop: function (props) {
    return canMoveKnight(props.x, props.y)
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
}

var BoardSquare = React.createClass({
  propTypes: {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired
  },

  renderOverlay: function(color) {
    return (
      <div style={{position:'absolute', top: 0, left: 0, height: '100%', width: '100%', zIndex: 1, opacity: 0.5, backgroundColor: color}} />
    )
  },

  render: function() {
    var x = this.props.x
    var y = this.props.y
    var connectDropTarget = this.props.connectDropTarget
    var isOver = this.props.isOver
    var canDrop = this.props.canDrop
    var black = (x + y) % 2 === 1

    return connectDropTarget(
      <div style={{position: 'relative', width: '100%', height: '100%'}}>
        <Square black={black}>
          {this.props.children}
        </Square>
        {isOver && !canDrop && this.renderOverlay('red')}
        {!isOver && canDrop && this.renderOverlay('yellow')}
        {isOver && canDrop && this.renderOverlay('green')}
      </div>
    )
  }
})

module.exports = DropTarget(ItemTypes.KNIGHT, squareTarget, collect)(BoardSquare)
