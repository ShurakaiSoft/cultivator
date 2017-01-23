'use strict'


// dependencies
const mongoose = require('mongoose')
const Promise = require('bluebird')
const expect = require('chai').expect

const config = require('./config')
const schemas = require('./schemas')


// module under test
const migrator = require('../lib/migrator')


describe('The migrator module:', function () {
    let db
    let Customer

    before(function () {
        return new Promise((resolve, reject) => {
            mongoose.connect(config.dbUrl)
            db = mongoose.connection

            db.on('error', reject)
            db.on('open', function () {
                Customer = mongoose.model('Customer', schemas.customer)
                resolve()
            })
            db.on('SIGINT', function () {
                console.log('connection interrupted')
                return db.close()
                    .then(() => {
                        console.log('Mongoose disconnect on app termination')
                    })
            })
        })
    })

    after(function () {
        return db.close && db.close()
                .then(() => {
                    console.log('Mongoose disconnecting on app exit')
                })
    })

    describe('The run() function:', function () {

        beforeEach(function () {
            return Customer.remove({})
        })

        describe('WHEN direction is migrate', function () {
            it('should run the given migrations `migrate` script', function () {
                return migrator.run({ migrationsDir: config.migrationsDir, version: '0.1.0', action: 'migrate' })
                    .then(() => {
                        return Customer.find({}).lean()
                    })
                    .then(docs => {
                        expect(docs.length).to.equal(1)
                    })
            })
        })

        describe('WHEN direction is rollback', function () {
            it('should run the given migrations `rollback` script', function () {
                return Customer.create({ name: 'Hugh Jackman', netWorth: '100M', age: 48, nationality: 'Australian' })
                    .then(() => {
                        return migrator.run({ migrationsDir: config.migrationsDir, version: '0.1.0', action: 'rollback' })
                    })
                    .then(() => {
                        return Customer.find({}).lean()
                    })
                    .then(docs => {
                        expect(docs.length).to.equal(0)
                    })
            })
        })
    })

})
