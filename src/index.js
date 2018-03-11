const R = require('ramda');
const S = require('sanctuary');
const sh = require('shelljs');

const reset = '\u001B[0m';
const red = '\u001B[31m';
const green = '\u001B[32m';

const falsyToUndefined = x => x || undefined;

//#   required :: List String
//.
//. List of required tools to be installed and in path.
const required = ['ddrescue', 'isoinfo', 'safecopy'];

//#   checkRequired :: Boolean -> String -> Boolean
const checkRequired = hasAll => req => hasAll && !!sh.which(req);

//#   toMarkdownList :: List String -> List String
const toMarkdownList = S.map(S.concat(' - '));

//#   failure :: String -> Undefined
const failure =
  xs => { process.stderr.write(`${red}ERR:${reset} ${xs}\n`);
          process.exit(1); };

//#   success :: String -> Undefined
const success =
  xs => { process.stdout.write(`${green}==>${reset} ${xs}\n`); };

//

//#   ls :: Array String -> String
const ls = S.joinWith('\n');

S.pipe([S.reduce(checkRequired, true),
        falsyToUndefined,
        S.toMaybe,
        S.maybeToEither(ls(['Required tools are not installed.\n',
                            'Please make sure you have the following tools installed:',
                            ls(toMarkdownList(required))])),
        S.either(failure, success)],
       required)
