// customize the experiment by specifying a view order and a trial structure
exp.customize = function() {

    // record current date and time in global_data
    this.global_data.startDate = Date();
    this.global_data.startTime = Date.now();
    this.blocks = 6
    this.remaining_blocks = this.blocks;
    this.practice_correct_n = 10;
    this.correctness = [];
    this.global_data.pause_times = [];

    // specify view order
    this.views_seq = [intro,
                     startSliderRating,
                     instructions1,
                     example,
                     instructions2,
                     trialKeyPress,
                     beginMainExp,
                     mainKeyPress,
                     loop([pauseScreen,
                     mainKeyPress], this.blocks-1),
                     postTest,
                     thanks];

    // adds progress bars to the views listed
    // view's name is the same as object's name
    this.progress_bar_in = ['main'];
    // this.progress_bar_in = ['practice', 'main'];
    // styles: chunks, separate or default
    //this.progress_bar_style = 'default';
    // the width of the progress bar or a single chunk
    //this.progress_bar_width = 100;
};
