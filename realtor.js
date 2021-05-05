const config    = require( './config'  );
const puppeteer = require( 'puppeteer' ); // @see https://github.com/puppeteer/puppeteer

const { USER_AGENT, WAIT, BROWSER, slowMo, setDelay, } = config;

// selectors
const QUERY_SELECTOR_ALL = 'div.property-records-content table > tbody > tr';
const SELECTOR_ADDRESS
   = SELECTOR_LINK      = 'td:nth-child(1) > a'; 
const SELECTOR_STATUS    = 'td:nth-child(2)';
const SELECTOR_VALUE     = 'td:nth-child(3)';

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
    await self.page.waitForTimeout( slowMo, );
  },

  getResults: async () => {
    const elements = await self.page.$$( QUERY_SELECTOR_ALL, );
    
    let results = [];

    for ( const element of elements ) {

      const address = await element.$eval( SELECTOR_ADDRESS , node => node.innerText.trim());
      const link    = await element.$eval( SELECTOR_LINK    , node => node.href     .trim());
      const status  = await element.$eval( SELECTOR_STATUS  , node => node.innerText.trim());
      const value   = await element.$eval( SELECTOR_VALUE   , node => node.innerText.trim());

      // console.log( address, link, status, value, );

      const result = { address, link, status, value, };
      // console.log( JSON.stringify( result ),);

      results.push( result, );
    }
    
    // cleanup
    await self.browser.close();

    // console.log('(line 48) results\n', JSON.stringify( results, ));
    return results;
  }
}

module.exports = self;