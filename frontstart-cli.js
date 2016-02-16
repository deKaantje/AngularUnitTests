/**
 * Requirements
 */

// Node requirements
var path = require('path');

// Other Requirements
var fscli = require('frontstart-cli');


/**
 * Variables
 */

// Constant variables
var FRONTSTART_VERSION = '0.6.0';


/**
 * Functions
 */

// Initialize
function initialize() {
    var projectPath = path.basename(process.cwd());

    process.title = projectPath;
    fscli.initialize(FRONTSTART_VERSION, projectPath);
}

initialize();