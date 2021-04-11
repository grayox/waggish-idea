const config    = require( './config'  );
const puppeteer = require( 'puppeteer' ); // @see https://github.com/puppeteer/puppeteer

const { USER_AGENT, WAIT, BROWSER, } = config;

// selectors
const QUERY_SELECTOR_ALL = 'table.StreetList > tbody > tr'; // #StreetList
const SELECTOR_LINK      = 'td > div[ itemprop="address" ] > a'; // 'td:nth-child(1)'
const SELECTOR_STREET    = `${ SELECTOR_LINK } > span[ itemprop="streetAddress"   ]`;
const SELECTOR_CITY      = `${ SELECTOR_LINK } > span[ itemprop="addressLocality" ]`;
const SELECTOR_STATE     = `${ SELECTOR_LINK } > span[ itemprop="addressRegion"   ]`;
const SELECTOR_ZIP       = `${ SELECTOR_LINK } > span[ itemprop="postalCode"      ]`;
const SELECTOR_SQFT      = 'td:nth-child(2)';
const SELECTOR_BED       = 'td:nth-child(3)';
const SELECTOR_BATHS     = 'td:nth-child(4)';
const SELECTOR_VALUE     = 'td.estvalue'; // 'td:nth-child(5)'

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

  getResults: async () => {
    // debugger;
    const elements = await self.page.$$( QUERY_SELECTOR_ALL, );
    
    let results = [];

    for ( const element of elements ) {

      const link    = await element.$eval( SELECTOR_LINK    , node => node.href     .trim());
      const street  = await element.$eval( SELECTOR_STREET  , node => node.innerText.trim());
      const city    = await element.$eval( SELECTOR_CITY    , node => node.innerText.trim());
      const state   = await element.$eval( SELECTOR_STATE   , node => node.innerText.trim());
      const zip     = await element.$eval( SELECTOR_ZIP     , node => node.innerText.trim());
      const sqft    = await element.$eval( SELECTOR_SQFT    , node => node.innerText.trim());
      const bed     = await element.$eval( SELECTOR_BED     , node => node.innerText.trim());
      const baths   = await element.$eval( SELECTOR_BATHS   , node => node.innerText.trim());
      const value   = await element.$eval( SELECTOR_VALUE   , node => node.innerText.trim());

      console.log( link, street, city, state, zip, sqft, bed, baths, value, );

      const result = { link, street, city, state, zip, sqft, bed, baths, value, };
      console.log( JSON.stringify( result ),);

      results.push( result, );
    }
    
    // cleanup
    await self.browser.close();

    // console.log('(line 48) results\n', JSON.stringify( results, ));
    return results;
  }
}

module.exports = self;