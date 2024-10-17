var fs = require('fs');
var os = require('os');
const colors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    Black: "\x1b[30m",
    Red: "\x1b[31m",
    Green: "\x1b[32m",
    Yellow: "\x1b[33m",
    Blue: "\x1b[34m",
    Magenta: "\x1b[35m",
    Cyan: "\x1b[36m",
    White: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m"
};

const infoLog = console.info
const logLog = console.log;
const warnLog = console.warn;
const errorLog = console.error;
const tablelog = console.table
const debuglog = console.debug;


function formatDate() {
    const date = new Date();
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    // const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // const day = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
    // const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const time = `[${String(date.getUTCHours()).padStart(2, '0') + ':' + String(date.getUTCMinutes()).padStart(2, '0') + ':' + String(date.getUTCSeconds()).padStart(2, '0')}]`
    const days = `[UTC ${String(month[date.getUTCMonth()]).padStart(2, '0') + ':' + String(date.getUTCDate()).padStart(2, '0') + ':' +  String(date.getUTCFullYear()).padStart(2, '0')}]`
    return `${time} ${days}`
}

function formatMessage(arg, type, emoji, title) {
    const copyArgs = Array.prototype.slice.call(arg);
    copyArgs.unshift(`${colors.Reset}${colors[type]}${formatDate()}${emoji} [${title}]`);
    //   copyArgs.unshift(`${formatDate()}${colors[type]}${emoji} [${title}]${colors.Reset}`);
    return copyArgs;
}

function formatMessagelog(arg, title) {
    const copyArgs = Array.prototype.slice.call(arg);
    copyArgs.unshift(`${formatDate()} [${title}]`);
    return copyArgs;
}
console.log = function(args) {
    logtofile("logs", formatMessagelog(arguments, 'LOG'))
    logLog.apply(null, formatMessage(arguments, 'Reset', '', 'LOG'));
};

console.info = function(args) {
    logtofile("info", formatMessagelog(arguments, 'INFO'))
    infoLog.apply(null, formatMessage(arguments, 'Green', '', 'INFO'));
};
console.warn = function(args) {
    logtofile("warn", formatMessagelog(arguments, 'WARN'))
    warnLog.apply(null, formatMessage(arguments, 'Yellow', '', 'WARN'));
};

console.error = function(args) {
    logtofile("error", formatMessagelog(arguments, 'ERROR'))
    errorLog.apply(null, formatMessage(arguments, 'Red', '', 'ERROR'));
};
console.debug = function(args) {
    logtofile("debug", formatMessagelog(arguments, 'DEBUG'))
    debuglog.apply(null, formatMessage(arguments, 'Cyan', '', 'DEBUG'));
};
// console.table = function(args) {
//     logtofile("table", formatMessagelog(arguments, 'TABLE'))
//     debuglog.apply(null, formatMessage(arguments, 'Blue', '', 'TABLE'));
// };

function logtofile(name, data2) {
    const date = new Date();
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = `${month[date.getUTCMonth()]}-${date.getUTCDate()}-${date.getFullYear()}`
    fs.readdir(`logs/`, function(err, dataawff) {
        if (err) { fs.mkdir(`logs/`, function(errff) {}) }
        fs.readdir(`logs/${days}`, function(erfr, dataawf) {
            if (erfr) { fs.mkdir(`logs/${days}`, function(errf) {}) }
            fs.appendFile(`logs/${days}/${name}.log`, `\n${data2}`, function(err) {})
        });
    });
}