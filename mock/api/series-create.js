const { getResource, setResource } = require('jgloo');
const { unlinkSync } = require('fs');

module.exports = {
  path: '/api/series',
  method: 'post',
  callback: (req, res) => {
    // Clean temp files
    req.files.forEach(f => {
      unlinkSync(f.path);
    });

    const resource = getResource('series') || [];
    const categories = getResource('category') || [];

    const model = {};
    model.id = resource.length ? resource[resource.length - 1].id + 1 : 1;
    model.title = req.body.title;
    model.description = req.body.description;
    model.bannerName =
      'https://staticfanpage.akamaized.net/wp-content/uploads/sites/5/2019/06/proximabcova-638x425.jpg';

    model.categories = req.body.categories.map(description => {
      const search = categories.find(c => c.description === description);

      if (search) {
        return search.id;
      } else {
        const newCategory = {
          id: categories.length ? categories[categories.length - 1].id + 1 : 1,
          description
        };
        categories.push(newCategory);
        setResource('category', categories);
        return newCategory.id;
      }
    });

    model.videos = [];
    model.createdAt = new Date().toISOString();

    resource.push(model);
    setResource('series', resource);
    res.json(model);
  }
};
