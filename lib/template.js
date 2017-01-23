'use strict'

module.exports = {
    migrate: () => {
        console.log('applying migration {{version}}')
        // migrate forwards
        Promise.resolve()
    },

    rollback: () => {
        console.log('rolling back {{version}}')
        // stuff to undo the above migrate work
        Promise.resolve()
    }
}
