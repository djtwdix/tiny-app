//require express

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
  "djtwdix": "Ymmfltdix9",
}

//Use bodyParser
app.use(bodyParser.urlencoded({extended: true}))

app.use(cookieParser())

app.use(express.static("public"));

//Sets view engine to ejs
app.set('view engine', 'ejs');

//Mock database lives at /urls.json
app.get("/urls.json", (req,res) => {
  res.json(urlDatabase);
});

app.get("/landing", (req,res) => {
  res.render("landing-page")
})

//My urls page, renders urls_index with urlDatabase as the 
//variable to populate the list
app.get("/urls", (req,res) => {
  console.log(req.cookies)
  const templateVars = {urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_index", templateVars);
})

//Create new URL page, renders urls_new and has form to input longURL
app.get("/urls_new", (req,res) => {
  const templateVars = {username: req.cookies["username"]}
  res.render("urls_new", templateVars);
})

//new route is created with shortURL path, renders urls_show
//displays longURL and shortURl (is link to longURL)
app.get("/urls/:shortURL", (req,res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"]}
  res.render("urls_show", templateVars);
})

//New route with /u/shortURL as path redirects to longURL
app.get("/u/:shortURL", (req,res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL)
})

//Takes input from form and generates shortURL
//Saves shortURL : longURL to database object
//redirects to new shortURL path which renders urls_show
app.post("/urls", (req,res) => {
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
})

app.post("/urls/:shortURL", (req,res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.updatedLongURL;
  res.redirect(`/urls/${shortURL}`);
})

app.post("/login", (req,res) => {
  res.cookie("username", req.body.username)
  res.redirect("/urls")
})

app.post("/logout", (req,res) => {
  res.clearCookie("username");
  res.redirect("/urls")
})

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls')
})

//Server listening on PORT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
