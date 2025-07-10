const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
  const { id = '5062' } = req.query;
  const url = `https://macizlevip315.shop/wp-content/themes/ikisifirbirdokuz/match-center.php?id=${id}`;

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    let m3u8Url = null;

    page.on('response', async (response) => {
      const reqUrl = response.url();
      if (reqUrl.includes('.m3u8') && reqUrl.includes('chunklist')) {
        m3u8Url = reqUrl;
      }
    });

    await page.goto(url, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3000));

    await browser.close();

    if (m3u8Url) {
      res.status(200).send(m3u8Url);
    } else {
      res.status(404).send('m3u8 yayın linki bulunamadı.');
    }
  } catch (error) {
    res.status(500).send('Hata: ' + error.message);
  }
};
