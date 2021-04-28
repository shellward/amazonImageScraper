// IMPORTS
const cheerio = require('cheerio'),
    request = require('request'),
    download = require('image-downloader'),
    fs = require('fs');

// PROCESS ARGS
const term = process.argv[2] ?? 'shoes';
const numberOfPages = process.argv[3] ?? 1,
    batchName = process.argv[4] ?? term;

console.log(process.argv)
// LOOP THROUGH PAGES WORTH OF RESULTS
for (pageNum = 1; pageNum < numberOfPages + 1; pageNum++) {

    //REQUEST
    request({
        method: 'GET',
        url: `https://www.amazon.com/s?k=${term}&page=${pageNum}`,
        gzip: true,
        headers:
            { "User-Agent": "Chrome /70.0.3538.77" }
    },
        (err, res, body) => {
            // ERR THROW ERR
            if (err) return console.error(err);

            let $ = cheerio.load(body);

            // GRAB IMAGES
            ($('div.a-section.a-spacing-none.s-image-overlay-black > div > span > a > div img').each(function (i, e) {
                //SET URL AND DEST
                options = {
                    url: `${e.attribs.src.replace('_AC_UL320_', '_AC_UL1280_')}`,
                    dest: `batch/${batchName}/${pageNum}_${i}.jpg`
                }

                console.log(options)
                // CREATE IF NOT EXISTS BATCH DIR
                if (!fs.existsSync(`batch`)) {
                    fs.mkdirSync(`batch`);
                }
                // CREATE IF NOT EXISTS BATCHNAME DIR
                if (!fs.existsSync(`batch/${batchName}`)) {
                    fs.mkdirSync(`batch/${batchName}`);
                }

                // DOWNLOAD IMAGE
                download.image(options)
                    // CONSOLE FILENAME
                    .then(({ filename }) =>
                        console.log(`file saved at ${filename}`))
                    // OR THROW
                    .catch((err) =>
                        console.error(err))
            }));
        });
}