const { readFileSync } = require('fs');
const { join, resolve } = require('path');
const S = require('sanctuary');

const path = resolve(__dirname, '..', 'test/mock', 'isoinfo2.txt')

//#   keyMatch :: RegExp -> (String, String) -> Boolean
const keyMatch = re => ([k, v]) => S.test(re, k);

//#   readFile :: String -> List String
const readFile = S.pipe([readFileSync, S.toString, S.lines]);

//#   splitPair :: String -> List String
const splitPair = S.compose(S.map(S.trim), S.splitOn(':'));

//#   getPairs :: List String -> List (String, String)
const getPairs = S.pipe([S.filter(S.test(/:/)), S.map(splitPair)]);

//#   lastMaybe :: Maybe (List a) -> Maybe a
const lastMaybe = S.chain(S.last);

//#   findPairBy :: RegExp -> List (String, a) -> Maybe (String, a)
const findPairBy = S.curry2((re, ps) => S.find(keyMatch(re), ps));

//#   findValueBy :: RegExp -> List (String, a) -> a
const findValueBy = S.curry2((re, ps) => S.chain(S.last, findPairBy(re, ps)));

//#   findValueFrom :: List (String, a) -> RegExp -> a
const findValueFrom = S.flip(findValueBy);

//.

//#   mock :: List String
const mock = readFile(path);

//#   pairs :: List (String, String)
const pairs = getPairs(mock);

//#   fromPairs :: RegExp -> a
const fromPairs = findValueFrom(pairs);

//

const volumeId = fromPairs(/Volume id/);
const blockSize = fromPairs(/block size/);
const volumeSize = fromPairs(/Volume size/);

//

console.log({ volumeId, blockSize, volumeSize });
