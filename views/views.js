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
        // what part of the progress bar is filled
        var filled = CT * (180 / exp.views_seq[exp.currentViewCounter].trials);
        view.name = 'trial',
        view.template = $('#practice-view').html();

        $('#main').html(Mustache.render(view.template, {

        }));
        var rotate = _.sample([true,false]);
        var startingTime;
        var target = false;
        draw_fixation(rotate);
        var org_pos;
        var target_pos;

        var showTarget = function(delay) {

          var timeoutID = setTimeout(function() {
            $('body').off('keydown', spaceListener);
            submitData(null, "wait");
          }, delay);

          var submitData = function(rt, reaction) {
            draw_blank();
            if (_.sum(org_pos)==0){
              org_pos = 0;
            } else if (_.sum(org_pos)==500) {
              org_pos = 2;
            } else if (org_pos[0]==250) {
              org_pos = 1;
            } else{
              org_pos = 3;
            }

            if(rotate) {
              org_pos = (org_pos+1)%4;
            }

            if (_.sum(target_pos)==0){
              target_pos = 0;
            } else if (_.sum(target_pos)==500) {
              target_pos = 2;
            } else if (target_pos[0]==250) {
              target_pos = 1;
            } else{
              target_pos = 3;
            }

            if(rotate) {
              target_pos = (target_pos+1)%4;
            }

            trial_data = {
                trial_type: "practiceKeyPress",
                trial_number: CT+1,
                rotate: rotate,
                org_pos: org_pos,
                target_pos: target_pos,
                RT: rt,
                reaction: reaction
            };
            console.log(trial_data);
            exp.trial_data.push(trial_data);
            $('body').off('keydown', spaceListener);
            setTimeout(function(){
                console.log("nextview");
                exp.findNextView();
            }, 500);
          };

          var spaceListener = function(e) {
              keyPressed = e.which
              if (keyPressed === 32) {
                  console.log(keyPressed);
                  var RT = Date.now() - startingTime; // measure RT before anything else
                  submitData(RT, "space");
                  clearTimeout(timeoutID);

              }
          };
          $('body').on('keydown', spaceListener);
        };

        setTimeout(function() {
          org_pos = draw_cue(rotate);
          console.log("CUE!");
          setTimeout(function() {
            draw_fixation(rotate);
            console.log("Fixation!");
            setTimeout(function() {
              target_pos = draw_target(org_pos[0], org_pos[1], rotate);
              console.log("Target!");
              target = true;
              startingTime = Date.now();
              showTarget(2000);
            }, 200);
          }, 100);
        }, 1000);


        return view;
    },
    trials: 5
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
      // what part of the progress bar is filled
      var filled = CT * (180 / exp.views_seq[exp.currentViewCounter].trials);
      view.name = 'main',
      view.template = $('#main-view').html();

      $('#main').html(Mustache.render(view.template, {

      }));
      var rotate = _.sample([true,false]);
      var startingTime;
      var target = false;
      draw_fixation(rotate);
      var org_pos;
      var target_pos;
      setTimeout(function() {
        org_pos = draw_cue(rotate);
        console.log("CUE!");
        setTimeout(function() {
          draw_fixation(rotate);
          console.log("Fixation!");
          setTimeout(function() {
            target_pos = draw_target(org_pos[0], org_pos[1], rotate);
            console.log("Target!");
            target = true;
            startingTime = Date.now();
          }, 200);
        }, 100);
      }, 1000);

      // updates the progress bar
      $('#filled').css('width', filled);

      var handleKeyPress = function(e) {
          keyPressed = e.which
          if (keyPressed === 32) {
              var corectness;
              console.log(keyPressed);
              var RT = Date.now() - startingTime; // measure RT before anything else
              if (!target){
                correctness = 'earlyPress';
                draw_blank(color="#FF0000");
                setTimeout(function(){
                    console.log("nextview");
                    exp.findNextView();
                }, 500);
              }
              else {
                correctness = 'correct';
                draw_blank();
                setTimeout(function(){
                    console.log("nextview");
                    exp.findNextView();
                }, 500);
              }
              if (_.sum(org_pos)==0){
                org_pos = 0;
              } else if (_.sum(org_pos)==500) {
                org_pos = 2;
              } else if (org_pos[0]==250) {
                org_pos = 1;
              } else{
                org_pos = 3;
              }

              if(rotate) {
                org_pos = (org_pos+1)%4;
              }

              if (_.sum(target_pos)==0){
                target_pos = 0;
              } else if (_.sum(target_pos)==500) {
                target_pos = 2;
              } else if (target_pos[0]==250) {
                target_pos = 1;
              } else{
                target_pos = 3;
              }

              if(rotate) {
                target_pos = (target_pos+1)%4;
              }

              trial_data = {
                  trial_type: "mainKeyPress",
                  trial_number: CT+1,
                  key_pressed: keyPressed,
                  correctness: correctness,
                  rotate: rotate,
                  org_pos: org_pos,
                  target_pos: target_pos,
                  RT: RT
              };
              console.log(trial_data);
              exp.trial_data.push(trial_data);
              $('body').off('keydown', handleKeyPress);

          }
      };

      $('body').on('keydown', handleKeyPress);

      return view;
  },
  trials: 5
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
