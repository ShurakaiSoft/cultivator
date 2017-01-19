'use strict'


// dependencies
const Promise = require('bluebird')
const requireDir = require('require-dir')
const path = require('path')

// locate configuration file
const config = require(path.join(process.cwd(), process.env.MIGRATIONS_CONFIG))


// hash of all migration scripts
const migrations = requireDir(config.migrationsDir)


module.exports = {
    // limits
    // * runs just one script
    // * must be given the direction (migrate, rollback)
    //
    // Features:
    // * finds script from a directory of scripts
    //
    run: (version, direction) => {
        let script

        return new Promise((resolve, reject) => {
            // check migration exists
            script = migrations[version][direction]
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
