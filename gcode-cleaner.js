#!/usr/bin/env node

var split = require('split');
var argv = require('optimist').argv;

process.stdin.once('data', function() {});

var x = argv.x || 0,
    y = argv.y || 0,
    z = argv.z || 0;


process.stdin.pipe(split()).on('data', function(line) {
  line = line.replace(/N[\d]+ /, '');

  if (line[0] === 'T' ||
      line[0] === '/' ||
      line[0] === '(' ||
      line[0] === '%' ||
      line[0] === 'M' ||
      line[0] === 'S')
  {
    return;
  }

  if (line.indexOf('G53') > -1 || line.indexOf('G57') > -1 || line.indexOf('G28') > -1 || line.indexOf('G43') > -1) {
    return;
  }


  line = line.replace(/G1F/, 'F');
  line = line.replace(/\.(\d\d)\d\d/g, '.$1')

  console.log(line);
});

console.log([
  '$H',
  'M4 S' + (argv.s || 10000),
  'G4 P' + (argv.p || 10),
  'G10 L20 P1 X0 Y0 Z0',
  'G21G17',
  'G1 X' + x + ' Y' + y + ' F' + (argv.f || 4000),
  'G1 Z' + z,
  'G10 L20 P1 X0 Y0 Z0',
  'G28.1 X0 Y0 Z0',
  'G1 Z5'  // raise the tool before dragging it across the work!
].join('\n'))


process.stdin.once('end', function() {
  console.log('G1 Z' + (Math.abs(z) || 5));
  console.log('G4 P2');
  console.log('M5')

  if (!argv.nohome) {
    console.log('$H');
    console.log('G10 L20 P1 X0 Y0 Z0');
    console.log('G1 X5 Y5 Z-5'); // Move off of the switches for tool changes
  } else {
    console.log('G1 X-5 Y-5 Z5');
  }
})

process.stdin.resume();
