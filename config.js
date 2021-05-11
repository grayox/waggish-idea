const UserAgent = require( 'user-agents' );

// params
const SYMBOLS = {
  PIPE: '|',
  COMMA: ',',
  COMMA_SPACE: ', ',
  WHITESPACE_ZERO: '',
  WHITESPACE_SINGLE: ' ',
  TEXT_CONTENT: 'textContent',
};

// [ BEGIN ] puppeteer

/**
 * delays execution of the next line of code
 * @see https://stackoverflow.com/a/46965281
 * @param { Number } durationInMs 
 * @returns { Void }
 */
const setDelay = durationInMs =>
  new Promise( resolve => setTimeout( resolve, durationInMs, ));

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
const slowMo = getSlowMo( 5, 2, ); // slow down rate in milliseconds
//                    0          1
const BROWSERS = [ 'chrome', 'firefox', ];

const product = BROWSERS[ BROWSER_SELECT ];
const BROWSER = {
  // slowMo,
  product, // 'chrome' | 'firefox'
  headless: false, // devtools: true,

  ignoreHTTPSErrors: true, // POST requests per https://stackoverflow.com/a/59173601

  // anonymous
  // https://www.youtube.com/watch?v=biWUZAlTnkg | https://www.youtube.com/watch?v=RhzGVhLCiK0
  userDataDir: './cache',
  args: [
    // '--window-size=800,860',
    // '--proxy-server=socks5://127.0.0.1:1337', // https://stackoverflow.com/a/50233814
    // '--proxy-server=socks5://127.0.0.1:9050', // https://stackoverflow.com/a/50233814
    // '--proxy-server=socks4://96.9.77.192:55796', // https://dev.to/sonyarianto/practical-puppeteer-using-proxy-to-browse-a-page-1m82
    // heroku: @see https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-on-heroku
    '--no-sandbox', '--start-maximized', '--disable-setuid-sandbox',
    '--disable-div-shm-usage', '--disable-gpu',

    '--enable-features=NetworkService', // POST requests per https://stackoverflow.com/a/59173601

    // google search: public proxy servers
    // blacklist lookup: https://whatismyipaddress.com/blacklist-check
    // potential proxy ips: 162.255.201.37
  ]
};
const WAIT = {
  waitUntil: 'networkidle2', // 'domcontentloaded', // 'networkidle0',
  // waitForNavigation: // ... is a property alternative to waitUntil
};

// const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';
const userAgentObject = new UserAgent();
const userAgent = userAgentObject.toString();
// console.log(`userAgent: ${ userAgent }`);

// ---------------- [ BEGIN ] options for anonymous scraping compliance ----------------
//                             ( @comment out for testing )

// // @see https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pagegotourl-options
// // @see https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pagegotourl-options

// await page.emulateMediaType( 'screen', );  // set before page navigation

// await page.waitForSelector( '#example', {
//   visible: true,
// });

// await page.setGeolocation({ latitude: 59.95, longitude: 30.31667 });

// page.setJavaScriptEnabled(enabled);

// page.setViewport(viewport); // set before page navigation

// headers // @see https://httpbin.org/anything | @see https://www.codementor.io/@scrapingdog/10-tips-to-avoid-getting-blocked-while-scraping-websites-16papipe62
// {
//   "args": {}, 
//   "data": "", 
//   "files": {}, 
//   "form": {}, 
//   "headers": {
//     "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8", 
//     "Accept-Encoding": "gzip, deflate, br", 
//     "Accept-Language": "en-US,en;q=0.5", 
//     "Host": "httpbin.org", 
//     "Referer": "https://www.google.com", 
//     "Upgrade-Insecure-Requests": "1", 
//     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0", 
//     "X-Amzn-Trace-Id": "Root=1-607d47be-0fdaa7ac079451be7aaeecaf"
//   }, 
//   "json": null, 
//   "method": "GET", 
//   "origin": "71.212.180.75", 
//   "url": "https://httpbin.org/anything"
// }

// ---------------- [ END ] options for anonymous scraping compliance ----------------

// reddit
// const TARGET_URL = 'https://old.reddit.com/r/node';

// // realtor
// // const TARGET_URL = 'https://www.realtor.com/propertyrecord-search/York_NE/N-York-Ave/';
// const TARGET_URL = 'https://www.realtor.com/propertyrecord-search/68521/7th-St';

// // realtyTracTargets
// const TARGET_URL = 'https://www.realtytrac.com/home-values/az/maricopa-county/scottsdale/85250/e-horseshoe-ln/';

// [ END ] puppeteer

// -------------------------------------------------------------------------

// [ BEGIN ] google sheets api

// const SHEET_NAME = 'Realtor';
const SHEET_NAME = 'API';
// const SPREADSHEET_ID = '1YZGTMnYCqYy-tINIambbwksL5mGO1itpYXjzNH_ZawM'; // test
const SPREADSHEET_ID = '17UYEPxffvgel8TaEvGwxz7RhJUHviDvY6R95YE1cSAo'; // api incoming
const GSHEETS_API_CONFIG = {
  // getCompute,
  read: {
    ssid: SPREADSHEET_ID,
    sheetName: SHEET_NAME,
    range: 'A1:B1', // skip if B1 is not blank because it hasn't been received and cleared yet
  },
  write: {
    ssid: SPREADSHEET_ID,
    sheetName: SHEET_NAME,
    range: 'B1',
  },
}

// [ END ] google sheets api

// -------------------------------------------------------------------------

// [ BEGIN ] exports

exports.WAIT = WAIT;
exports.SYMBOLS = SYMBOLS;
exports.BROWSER = BROWSER;
exports.GSHEETS_API_CONFIG = GSHEETS_API_CONFIG;
// exports.TARGET_URL = TARGET_URL;
// exports.USER_AGENT = USER_AGENT;

exports.slowMo = slowMo;
exports.setDelay = setDelay;
exports.userAgent = userAgent;
// [ END ] exports