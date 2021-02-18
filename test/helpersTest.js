const { assert } = require('chai');
const { getUserIdByEmail } = require("../helpers/auth");
const { getURLSByID } = require("../helpers/permissions")

const userDatabase = {
  "h49hf7": {
    "id": "h49hf7",
    "email": "example@example.com",
    "password": "examplepassword9",
  },
  "tk6199": {
    "id": 'tk6199',
    "email": 'example2@example.com',
    "password": 'asdasd',
  }
}

const urlDatabase= {
  "h7hh37": {
    longURL: 'https://www.omgexample.com',
    userID: 'rv7hi4'
  },
  "h7sdf37": {
    longURL: 'https://www.notthisagainexample.com',
    userID: 'rv7hi4'
  },
  "h7hsd7": {
    longURL: 'https://www.notthisexample.com',
    userID: 'rv7hi4'
  },
  "h7asd7": {
    longURL: 'https://www.example.com',
    userID: 'rsdfddd'
  }
}

describe("#getUserIDbyEmail", () => {
  it("should return userID string if passed in an e-mail that exists in database", () => {
    const result = getUserIdByEmail(userDatabase, "example2@example.com");
    assert.equal(result, "tk6199");
  });
  it("should return null if passed in an e-mail that doesn't exist in database", () => {
    const result = getUserIdByEmail(userDatabase, "example2@notexample.com");
    assert.equal(result, null);
  });
});

describe("#getURLSbyID", () => {
  it("should return object with shortURL keys and longURL values of any URLs associated with inputed userID", () => {
    const result = getURLSByID(urlDatabase, "rsdfddd");
    assert.deepEqual(result, {"h7asd7": 'https://www.example.com'})
  });
  it("should return empty object if there are no URLs associated with inputed userID", () => {
    const result = getURLSByID(urlDatabase, "rss73d");
    assert.deepEqual(result, {})
  });
});