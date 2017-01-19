/**
 * An example migration script for testing
 *
 *
 */
'use strict'

// dependencies
const Promise = require('bluebird')
const mongoose = require('mongoose')

const schemas = require('../schemas')
const config = require('../config')

const db = mongoose.connection  // this connection has been opened elsewhere, as if by magic...
const Customer = mongoose.model('Customer', schemas.customer)
mongoose.Promise = Promise


module.exports = {
    migrate: () => {
        return new Promise((resolve, reject) => {
            if (db.readyState !== 1) reject('db connection not open:', db.readyState)

            return Customer.create({ name: 'Hugh Jackman', netWorth: '100M', age: 48, country: 'Australia' })
                .then((doc) => {
                    resolve()
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },

    rollback: () => {
        return new Promise((resolve, reject) => {
            if (db.readyState !== 1) reject('db connection not available', db.readyState)

            return Customer.remove({ name: 'Hugh Jackman' })
                .then(doc => {
                    resolve()
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}
