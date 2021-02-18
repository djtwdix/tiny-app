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
