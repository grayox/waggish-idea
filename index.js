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
const scraper = require( './scraper'  );
// const reddit  = require( './reddit'  );
// const realtor = require( './realtor' );
// const realtyTracValues = require( './realtyTracValues' );
const google = require( './googleSheetsApi' );

const REGEX_WHITESPACE = /\s/;
const WHITESPACE_SINGLE = ' ';
const timestamp = new Date();

// destructured assignments
const { GSHEETS_API_CONFIG, } = config;
const { initialize, getResults, } = scraper;
// const { initialize, getResults, } = reddit;
// const { initialize, getResults, } = realtor;
// const { initialize, getResults, } = realtyTracValues;
const { googleSheetsApi, } = google;

// scraping function
const getCompute = async incomingDataGrid => {
  const SKIP_NOTICE = 'Latest result cell is still populated';

  // de-structure incoming data grid
  let [[ configApi, latestResult, ],] = incomingDataGrid;
  configApi = configApi.split( REGEX_WHITESPACE, ).join( WHITESPACE_SINGLE, );

  // skip if latest result cell is not empty
  const isHasLatestResult = latestResult && latestResult.length;
  if( isHasLatestResult ) {
    console.log( SKIP_NOTICE, );
    return false;
  }

  // deconstruct configApi
  const {
    orderId, targetUrl, querySelectorAll, configSelectors,
  } = JSON.parse( configApi, );
  
  // scrape page at incoming url for data
  await initialize( targetUrl, );
  const results = await getResults( querySelectorAll, configSelectors, );
  // console.log('results\n', JSON.stringify( results, ));
  // return results;

  // convert results to a 2D array with 1 row and 1 column
  // with value equal to a stringified JSON object written to the cell
  const newCellObject = { results, orderId, timestamp, };
  const newCellContent = JSON.stringify( newCellObject, );
  const newDataGrid = [[ newCellContent, ]];
  return newDataGrid;
}

const main = async () => {
  const googleSheetsApiConfig = await { ...GSHEETS_API_CONFIG, getCompute, };
  await googleSheetsApi( googleSheetsApiConfig, );
};

main();

// // [ BEGIN ] testing notes

// // working spreadsheet content
// // {"orderId":"foo","targetUrl":"https://old.reddit.com/r/node","querySelectorAll":"#siteTable > div[class*=\"thing\"]","configSelectors":[["title","p.title","innerText"],["authorUrl","p.tagline > a.author","href"],["authorName","p.tagline > a.author","innerText"],["score","div.score.likes","innerText"]]}

// // url, selectors
// const TARGET_URL = 'https://old.reddit.com/r/node';
// const QUERY_SELECTOR_ALL = '#siteTable > div[class*="thing"]';
// const CONFIG_SELECTORS = [
//   //  propertyName     selector                     attribute
//   [ 'title'      , 'p.title'              , 'innerText' , ] ,
//   [ 'authorUrl'  , 'p.tagline > a.author' , 'href'      , ] ,
//   [ 'authorName' , 'p.tagline > a.author' , 'innerText' , ] ,
//   [ 'score'      , 'div.score.likes'      , 'innerText' , ] ,
// ];

// const main1 = async () => {
//   await initialize( TARGET_URL, );
//   const results = await getResults( QUERY_SELECTOR_ALL, CONFIG_SELECTORS, );
//   console.log('results\n', JSON.stringify( results, ));
//   return results;
// };

// // [ END ] testing notes
