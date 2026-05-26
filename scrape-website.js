const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to https://Vishvatechnologies.com...');
    await page.goto('https://Vishvatechnologies.com', { waitUntil: 'networkidle2', timeout: 60000 });
    
    console.log('Waiting for content to load...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Extract logo URL
    const logoUrl = await page.evaluate(() => {
      const logoImg = document.querySelector('img[alt*="Vishva" i], img[alt*="logo" i], .logo img');
      return logoImg ? logoImg.src : null;
    });
    
    console.log('Logo URL:', logoUrl);
    
    if (logoUrl) {
      const fs = require('fs');
      const response = await page.goto(logoUrl);
      const buffer = await response.buffer();
      fs.writeFileSync('public/assets/logo.png', buffer);
      console.log('Logo saved to public/assets/logo.png');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
