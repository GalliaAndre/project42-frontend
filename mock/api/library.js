const { getResource } = require('jgloo');

module.exports = {
  path: '/api/library',
  method: 'get',
  callback: (req, res) => {
    const series = getResource('series') || [];
    const allVideos = getResource('video') || [];
    const categories = getResource('category') || [];

    const videos = allVideos.filter(v => !v.series);

    videos.forEach(v => {
      v.categories = v.categories.map(cId =>
        categories.find(c => c.id === cId)
      );
    });

    series.forEach(s => {
      s.videos = allVideos.filter(v => v.series === s.id);

      s.videos.forEach(v => {
        v.categories = v.categories.map(cId =>
          categories.find(c => c.id === cId)
        );
      });

      s.categories = s.categories.map(cId =>
        categories.find(c => c.id === cId)
      );
    });

    res.json({ videos, series });
  }
};
