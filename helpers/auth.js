const getUserIdByEmail = (userData, email) => {
  for (const user in userData) {
    const userEmail = userData[user]["email"]
    if (email === userEmail) {
      return user
    }
  }
  return null
}

module.exports = {
  getUserIdByEmail
}

//test

/* const userDatabase = {
  "h49hf7": {
    "id": "h49hf7",
    "email": "example@example.com",
    "password": "examplepassword9",
  },
  "tk6199": { 
    "id": 'tk6199', 
    "email": 'djtwd.ix@icloud.com', 
    "password": 'asdasd',
  }
}

console.log(getUserIdByEmail(userDatabase, "djtwd.ix@icloud.com")) */