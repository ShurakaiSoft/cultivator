#!/usr/bin/env node
'use strict'

// dependencies
const cli = require('cli')

const migrator = require('../lib/migrator')


const USAGE =
    'cultivator [COMMANDS]\n' +
    '\n' +
    'Commands:\n' +
    '\n' +
    '  migrate version          migrate up\n' +
    '  rollback version         rollback down\n' +
    ''


if (!process.argv || process.argv.length === 0) {
    console.log(USAGE)
}

let action = process.argv[2]
let version = process.argv[3]

if (['migrate', 'rollback'].indexOf(action) === -1) {
    console.log(`${process.argv[2]} should be either migrate or rollback\n` + USAGE)
}

if (!version) {
    console.log(USAGE)
}

migrator.run(version, action)
    .then(() => {
        console.log('done');
        process.exit()
    })
    .catch(err => {
        console.log('Oh dear, we\'ve run into some unexpected issues with your script:', err)
        process.exit(1)
    })
