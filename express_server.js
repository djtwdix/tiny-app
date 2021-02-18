//require express
const { getUserIdByEmail } = require("./helpers/auth")
const express = require('express');
const app = express();
var cookieParser = require('cookie-parser');

//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const bodyParser = require("body-parser");
const PORT = 8080;

//Generate random string
const generateRandomString = () => {
  let randomString = Math.random().toString(36).substring(7);
  return randomString;
}

//mock database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const userDatabase = {
  "h49hf7": {
    "id": "h49hf7",
    "email": "example@example.com",
    "password": "examplepassword9",
  }
}

//Use bodyParser
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser())

app.use(express.static("public"));

//Sets view engine to ejs
app.set('view engine', 'ejs');

//Mock database lives at /urls.json
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/login", (req, res) => {
  res.render("login");
})

app.get("/register", (req, res) => {

  res.render("register");
})

app.get("/login", (req,res) => {
  res.render("login")
});

//My urls page, renders urls_index with urlDatabase as the 
//variable to populate the list
app.get("/urls", (req, res) => {
  const userInfo = userDatabase[req.cookies["user_id"]]
  const templateVars = { urls: urlDatabase, user: userInfo };
  res.render("urls_index", templateVars);
})

//Create new URL page, renders urls_new and has form to input longURL
app.get("/urls_new", (req, res) => {
  const userInfo = userDatabase[req.cookies["user_id"]]
  const templateVars = { user: userInfo}
  res.render("urls_new", templateVars);
})

//new route is created with shortURL path, renders urls_show
//displays longURL and shortURl (is link to longURL)
app.get("/urls/:shortURL", (req, res) => {
  const userInfo = userDatabase[req.cookies["user_id"]]
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: userInfo  }
  res.render("urls_show", templateVars);
})

//New route with /u/shortURL as path redirects to longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL)
})

//Takes input from form and generates shortURL
//Saves shortURL : longURL to database object
//redirects to new shortURL path which renders urls_show
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
})

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.updatedLongURL;
  res.redirect(`/urls/${shortURL}`);
})

app.post("/login", (req, res) => {
  const id = getUserIdByEmail(userDatabase, req.body.email)
  if (getUserIdByEmail(userDatabase, req.body.email) &&
  userDatabase[id]["password"] === req.body.password) {
      res.cookie("user_id", id);
      res.redirect("/urls");
    } else {
      res.sendStatus(403);
    }
})

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login")
})

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls')
})

app.post("/register2", (req, res) => {
  if (req.body.email === "" || req.body.password === "" || getUserIdByEmail(userDatabase, req.body.email)) {
    res.sendStatus(400);
    /* res.redirect("/register") */
  } else if (!getUserIdByEmail(userDatabase, req.body.email)) {
    const id = generateRandomString();
    userDatabase[id] = {
      "id": id,
      "email": req.body.email,
      "password": req.body.password
    }
    res.cookie("user_id", id)
    res.redirect("/urls")
  }
});

//Server listening on PORT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
