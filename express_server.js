const { getUserIdByEmail } = require("./helpers/auth")
const { getURLSByID } = require("./helpers/permissions")
const express = require('express');
const app = express();
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
const PORT = 8080;

//Generate random string
const generateRandomString = () => {
  let randomString = Math.random().toString(36).substring(7);
  return randomString;
};

//mock database
const urlDatabase = {

};

const userDatabase = {

};

//USE

//bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

//cookie-session
app.use(cookieSession({
  name: "session",
  keys: ["Key 1", "Key 2"]
}));

//public folder for local static content
app.use(express.static("public"));

app.use(methodOverride('_method'))

//Sets view engine to ejs
app.set('view engine', 'ejs');



//GETS

//Mock urlDatabase lives at /urls.json
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//Mock userDatabase lives at /users.json
app.get("/users.json", (req, res) => {
  res.json(userDatabase);
});

//get login page
app.get("/login", (req, res) => {
  res.render("login");
});

//get register page
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/user_exists", (req, res) => {
  res.render("user_exists");
});

//URLs index
app.get("/urls", (req, res) => {
  //get user_id cookie and access user info in database by that cookie
  const userInfo = userDatabase[req.session.user_id];
  //userID is the user_id cookie
  const userID = req.session.user_id;
  //Get URLs associated with that userID
  const usersURLS = getURLSByID(urlDatabase, userID)
  //User urls and user info sent back for populating site with user specific content
  const templateVars = { urls: usersURLS, user: userInfo };
  res.render("urls_index", templateVars);
});

//create new URL page
app.get("/urls_new", (req, res) => {
  //get user_id cookie and access user info in database by that cookie
  const userInfo = userDatabase[req.session.user_id];
  //User info sent back for populating site with user specific content
  const templateVars = { user: userInfo };
  res.render("urls_new", templateVars);
});

//new route is created with shortURL path, renders urls_show
app.get("/urls/:shortURL", (req, res) => {
  //get userID from user_id cookie
  const userID = req.session.user_id;
  //shortURL comes from 
  const shortURL = req.params.shortURL;
  //get user info in database from userID
  const userInfo = userDatabase[userID];
  //Send back shortURL, longURL,the ID associated with URL and userInfo
  const templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL]["longURL"], urlID: urlDatabase[shortURL]["userID"], user: userInfo };
  res.render("urls_show", templateVars);
});

// u/shortURL as path redirects to longURL
app.get("/u/:shortURL", (req, res) => {
  //get longURL from database
  if (urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL]["longURL"];
    res.redirect(longURL);
  } else {
    res.sendStatus(400);
  }
});

//POSTS

//Takes input from form and generates shortURL
//Saves shortURL : longURL to database object
//redirects to new shortURL path which renders urls_show
app.post("/urls", (req, res) => {
  //Generate random string for shortURL
  const shortURL = generateRandomString();
  //id is user_id cookie
  const id = req.session.user_id;
  //If empty string is entered redirect to same page to try again
  if (req.body.longURL === "") {
    res.redirect("urls_new")
    //If something is entered, store it in urlDatabase under the shortURL key
  } else {
    urlDatabase[shortURL] = {
      "longURL": req.body.longURL,
      "userID": id
    }
    res.redirect(`/urls/${shortURL}`);
  }
});

//Edit longURL associated with shortURL
app.put("/urls/:shortURL", (req, res) => {
  //shortURL comes from req params
  const shortURL = req.params.shortURL;
  //id is user_id cookie
  const id = req.session.user_id;
  //get URLs associated with id
  const usersURLs = getURLSByID(urlDatabase, id);
  //if shortURL is from usersURLs update longURL
  if (usersURLs[shortURL]) {
    urlDatabase[shortURL] = {
      "longURL": req.body.updatedLongURL,
    }
  }
  res.redirect(`/urls/${shortURL}`);
});

//Login
app.post("/login", (req, res) => {
  //get id from database with email
  const id = getUserIdByEmail(userDatabase, req.body.email);
  //if id exists in database and passwords match redirect to urls index
  if (getUserIdByEmail(userDatabase, req.body.email) && bcrypt.compareSync(req.body.password, userDatabase[id]["password"])) {
    //set cookie 
    req.session.user_id = id;
    res.redirect("/urls");
    //or else send status 403
  } else {
    res.sendStatus(403);
  }
});

//delete cookies at logout and redirect to login page
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

//delete URL from database
app.delete("/urls/:shortURL/delete", (req, res) => {
  //id is user_id cookie
  const id = req.session.user_id;
  //get URLs associated with id
  const usersURLs = getURLSByID(urlDatabase, id);
  //if users URLs contains the shortURL set for deletion, execute deletion
  if (usersURLs[req.params.shortURL]) {
    delete urlDatabase[req.params.shortURL];
  }
  //If it's not the users URL redirect to urls index
  res.redirect('/urls');
});

//registration
app.post("/register2", (req, res) => {
  //if empty strings entered or user is already in database, return status code 400
  if (req.body.email === "" || req.body.password === "" || getUserIdByEmail(userDatabase, req.body.email)) {
    res.sendStatus(400);
    //otherwise allow the user to register
  } else if (!getUserIdByEmail(userDatabase, req.body.email)) {
    //id is a randomly generated string
    const id = generateRandomString();
    //inputted password is hashed and stored in variable
    const password = bcrypt.hashSync(req.body.password, 10);
    //popuate userDatabase with information
    userDatabase[id] = {
      "id": id,
      "email": req.body.email,
      "password": password,
    }
    //create cookie
    req.session.user_id = id; ("user_id", id);
    res.redirect("/urls");
  }
});

//Server listening on PORT
app.listen(PORT, () => {
  console.log(`TINYapp server listening on port ${PORT}`);
});
