// insert any functions that are useful throughout the experiment here
var shuffleComb = function(comb) {
    // while this one is trivial, this just to show that we CAN define a function here
    return _.shuffle(comb);
};

var draw_fixation = function(rotate=false) {
  // start
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var cw = canvas.width;
    var ch = canvas.height;
    ctx.clearRect(0, 0, cw, ch);
    var width = cw / 6;
    ctx.strokeRect(0, 0, width, ch);
    ctx.strokeRect(cw-width, 0, width, ch);

    var middle_w = cw / 2;
    var middle_h = ch / 2;
    ctx.moveTo(middle_w, middle_h-10);
    ctx.lineTo(middle_w, middle_h+10);
    ctx.stroke();

    ctx.moveTo(middle_w-10, middle_h);
    ctx.lineTo(middle_w+10, middle_h);
    ctx.stroke();

    if (rotate) {
      rotate();
    }
  }
}

var rotate = function() {

}
