//modul yang harus digunakan
const jwt = require("jsonwebtoken")
const fs = require("fs")
const express = require("express")
const app = express()

app.use(express.urlencoded({ extended: true }))


// Routing Login dan get data teachers

app.post("/login-user", (req, res) => {
  const { username, password } = req.body

  const data_users = fs.readFileSync("./data/users.json", "utf-8")
  const parsingUsers = JSON.parse(data_users)

  const foundedUser = parsingUsers.find((user) => user.username === username)
  if (foundedUser && foundedUser.password === password) {
    res.send("Login Berhasil")
    const data = {
      username: foundedUser.username,
      password: foundedUser.password,
    }
    jwt.sign(
      {
        data: data,
      },
      "secret",
      (err, token) => {
        console.log(`Token: ${token}`)
      }
    )
  } else if (foundedUser && foundedUser.password !== password) {
    res.send("Password Tidak Valid")
  } else {
    res.send("Data tidak valid!")
  }
})


const verification = (req, res, next) => {
  let getHeader = req.headers["auth"]
  if (typeof getHeader !== "undefined") {
    req.token = getHeader
    next()
  } else {
    res.sendStatus(403)
  }
}


// Routing get data teachers
app.get("/teachers-data", verification, (req, res) => {
  jwt.verify(req.token, "secret", (err, auth) => {
    if (err) {
      res.sendStatus(403)
    } else {
      const users = fs.readFileSync("./data/teachers.json", "utf-8")
      const usersParsing = JSON.parse(users)
      res.json(usersParsing)
    }
  })
})

app.listen(3000, () => {
  console.log("Listening at http://localhost:3000")
})
