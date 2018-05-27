var intro = {
    name: 'intro',
    // introduction title
    "title": "Welcome!",
    // introduction text
    "text": "Thank you for participating in our study. In this study, you will see pictures and click on buttons.",
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
    "text": "On each trial, you will see a question and two response options. Please select the response option you like most. We start with two practice trials.",
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
        startingTime = Date.now();
        // updates the progress bar
        $('#filled').css('width', filled);

        var handleKeyPress = function(e) {
            keyPressed = e.which
            if (keyPressed === 32) {
                var corectness;
                console.log(keyPressed);
                var RT = Date.now() - startingTime; // measure RT before anything else

                if (true) {
                    correctness = 'correct';
                } else {
                    correctness = 'incorrect';
                };

                trial_data = {
                    trial_type: "practiceKeyPress",
                    trial_number: CT+1,
                    key_pressed: keyPressed,
                    correctness: correctness,
                    RT: RT
                };


                console.log(trial_data);
                exp.trial_data.push(trial_data);
                $('body').off('keyup', handleKeyPress);
                exp.findNextView();
            }
        };

        $('body').on('keyup', handleKeyPress);

        return view;
    },
    trials: 3
};

var beginMainExp = {
    name: 'beginMainExp',
    "text": "Now that you have acquainted yourself with the procedure of the task, the actual experiment will begin.",
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
        startingTime = Date.now();
        // updates the progress bar
        $('#filled').css('width', filled);

        var handleKeyPress = function(e) {
            var keyPressed = e.which;
            if (keyPressed === 32) {
                var corectness;
                console.log(keyPressed);
                var RT = Date.now() - startingTime; // measure RT before anything else

                if (true) {
                    correctness = 'correct';
                } else {
                    correctness = 'incorrect';
                };

                trial_data = {
                    trial_type: "mainKeyPress",
                    trial_number: CT+1,
                    key_pressed: keyPressed,
                    correctness: correctness,
                    RT: RT
                };

                console.log(trial_data);
                exp.trial_data.push(trial_data);
                $('body').off('keyup', handleKeyPress);
                exp.findNextView();
            }
        };

        $('body').on('keyup', handleKeyPress);

        return view;
    },
    trials: 3
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
