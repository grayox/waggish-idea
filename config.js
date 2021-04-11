// params
const SYMBOLS = {
  PIPE: '|',
  COMMA: ',',
  COMMA_SPACE: ', ',
  WHITESPACE_ZERO: '',
  WHITESPACE_SINGLE: ' ',
  TEXT_CONTENT: 'textContent',
};

/**
 * returns a random time delay
 * @param { Number } [ fixedSeconds = 2 ]
 * @param { Number } [ randomSecondsUpperLimit = 3 ]
 * @returns 
 */
const getSlowMo = ( fixedSeconds = 2, randomSecondsUpperLimit = 3, ) => {
  const MILLISECONDS_PER_SECOND = 1000;
  const randomDecimalBetweenZeroAndOne = Math.random();

  const randomSeconds = randomDecimalBetweenZeroAndOne * randomSecondsUpperLimit;
  const totalTimeDelayInSeconds = fixedSeconds + randomSeconds;

  const totalTimeDelayInMilliseconds = totalTimeDelayInSeconds * MILLISECONDS_PER_SECOND;
  return totalTimeDelayInMilliseconds;
}

const BROWSER_SELECT = 0;
const slowMo = getSlowMo( 2, 3, ); // slow down rate in milliseconds
//                    0          1
const BROWSERS = [ 'chrome', 'firefox', ];

const product = BROWSERS[ BROWSER_SELECT ];
const BROWSER = {
  slowMo,
  product, // 'chrome' | 'firefox'
  headless: false, // devtools: true,
};
const WAIT = {
  waitUntil: 'networkidle0', // 'domcontentloaded', // 'networkidle2',
  // waitForNavigation: // ... is a property alternative to waitUntil
};

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';

// // reddit
// const TARGET_URL = 'https://old.reddit.com/r/node';

// // realtor
// // const TARGET_URL = 'https://www.realtor.com/propertyrecord-search/York_NE/N-York-Ave/';
// const TARGET_URL = 'https://www.realtor.com/propertyrecord-search/68521/7th-St';

// realtyTracTargets
const TARGET_URL = 'https://www.realtytrac.com/home-values/az/maricopa-county/scottsdale/85250/e-horseshoe-ln/';

exports.SYMBOLS = SYMBOLS;
exports.BROWSER = BROWSER;
exports.WAIT = WAIT;
exports.TARGET_URL = TARGET_URL;
exports.USER_AGENT = USER_AGENT;