declare function require(name: string);

var striptags = require('striptags');
let originalConsoleLog: Function = console.log;

interface Console2Interface {
    extendedLog: Function
}

let createLoggerHTMLElement = (logger: HTMLDivElement) => {
    logger = document.createElement("div");
    logger.id = "log";
    document.body.appendChild(logger);
    return logger;
};
let registerConsole2 = (logger: HTMLDivElement) => {
    let _console: Console2Interface = {
        extendedLog: (log: string, color: string) => {
            logger.innerHTML += `<span style="color:${color}">${log}</span><br/>`;
            originalConsoleLog(striptags(log));
        }
    };
    window['console2'] = _console;
    console2 = _console;
};

export function replaceConsoleLog() {

    let logger: HTMLDivElement = document.getElementById('log') as HTMLDivElement;
    if (logger == null) {
        logger = createLoggerHTMLElement(logger);
    }
    console.log = (...args) => {
        for (let i = 0; i < args.length; i++) {
            if (typeof args[i] == 'object') {
                logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(args[i],
                    undefined,
                    2) : args[i]) + '<br />';
            } else {
                logger.innerHTML += args[i] + '<br />';
                args[i] = striptags(args[i]);
            }
        }
        originalConsoleLog.apply(this, args);
    };
    registerConsole2(logger);
};

export var console2: Console2Interface = null;