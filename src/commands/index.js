const config = require('../../config.json');

module.exports = (msg) => {
    const content = msg.content.slice(config.discord.prefix.length).trim();

    msg.delete().catch(err => {});

    if (!content) require('./general').info(msg);
    else if (content.startsWith('list')) require('./listEdt')(msg);
    else if (content.startsWith('me')) require('./general').me(msg, content);
    else require('./showEdt').cmd(msg, content);
}