// getAllUsers, insertUser, getById, deleteUser, updateUser, getByUsernameAndPassword, getByEmailAndPassword

const usersService = {
    getAllUsers(knex) {
        return knex.select('*').from('users')
    }, 
    insertUser(knex, newUser) {
        return knex
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }, 
    getById(knex, id) {
        return knex.select('*').from('users').where('id', id).first()
    }, 
    deleteUser(knex, id) {
        return knex('users')
            .where({ id })
            .delete()
    },
    updateUser(knex, id, newUserFields) {
        return knex('users')
            .where({ id })
            .update(newUserFields)
            .returning('*')
            .where('id', id)
    }, 
    getByUsernameAndPassword(knex, username, password) {
        return knex.select('*').from('users').where('username', username).andWhere('password', password).first()
    }, 
    getByEmailAndPassword(knex, email, password) {
        return knex.select('*').from('users').where('email', email).andWhere('password', password).first()
    }
}

module.exports = usersService