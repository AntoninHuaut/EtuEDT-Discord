const playwright = require('playwright');
const sharp = require('sharp');
const config = require('../../config.json');
const fs = require('fs').promises;

exports.takeScreenshot = async function (edtId, folder, fileName) {
    const browser = await playwright['firefox'].launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setViewportSize({
        width: config.img.viewport.width,
        height: config.img.viewport.height
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