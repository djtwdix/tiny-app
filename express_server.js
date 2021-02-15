const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const PORT = 8080;

const generateRandomString = () => {
  let randomString = ""
  let alphaNum = '123456789abcdefghijklmnopqrstuvwxyz'
  for (let i = 0; i < 6; i++) {
  	randomString += alphaNum[Math.round(Math.random() * (alphaNum.length - 1))];
  }
  return randomString;
}


app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req,res) => {
  res.send("Hello!")
})

app.get("/urls.json", (req,res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req,res) => {
  const templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars);
})

app.get("/urls_new", (req,res) => {
  res.render("urls_new");
})

app.get("/urls/:shortURL", (req,res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase.shortURL}
  res.render("urls_show", templateVars);
})

app.post("/urls", (req,res) => {
  console.log(req.body);
  res.send("Ok");
})

app.get("/hello", (req,res) => {
  res.send("<html><body>Hello<b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})