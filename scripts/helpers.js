// insert any functions that are useful throughout the experiment here
var shuffleComb = function(comb) {
    // while this one is trivial, this just to show that we CAN define a function here
    return _.shuffle(comb);
};

var draw_blank = function(color="#FFFFFF") {
    // start
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      var cw = canvas.width;
      var ch = canvas.height;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, cw, ch);
    }
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
    if (rotate) {
      ctx.strokeRect(0, 0, ch, width);
      ctx.strokeRect(0, ch-width, ch, width);
    } else {
      ctx.strokeRect(0, 0, width, ch);
      ctx.strokeRect(cw-width, 0, width, ch);
    }

    var middle_w = cw / 2;
    var middle_h = ch / 2;
    ctx.moveTo(middle_w, middle_h-10);
    ctx.lineTo(middle_w, middle_h+10);
    ctx.stroke();

    ctx.moveTo(middle_w-10, middle_h);
    ctx.lineTo(middle_w+10, middle_h);
    ctx.stroke();

  }
};

var draw_cue = function(rotate=false) {
  // start
  var canvas = document.getElementById('canvas');

  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var cw = canvas.width;
    var ch = canvas.height;

    var width = cw / 6;
    var org_x = _.sample([0,cw-width]);
    var org_y = _.sample([0,ch-width]);
    ctx.fillStyle="#FFFFFF";
    ctx.fillRect(org_x, org_y, width, width);

    return [org_x, org_y];
  }
};

var draw_target = function(org_x, org_y, rotate=false, target=true) {
  // start
  var canvas = document.getElementById('canvas');

  if (canvas.getContext) {
    if (target) {
      var ctx = canvas.getContext('2d');
      var cw = canvas.width;
      var ch = canvas.height;
      var width = cw / 6;
      var react = _.sample([[org_x,org_y],[org_x,org_y],[org_x,org_y],[(org_x+cw-width)%(cw-width),org_y],[org_x,(org_y+ch-width)%(ch-width)]]);
      ctx.fillStyle="#000000";
      ctx.fillRect(react[0],react[1],width,width);

    } else {
      var react = false;
    }

    return react;
  }
};
