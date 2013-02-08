module.exports = Object.freeze({
  db: {
    user:"user",
    pass:"pass",
    url: "linus.mongohq.com",
    port: 10082,
    name: "ottosipe"
  }, 
  email: {
    user: "artichoke",
    pass: "artichoke"
  },
  admin: {
    user: "user",
    pass: "pass"
  },
  gh_prod: {
    id: '96e6b51122852707d612', // only for artichoke deployment
    secret: '8be368fed2de28da68559cbd7381ac50b467bc01'
  },
  gh_dev: {
    id: '4f764f0fe8285250849d', // only for artichoke test
    secret: '20667758e8ab8dd9a88f4e0d853cdaa5a683c58f'
  }
});
