/** 
 * @name RentersWarehouseAPI
 * 
 * @description "dirty api" for renterswarehouse.com
 * 
 * below is standalone test version only
 * designed for exploring and testing
 * 
 * implementation is currently successful
 * provided all headers and option args are applied
 * 
 * currently not automated or attached to API interface
 * 
 * anti-scraping tech appears present
 * 
 * obtain core source requests from
 * developer tools XHR network requests
 * 
 * @todo automate via integration with API interface
 * 
 * @version 0.0.0 
 * 
 * @copyright Q-Quest [ qquestlive@gmail.com ]
 * 
 * @license all rights reserved
 */

const puppeteer = require( 'puppeteer' ); // @see https://github.com/puppeteer/puppeteer

const REQUEST = 'request';
const GET = 'GET';
// const WILDCARD = '*';

const BROWSER = {
  slowMo: 1577,
  product: 'chrome', // 'chrome' | 'firefox'
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

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';

// const TARGET_URL = 'https://www.renterswarehouse.com/search-properties/for-sale?page=1&lat=35.2270869&lng=-80.8431267&zoom=11&location_txt=Charlotte%2C%20NC%2C%20USA&min_lat=34.8456240250849&max_lat=35.90932765497266&min_lng=-82.31699518926546&max_lng=-80.21598868139192&match_type=i&order_by=gross_yield&order_dir=desc&listingsType=for-sale&listingsView=agent&building_type=single%20family%20home';
const TARGET_URL = 'https://www.renterswarehouse.com/search/properties/for-sale?page=1&lat=33.7489954&lng=-84.3879824&zoom=11&location_txt=Atlanta%2C%20GA%2C%20USA&min_lat=33.57039384109491&max_lat=33.927225748602694&min_lng=-84.62350180917967&max_lng=-84.1524629908203&match_type=i&order_by=gross_yield&order_dir=desc&listingsType=for-sale&listingsView=agent&building_type=single%20family%20home';

// fetch("https://www.renterswarehouse.com/search/properties/for-sale?page=1&lat=33.7489954&lng=-84.3879824&zoom=11&location_txt=Atlanta%2C%20GA%2C%20USA&min_lat=33.57039384109491&max_lat=33.927225748602694&min_lng=-84.62350180917967&max_lng=-84.1524629908203&match_type=i&order_by=gross_yield&order_dir=desc&listingsType=for-sale&listingsView=agent&building_type=single%20family%20home", {
//   "headers": {
//     "accept": "application/json, text/plain, */*",
//     "accept-language": "en-US,en;q=0.9,fr;q=0.8",
//     "cache-control": "no-cache",
//     "pragma": "no-cache",
//     "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "x-csrf-token": "IDsndNVeH3f30cE4bKeVki6qLSR6sNcZPvUhg1dW",
//     "x-requested-with": "XMLHttpRequest",
//     "x-xsrf-token": "eyJpdiI6ImpCblYycTJDTGF3bHFHVmFkSm1velE9PSIsInZhbHVlIjoia0tCUjh6M0FYcnBpY0JEM2JHUjdIQjU1XC9jZUVmN3JmQmJoUGo2TGpTM1VaS1VTZ2VcL1MwWkZpRStrY0ozbFl3IiwibWFjIjoiZTM0OTc5N2ZlNzBiZDMzNmFjNzkyMjA0ZjE0YjFmMTUyZWI0MjUwNGQwYjg2YzA5NmNkNjBhYjdmOTcwZTIxMSJ9",
//     "cookie": "utm_source=eyJpdiI6IjROU1FcL01HNHhwYmI5SFlWNGFRRU53PT0iLCJ2YWx1ZSI6Im9XcmZBcWp3RDdKXC9KREZIMThFcnBnPT0iLCJtYWMiOiJhMzkyMzg5MjRjODdjZWJhNDA1ODE5OTI2MGRiNjc1ZDMxYmQwMmU1YTI2MWJiOWZjNDY1MDNmMTgwNmZjMWU5In0%3D; referer=eyJpdiI6IllJYWxkTk9PazBsMURiRHVRelZaYmc9PSIsInZhbHVlIjoiWWRlMG44TFZ3SEtLbU05NFRcL21LOU1aXC8yanBtWFBqM3d0WktTV0xVS2d3PSIsIm1hYyI6IjQ4ODZjMjY0ZmVkZGJkMDM2NDI4ZTU1OWU3NjJiNDY5ZGZkZmE3NjBiMTI4ZDIzZTU4ZTIxMDE1MGQ0ZGE1Y2MifQ%3D%3D; _ga=GA1.2.2106169264.1625868265; _gid=GA1.2.691382145.1625868265; MGX_P=84a82466-ac91-40a3-a701-4132d4d60f4b; MGX_PX=a174dc76-1391-42c5-b675-094fad065e99; _gcl_au=1.1.1291082827.1625868265; _hjTLDTest=1; _hjid=5991a5aa-6af2-4290-95ab-830acd8d17cf; __pcmip_uid=1-0akaau8c-kqwvziw3; __pcmip_utm={\"utm_source\":\"referral\"}; _st_bid=a00aeea0-e101-11eb-be40-3db2f0988db6; MGX_EID=bnNfc2VnXzAxOA==; MGX_CID=217a2547-f5f7-47e5-82d3-6a4534ae4803; MGX_VS=11; _st_l=35.600|; _st=a00aeea0-e101-11eb-be40-3db2f0988db6.a00e22f0-e101-11eb-be40-3db2f0988db6....0....1625876293.1625884722.600.10800.30.0....1....1.10,11..renterswarehouse^com.UA-27352266-1.2106169264^1625868265.35.; XSRF-TOKEN=eyJpdiI6ImpCblYycTJDTGF3bHFHVmFkSm1velE9PSIsInZhbHVlIjoia0tCUjh6M0FYcnBpY0JEM2JHUjdIQjU1XC9jZUVmN3JmQmJoUGo2TGpTM1VaS1VTZ2VcL1MwWkZpRStrY0ozbFl3IiwibWFjIjoiZTM0OTc5N2ZlNzBiZDMzNmFjNzkyMjA0ZjE0YjFmMTUyZWI0MjUwNGQwYjg2YzA5NmNkNjBhYjdmOTcwZTIxMSJ9; renterswarehouse_session=eyJpdiI6IlBvRnVFSUN5Vmt6WnplVVwvY25OR2NnPT0iLCJ2YWx1ZSI6ImxkWEZzNDN5cXgzY21kbndueFFvR2dDMFZDNmJHQXVEdmFkallqaUNFSmhlOHpJS0U5WEhcLzcxUnZsWnMxZDkrIiwibWFjIjoiMmJlMDcyMWZmYTA3ZjVmMDQwYzNjZTY0Y2Q0ODU0NjI5Mzc4MmU5ODNiNmE1OGQyMjRkZGZhZjhhYTc1ZTFiZSJ9"
//   },
//   "referrer": "https://www.renterswarehouse.com/search-properties/for-sale?page=1&lat=33.7489954&lng=-84.3879824&zoom=11&location_txt=Atlanta%2C%20GA%2C%20USA&min_lat=33.57039384109491&max_lat=33.927225748602694&min_lng=-84.62350180917967&max_lng=-84.1524629908203&match_type=i&order_by=gross_yield&order_dir=desc&listingsType=for-sale&listingsView=agent&building_type=single%20family%20home",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": null,
//   "method": "GET",
//   "mode": "cors"
// });

const HEADERS = {
  "accept": "application/json, text/plain, */*",
  "accept-language": "en-US,en;q=0.9,fr;q=0.8",
  "cache-control": "no-cache",
  "pragma": "no-cache",
  "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
  // below are okay to omit... nope, not anymore. they put up anti-scraping tech
  "sec-ch-ua-mobile": "?0",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "x-requested-with": "XMLHttpRequest",
  "x-csrf-token": "OwWxlm6yDCsif2DOHBqyQ9olEkAh2U2vu1jf2MxA",
  "x-xsrf-token": "eyJpdiI6ImZKV0ZZWFh3M2FRSXFOWFRtTktqa0E9PSIsInZhbHVlIjoicDhVbFVDZTM2XC9ybHRDckhTSXVza01KZHoycnNEK2lhdEVXU25CUFY4dlRQQ3BBTUYzd1ZtT1NQRnlscTd4dFgiLCJtYWMiOiI4ZmYzMWJkMzM5Y2QwNmUxZWE2N2Q1OWRmZmRhZmZjYzg4OTgxNmViYjNkMjAyNzIwZDQwZDc0N2Q0NGMxY2YyIn0=",
  "cookie": "utm_source=eyJpdiI6IjROU1FcL01HNHhwYmI5SFlWNGFRRU53PT0iLCJ2YWx1ZSI6Im9XcmZBcWp3RDdKXC9KREZIMThFcnBnPT0iLCJtYWMiOiJhMzkyMzg5MjRjODdjZWJhNDA1ODE5OTI2MGRiNjc1ZDMxYmQwMmU1YTI2MWJiOWZjNDY1MDNmMTgwNmZjMWU5In0%3D; referer=eyJpdiI6IllJYWxkTk9PazBsMURiRHVRelZaYmc9PSIsInZhbHVlIjoiWWRlMG44TFZ3SEtLbU05NFRcL21LOU1aXC8yanBtWFBqM3d0WktTV0xVS2d3PSIsIm1hYyI6IjQ4ODZjMjY0ZmVkZGJkMDM2NDI4ZTU1OWU3NjJiNDY5ZGZkZmE3NjBiMTI4ZDIzZTU4ZTIxMDE1MGQ0ZGE1Y2MifQ%3D%3D; _ga=GA1.2.2106169264.1625868265; MGX_P=84a82466-ac91-40a3-a701-4132d4d60f4b; MGX_PX=a174dc76-1391-42c5-b675-094fad065e99; _gcl_au=1.1.1291082827.1625868265; _hjTLDTest=1; _hjid=5991a5aa-6af2-4290-95ab-830acd8d17cf; __pcmip_uid=1-0akaau8c-kqwvziw3; __pcmip_utm={\"utm_source\":\"referral\"}; _st_bid=a00aeea0-e101-11eb-be40-3db2f0988db6; MGX_EID=bnNfc2VnXzAxOA==; MGX_CID=217a2547-f5f7-47e5-82d3-6a4534ae4803; _st_l=35.600||6783550001.8287668900; MGX_VS=13; _st=a00aeea0-e101-11eb-be40-3db2f0988db6.a00e22f0-e101-11eb-be40-3db2f0988db6....0....1625910647.1625911683.600.10800.30.0....1....1.10,11..renterswarehouse^com.UA-27352266-1.2106169264^1625868265.35.; XSRF-TOKEN=eyJpdiI6ImZKV0ZZWFh3M2FRSXFOWFRtTktqa0E9PSIsInZhbHVlIjoicDhVbFVDZTM2XC9ybHRDckhTSXVza01KZHoycnNEK2lhdEVXU25CUFY4dlRQQ3BBTUYzd1ZtT1NQRnlscTd4dFgiLCJtYWMiOiI4ZmYzMWJkMzM5Y2QwNmUxZWE2N2Q1OWRmZmRhZmZjYzg4OTgxNmViYjNkMjAyNzIwZDQwZDc0N2Q0NGMxY2YyIn0%3D; renterswarehouse_session=eyJpdiI6Ik15bVFydnFpSmthYU9hdFZhMCtCVkE9PSIsInZhbHVlIjoiUkhVUkluXC9yTERQS2F2Q0N5am1VOWxma2U0czFhdEIrMFhQTDdkbEVLNDlhOTJzdVwvMkhodDZnM0x1XC83RGNGWiIsIm1hYyI6ImNmYmM2ZGFmMGI5NWUyMDY3ODUyMWY0Y2IxMWQwOGZjMGJmNTk4N2YyOWFlMTJhMDFhZmY5ZDhjNjdjMzdlOGQifQ%3D%3D; _gid=GA1.2.473417662.1626082484; _dc_gtm_UA-27352266-1=1"
};
const ARGS = {
  "body": null,
  "method": GET,
  "mode": "cors",
  // below are okay to omit... nope, not anymore. they put up anti-scraping tech
  "referrer": "https://www.renterswarehouse.com/search-properties/for-sale?page=1&lat=35.2270869&lng=-80.8431267&zoom=11&location_txt=Charlotte%2C%20NC%2C%20USA&min_lat=35.05161593482882&max_lat=35.40217921823524&min_lng=-81.0786461091797&max_lng=-80.60760729082033&match_type=i&order_by=gross_yield&order_dir=desc&listingsType=for-sale&listingsView=agent&building_type=single%20family%20home",
  "referrerPolicy": "strict-origin-when-cross-origin",
};


( async () => {
  const browser = await puppeteer.launch( BROWSER, );
  const page = await browser.newPage();

  // set user-agent
  await page.setUserAgent( USER_AGENT, );

  // intercept, inject options
  // [ BEGIN ] POST
  const handleSetPostDataPayload = async () => {
    // if( !payload ) return;

    // Allows you to intercept a request; must appear before
    // your first page.goto()
    await page.setRequestInterception( true, );

    // Request intercept handler... will be triggered with
    // each page.goto() statement
    await page.once( REQUEST, interceptedRequest => {
      
      // change request method and add post data
      const options = {
        ...ARGS,
        // method: GET,
        // postData: JSON.stringify( payload, ),
        // postData: 'foo=FOO&bar=BAR', // { foo: 'FOO', bar: 'BAR', },
        headers: {
          ...interceptedRequest.headers(),
          // [ CONTENT_TYPE ]: APPLICATION_JSON, // APPLICATION_ENCODED, //
          ...HEADERS,
        },
      };
      // Request modified... finish sending!
      interceptedRequest.continue( options, );
    },);
  };

  await handleSetPostDataPayload();
  // [ END ] POST
  
  // navigate to target  
  await page.goto( TARGET_URL, WAIT, );
  await page.waitForTimeout( 3500, );

  // get data
  const data = await page.evaluate(() =>
    // document.querySelector( '*'   ).outerHTML
    document.querySelector( 'pre' ).innerText
  );
  console.log( data, );

  await browser.close();
})();