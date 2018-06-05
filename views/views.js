var intro = {
    name: 'intro',
    // introduction title
    "title": "Welcome!",
    // introduction text
    "text": "Thank you for participating in our study. In this study, you will see rectangles and have to click space. The experiment will take around 7 minutes and needs your full attention. If you don't have enough time now, please come back later.",
    // introduction's slide proceeding button text
    "buttonText": "Begin experiment",
    // render function renders the view
    render: function() {

        viewTemplate = $('#intro-view').html();
        $('#main').html(Mustache.render(viewTemplate, {
            title: this.title,
            text: this.text,
            button: this.buttonText
        }));

        // moves to the next view
        $('#next').on('click', function(e) {
            exp.findNextView();
        });

    },
    // for how many trials should this view be repeated?
    trials: 1
};

var startSliderRating = {
  "text": "Please answer these question about how you feel at the moment. Afterwards, we can begin with the experiment.",
    render : function(CT) {
        var view = {};
        view.name = 'start-questions',
        view.template = $('#start-view-slider-response').html();
        view.response = $('#response').html();
        var response1;
        var response2;
        var response3;
        var start_data = {};
        start_data.question1 = "How hungry are you?";
        start_data.option11 = "Not at all";
        start_data.option12 = "Very";
        start_data.question2 = "How tired are you?";
        start_data.option21 = "Not at all";
        start_data.option22 = "Very";
        start_data.question3 = "How happy are you?";
        start_data.option31 = "Not at all";
        start_data.option32 = "Very";
        $('#main').html(Mustache.render(view.template, {
            text: this.text,
            question1: start_data.question1,
            option11: start_data.option11,
            option12: start_data.option12,
            question2: start_data.question2,
            option21: start_data.option21,
            option22: start_data.option22,
            question3: start_data.question3,
            option31: start_data.option31,
            option32: start_data.option32
        }));
        startingTime = Date.now();
        response1 = $('#response1');
        response2 = $('#response2');
        response3 = $('#response3');

        // checks if the slider has been changed
        response3.on('change', function() {
            $('#next').removeClass('nodisplay');
        });
        response3.on('click', function() {
            $('#next').removeClass('nodisplay');
        });

        $('#next').on('click', function() {
            exp.global_data.hungry = response1.val(),
            exp.global_data.tired = response2.val(),
            exp.global_data.happy = response3.val(),

          exp.findNextView();
        });

        return view;
    },
    trials: 1
};

var instructions1 = {
    name: 'instructions',
    // instruction's title
    "title": "Instructions",
    // instruction's text
    "text": "On each trial, you will see two rectangles. Fixate the cross in the middle and when one end of one rectangle gets black press Space.",
    // instuction's slide proceeding button text
    "buttonText": "See an example",
    render: function() {

        viewTemplate = $("#instructions-view").html();
        $('#main').html(Mustache.render(viewTemplate, {
            title: this.title,
            text: this.text,
            button: this.buttonText
        }));

        // moves to the next view
        $('#next').on('click', function(e) {
            exp.findNextView();
        });

    },
    trials: 1
};

var example = {
    name: 'example',
    // instruction's text
    "text": "First you will see two rectangles. Press J to continue example.",
    render: function() {

        var ins_text = 0;
        viewTemplate = $("#example-view").html();
        $('#main').html(Mustache.render(viewTemplate, {
            text: this.text,
        }));
        draw_fixation();
        var org_pos;
        var target_pos;

        var jListener = function(e) {
            keyPressed = e.which
            if (keyPressed === 74) {
                ins_text++;
                if (ins_text === 1){
                    org_pos = draw_cue();
                    example.text = "Then a cue (white rectangle) will appear at one end of one of the two rectangles. You have to fixate the cross in the middle. Press J to continue example.";
                    $('#main').html(Mustache.render(viewTemplate, {
                        text: example.text,
                    }));
                    draw_fixation();
                    org_pos = draw_cue();

                } else if (ins_text === 2){
                    example.text = "After a short time a target (black rectangle) will appear at one end of the two rectangles (likely to be at the same place as the cue was). Now you have to press space as fast as possible. Press J to continue example.";
                    $('#main').html(Mustache.render(viewTemplate, {
                        text: example.text,
                    }));
                    draw_fixation();
                    target_pos = draw_target(org_pos[0],org_pos[1]);
                } else if (ins_text === 3){
                    example.text = "Sometimes the rectangles will be rotated, everything else will stay the same. Press J to continue.";
                    $('#main').html(Mustache.render(viewTemplate, {
                        text: example.text,
                    }));
                    draw_fixation(true);
                } else if (ins_text === 4){
                    $('body').off('keydown', jListener);
                    exp.global_data.org_pos_ex = org_pos[2];
                    exp.global_data.target_pos_ex = target_pos[2];
                    exp.findNextView();
                }
            }
        };
        $('body').on('keydown', jListener);


    },
    trials: 1
};

var instructions2 = {
    name: 'instructions',
    // instruction's title
    "title": "Instructions",
    // instruction's text
    "text": "Sometimes there will be no target, then you have to wait until the next trial will start (two seconds). The real experiment will start, after you completed 10 correct trials in a row. Please be as fast as possible, without making any mistakes.",
    // instuction's slide proceeding button text
    "buttonText": "Start trials",
    render: function() {

        viewTemplate = $("#instructions-view").html();
        $('#main').html(Mustache.render(viewTemplate, {
            title: this.title,
            text: this.text,
            button: this.buttonText
        }));

        // moves to the next view
        $('#next').on('click', function(e) {
            exp.findNextView();
        });

    },
    trials: 1
};

var trialKeyPress = {
    render : function(CT) {
        var view = {};
        view.name = 'trial',
        view.template = $('#practice-view').html();
        $('#main').html(Mustache.render(view.template, {  }));
        var n = 0;
        var correct_n = 0;
        var trialLoop = function() {
          // 50% of trials are rotated
          var rotate = _.sample([true,false]);
          var unset = "unset";
          var org_pos = [unset, unset, unset];
          var target_pos = [unset, unset, unset];
          var startingTime;
          var fixTO;
          var cueTO;
          var fix2TO;
          var targetTO;
          var target = null;
          // time between cue and target
          var timeBCT = _.sample([150,200,250]);

          // listen to the space bar
          var spaceListener = function(e) {
              keyPressed = e.which
              if (keyPressed === 32) {
                  var RT = Date.now() - startingTime; // measure RT before anything else
                  // stop the timeout, because the space bar was pressed
                  clearTimeout(fixTO);
                  clearTimeout(cueTO);
                  clearTimeout(fix2TO);
                  clearTimeout(targetTO);
                  submitData(RT, "space");

              }
          };

          // draw the fixation screen
          draw_fixation(rotate);
          $('body').on('keydown', spaceListener);


          // main procedure of the trial
          // show fixation for 1000 milliseconds
          // show cue for 100 milliseconds and record its position
          // show the fixation screen for 200 milliseconds again
          // show the target or a catch trial for 2000 milliseconds or until the space bar is keyPressed and record all information
          fixTO = setTimeout(function() {
            org_pos = draw_cue(rotate);
            cueTO = setTimeout(function() {
              draw_fixation(rotate);
              fix2TO = setTimeout(function() {
                target = _.sample([true,true,true,false]);
                target_pos = draw_target(org_pos[0], org_pos[1], rotate, target);
                startingTime = Date.now();
                // submit the data after 2000 milliseconds
                targetTO = setTimeout(function() {
                  submitData(null, "wait");
                }, 2000)
              }, timeBCT);
            }, 100);
          }, 1000);

          // submits the data and draw a blank screen for 500 milliseconds
          var submitData = function(rt, reaction) {
            draw_blank();
            // set whether the button press was correct or not
            if ((target === false && reaction === "wait") || (target === true && reaction === "space")){
              correct = true;
              correct_n++;
            } else {
              correct = false;
              correct_n = 0;
            }
            // set all trial_data
            trial_data = {
                trial_type: "practiceKeyPress",
                trial_number: CT+1+n,
                rotate: rotate,
                org: org_pos[2],
                target: target_pos[2],
                RT: rt,
                timeBCT: timeBCT,
                reaction: reaction,
                correct: correct,
                org_pos: org_pos.slice(0,2),
                target_pos: target_pos.slice(0,2),
                block: "practice"
            };
            // push the trial data
            exp.trial_data.push(trial_data);
            // stops listening to the space bar
            $('body').off('keydown', spaceListener);
            // continue with the next view after 500 milliseconds
            setTimeout(function(){
              if(correct_n === exp.practice_correct_n){
                exp.findNextView();
              } else {
                n++;
                trialLoop(n);
              }
            }, 500);
          };
          return view;
    }
    trialLoop(n);
  },
    trials: 1
};

var beginMainExp = {
    name: 'beginMainExp',
    // render function renders the view
    render: function() {

        viewTemplate = $('#begin-exp-view').html();
        $('#main').html(Mustache.render(viewTemplate, {
            text: String.format("Now that you have acquainted yourself with the procedure of the task, the actual experiment will begin. " +
            "\n On each trial, you will see two rectangles. Fixate the cross in the middle and when one end of one rectangle gets black press Space." +
            "\n There will be {0} blocks with {1} trials each.", exp.blocks, mainKeyPress.trials)
        }));

        // moves to the next view
        $('#next').on('click', function(e) {
            exp.findNextView();
        });

    },
    trials: 1
};

var pauseScreen = {
    name: 'pauseScreen',
    // render function renders the view
    render: function() {

        var startingTime = Date.now()

        viewTemplate = $('#pause-exp-view').html();
        $('#main').html(Mustache.render(viewTemplate, {
            text: String.format("Perfect! You had {0} % correct in the last block. Stay focused, you still have to do {1} block{2}.", exp.correctness[exp.blocks-1-exp.remaining_blocks], exp.remaining_blocks, exp.remaining_blocks>1? "s":"")
        }));

        // moves to the next view
        $('#next').on('click', function(e) {
            exp.global_data.pause_times.push(Date.now()-startingTime);
            exp.findNextView();
        });

    },
    trials: 1
};

var mainKeyPress = {
  "n": 0,
  "correct_n": 0,
  render : function(CT) {
      var view = {};
      view.name = 'main',
      view.template = $('#main-view').html();

      $('#main').html(Mustache.render(view.template, { }));

      // 50% of trials are rotated
      var rotate = _.sample([true,false]);
      var unset = "unset";
      var org_pos = [unset, unset, unset];
      var target_pos = [unset, unset, unset];
      var startingTime;
      var fixTO;
      var cueTO;
      var fix2TO;
      var targetTO;
      var target = null;
      // time between cue and target
      var timeBCT = _.sample([150,200,250]);

      // listen to the space bar
      var spaceListener = function(e) {
          keyPressed = e.which
          if (keyPressed === 32) {
              var RT = Date.now() - startingTime; // measure RT before anything else
              // stop the timeout, because the space bar was pressed
              clearTimeout(fixTO);
              clearTimeout(cueTO);
              clearTimeout(fix2TO);
              clearTimeout(targetTO);
              submitData(RT, "space");

          }
      };

      // draw the fixation screen
      draw_fixation(rotate);
      $('body').on('keydown', spaceListener);


      // main procedure of the trial
      // show fixation for 1000 milliseconds
      // show cue for 100 milliseconds and record its position
      // show the fixation screen for 200 milliseconds again
      // show the target or a catch trial for 2000 milliseconds or until the space bar is keyPressed and record all information
      fixTO = setTimeout(function() {
        org_pos = draw_cue(rotate);
        cueTO = setTimeout(function() {
          draw_fixation(rotate);
          fix2TO = setTimeout(function() {
            target = _.sample([true,true,true,false]);
            target_pos = draw_target(org_pos[0], org_pos[1], rotate, target);
            startingTime = Date.now();
            // submit the data after 2000 milliseconds
            targetTO = setTimeout(function() {
              submitData(null, "wait");
            }, 2000)
          }, timeBCT);
        }, 100);
      }, 1000);

      // submits the data and draw a blank screen for 500 milliseconds
      var submitData = function(rt, reaction) {
        draw_blank();
        // set whether the button press was correct or not
        if ((target === false && reaction === "wait") || (target === true && reaction === "space")){
          correct = true;
          mainKeyPress.correct_n++;
        } else {
          correct = false;
        }
        mainKeyPress.n++;
        exp.correctness[exp.blocks - exp.remaining_blocks] = (mainKeyPress.correct_n/mainKeyPress.n) * 100;

        // set all trial_data
        trial_data = {
            trial_type: "mainKeyPress",
            trial_number: CT+1,
            rotate: rotate,
            org: org_pos[2],
            target: target_pos[2],
            RT: rt,
            timeBCT: timeBCT,
            reaction: reaction,
            correct: correct,
            org_pos: org_pos.slice(0,2),
            target_pos: target_pos.slice(0,2),
            block: exp.blocks+1 - exp.remaining_blocks
        };
        // push the trial data
        exp.trial_data.push(trial_data);
        // stops listening to the space bar
        $('body').off('keydown', spaceListener);
        // continue with the next view after 500 milliseconds
        setTimeout(function(){
            if (mainKeyPress.n === mainKeyPress.trials){
              exp.remaining_blocks--;
              mainKeyPress.n = 0;
              mainKeyPress.correct_n = 0;
            }
            exp.findNextView();
        }, 500);
      };
      return view;

},
  trials: 25
};

var postTest = {
    name: 'postTest',
    "title": "Additional Info",
    "text": "Answering the following questions is optional, but will help us understand your answers.",
    "buttonText": "Continue",
    // render function renders the view
    render : function() {

        viewTemplate = $('#post-test-view').html();
        $('#main').html(Mustache.render(viewTemplate, {
            title: this.title,
            text: String.format("You got {0} % correct overall.", _.sum(exp.correctness)/exp.blocks)  + this.text,
            buttonText: this.buttonText
        }));
        console.log(exp.correctness);

        $('#next').on('click', function(e) {
            // prevents the form from submitting
            e.preventDefault();

            // records the post test info
            exp.global_data.age = $('#age').val();
            exp.global_data.gender = $('#gender').val();
            exp.global_data.education = $('#education').val();
            exp.global_data.languages = $('#languages').val();
            exp.global_data.comments = $('#comments').val().trim();
            exp.global_data.endTime = Date.now();
            exp.global_data.timeSpent = (exp.global_data.endTime - exp.global_data.startTime) / 60000;

            // moves to the next view
            exp.findNextView();
        })

    },
    trials: 1
};

var thanks = {
    name: 'thanks',
    "message": "Thank you for taking part in this experiment!",
    render: function() {

        viewTemplate = $('#thanks-view').html();

        // what is seen on the screen depends on the used deploy method
		//    normally, you do not need to modify this
        if ((config_deploy.is_MTurk) || (config_deploy.deployMethod === 'directLink')) {
            // updates the fields in the hidden form with info for the MTurk's server
            $('#main').html(Mustache.render(viewTemplate, {
                thanksMessage: this.message,
            }));
        } else if (config_deploy.deployMethod === 'Prolific') {
            var prolificURL = 'https://prolific.ac/submissions/complete?cc=' + config_deploy.prolificCode;

            $('main').html(Mustache.render(viewTemplate, {
                thanksMessage: this.message,
                extraMessage: "Please press the button below<br />" + '<a href=' + prolificURL +  ' class="prolific-url">Finished!</a>'
            }));
        } else if (config_deploy.deployMethod === 'debug') {
            $('main').html(Mustache.render(viewTemplate, {}));
        } else {
            console.log('no such config_deploy.deployMethod');
        }

        exp.submit();

    },
    trials: 1
};
