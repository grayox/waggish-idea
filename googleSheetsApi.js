/**
 * @name Google Sheets API Tutorial
 * 
 * @description provides an interface with the google sheets api
 * 
 * tutorial: Google Sheets API - JavaScript NodeJS Tutorial
 * by: Learn Google Spreadsheets https://www.youtube.com/channel/UC8p19gUXJYTsUPEpusHgteQ
 * @see https://www.youtube.com/watch?v=MiPpQzW_ya0
 * 
 * dependencies
 * npm install googleapis@39 --save
 * 
 * google api
 * @see https://console.developers.google.com // console
 * @see https://developers.google.com/sheets/api/quickstart/nodejs // package
 * @see https://developers.google.com/identity/protocols/googlescopes // scopes
 */

const keys        = require( './keys.json' , );
const { google, } = require( 'googleapis'  , );

// params
const VERSION = 'v4';
const CLIENT_API_LIST = [ 'https://www.googleapis.com/auth/spreadsheets', ];

const BANG = '!';

const getSpreadsheetRange = ( sheetName, sheetRange, ) =>
  [ sheetName, sheetRange, ].join( BANG, );

/**
 * returns a reference to an authorized
 * client of the google sheets api
 */
const getGsClient = async () => {
  const gsClient = new google.auth.JWT (
    keys.client_email, null, keys.private_key, CLIENT_API_LIST,
  );

  await gsClient.authorize(( error, tokens, ) => {
    const CONNECTED_MESSAGE = 'Connected!';
    const message = error || CONNECTED_MESSAGE;
    console.log( message, );
  });

  return gsClient;
}

/**
 * returns reference to google sheets api
 */
 const getGsApi = async () => {
  const gsClient = await getGsClient();
  const apiObject = { version: VERSION, auth: gsClient, };
  const gsApi = google.sheets( apiObject, );
  return gsApi;
};

/**
 * reads data from a google sheet
 * @param { Object } gsApi reference to the google sheets api
 * @returns { *[][] } array of arrays representing the data grid contained in google sheets
 */
const getGsRead = async ( gsApi, spreadsheetId, sheetName, sheetRange, ) => {
  const range = getSpreadsheetRange( sheetName, sheetRange, );
  const options = { spreadsheetId, range, };
  const dataRangeImport = await gsApi.spreadsheets.values.get( options, );
  const dataGrid = dataRangeImport && dataRangeImport.data && dataRangeImport.data.values;
  console.log(`Successfully fetched spreadsheet data and saw: ${ dataGrid }`, );
  return dataGrid;
}

/**
 * writes update to google sheets
 * @param { *[][] } newDataGrid 
 * @returns 
 */
const setGsUpdate = async ( newDataGrid, gsApi, spreadsheetId, sheetName, sheetRange, ) => {
  console.log( newDataGrid, );

  const range = getSpreadsheetRange( sheetName, sheetRange, );
  const options = {
    spreadsheetId, range,
    valueInputOption: 'USER_ENTERED',
    resource: { values: newDataGrid, },
  }
  const result = await gsApi.spreadsheets.values.update( options, );
  return result;
}

const setGoogleSheetsApi = async config => {
  const { read, write, getCompute, } = config;
  const { ssid: readSsid  , sheetName: readSheetName  , range: readRange  , } = read;
  const { ssid: writeSsid , sheetName: writeSheetName , range: writeRange , } = write;

  const gsApi = await getGsApi(); // get reference to google sheets api
  
  // fetch old data
  const originalDataGrid = await getGsRead( gsApi, readSsid, readSheetName, readRange, );
  
  // compute new data
  const newDataGrid = await getCompute( originalDataGrid, );
  
  // update google sheets with new data
  const result = await setGsUpdate( newDataGrid, gsApi, writeSsid, writeSheetName, writeRange, );
  
  // console.log( result, );
  return result;
};

// ------------------------ [ BEGIN ] test ------------------------

// /**
//  * computes new data grid based on old data grid
//  * @param { *[][] } originalDataGrid
//  * @param { *[][] }
//  */
//  const getCompute_test = originalDataGrid => {
//   // ensure consistent row length
//   const normalizedDataGrid = originalDataGrid.map( row => {
//     while( row.length < 2) row.push( WHITESPACE_ZERO, );
//     return row;
//   })

//   // compute each row
//   const newDataGrid = normalizedDataGrid.map( row => {
//     const newValue = `${ row[0] }-${ row[1] }`;
//     row.push( newValue, );
//     return row;
//   });

//   return newDataGrid;
// }

// const SHEET_NAME = 'Data';
// const SPREADSHEET_ID = '1YZGTMnYCqYy-tINIambbwksL5mGO1itpYXjzNH_ZawM'; // test
// // const SPREADSHEET_ID = '17UYEPxffvgel8TaEvGwxz7RhJUHviDvY6R95YE1cSAo'; // api incoming
// const TEST_CONFIG = {
  //   read: {
    //     ssid: SPREADSHEET_ID,
    //     sheetName: SHEET_NAME,
    //     range: 'A1:B5',
    //   },
    //   write: {
      //     ssid: SPREADSHEET_ID,
      //     sheetName: SHEET_NAME,
      //     range: 'E2',
      //   },
      //   getCompute: getCompute_test,
      // }
      
      // setGoogleSheetsApi( TEST_CONFIG, );

// ------------------------ [ END ] test ------------------------

exports.googleSheetsApi = setGoogleSheetsApi;