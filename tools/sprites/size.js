function roughSizeOfObject(object) {

  var objectList = [];
  var stack = [object];
  var bytes = 0;

  while (stack.length) {
    var value = stack.pop();

    if (typeof value === 'boolean') {
      bytes += 4;
    } else if (typeof value === 'string') {
      bytes += value.length * 2;
    } else if (typeof value === 'number') {
      bytes += 8;
    } else if (
      typeof value === 'object' && objectList.indexOf(value) === -1
    ) {
      objectList.push(value);

      for (var i in value) {
        stack.push(value[i]);
      }
    }
  }
  return bytes;
};


var map = {
  'uno': []
};
var i = 0;

var m = [];

for (i = 0; i < 1800; i++) {

  var row = [];

  for (j = 0; j < 1800; j++) {

    row.push([0]);

  };

  m.push(row);

};

console.log('bytes', JSON.stringify(m).length);
// console.log('bytes', roughSizeOfObject(map));