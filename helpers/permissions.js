//Function takes in urlDatabase and an ID key, returns the URLs associated with that ID

const getURLSByID = (urlData, ID) => {
  emptyObject = {};
  for (const user in urlData) {
    if (urlData[user]["userID"] === ID) {
      emptyObject[user] = urlData[user]["longURL"];
    }
  }
  return emptyObject
}

module.exports = {
  getURLSByID
}