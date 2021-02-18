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