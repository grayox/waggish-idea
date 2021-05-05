const config    = require( './config'  );
const puppeteer = require( 'puppeteer' ); // @see https://github.com/puppeteer/puppeteer

const { USER_AGENT, WAIT, BROWSER, } = config;

const MAX_COUNT = 6;

// selectors
const QUERY_SELECTOR_ALL = '#siteTable > div[class*="thing"]';
const SELECTOR_TITLE       = 'p.title';
// const SELECTOR_RANK        = 'p.rank';
// const SELECTOR_POST_TIME   = 'p.tagline > time';
const SELECTOR_AUTHOR_URL 
   = SELECTOR_AUTHOR_NAME = 'p.tagline > a.author';
const SELECTOR_SCORE       = 'div.score.likes';
// const SELECTOR_COMMENTS    = 'a[data-event-action="comments"]';


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
    const elements = await self.page.$$( QUERY_SELECTOR_ALL, );
    let results = [];
    let counter = 0;

    for ( const element of elements ) {
      
      const title      = await element.$eval( SELECTOR_TITLE       , node => node.innerText.trim());
      // const rank       = await element.$eval( SELECTOR_RANK        , node => node.innerText.trim());
      // const postTime   = await element.$eval( SELECTOR_POST_TIME   , node => node.innerText.trim());
      const authorUrl  = await element.$eval( SELECTOR_AUTHOR_URL  , node => node.href     .trim());
      const authorName = await element.$eval( SELECTOR_AUTHOR_NAME , node => node.innerText.trim());
      const score      = await element.$eval( SELECTOR_SCORE       , node => node.innerText.trim());
      // const comments   = await element.$eval( SELECTOR_COMMENTS    , node => node.innerText.trim());

      // console.log( title, authorUrl, authorName, score, );

      const result = {
        // rank, postTime, comments,
        title, authorUrl, authorName, score,
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