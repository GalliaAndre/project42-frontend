const { getResource } = require('jgloo');

module.exports = {
  path: '/api/users/:id',
  method: 'get',
  callback: (req, res) => {
    const videos = getResource('video') || [];
    const series = getResource('series') || [];

    res.json({
      id: 1,
      email: 'hbarhdadi@sorint.it',
      firstName: 'Mario',
      lastName: 'Rossi',
      username: 'mrossi',
      videos: videos,
      series: series
    });
  }
};
