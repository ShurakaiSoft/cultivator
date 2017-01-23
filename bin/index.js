#!/usr/bin/env node
'use strict'

// dependencies
const Promise = require('bluebird')
const cli = require('cli')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')

const migrator = require('../lib/migrator')

const MIGRATIONS_EXT = '.js'
const MIGRATIONS_DIRECTORY = './migrations'
const CURRENT_WORKING_DIRECTORY = '.'


Promise.promisifyAll(fs)
Promise.promisifyAll(mkdirp)



function createMigrationsStub(folder, version) {
    let baseName = version + MIGRATIONS_EXT

    console.log(`creating migrations stub '${baseName}' ...`)
    return Promise.all([
        mkdirp(folder),
        fs.readFileAsync(path.join(__dirname, '../lib/template.js'), 'utf8')
    ])
        .spread((dirOk, templateContent) => {
            return fs.writeFileAsync(path.join(folder, baseName), templateContent.replace(/\{\{version\}\}/g, version))
        })
        .then(() => {
            console.log('done')
            return cli.exit()
        })
        .catch(err => {
            console.log('Oh snap, something went wrong:', err)
            return cli.exit(1)
        })
}


cli.setUsage(
    'cultivator  [OPTIONS] [COMMANDS]\n' +
    '\n' +
    'Commands:\n' +
    '\n' +
    '  migrate version          migrate up\n' +
    '  rollback version         rollback down\n' +
    '  create version           create migrations script file stub\n' +
    ''
)


cli.parse({
    migrations: ['m', 'Folder containing migration scripts', 'string', MIGRATIONS_DIRECTORY],
    dir: ['d', 'Working folder', 'string', CURRENT_WORKING_DIRECTORY]
})


cli.main(function (args, options) {
    if (args.length === 0) return cli.getUsage(1)

    let cwd = options.dir ? path.resolve(options.dir) : process.cwd()
    let action = args[0]
    let version = args[1]
    let migrations = options.migrations

    if (['migrate', 'rollback', 'create'].indexOf(action) === -1) return cli.getUsage(1)
    if (!version) return cli.getUsage(1)
    if (path.resolve(migrations) !== migrations) {
        migrations = path.join(cwd, migrations)
    }

    if ('create' === action) {
        return createMigrationsStub(migrations, version)
    }

    console.log(`running ${action}: ${version}...`)
    migrator.run({migrationsDir: migrations, version: version, action: action})
        .then(() => {
            console.log('done');
            return cli.exit()
        })
        .catch(err => {
            console.log('Oh dear, we\'ve run into some unexpected issues with your script:', err)
            return cli.exit(1)
        })
})
