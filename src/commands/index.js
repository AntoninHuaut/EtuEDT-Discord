const config = require('../../config.json');

module.exports = (msg) => {
    const content = msg.content.slice(config.discord.prefix.length).trim();

    if (!content) require('./listEdt')(msg);
    else if (content.startsWith('info')) require('./general').info(msg);
    else if (content.startsWith('url')) require('./general').url(msg);
    else if (content.startsWith('me')) require('./general').me(msg, content);
    else require('./showEdt').cmd(msg, content);
}