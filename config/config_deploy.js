var config_deploy = {

    // obligatory fields

    // the experimentID is needed to recover data from the _babe server app
	// you receive the experimentID when you create the experiment using the _babe server app

	 "experimentID": "4",

    // set deployment method; use one of:
    //'debug', 'localServer', 'MTurk',
    // 'MTurkSandbox', 'Prolific', 'directLink'
    "deployMethod" : "debug",

    // optional fields
    "author": "JannisAndTill",
    "description": "Object-Biases(FIT)",
    // who to contact in case of trouble
    "contact_email": "jrautenstrau@uos.de",
};
