module.exports = {
    func: {
        Number: {
            random: max => {
                return Math.floor(Math.random() * max);
            }
        }
    },
    log: {
        log: content => {
            console.log(`[LOG] ${content}`);
        },
        warn: content => {
            console.log(`\x1B[33m[WARN]\x1B[0m ${content}`);
        },
        err: content => {
            console.log(`\x1B[31m[ERROR]\x1B[0m ${content}`);
        },
        error: content => {
            console.log(`\x1B[31m[ERROR]\x1B[0m ${content}`);
        },
        success: content => {
            console.log(`\x1B[32m[SUCCESS]\x1B[0m ${content}`);
        }
    }
};