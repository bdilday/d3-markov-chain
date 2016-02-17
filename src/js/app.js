
var $ = require('jquery');
var d3 = require('d3');
var _ = require('lodash');

var math = require('mathjs');
var config = require('./config.js');

require('../../node_modules/d3-jetpack/d3-jetpack')(d3);
require('./d3-starterkit')(d3);
var initialState = require('./initialState');

var c = d3.conventions(config);
console.log('c', c, c.svg);

var make_rectangle = function(g, tx, ty, x, y) {

}


var r = c.svg.append('rect')
    .attr('width', 100)
    .attr('height', 100)
    .attr('fill', 'None')
    .attr('stroke', 'black');

var small_rect_config = {
    sz: 10,
    nrow: 10,
    ncol: 10
};

var idxToXY = function(idx, config) {
    //console.log('idx', idx, config.ncol, idx%config.ncol, parseInt(idx/config.ncol));
    var t = {
        ix: idx % config.ncol,
        iy: parseInt(idx / config.ncol)
    };
    t.x = t.ix * config.sz;
    t.y = t.iy * config.sz;
    return t;
}



var transitionMatrix_nrow = initialState.transitionMatrix.length;
var transitionMatrix_ncol = initialState.transitionMatrix[0].length;

var transitionMatrix_nel = transitionMatrix_ncol*transitionMatrix_nrow;

var TransitionMatrixElements = [];
_.forEach(_.range(transitionMatrix_nrow), function(icol) {
   var tmp = [];
    _.forEach(_.range(transitionMatrix_ncol), function(irow) {
        tmp.push('');
    });
    TransitionMatrixElements.push(tmp);
})

console.log('TransitionMatrixElements', TransitionMatrixElements);

_.forEach(_.range(transitionMatrix_nel), function(idx) {
    var s = idxToXY(idx, {'ncol': 3, 'sz': 100});

    TransitionMatrixElements[s.ix][s.iy] = c.svg
        .append('svg')
        .append('g')
        .attr('transform', 'translate(' + s.x + ',' + s.y + ')');

    TransitionMatrixElements[s.ix][s.iy]
        .append('rect')
        .attr('width', 100)
        .attr('height', 100)
        .attr('fill', 'None')
        .attr('stroke', 'black');
});

var fill_matrix_element = function(parent, data) {
console.log('parent', parent);

    parent.selectAll('smallrect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'smallrect')
        .attr('fill', 'cornflowerblue')
        .attr('x', function (d) {
            return d.x;
        })
        .attr('y', function (d) {
            return d.y;
        })
        .attr('width', small_rect_config.sz)
        .attr('height', small_rect_config.sz)
    ;
}


_.forEach(_.range(transitionMatrix_nel), function(idx) {
    var s = idxToXY(idx, {'ncol': 3, 'sz': 100});
    var v = initialState.transitionMatrix[s.ix][s.iy];
    var nbox = parseInt(v * 100);

    var data = _.map(_.range(nbox), function (idx) {
        return idxToXY(idx, small_rect_config);
    });

    console.log('data', data, data.length);
    fill_matrix_element(TransitionMatrixElements[s.ix][s.iy], data);
});
