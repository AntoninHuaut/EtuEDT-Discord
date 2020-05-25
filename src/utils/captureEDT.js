const puppeteer = require('puppeteer');
const sharp = require('sharp');
const config = require('../../config.json');
const fs = require('fs').promises;

exports.takeScreenshot = async function (edtId, folder, fileName) {
    try {
        const width = config.img.viewport.width;
        const height = config.img.viewport.height;

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox', `--window-size=${width},${height}`]
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: width,
            height: height
        });
        await page.goto(`${config.url.front}/edt/${edtId}`);
        try {
            await page.waitForSelector('.v-calendar', {
                visible: true
            });
        } catch (e) {}

        try {
            await fs.mkdir(folder);
        } catch {}

        await page.screenshot({
            path: `${folder}in-${fileName}`
        });

        await browser.close();
    } catch (ex) {
        console.error(ex)
    }
}

exports.resizeScreenshot = async function (folder, fileName) {
    try {
        await sharp(`${folder}in-${fileName}`).extract({
            left: config.img.resize.left,
            top: config.img.resize.top,
            width: config.img.resize.width,
            height: config.img.resize.height
        }).toFile(`${folder + fileName}`);

        fs.unlink(`${folder}in-${fileName}`);

        return `${folder + fileName}`;
    } catch (err) {
        console.error(err)
        return null;
    }
}