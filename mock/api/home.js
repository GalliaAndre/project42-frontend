const { getResource } = require('jgloo');

module.exports = {
  path: '/api/home',
  method: 'get',
  callback: (req, res) => {
    const videos = getResource('video') || [];
    const series = getResource('series') || [];

    res.json({
      latestVideos: videos,
      latestSeries: series,
      mostViewedVideos: videos,
      mostViewedSeries: series,
      topRatedVideos: videos,
      topRatedSeries: series
    });
  }
};
