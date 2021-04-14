const keys        = require( './keys.json' , );
const { google, } = require( 'googleapis'  , );
// const {
//   SPREADSHEET_ID, CLIENT_API_LIST,
// } = require( './config', );

/**
 * @name Google Sheets API Tutorial
 * 
 * @description implements code in the following tutorial video
 * 
 * tutorial Google Sheets API - JavaScript NodeJS Tutorial
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

// params
const SPREADSHEET_ID = '1YZGTMnYCqYy-tINIambbwksL5mGO1itpYXjzNH_ZawM'; // test
// const SPREADSHEET_ID = '17UYEPxffvgel8TaEvGwxz7RhJUHviDvY6R95YE1cSAo'; // api incoming
const CLIENT_API_LIST = [ 'https://www.googleapis.com/auth/spreadsheets', ];
const version = 'v4';

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
  const apiObject = { version, auth: gsClient, };
  const gsApi = google.sheets( apiObject, );
  return gsApi;
};

/**
 * reads data from a google sheet
 * @param { Object } gsApi reference to the google sheets api
 * @returns { *[][] } array of arrays representing the data grid contained in google sheets
 */
const getGsRead = async gsApi => {
  const OPTIONS = {
    spreadsheetId: SPREADSHEET_ID,
    range: 'Data!A1:B5',
  };
  const dataRangeImport = await gsApi.spreadsheets.values.get( OPTIONS, );
  const dataGrid = dataRangeImport && dataRangeImport.data && dataRangeImport.data.values;
  console.log( dataGrid, );
  return dataGrid;
}

/**
 * computes new data grid based on old data grid
 * @param { *[][] } originalDataGrid
 * @param { *[][] }
 */
const getGsCompute = originalDataGrid => {
  // ensure consistent row length
  const normalizedDataGrid = originalDataGrid.map( row => {
    while( row.length < 2) row.push( '', );
    return row;
  })

  // compute each row
  const newDataGrid = normalizedDataGrid.map( row => {
    const newValue = `${ row[0] }-${ row[1] }`;
    row.push( newValue, );
    return row;
  });

  return newDataGrid;
}

/**
 * writes update to google sheets
 * @param { *[][] } newDataGrid 
 * @returns 
 */
const setGsUpdate = async ( newDataGrid, gsApi, ) => {
  const options = {
    spreadsheetId: SPREADSHEET_ID,
    range: 'Data!E2',
    valueInputOption: 'USER_ENTERED',
    resource: { values: newDataGrid, },
  }
  const result = await gsApi.spreadsheets.values.update( options, );
  return result;
}

const gsrun = async () => {
  const gsApi = await getGsApi(); // get reference to google sheets api
  const originalDataGrid = await getGsRead( gsApi, ); // fetch old data
  const newDataGrid = await getGsCompute( originalDataGrid, ); // compute new data
  const result = await setGsUpdate( newDataGrid, gsApi, ); // update google sheets with new data
  console.log( result, );
  return result;
};

gsrun();