module.exports = (input, every = true) => {
    let sec = input;
    // convert seconds to minutes
    let min = sec / 60;
    // convert minutes to hours
    let hour = min / 60;
    // convert hours to days
    let day = hour / 24;
    // convert days to weeks
    let week = day / 7;
    // convert weeks to months
    let month = week / 4;
    if (every === true) {
        if (sec < 60) {
            return `*/${sec} * * * * *`;
        } else if (sec >= 60 && sec < 3600) {
            if((sec - min * 60)==0){
                return `*/${Math.floor(min)} * * * *`;
            }
            return `*/${sec - min * 60} */${Math.floor(min)} * * * *`;
        } else if (sec >= 3600 && sec < 86400) {
            return `*/${sec - min * 60} */${Math.floor(min - hour * 24)} */${Math.floor(hour)} * * *`;
        } else if (sec >= 86400 && sec < 604800) {
            return `*/${sec - min * 60} */${Math.floor(min - hour * 24)} */${Math.floor(hour - day * 7)} */${Math.floor(day)} * *`;
        } else if (sec >= 604800 && sec < 29030400) {
            return `*/${sec - min * 60} */${Math.floor(min - hour * 24)} */${Math.floor(hour - day * 7)} */${Math.floor(day - week * 4)} */${Math.floor(month)} *`;
        } else {
            return "this value is too large";
        }
    } else if (every === false) {
        if (sec < 60) {
            return `*${sec} * * * * *`;
        } else if (sec >= 60 && sec < 3600) {
            return `*${sec - min * 60} *${Math.floor(min)} * * * *`;
        } else if (sec >= 3600 && sec < 86400) {
            return `*${sec - min * 60} *${Math.floor(min - hour * 24)} *${Math.floor(hour)} * * *`;
        } else if (sec >= 86400 && sec < 604800) {
            return `*${sec - min * 60} *${Math.floor(min - hour * 24)} *${Math.floor(hour - day * 7)} *${Math.floor(day)} * *`;
        } else if (sec >= 604800 && sec < 29030400) {
            return `*${sec - min * 60} *${Math.floor(min - hour * 24)} *${Math.floor(hour - day * 7)} *${Math.floor(day - week * 4)} *${Math.floor(month)} *`;
        } else {
            return "this value is too large";
        }
    }

}