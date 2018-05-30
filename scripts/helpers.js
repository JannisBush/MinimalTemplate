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
  if (rotate){
    canvas = createCanvas(canvas.width, canvas.height);
  }
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
      rotate_canvas(canvas);
    }
  }
};

var draw_cue = function(rotate=false) {
  // start
  var canvas = document.getElementById('canvas');
  if (rotate){
    canvas = createCanvas(canvas.width, canvas.height);
  }
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var cw = canvas.width;
    var ch = canvas.height;
    ctx.clearRect(0, 0, cw, ch);
    var width = cw / 6;
    ctx.strokeRect(0, 0, width, ch);
    ctx.strokeRect(cw-width, 0, width, ch);

    var org_x = _.sample([0,cw-width]);
    var org_y = _.sample([0,ch-width]);
    ctx.fillStyle="#FFFFFF";
    ctx.fillRect(org_x, org_y, 50, 50);

    var middle_w = cw / 2;
    var middle_h = ch / 2;
    ctx.moveTo(middle_w, middle_h-10);
    ctx.lineTo(middle_w, middle_h+10);
    ctx.stroke();

    ctx.moveTo(middle_w-10, middle_h);
    ctx.lineTo(middle_w+10, middle_h);
    ctx.stroke();

    if (rotate) {
      rotate_canvas(canvas);
    }
    return [org_x, org_y];
  }
};

var draw_target = function(org_x, org_y, rotate=false, target=true) {
  // start
  var canvas = document.getElementById('canvas');
  if (rotate){
    canvas = createCanvas(canvas.width, canvas.height);
  }
  if (canvas.getContext) {
    if (target) {
      var ctx = canvas.getContext('2d');
      var cw = canvas.width;
      var ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);
      var width = cw / 6;
      ctx.strokeRect(0, 0, width, ch);
      ctx.strokeRect(cw-width, 0, width, ch);
      var react = _.sample([[org_x,org_y],[org_x,org_y],[org_x,org_y],[(org_x+cw-width)%(cw-width),org_y],[org_x,(org_y+ch-width)%(ch-width)]]);
      ctx.fillStyle="#000000";
      ctx.fillRect(react[0],react[1],width,width);


      var middle_w = cw / 2;
      var middle_h = ch / 2;
      ctx.moveTo(middle_w, middle_h-10);
      ctx.lineTo(middle_w, middle_h+10);
      ctx.stroke();

      ctx.moveTo(middle_w-10, middle_h);
      ctx.lineTo(middle_w+10, middle_h);
      ctx.stroke();

      if (rotate) {
        rotate_canvas(canvas);
      }
    } else {
      var react = false;
    }

    return react;
  }
};

var rotate_canvas = function(hidden_canvas) {
  // store current data to an image
  var myImage = new Image();
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ch = canvas.height;
    var cw = canvas.width;
    var context = canvas.getContext('2d');
    myImage.src = hidden_canvas.toDataURL();

    myImage.onload = function () {
        // reset the canvas with new dimensions
        canvas.width = ch;
        canvas.height = cw;
        cw = canvas.width;
        ch = canvas.height;

        context.save();
        // translate and rotate
        context.translate(cw, ch / cw);
        context.rotate(Math.PI / 2);
        // draw the previows image, now rotated
        context.drawImage(myImage, 0, 0);
        context.restore();

        // clear the temporary image
        myImage = null;
    }
  }
};

var createCanvas = function(width, height) {
 var c = document.createElement('canvas');
 c.setAttribute('width', width);
 c.setAttribute('height', height);
 return c;
};
