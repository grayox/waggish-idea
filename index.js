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
const config            = require( './config'  );
const scraper           = require( './scraper' );
// const reddit            = require( './archive/reddit'           );
// const realtor           = require( './archive/realtor'          );
// const realtyTracValues  = require( './archive/realtyTracValues' );
// const rentersWarehouse  = require( './archive/rentersWarehouse' );
const google            = require( './googleSheetsApi'          );
// const resultsImport = require ('./archive/tempdata-equator.json');
// const resultsImport = require ('./archive/tempdata-realtytrac-post-b.json');

const REGEX_WHITESPACE = /\s/;
const WHITESPACE_ZERO = '';
const WHITESPACE_SINGLE = ' ';
const RANGE_START_STRING = 'A1:'
const POST = 'POST';
const timestamp = new Date();

// destructured assignments
const { GSHEETS_API_CONFIG, } = config;
const { initialize, getResults, } = scraper;
// const { initialize, getResults, } = reddit;
// const { initialize, getResults, } = realtor;
// const { initialize, getResults, } = realtyTracValues;
// const { initialize, getResults, } = rentersWarehouse;
const { googleSheetsApi, } = google;

// scraping function
const getCompute = async (
  incomingDataGrid, writeSheetName, writeRange, writeSheetNamePost,
) => {
  const TERMINATE_NOTICE = 'Latest result cell is still populated. Will not overwrite. Terminating now.';

  // de-structure incoming data grid
  let [[ configApi, latestResult, ],] = incomingDataGrid;

  // skip if latest result cell is not empty
  const isHasLatestResult = latestResult && latestResult.length;
  if( isHasLatestResult ) {
    console.log( TERMINATE_NOTICE, );
    return;
  }
  
  // deconstruct configApi
  configApi = configApi.split( REGEX_WHITESPACE, ).join( WHITESPACE_SINGLE, );
  const {
    targetUrl, headers, payload, ajaxXhrUrl, pathToData,
    orderId, querySelectorAll, configSelectors, maxCountLimit,
    method, args,
  } = JSON.parse( configApi, );
  
  // scrape page at incoming url for data
  // returns json object from POST
  let results = await initialize({
    targetUrl, headers, payload,
    ajaxXhrUrl, pathToData,
    method, args,
  });
  // @testing
  // // test 1
  // let results = [
  //   { name: 'alice'   , age: 21 , } ,
  //   { name: 'bob'     , age: 32 , } ,
  //   { name: 'charlie' , age: 43 , } ,
  // ];
  // // test 2
  // let results = resultsImport;
  // // const pathToData = [ 'properties', ];

  // extract the relevant data from the pathToData
  const isPathToData = pathToData && pathToData.length;
  if( isPathToData ) pathToData.forEach( property => results = results[ property ]);
  
  // [ BEGIN ] handle http POST
  if( results ){

    /**
     * @see http://bideowego.com/base-26-conversion
     * @param { Number } numberInBase10 
     * @returns { String }
     */
     const getConvertToBase26 = numberInBase10 => {
      const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const ALPHABET_LENGTH = ALPHABET.length;
      let result = WHITESPACE_ZERO;
      if( numberInBase10 < 1 ) return result; // no letters for 0 or less
      let remainder;
      while( numberInBase10 !== 0 ){ // until we have a 0 quotient
        let decremented = numberInBase10 - 1; // compensate for 0 based array
        numberInBase10 = Math.floor( decremented / ALPHABET_LENGTH ); // divide by 26
        remainder = decremented % ALPHABET_LENGTH; // get remainder
        result = ALPHABET[ remainder ] + result; // prepend the letter at index of remainder
      }
      return result;
    }
    // const test_getConvertToBase26 = () => {
    //   const CONFIG = [ 36, 57, 128, 269, ];
    //   const result = CONFIG.map( numberInBase10 => getConvertToBase26( numberInBase10, ));
    //   Logger.log('(line 363) result: %s', result, );
    //   return result;
    // }

    const getWriteRangePost = dataGrid => {
      const dataGridHeaderRow = dataGrid[ 0 ];
      const dataGridHeaderRowLength = dataGridHeaderRow.length;
      const dataGridLength = dataGrid.length;
      const lastColumnLetters = getConvertToBase26( dataGridHeaderRowLength, );
      const resultRange = [
        RANGE_START_STRING, lastColumnLetters, dataGridLength,
      ].join( WHITESPACE_ZERO, );
      return resultRange;
    }
    
    /**
      * Inverse method for getArrayOfObjectsFromDataGrid()
      * @param { String[] } headerRow must match the keys of each object
      * @param { Object[] } arrayOfObjects
      * @returns { *[][] }
      */
    const getDataGridFromArrayOfObjects = ( headerRow, arrayOfObjects, ) => {
      const dataGrid = arrayOfObjects.map ( item =>
        headerRow.map( headerLabel => item[ headerLabel ])
      );
      dataGrid.unshift( headerRow, );
      return dataGrid;
    }

    // get headers by searching all rows
    const headerRowSet = new Set();
    results.forEach( result => {
      const keys = Object.keys( result, );
      keys.forEach( key => headerRowSet.add( key, ));
    });
    const headerRow = [ ...headerRowSet, ];

    // stringify each property of each result for POST
    results.forEach( result => {
      headerRow.forEach( property =>
        result[ property ] = JSON.stringify( result[ property ])
      );
    });

    const newDataGrid = getDataGridFromArrayOfObjects( headerRow, results, );

    const writeRangePost = getWriteRangePost( newDataGrid, );

    const postReturnObject = { orderId, results: POST, };
    const postReturnObjectStringified = JSON.stringify( postReturnObject, )
    const postReturnGrid = [[ postReturnObjectStringified, ]];
    const out = [
      [ newDataGrid    , writeSheetNamePost , writeRangePost , ] ,
      [ postReturnGrid , writeSheetName     , writeRange     , ] ,
    ];
    return out;
  }
  // [ END ] handle http POST

  // [ BEGIN ] handle http GET
  
  // process GET
  results = await getResults(
    querySelectorAll, configSelectors, maxCountLimit, headers, payload,
  );
  // // test testing
  // console.log('results\n', JSON.stringify( results, ));
  // return results;

  // convert results to a 2D array with 1 row and 1 column
  // with value equal to a stringified JSON object written to the cell
  const newCellObject = { results, orderId, timestamp, };
  const newCellContent = JSON.stringify( newCellObject, );
  const newDataGrid = [[ newCellContent, ]];
  const out = [[ newDataGrid, writeSheetName, writeRange, ]];
  return out;
  // [ END ] handle http GET
}

( async () => await googleSheetsApi({ ...GSHEETS_API_CONFIG, getCompute, },))()
  .catch( e => console.log( e.message ));

// // [ BEGIN ] test testing notes

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