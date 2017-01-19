'use strict'

const mongoose = require('mongoose')


module.exports = {
    customer: mongoose.Schema({
        name: String,
        netWorth: String,
        age: String,
        nationality: String
    })
}
