const router = require('express').Router();
const verify = require('../verifyToken');

router.get('/', verify, (req, res) => {
  res.json({
    posts: {
      title: 'my first post',
      desc: 'random data you shouldnt access without logging in',
    },
  });
});

module.exports = router;
