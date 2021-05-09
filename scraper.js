const config    = require( './config'  );
const puppeteer = require( 'puppeteer' ); // @see https://github.com/puppeteer/puppeteer

const { userAgent, WAIT, BROWSER, } = config;  // USER_AGENT,

const self = {
  browser: null,
  pages: null,

  // setup
  initialize: async targetUrl => {
    self.browser = await puppeteer.launch( BROWSER, );
    self.page = await self.browser.newPage();

    // set user-agent
    await self.page.setUserAgent( userAgent, ); // USER_AGENT,
    
    // navigate to target
    await self.page.goto( targetUrl, WAIT, );
  },

  getResults: async ( querySelectorAll, configSelectors, maxCountLimit, ) => {
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