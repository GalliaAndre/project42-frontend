module.exports = {
  path: '/api/videos/:id/rating',
  method: 'post',
  callback: (req, res) => {
    res.json(true);
  }
};
