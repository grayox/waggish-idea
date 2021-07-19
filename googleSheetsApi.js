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

const CONFIG_TEST = {"orderId":"rentersWarehouse","targetUrl":"https://www.renterswarehouse.com/search/properties/for-sale?page=1&lat=33.7489954&lng=-84.3879824&zoom=11&location_txt=Atlanta%2C%20GA%2C%20USA&min_lat=33.57039384109491&max_lat=33.927225748602694&min_lng=-84.62350180917967&max_lng=-84.1524629908203&match_type=i&order_by=gross_yield&order_dir=desc&listingsType=for-sale&listingsView=agent&building_type=single%20family%20home","maxCountLimit":250,"querySelectorAll":"pre","headers":{"accept":"application/json, text/plain, */*","accept-language":"en-US,en;q=0.9,fr;q=0.8","cache-control":"no-cache","pragma":"no-cache","sec-ch-ua":"\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"","sec-ch-ua-mobile":"?0","sec-fetch-dest":"empty","sec-fetch-mode":"cors","sec-fetch-site":"same-origin","x-requested-with":"XMLHttpRequest","x-csrf-token":"OwWxlm6yDCsif2DOHBqyQ9olEkAh2U2vu1jf2MxA","x-xsrf-token":"eyJpdiI6ImZKV0ZZWFh3M2FRSXFOWFRtTktqa0E9PSIsInZhbHVlIjoicDhVbFVDZTM2XC9ybHRDckhTSXVza01KZHoycnNEK2lhdEVXU25CUFY4dlRQQ3BBTUYzd1ZtT1NQRnlscTd4dFgiLCJtYWMiOiI4ZmYzMWJkMzM5Y2QwNmUxZWE2N2Q1OWRmZmRhZmZjYzg4OTgxNmViYjNkMjAyNzIwZDQwZDc0N2Q0NGMxY2YyIn0=","cookie":"utm_source=eyJpdiI6IjROU1FcL01HNHhwYmI5SFlWNGFRRU53PT0iLCJ2YWx1ZSI6Im9XcmZBcWp3RDdKXC9KREZIMThFcnBnPT0iLCJtYWMiOiJhMzkyMzg5MjRjODdjZWJhNDA1ODE5OTI2MGRiNjc1ZDMxYmQwMmU1YTI2MWJiOWZjNDY1MDNmMTgwNmZjMWU5In0%3D; referer=eyJpdiI6IllJYWxkTk9PazBsMURiRHVRelZaYmc9PSIsInZhbHVlIjoiWWRlMG44TFZ3SEtLbU05NFRcL21LOU1aXC8yanBtWFBqM3d0WktTV0xVS2d3PSIsIm1hYyI6IjQ4ODZjMjY0ZmVkZGJkMDM2NDI4ZTU1OWU3NjJiNDY5ZGZkZmE3NjBiMTI4ZDIzZTU4ZTIxMDE1MGQ0ZGE1Y2MifQ%3D%3D; _ga=GA1.2.2106169264.1625868265; MGX_P=84a82466-ac91-40a3-a701-4132d4d60f4b; MGX_PX=a174dc76-1391-42c5-b675-094fad065e99; _gcl_au=1.1.1291082827.1625868265; _hjTLDTest=1; _hjid=5991a5aa-6af2-4290-95ab-830acd8d17cf; __pcmip_uid=1-0akaau8c-kqwvziw3; __pcmip_utm={\"utm_source\":\"referral\"}; _st_bid=a00aeea0-e101-11eb-be40-3db2f0988db6; MGX_EID=bnNfc2VnXzAxOA==; MGX_CID=217a2547-f5f7-47e5-82d3-6a4534ae4803; _st_l=35.600||6783550001.8287668900; MGX_VS=13; _st=a00aeea0-e101-11eb-be40-3db2f0988db6.a00e22f0-e101-11eb-be40-3db2f0988db6....0....1625910647.1625911683.600.10800.30.0....1....1.10,11..renterswarehouse^com.UA-27352266-1.2106169264^1625868265.35.; XSRF-TOKEN=eyJpdiI6ImZKV0ZZWFh3M2FRSXFOWFRtTktqa0E9PSIsInZhbHVlIjoicDhVbFVDZTM2XC9ybHRDckhTSXVza01KZHoycnNEK2lhdEVXU25CUFY4dlRQQ3BBTUYzd1ZtT1NQRnlscTd4dFgiLCJtYWMiOiI4ZmYzMWJkMzM5Y2QwNmUxZWE2N2Q1OWRmZmRhZmZjYzg4OTgxNmViYjNkMjAyNzIwZDQwZDc0N2Q0NGMxY2YyIn0%3D; renterswarehouse_session=eyJpdiI6Ik15bVFydnFpSmthYU9hdFZhMCtCVkE9PSIsInZhbHVlIjoiUkhVUkluXC9yTERQS2F2Q0N5am1VOWxma2U0czFhdEIrMFhQTDdkbEVLNDlhOTJzdVwvMkhodDZnM0x1XC83RGNGWiIsIm1hYyI6ImNmYmM2ZGFmMGI5NWUyMDY3ODUyMWY0Y2IxMWQwOGZjMGJmNTk4N2YyOWFlMTJhMDFhZmY5ZDhjNjdjMzdlOGQifQ%3D%3D; _gid=GA1.2.473417662.1626082484; _dc_gtm_UA-27352266-1=1"},"payload":{"page":1,"lat":33.7489954,"lng":-84.3879824,"zoom":11,"location_txt":"Atlanta%2C%20GA%2C%20USA","min_lat":33.57039384109491,"max_lat":33.927225748602694,"min_lng":-84.62350180917967,"max_lng":-84.1524629908203,"match_type":"i","order_by":"gross_yield","order_dir":"desc","listingsType":"for-sale","listingsView":"agent","building_type":"single%20family%20home"},"method":"GET","args":{"body":null,"mode":"cors","referrer":"https://www.renterswarehouse.com/search-properties/for-sale?page=1&lat=35.2270869&lng=-80.8431267&zoom=11&location_txt=Charlotte%2C%20NC%2C%20USA&min_lat=35.05161593482882&max_lat=35.40217921823524&min_lng=-81.0786461091797&max_lng=-80.60760729082033&match_type=i&order_by=gross_yield&order_dir=desc&listingsType=for-sale&listingsView=agent&building_type=single%20family%20home","referrerPolicy":"strict-origin-when-cross-origin"}};

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
    const CONNECTED_MESSAGE = 'Connected to Google Sheets API!';
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
  console.log(`Successfully imported Google Sheets data and saw: ${ dataGrid }`, );
  return dataGrid;
}

/**
 * writes update to google sheets
 * @param { *[][] } newDataGrid 
 * @returns 
 */
const setGsUpdate = async ( newDataGrid, gsApi, spreadsheetId, sheetName, sheetRange, ) => {
  const range = getSpreadsheetRange( sheetName, sheetRange, );
  const options = {
    spreadsheetId, range,
    valueInputOption: 'USER_ENTERED',
    resource: { values: newDataGrid, },
  }
  const result = await gsApi.spreadsheets.values.update( options, );
  
  // log result
  const newDataGridLength = newDataGrid.length;
  const newRecordCount = newDataGridLength - 1;
  const isPost = newRecordCount > 0;
  const dataGridReport = isPost ? `${ newRecordCount } new records` : newDataGrid;
  console.log( `Successfully wrote to spreadsheet: ${ dataGridReport }`, );

  return result;
}

const setGoogleSheetsApi = async config => {
  const { read, write, post, getCompute, } = config;
  const { ssid: readSsid  , sheetName: readSheetName  , range: readRange  , } = read;
  const { ssid: writeSsid , sheetName: writeSheetName , range: writeRange , } = write;
  const {                   sheetName: postSheetName  ,                     } = post;

  const gsApi = await getGsApi(); // get reference to google sheets api
  
  // fetch old data
  const originalDataGrid = await getGsRead( gsApi, readSsid, readSheetName, readRange, );
  
  // compute new data
  const computed = await getCompute( originalDataGrid, writeSheetName, writeRange, postSheetName, );
  const isComputed = computed && computed.length;
  if( !isComputed ) return;

  // update google sheets with new data
  computed.forEach( async ([ newDataGrid, actualWriteSheetName, actualWriteRange, ]) => {
    await setGsUpdate( newDataGrid, gsApi, writeSsid, actualWriteSheetName, actualWriteRange, );
  });
  
  // console.log( computed, );
  return computed;
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