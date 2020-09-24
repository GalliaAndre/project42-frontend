const { getResource } = require('jgloo');

module.exports = {
  path: '/api/search',
  method: 'get',
  callback: (req, res) => {
    const categories = getResource('category') || [];
    const videos = getResource('video') || [];
    const series = getResource('series') || [];

    categories.forEach(category => {
      category.videos = videos.filter(v => v.categories.includes(category.id));
      category.series = series.filter(s => s.categories.includes(category.id));
    });

    res.json({
      videos,
      series,
      categories
    });
  }
};
