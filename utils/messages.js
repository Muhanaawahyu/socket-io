const moment = require('moment');

const formatMessage = (id, username, msg) => {
    return {
        id,
        username,
        msg,
        time: moment().format('dddd, HH:mm')
    };
};

module.exports = formatMessage;