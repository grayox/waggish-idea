const config    = require( './config'  );
const puppeteer = require( 'puppeteer' ); // @see https://github.com/puppeteer/puppeteer

const { userAgent, WAIT, BROWSER, } = config;  // USER_AGENT,

const REQUEST = 'request';
const POST = 'POST';
const CONTENT_TYPE = 'Content-Type';
const APPLICATION_JSON = 'application/json';
const APPLICATION_ENCODED = 'application/x-www-form-urlencoded';
const STATUS_CODE_SUCCESS = 200;

const self = {
  browser: null,
  pages: null,

  // setup
  /**
   * can handle http GET and POST requests
   * @see https://stackoverflow.com/a/49385769
   * @param { String } targetUrl the intended endpoint
   * @param { Object } [ payload = false ] for HTTP POST requests
   */
  initialize: async ( targetUrl, payload = false, ) => {
    self.browser = await puppeteer.launch( BROWSER, );
    self.page = await self.browser.newPage();

    // set user-agent
    await self.page.setUserAgent( userAgent, ); // USER_AGENT,
    
    // http POST
    // conditioned on payload existing  
    const handleSetPostDataPayload = async () => {
      if( !payload ) return;

      // Allows you to intercept a request; must appear before
      // your first page.goto()
      await self.page.setRequestInterception( true, );

      // Request intercept handler... will be triggered with
      // each page.goto() statement
      await self.page.once( REQUEST, interceptedRequest => {
        
        // change request method and add post data
        const data = {
          method: POST,
          postData: JSON.stringify( payload, ),
          // postData: 'foo=FOO&bar=BAR', // { foo: 'FOO', bar: 'BAR', },
          headers: {
            ...interceptedRequest.headers(),
            [ CONTENT_TYPE ]: APPLICATION_JSON, // APPLICATION_ENCODED, // 
          },
        };
        // Request modified... finish sending!
        interceptedRequest.continue( data, );
      },);
    };

    await handleSetPostDataPayload();
    
    // navigate to target
    const response = await self.page.goto( targetUrl, WAIT, );

    // if this is not a POST request, then return to process
    // the GET request normally with the prescribed scraping
    if( !payload ) {
      await self.browser.close(); // cleanup
      return;
    }

    // console.log({
    //   url: response.url(),
    //   statusCode: response.status(),
    //   body: await response.text(),
    // });
    
    // otherwise return false if not successful...
    const statusCode = await response.status();
    const isResponseSuccess = statusCode === STATUS_CODE_SUCCESS;
    if( !isResponseSuccess ) {
      await self.browser.close(); // cleanup
      return false;
    }
    
    // ...or, if successful, return the JSON object
    const jsonBodyAsString = await response.text();
    const jsonObject = JSON.parse( jsonBodyAsString, );
    await self.browser.close(); // cleanup
    return jsonObject;
  },

  getResults: async ( querySelectorAll, configSelectors, maxCountLimit, payload, ) => {
    // handle post
    if( payload ) {
      console.log(`post request payload: ${ payload }`);
      return;
    }


    const elements = await self.page.$$( querySelectorAll, );
    let results = [];
    let counter = 1;
    
    for ( const element of elements ) {
      const result = {};

      // CONFIG_SELECTORS.forEach( async ([ propertyName, selector, attribute, ]) => { // fails
      // .forEach() throws, use regular for loop instead
      for ( const [ propertyName, selector, attribute, ] of configSelectors ) {      
        try {
          result[ propertyName ] = 
            selector
            ?
            // @see https://stackoverflow.com/a/59899999
            // how to pass arguments to .$eval()
            //   const now = moment().format('YYYY-MM-D');
            //   await page.$eval('#middleContent_txtEndDate', (el, now, foo) => {
            //      console.log(el, now, foo);
            //      return el.value = now;
            //   }, now, 'foo');
            await element.$eval (
              selector,
              ( node, attribute, ) =>
                ( node[ attribute ] && node[ attribute ].trim() )
                || node.getAttribute( attribute, ),
              attribute, // ...additional args
            )
            :
            // select the element handle as reference
            // @see https://stackoverflow.com/a/52829150
            await self.page.evaluate (
              ( node, attribute, ) =>
                ( node[ attribute ] && node[ attribute ].trim() )
                || node.getAttribute( attribute, ),
              element, attribute, // ...additional args
            );  
        } catch ( error ) {
          console.log( error.message, );
        }
      };
      results.push( result, );

      // limit number of results per page, if necessary
      if( !maxCountLimit ) continue;
      if( ++counter > maxCountLimit ) break;
    }
    
    // cleanup
    await self.browser.close();

    // console.log('(line 65) results\n', JSON.stringify( results, ));
    return results;
  }
}

module.exports = self;