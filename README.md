# cultivator


A tool for managing infrastructure migrations and rollbacks, storing the current state in MongoDB along the way.

At a high level:

1. Scripts are created and stored in a migrations directory. (this directory is configurable)
2. Each script has `migrate` and `rollback` functions, that can do anything a script can do. Seed data, add indexes etc.
3. Run `cultivator migrate 1.2.1` from the CLI will run the "migrate" script for version 1.2.1 of your application.
4. Run `cultivator rollback 1.2.1` from the CLI would rollback the changes made from this migration "version".


## Installation

```
$ npm i cultivator -S
```


## Usage

cultivator can be run from the `CLI` or `required` as a `module` into an existing application. See the `example`
directory for example migration/rollback scripts. Or look over the `test` directory.

### on the command line

To use cultivator from the CLI you will first need to set an environment variable to point to the location of the config
file.

```
$ export MIGRATIONS_CONFIG=./config.js

$ cultivator migrate 1.2.1
```

This would run the `migrate` script from the file `1.2.1.js` in the `migrations` directory that was defined in the `configuration file`
pointed to by the `MIGRATIONS_CONFIG` environment variable.


### require as a module

To use it directly from an application, first require the module:

```
npm i cultivator -S
```

Then from within your application.

```
const cultivator = require('cultivator')

const migrationVersion = '1.2.1'               // the name (version) of the migration to run
    
cultivator.run(migrationVersion, 'migrate')    // the second argument indicates the direction, either 'migrate' or 'rollback'
    .then(() => {
        console.log('done')
    })
    .catch(err => {
        console.log('Errro:', err)
    })
```

The migration scripts must return a promise.


## The Config File

The location of the configuration file used by `cultivator` is set in the environment variable `MIGRATIONS_CONFIG`. This
is relative to the requiring application's root directory.

Ths config file format is:

```
module.exports = {

  // the location of the migration scripts, relative to the applications root directory.
  migrationsDir: 'migrations'
  
}
```

## The Scripts

The scripts for migrating and rolling back are stored in the `migrations` folder (configured above). They are standard node.js
modules that export an object that contains two functions, `migrate` and `rollback`. These functions take no arguments and return
a promise, indicating success or failure.

```
module.exports = {
    migrate: () => {
        ...
        return Promise.resolve('done')
    },
    rollback: () => {
        ...
        return Promise.resolve('done')
    }
}
```

These scripts run standard javascript, so the possibilities of what can be managed is virtually limitless. Good candidates
are Seeding additional Data and managing indexes.

Ideally the script files are named to match up with the Semantic Versioning of your application. For example `1.2.1.js`
contains the migration scripts required for the application to be at version `1.2.1`. The downgrade script would be run
when the application is already at `1.2.1` and is being rolled back to `1.2.0`. 

This versioning of migration scripts can be broken down into smaller steps by adding a 4th digit to the file name 
(version). For example `1.2.1.1` and `1.2.1.2` being part A and part B of the `1.2.1` migration. This could be useful as
checkpoints to simplify the auto-rolling back of failed large and complex migrations.

## Testing

In order to run the tests, you need to have:

1. An instance of mongodb running at `localhost:27017`.
2. The environment variable `MIGRATIONS_CONFIG='test/config.js` must be set.

Tests can be run from `npm` like so:

```
$ npm t
```

Running them this way, automatically sets `MIGRATIONS_CONFIG` for the test environment. You only need MongoDB.


## PRIOR ART

This module was inspired by:
   * https://github.com/flashstockinc/mongoose-data-migrate
   
which is a fork of
   * https://github.com/madhums/mongoose-migrate

which is a fork of
   * https://github.com/tj/node-migrate


## Road Map

Currently this is very basic. But future enhancements are planned.

1. Add command line options processing so we don't need to define environment variables and configuration files when
   running via the CLI
2. Store the current migration in a DB, so we automatically calculate the scripts need to migrate/rollback to the target
   **version**.
3. Migrate more than one script forwards or backwards.
4. Based on the target **version**, automatically detect the direction, either `migrate` or `rollback`.
5. Use the CLI to auto-generate a stub migrations file.
6. Use the `version` from `package.json` as the destination to migrate/rollback to.
7. Allow for pre and post scripts for a target version.
