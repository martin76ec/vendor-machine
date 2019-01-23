const q0 = require('../controller/q0.js');
const q1 = require('../controller/q1.js');
const q2 = require('../controller/q2.js');

var stateq0 = new q0();
var stateq1 = new q1();
var stateq2 = new q2();
var state = stateq0;

stateq1.setQ2(stateq2);
state.setQ1(stateq1);


module.exports = state;