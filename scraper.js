const config    = require( './config'  );
const puppeteer = require( 'puppeteer' ); // @see https://github.com/puppeteer/puppeteer

const { USER_AGENT, WAIT, BROWSER, } = config;

const MAX_COUNT = 6;

const self = {
  browser: null,
  pages: null,

  // setup
  initialize: async targetUrl => {
    self.browser = await puppeteer.launch( BROWSER, );
    self.page = await self.browser.newPage();

    // set user-agent
    await self.page.setUserAgent( USER_AGENT, );
    
    // navigate to target
    await self.page.goto( targetUrl, WAIT, );
  },

  getResults: async ( querySelectorAll, configSelectors, ) => {
    const elements = await self.page.$$( querySelectorAll, );
    let results = [];
    let counter = 0;

    for ( const element of elements ) {
      const result = {};
      // CONFIG_SELECTORS.forEach( async ([ propertyName, selector, attribute, ]) => { // fails
      // .forEach() throws, use regular for loop instead
      for ( const [ propertyName, selector, attribute, ] of configSelectors ) {
        result[ propertyName ] = await element.$eval (
          selector,
          ( node, attribute, ) => node[ attribute ].trim(),
          attribute,
        );
      };
      results.push( result, );
      if( counter++ > MAX_COUNT ) break;
    }
    
    // cleanup
    await self.browser.close();

    // console.log('(line 65) results\n', JSON.stringify( results, ));
    return results;
  }
}

module.exports = self;