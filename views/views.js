var intro = {
    name: 'intro',
    // introduction title
    "title": "Welcome!",
    // introduction text
    "text": "Thank you for participating in our study. In this study, you will see rectangles and click space.",
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

var instructions = {
    name: 'instructions',
    // instruction's title
    "title": "Instructions",
    // instruction's text
    "text": "On each trial, you will see two rectangles. Fixate the cross in the middle and when one end of one rectangle gets black press Space",
    // instuction's slide proceeding button text
    "buttonText": "Go to practice trial",
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

        // show the target for delay number of milliseconds and publish the data
        var showTarget = function(delay) {
          // submit the data after delay number of seconds
          var timeoutID = setTimeout(function() {
            $('body').off('keydown', spaceListener);
            submitData(null, "wait");
          }, delay);

          // submits the data and draw a blank screen for 500 milliseconds
          var submitData = function(rt, reaction) {
            draw_blank();
            // set whether the button press was correct or not
            if ((target === false && reaction === "wait") || (target === true && reaction === "space")){
              correct = true;
            } else {
              correct = false;
            }
            // set all trial_data
            trial_data = {
                trial_type: "practiceKeyPress",
                trial_number: CT+1,
                rotate: rotate,
                org: org_pos[2],
                target: target_pos[2],
                RT: rt,
                reaction: reaction,
                correct: correct,
                org_pos: org_pos.slice(0,2),
                target_pos: target_pos.slice(0,2)
            };
            // push the trial data
            exp.trial_data.push(trial_data);
            // stops listening to the space bar
            $('body').off('keydown', spaceListener);
            // continue with the next view after 500 milliseconds
            setTimeout(function(){
                exp.findNextView();
            }, 500);
          };
          // listen to the space bar
          var spaceListener = function(e) {
              keyPressed = e.which
              if (keyPressed === 32) {
                  var RT = Date.now() - startingTime; // measure RT before anything else
                  submitData(RT, "space");
                  // stop the timeout, because the space bar was pressed
                  clearTimeout(timeoutID);

              }
          };
          $('body').on('keydown', spaceListener);
        };

        // 50% of trials are rotated
        var rotate = _.sample([true,false]);
        var org_pos;
        var target_pos;
        var startingTime;
        // draw the fixation screen
        draw_fixation(rotate);

        // main procedure of the trial
        // show fixation for 1000 milliseconds
        // show cue for 100 milliseconds and record its position
        // show the fixation screen for 200 milliseconds again
        // show the target or a catch trial for 2000 milliseconds or until the space bar is keyPressed and record all information
        setTimeout(function() {
          org_pos = draw_cue(rotate);
          setTimeout(function() {
            draw_fixation(rotate);
            setTimeout(function() {
              target = _.sample([true,true,true,false]);
              target_pos = draw_target(org_pos[0], org_pos[1], rotate, target);
              startingTime = Date.now();
              showTarget(2000);
            }, 200);
          }, 100);
        }, 1000);


        return view;
    },
    trials: 10
};

var beginMainExp = {
    name: 'beginMainExp',
    "text": "Now that you have acquainted yourself with the procedure of the task, the actual experiment will begin. " +
    "\n On each trial, you will see two rectangles. Fixate the cross in the middle and when one end of one rectangle gets black press Space",
    // render function renders the view
    render: function() {

        viewTemplate = $('#begin-exp-view').html();
        $('#main').html(Mustache.render(viewTemplate, {
            text: this.text
        }));

        // moves to the next view
        $('#next').on('click', function(e) {
            exp.findNextView();
        });

    },
    trials: 1
};

var mainKeyPress = {
  render : function(CT) {
      var view = {};
      view.name = 'main',
      view.template = $('#main-view').html();

      $('#main').html(Mustache.render(view.template, { }));
      
      // show the target for delay number of milliseconds and publish the data
      var showTarget = function(delay) {
        // submit the data after delay number of seconds
        var timeoutID = setTimeout(function() {
          $('body').off('keydown', spaceListener);
          submitData(null, "wait");
        }, delay);

        // submits the data and draw a blank screen for 500 milliseconds
        var submitData = function(rt, reaction) {
          draw_blank();
          // set whether the button press was correct or not
          if ((target === false && reaction === "wait") || (target === true && reaction === "space")){
            correct = true;
          } else {
            correct = false;
          }
          // set all trial_data
          trial_data = {
              trial_type: "practiceKeyPress",
              trial_number: CT+1,
              rotate: rotate,
              org: org_pos[2],
              target: target_pos[2],
              RT: rt,
              reaction: reaction,
              correct: correct,
              org_pos: org_pos.slice(0,2),
              target_pos: target_pos.slice(0,2)
          };
          // push the trial data
          exp.trial_data.push(trial_data);
          // stops listening to the space bar
          $('body').off('keydown', spaceListener);
          // continue with the next view after 500 milliseconds
          setTimeout(function(){
              exp.findNextView();
          }, 500);
        };
        // listen to the space bar
        var spaceListener = function(e) {
            keyPressed = e.which
            if (keyPressed === 32) {
                var RT = Date.now() - startingTime; // measure RT before anything else
                submitData(RT, "space");
                // stop the timeout, because the space bar was pressed
                clearTimeout(timeoutID);

            }
        };
        $('body').on('keydown', spaceListener);
      };

      // 50% of trials are rotated
      var rotate = _.sample([true,false]);
      var org_pos;
      var target_pos;
      var startingTime;
      // draw the fixation screen
      draw_fixation(rotate);

      // main procedure of the trial
      // show fixation for 1000 milliseconds
      // show cue for 100 milliseconds and record its position
      // show the fixation screen for 200 milliseconds again
      // show the target or a catch trial for 2000 milliseconds or until the space bar is keyPressed and record all information
      setTimeout(function() {
        org_pos = draw_cue(rotate);
        setTimeout(function() {
          draw_fixation(rotate);
          setTimeout(function() {
            target = _.sample([true,true,true,false]);
            target_pos = draw_target(org_pos[0], org_pos[1], rotate, target);
            startingTime = Date.now();
            showTarget(2000);
          }, 200);
        }, 100);
      }, 1000);
      return view;
  },
  trials: 10
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
            text: this.text,
            buttonText: this.buttonText
        }));

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
