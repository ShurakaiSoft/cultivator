'use strict'


// dependencies
const Promise = require('bluebird')
const requireDir = require('require-dir')


module.exports = {
    // limits
    // * runs just one script
    // * must be given the action (migrate, rollback)
    //
    // Features:
    // * finds script from a directory of scripts
    //
    run: (options) => {
        return new Promise((resolve, reject) => {
            let script

            // load scripts into hash
            const migrations = requireDir(options.migrationsDir)

            // check migration exists
            script = migrations[options.version][options.action]
            if (!script) reject('migration does not exist, skipping...')

            // run migration.
            script()
                .then(() => {
                    return resolve('done')
                })
                .catch((err) => {
                    console.log('Oh dear... something went horribly wrong:', err)
                })
        })
    }
}
