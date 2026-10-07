import express from 'express'
import cookieParser from 'cookie-parser'
import { todoService } from './services/todo.service.js'
import { userService } from './services/users.service.js'
import { authService } from './services/auth.service.js'

const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// app.get('/', (req, res) => res.send('Hello there'))

app.set('query parser', 'extended') // allow sending arrays and objects in query params

app.listen(3030, () => console.log('Server ready at port 3030'))

app.get('/api/todo', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        importance: +req.query.importance || 0,
    }

    todoService.query(filterBy)
        .then(todosInfo => res.send(todosInfo))
        .catch(err => res.status(400).send('Cannot get bugs'))
})


app.put('/api/todo/:todoId', (req, res) => {
    // const loggedinUser = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Not Authenticated')

    const { createdAt, importance, txt, _id, isDone, nextTodoId, prevTodoId } = req.body

    if (!_id || !txt || !importance) return res.status(400).send('Missing required fields')

    const todo = {
        createdAt: createdAt,
        importance: +importance,
        txt,
        nextTodoId,
        prevTodoId,
        isDone,
        _id,
    }


    todoService.save(todo)
        .then(savedTodo => res.send(savedTodo))
        .catch(err => res.status(400).send('Cannot save todos'))
})

app.post('/api/todo/', (req, res) => {
    // const loggedinUser = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Not Authenticated')

    const { importance, txt, isDone } = req.body
    console.log('importance', importance)
    console.log('txt', txt)
    console.log('isDone', isDone)
    if (!importance || !txt) return res.status(400).send('Missing required fields')

    const todo = {
        txt,
        importance: +importance || 1,
        isDone: isDone || false,
    }

    todoService.save(todo)
        .then(savedTodo => res.send(savedTodo))
        .catch(err => res.status(400).send('Cannot create a bug'))
})

app.get('/api/todo/:todoId', (req, res) => {
    const { todoId } = req.params
    // const visitedBugs = req.cookies.visitedBugs || []

    // // TODO: Change cookie so when limit is hit the user can still visit already visited bugs
    // if (!visitedBugs.includes(todoId)) {
    //     if (visitedBugs.length >= 3) {
    //         return res.status(401).send('Wait for a bit')
    //     } else {
    //         visitedBugs.push(todoId)
    //     }
    // }

    // res.cookie('visitedBugs', visitedBugs, { maxAge: 7 * 1000 })

    todoService.get(todoId)
        .then(todo => res.send(todo))
        .catch(err => res.status(400).send('Cannot find bug'))
})

app.delete('/api/todo/:todoId/', (req, res) => {
    // const loggedinUser = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Not Authenticated')

    const { todoId } = req.params

    todoService.remove(todoId)
        .then(todo => res.send(todo))
        .catch(err => res.status(400).send(err))

})


// Auth 
app.post('/api/auth/signup', (req, res) => {
    const { username, password, fullname } = req.body
    const user = { username, password, fullname }

    userService.add(user)
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => res.status(400).send('Username taken'))

})

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body

    authService.checkLogin({ username, password })
        .then(user => {
            console.log('user', user)
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(() => res.status(404).send('Cannot sign in'))
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})


// Users

app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => res.status(400).send('Cannot get users'))
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => res.status(400).send('Cannot find user'))
})

app.delete('/api/user/:userId/', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Not Authenticated')

    const { userId } = req.params

    userService.remove(userId, loggedinUser)
        .then(bug => res.send(bug))
        .catch(err => res.status(400).send(err))

})
