const config    = require( './config'  );
const puppeteer = require( 'puppeteer' ); // @see https://github.com/puppeteer/puppeteer

const { USER_AGENT, WAIT, BROWSER, slowMo, setDelay, } = config;

// selectors
const QUERY_SELECTOR_ALL = 'html';
// const QUERY_SELECTOR_ALL = 'div.property-records-content table > tbody > tr';
// const SELECTOR_ADDRESS
//    = SELECTOR_LINK      = 'td:nth-child(1) > a'; 
// const SELECTOR_STATUS    = 'td:nth-child(2)';
// const SELECTOR_VALUE     = 'td:nth-child(3)';

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

const self = {
  browser: null,
  pages: null,

  // setup
  initialize: async targetUrl => {
    targetUrl = TARGET_URL; // test testing

    self.browser = await puppeteer.launch( BROWSER, );
    self.page = await self.browser.newPage();

    // set user-agent
    await self.page.setUserAgent( USER_AGENT, );
    
    // navigate to target
    await self.page.goto( targetUrl, WAIT, );
    await self.page.waitForTimeout( slowMo, );
  },

  /**
   * for test testing
   * @returns { String }
   */
  getResults: async () => {
    const data = await self.page.evaluate(() => document.querySelector('*').outerHTML);
    console.log(data);
    await self.browser.close();
    return data;
  },
  
  getResults1: async () => {
    const elements = await self.page.$$( QUERY_SELECTOR_ALL, );
    
    let results = [];

    for ( const element of elements ) {

      const address = await element.$eval( SELECTOR_ADDRESS , node => node.innerText.trim());
      const link    = await element.$eval( SELECTOR_LINK    , node => node.href     .trim());
      const status  = await element.$eval( SELECTOR_STATUS  , node => node.innerText.trim());
      const value   = await element.$eval( SELECTOR_VALUE   , node => node.innerText.trim());

      // console.log( address, link, status, value, );

      const result = { address, link, status, value, };
      // console.log( JSON.stringify( result ),);

      results.push( result, );
    }
    
    // cleanup
    await self.browser.close();

    // console.log('(line 48) results\n', JSON.stringify( results, ));
    return results;
  }
}

module.exports = self;