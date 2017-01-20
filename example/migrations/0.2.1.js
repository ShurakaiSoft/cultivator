/**
 * An example migration script for testing
 *
 *  1. Migration files are named to match the version of your application as defined in your package.json file.
 *  2. Migration files export an object containing two functions: 'migrate' and 'rollback'.
 *  3. The migrate script runs when the target version is <= this version.
 *  4. The rollback script runs when the rollback target is < this version
 *  5. If the migrate script fails, it is responsible for rewinding any partially applied migrations, so the state of the
 *     system is as if the migration never ran.
 *  6. If a rollback fails.... ????? need to crash with some logging details, a human will most likely be required to
 *     sort out this messy state....
 *  7. Scripts when successful, should return a resolved promise.
 *  8. If a script fails, after undoing stuff it should return a rejected promise.
 *
 */
'use strict'

// dependencies
const Promise = require('bluebird')
const mongoose = require('mongoose')

const dbUrl = 'mongodb://localhost/cultivator_example'

mongoose.Promise = Promise
const customerSchema = {
    name: String,
    balance: String
}
const Customer = mongoose.model('Customer', customerSchema)


module.exports = {
    migrate: () => {
        return new Promise((resolve, reject) => {
            let db

            mongoose.connect(dbUrl)
            db = mongoose.connection
            db.on('error', reject)
            db.on('open', () => {
                return Customer.create({name: 'Chris Hemsworth', balance: '71000000'})
                    .then((doc) => {
                        resolve()
                    })
                    .catch((err) => {
                        reject(err)
                    })
                    .finally(() => {
                        db.close()
                    })
            })
        })
    },

    rollback: () => {

        return new Promise((resolve, reject) => {
            let db

            mongoose.connect(dbUrl)
            db = mongoose.connection
            db.on('error', reject)
            db.on('open', () => {
                return Customer.remove({name: 'Chris Hemsworth'})
                    .then(doc => {
                        resolve()
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        })
    }
}
