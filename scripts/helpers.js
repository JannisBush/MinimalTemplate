// insert any functions that are useful throughout the experiment here
var shuffleComb = function(comb) {
    // while this one is trivial, this just to show that we CAN define a function here
    return _.shuffle(comb);
};

// draw a blank pause screen
var draw_blank = function(color="#FFFFFF") {
    // overwrite the canvas with a white rectangle with the size of the canvas
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      var cw = canvas.width;
      var ch = canvas.height;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, cw, ch);
    }
  };

// draw the fixation screen
var draw_fixation = function(rotate=false) {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var cw = canvas.width;
    var ch = canvas.height;
    var width = cw / 6;
    var middle_w = cw / 2;
    var middle_h = ch / 2;

    // first clear the screen
    ctx.clearRect(0, 0, cw, ch);

    // draw the rectangle according to the value of rotate
    if (rotate) {
      ctx.strokeRect(0, 0, ch, width);
      ctx.strokeRect(0, ch-width, ch, width);
    } else {
      ctx.strokeRect(0, 0, width, ch);
      ctx.strokeRect(cw-width, 0, width, ch);
    }

    // draw the cross in the middle
    ctx.moveTo(middle_w, middle_h-10);
    ctx.lineTo(middle_w, middle_h+10);
    ctx.stroke();
    ctx.moveTo(middle_w-10, middle_h);
    ctx.lineTo(middle_w+10, middle_h);
    ctx.stroke();
  }
};

// draw the cue and give back its position
var draw_cue = function(rotate=false) {
  // start
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var cw = canvas.width;
    var ch = canvas.height;
    var width = cw / 6;

    // randomly decide which of the possible 4 positions to use as the cue
    var org_x = _.sample([0,cw-width]);
    var org_y = _.sample([0,ch-width]);

    // fill the cue position with a white rectangle
    // this deletes the lines on that position
    ctx.fillStyle="#FFFFFF";
    ctx.fillRect(org_x, org_y, width, width);

    // calculate where the cue is
    var org_pos = [org_x, org_y];
    var org;
    if (_.sum(org_pos) === 0){
      org = 0;
    } else if (_.sum(org_pos) === (cw + ch) - 2*width) {
      org = 3;
    } else if (org_pos[0] === cw - width) {
      org = 1;
    } else{
      org = 4;
    }
    org_pos[2] = org;

    return org_pos;
  }
};

// draw the target or do nothing on catch trials
var draw_target = function(org_x, org_y, rotate=false, target=true) {

  var canvas = document.getElementById('canvas');
  var target_n = false;

  if (canvas.getContext) {
    if (target) {
      var ctx = canvas.getContext('2d');
      var cw = canvas.width;
      var ch = canvas.height;
      var width = cw / 6;

      // randomly choose a target position
      // 3/5 cue position, 1/5 move vertically, 1/5 move horizontally
      var react = _.sample([[org_x,org_y],[org_x,org_y],[org_x,org_y],[(org_x+cw-width)%(2*(cw-width)),org_y],[org_x,(org_y+ch-width)%(2*(ch-width))]]);

      // draw a black rectangle as target
      ctx.fillStyle="#000000";
      ctx.fillRect(react[0],react[1],width,width);

      // calculate where the target is
      if (_.sum(react)==0){
        target_n = 0;
      } else if (_.sum(react)==(cw+ch)-2*width) {
        target_n = 3;
      } else if (react[0]==cw-width) {
        target_n = 1;
      } else if (react[0]==0){
        target_n = 4;
      }
      react[2] = target_n;

    } else {
      var react = [false,false,false];
    }
    return react;
  }
};

if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}
