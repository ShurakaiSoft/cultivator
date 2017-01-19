/**
 * An example migration script for testing
 *
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
