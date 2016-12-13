var React = require('react');
var PropTypes = React.PropTypes;
var Square = require('./Square');
var Knight = require('./Knight');
var moveKnight = require('./Game').moveKnight
var canMoveKnight = require('./Game').canMoveKnight

var Board = React.createClass({
  propTypes: {
    knightPosition: PropTypes.arrayOf(
      PropTypes.number.isRequired
    ).isRequired
  },

  renderSquare: function (i) {
    var x = i % 8;
    var y = Math.floor(i / 8);
    var black = (x + y) % 2 === 1;

    var knightX = this.props.knightPosition[0];
    var knightY = this.props.knightPosition[1];
    var piece = (x === knightX && y === knightY) ?
      <Knight /> :
      null;

    return (
      <div key={i}
           style={{ width: '12.5%', height: '12.5%' }}
           onClick={this.handleSquareClick.bind(this, x, y)}>
        <Square black={black}>
          {piece}
        </Square>
      </div>
    );
  },

  handleSquareClick: function (toX, toY) {
    if (canMoveKnight(toX, toY)) {
      moveKnight(toX, toY)
    }
  },

  render: function () {
    var squares = [];
    for (let i = 0; i < 64; i++) {
      squares.push(this.renderSquare(i));
    }

    return (
      <div style={{
        width: 400,
        height: 400,
        display: 'flex',
        flexWrap: 'wrap'
      }}>
        {squares}
      </div>
    );
  }
});

module.exports = Board;