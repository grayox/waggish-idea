/**
 * @name Google Sheets API Tutorial
 * 
 * @description implements code in the following tutorial video
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

const { google, } = require( 'googleapis', );
const keys = require( './keys.json' );

const SPREADSHEET_ID = '1YZGTMnYCqYy-tINIambbwksL5mGO1itpYXjzNH_ZawM';

const client = new google.auth.JWT (
  keys.client_email,
  null,
  keys.private_key,
  [ 'https://www.googleapis.com/auth/spreadsheets', ],
);

client.authorize(( error, tokens, ) => {

  if( error ){
    console.log( error, );
    return;
  }

  console.log( 'Connected!' );
});

const gsrun = async cl => {
  const gsapi = google.sheets({ version: 'v4', auth: cl, });
  const opt = {
    spreadsheetId: SPREADSHEET_ID,
    range: 'Data!A1:B5',
  };

  // fetch old data
  let data = await gsapi.spreadsheets.values.get( opt, );
  console.log( data.data.values, );
  let dataArray = data.data.values;

  // compute new data

  // ensure consistent row length
  dataArray = dataArray.map( r => {
    while( r.length < 2) r.push( '', );
    return r;
  })
  // compute each row
  let newDataArray = dataArray.map( r => {
    const newValue = `${ r[0] }-${ r[1] }`;
    r.push( newValue, );
    return r;
  });

  // write new data
  const updateOptions = {
    spreadsheetId: SPREADSHEET_ID,
    range: 'Data!E2',
    valueInputOption: 'USER_ENTERED',
    resource: { values: newDataArray, },
  }
  let res = await gsapi.spreadsheets.values.update( updateOptions, );
  console.log( res, );
}

gsrun( client, );