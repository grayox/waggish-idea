const config  = require( './config'  );
// const reddit  = require( './reddit'  );
// const realtor = require( './realtor' );
const realtyTracValues = require( './realtyTracValues' );

/** 
 * @name Puppeteer Scrapers
 * 
 * @description provides an interface with the google sheets api
 * 
 * tutorial: Scraping Reddit with Puppeteer & NodeJs
 * by: Fabian Grohs https://www.youtube.com/channel/UCdv_4yb4agiPz07PByzHTeQ
 * @see https://www.youtube.com/watch?v=o7MJ1-UhS50
 * 
 * stealth scraping
 * @see https://javascriptwebscrapingguy.com/avoid-being-blocked-with-puppeteer/
 *
 * captcha solving
 * @see https://dynomapper.com/blog/514-online-captcha-solving-services-and-available-captcha-types
 * @see https://prowebscraper.com/blog/top-10-captcha-solving-services-compared/
 *
 * @version 0.0.0
 * 
 * @since v0.0.0
 * 
 * @copyright Q-Quest [ qquestlive@gmail.com ]
 * 
 * @license all rights reserved
 */

// destructured assignments
const { TARGET_URL, } = config;

// const { initialize, getResults, } = reddit;
// const { initialize, getResults, } = realtor;
const { initialize, getResults, } = realtyTracValues;

( async () => {

  await initialize( TARGET_URL, );

  const results = await getResults();
  // console.log('results\n', JSON.stringify( results, ));

  debugger;
  return results;
})();

