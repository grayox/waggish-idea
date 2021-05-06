/** 
 * @name Puppeteer Scrapers
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

// imports
const config  = require( './config'  );
// const reddit  = require( './reddit'  );
const realtor = require( './realtor' );
// const realtyTracValues = require( './realtyTracValues' );
const google = require( './googleSheetsApi' );

// destructured assignments
const { GSHEETS_API_CONFIG, } = config;
// const { initialize, getResults, } = reddit;
const { initialize, getResults, } = realtor;
// const { initialize, getResults, } = realtyTracValues;
const { googleSheetsApi, } = google;

// scraping function
const getCompute = async incomingDataGrid => {
  const SKIP_NOTICE = 'Latest result cell is still populated';

  // de-structure incoming data grid
  const [[ targetUrl, latestResult, ],] = incomingDataGrid;

  // skip if latest result cell is not empty
  const isHasLatestResult = latestResult && latestResult.length;
  if( isHasLatestResult ) {
    console.log( SKIP_NOTICE, );
    return false;
  }

  // scrape page at incoming url for data
  await initialize( targetUrl, );
  const results = await getResults();
  // console.log('results\n', JSON.stringify( results, ));
  // return results;

  // convert results to a 2D array with 1 row and 1 column
  // with value equal to a stringified JSON object written to the cell
  const cellContent = JSON.stringify( results, );
  const newDataGrid = [[ cellContent, ]];
  return newDataGrid;
}

const main = async () => {
  const googleSheetsApiConfig = await { ...GSHEETS_API_CONFIG, getCompute, };
  await googleSheetsApi( googleSheetsApiConfig, );
};

main();