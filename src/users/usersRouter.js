const express = require('express'); 
const usersRouter = express.Router(); 
const jsonParser = express.json(); 
const usersService = require('./usersService');

usersRouter
    .route('/api/users')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')

        usersService.getAllUsers(knexInstance)
            .then(users => {
                if(!users) {
                    return res.status(404).json({
                        error: { message: 'no users found' }
                    })
                }
                return res.json({
                    users
                })
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')

        const { email, username, password } = req.body; 

        if (!email) {
            return res
                .status(400)
                .send('Email is required')
        }; 

        if (!username) {
            return res
                .status(400)
                .send('Username is required')
        }; 

        if (!password) {
            return res
                .status(400)
                .send('Password is required')
        }; 

        if (password.length < 6) {
            return res
                .status(400)
                .send('Password must be at least 6 characters long')       
        }; 

        if (!password.match(/[A-Z]/)) {
            return res
                .status(400)
                .send('Password must include one uppercase letter')
        }; 

        if (!password.match(/\d+/g)) {
            return res  
                .status(400)
                .send('Password must include one number' )
        }; 

        const newUser = {
            email: email.toLowerCase(), 
            username: username.toLowerCase(), 
            password: password, 
            profile_img: "user-icon.png", 
            images: '[]'
        }

        // email TEXT NOT NULL, 
        // username TEXT NOT NULL, 
        // password TEXT NOT NULL, 
        // profile_img TEXT, 
        // images json

        // return res.json(newUser)

        usersService.insertUser(knexInstance, newUser)
            .then(user => {
                return res
                    .status(201)
                    .location(`/api/users/${user.id}`)
                    .json(user)
            })
            .catch(next)
    })

usersRouter
    .route('/api/users/:id')
    .get((req, res, next) => {

        const { id } = req.params;

        const knexInstance = req.app.get('db');

        usersService.getById(knexInstance, id)
            .then(user => {
                if (!user) {
                    return res
                        .status(404)
                        .send('User not found')
                }; 

                return res.json(user)
            })
            .catch(next)

    })
    .delete((req, res, next) => {
        const { id } = req.params; 

        const knexInstance = req.app.get('db'); 

        usersService.deleteUser(knexInstance, id)
            .then(() => {
                return res
                    .status(204).end()
            })

    })
    .patch(jsonParser, (req, res, next) => {

        const { id, email, username, password, profile_img, images } = req.body; 

        const strImages = JSON.stringify(images); 

        const updatedUser = {
            id: id, 
            email: email, 
            username: username, 
            password: password, 
            profile_img: profile_img,
            images: strImages
            // images: '[{"name": "Bowie-1", "dateAdded": "Wed June 2 02:00:00 GMT-0700 (Pacific Daylight Time)"}]'
            // images: `${images}`
        }; 

        const knexInstance = req.app.get('db')

        console.log(JSON.stringify(images))

        usersService.updateUser(knexInstance, id, updatedUser)
            .then(user => {
                // console.log(user)
                if (!user) {
                    return res
                        .status(404)
                        .send('user not found')
                }
                return res.json(user)
            })
            .catch(next)

        // "id": 2,
        // "email": "helmutnewton@gmail.com",
        // "username": "h_newton",
        // "password": "Newtonhelmut1",
        // "profile_img": "",
        // "images": {}
    })

usersRouter
    .route('/api/login')
    .get((req, res) => {

        const { input, password } = req.headers;
        
        const knexInstance = req.app.get('db'); 

        usersService.getByUsernameAndPassword(knexInstance, input.toLowerCase(), password) 
            .then(user => {
                if (!user) {
                    usersService.getByEmailAndPassword(knexInstance, input.toLowerCase(), password)
                        .then(user => {
                            if (!user) {
                                return res.status(404).send('user not found')
                            } else {
                                return res.json(user)
                            }
                        })
                } else {
                    return res.json(user)
                }
            })
    })

module.exports = usersRouter; 