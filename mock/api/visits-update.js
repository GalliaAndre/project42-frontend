module.exports = {
  path: '/api/visits/:id',
  method: 'patch',
  callback: (req, res) => {
    res.json(true);
  }
};
