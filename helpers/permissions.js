const getURLSByID = (userData, ID) => {
  emptyObject = {};
  for (const user in userData) {
    if (userData[user]["userID"] === ID) {
      emptyObject[user] = userData[user]["longURL"];
    }
  }
  return emptyObject
}

module.exports = {
  getURLSByID
}

/* const userData = {
"h7hh37": {
  longURL: 'https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application',
  userID: 'rv7hi4'
},
"h7sdf37": {
  longURL: 'https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application',
  userID: 'rv7hi4'
},
"h7hsd7": {
  longURL: 'https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application',
  userID: 'rv7hi4'
},
"h7hsd7": {
  longURL: 'https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application',
  userID: 'rsdfddd'
},
"h7asd7": {
  longURL: 'https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application',
  userID: 'rsdfddd'
}
}

console.log(getURLSByID(userData, 'rv7hi4')); */