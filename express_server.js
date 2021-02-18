//require express
const { getUserIdByEmail } = require("./helpers/auth")
const { getURLSByID } = require("./helpers/permissions")
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

};

const userDatabase = {

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
  const userInfo = userDatabase[req.cookies["user_id"]];
  const userID = req.cookies["user_id"];
  const usersURLS = getURLSByID(urlDatabase, userID)
  console.log("getURlsbyID: ", getURLSByID(urlDatabase, userID))
  console.log(urlDatabase);
  const templateVars = { urls: usersURLS, user: userInfo };
  console.log("url index template vars: ", templateVars)
  res.render("urls_index", templateVars);
})

//Create new URL page, renders urls_new and has form to input longURL
app.get("/urls_new", (req, res) => {
  const userInfo = userDatabase[req.cookies["user_id"]];
  const templateVars = { user: userInfo};
  res.render("urls_new", templateVars);
})

//new route is created with shortURL path, renders urls_show
//displays longURL and shortURl (is link to longURL)
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies["user_id"]
  const shortURL = req.params.shortURL
  const userInfo = userDatabase[userID]
  const templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL]["longURL"], urlID: urlDatabase[shortURL]["userID"], user: userInfo  }
  console.log("new url template vars: ", templateVars)
  console.log("tempVars shortURL: ", templateVars["shortURL"]);
  res.render("urls_show", templateVars);
})

//New route with /u/shortURL as path redirects to longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  console.log("LongURL: ", longURL)
  res.redirect(longURL)
})

//Takes input from form and generates shortURL
//Saves shortURL : longURL to database object
//redirects to new shortURL path which renders urls_show
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString()
  const id = req.cookies["user_id"];
  urlDatabase[shortURL] = {
    "longURL": req.body.longURL,
    "userID": id
  }
  console.log("urls post:", urlDatabase)
  res.redirect(`/urls/${shortURL}`);
})

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const id = req.cookies["user_id"]
  const usersURLs = getURLSByID(urlDatabase, id);
  if (usersURLs[shortURL]) {
    urlDatabase[shortURL] = {
      "longURL": req.body.updatedLongURL,
    }
  }
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
  const id = req.cookies["user_id"]
  const usersURLs = getURLSByID(urlDatabase, id);
  console.log("usersURLS: ", usersURLs);
  if (usersURLs[req.params.shortURL]) {
    delete urlDatabase[req.params.shortURL];
  }
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
