// IMPORTS
const cheerio = require('cheerio'),
    request = require('request'),
    download = require('image-downloader'),
    fs = require('fs');

// PROCESS ARGS
const term = process.argv[2] ?? 'shoes';
const numberOfPages = process.argv[3] ?? 1,
    batchName = process.argv[4] ?? term;

// REQUEST OPTS
let options = {
    method: 'GET',
    url: `https://www.amazon.com/s?k=${term}${numberOfPages > 1 ? '&page=' + numberOfPages : ''}`,
    gzip: true,
    headers:
        { "User-Agent": "Chrome /70.0.3538.77" }
}

// LOOP THROUGH PAGES WORTH OF RESULTS
for (pageNum = 1; pageNum < parseInt(numberOfPages) + 1; pageNum++) {


    //REQUEST
    request(options,
        (err, res, body) => {
            // ERR THROW ERR
            if (err) return console.error(err);

            let $ = cheerio.load(body);

            // GRAB IMAGES
            ($('a > div img').each((i, e) => {

                // GUARD CLAUSE AGAINST TINY IMGS
                if (e.attribs.height < 2 &&
                    e.attribs.width < 2) { return }

                // SET URL AND DEST
                options = {
                    url: `${e.attribs.src.replace('_AC_UL320_', '_AC_UL1280_')}`,
                    dest: `batch/${batchName}/${pageNum}_${i}.jpg`
                }

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
