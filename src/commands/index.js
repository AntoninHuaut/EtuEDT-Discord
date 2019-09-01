const config = require('../../config.json');

module.exports = (msg) => {
    const content = msg.content.slice(config.discord.prefix.length).trim();

    if (!content) require('./listEdt')(msg);
    else if (content == 'info') require('./general').info(msg);
    else if (content == 'url') require('./general').url(msg);
    else require('./showEdt')(msg, content);
}