const emailDoesNotExist = (userData, email) => {
  for (const user in userData) {
    const userEmail = userData[user]["email"]
    if (email === userEmail) {
      return null
    }
  }
  return email
}

module.exports = {
  emailDoesNotExist
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

console.log(emailDoesNotExist(userDatabase, "djtwd.ix@icsdsdloud.com")) */