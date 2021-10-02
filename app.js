const express = require('express')
const app = express()
const port = 3000

let nextId = 1;
const users = []
users.push({id: nextId++, name: "John"})
users.push({id: nextId++, name: "Paul"})
users.push({id: nextId++, name: "Anna"})

app.use(express.json())

const findUserByUserIdParam = (req) => {
    const userId = parseInt(req.params.userId);
    return users.find((user) => user.id === userId);
}

const getUserList = (req, res) => {
    res.json(users);
}

const createUser = (req, res) => {
    if (!req.body.name) {
        res.sendStatus(400)
        return
    }
    const newId = nextId++
    users.push({ id: newId, name: req.body.name })
    res.header('Location', 'http://localhost:3000/users/' + newId)
    res.status(201).send()
}

const getUserById = (req, res) => {
    const user = findUserByUserIdParam(req)
    if (!user) {
        res.sendStatus(404)
        return
    }
    res.json(user)
}

const updateUserById = (req, res) => {
    const user = findUserByUserIdParam(req)
    if (!user) {
        res.status(404).send()
        return
    }
    if (req.body.id !== user.id || !req.body.name) {
        res.status(400).send()
        return
    }
    user.name = req.body.name
    res.status(200).send()
}

const deleteUserById = (req, res) => {
    const user = findUserByUserIdParam(req)
    if (!user) {
        res.status(404).send()
        return
    }
    users.splice(users.indexOf(user), 1)
    res.status(200).send()
}

const methodNotAllowed = (allowedMethods) => {
    const allowedHeaderValue = allowedMethods.join(', ').toUpperCase()
    return (req, res) => {
        res.header('Allowed', allowedHeaderValue).status(405).send()
    }
}

app.route('/users')
    .get(getUserList)
    .post(createUser)
    .all(methodNotAllowed(['get', 'post']))

app.route('/users/:userId')
    .get(getUserById)
    .put(updateUserById)
    .delete(deleteUserById)
    .all(methodNotAllowed(['get', 'put', 'delete']))

app.listen(port, () => {
    console.log(`HTTP example app listening at http://localhost:${port}`)
})