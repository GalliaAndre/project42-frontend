const { getResource, setResource } = require('jgloo');
const { unlinkSync } = require('fs');

module.exports = {
  path: '/api/series/:id',
  method: 'post',
  callback: (req, res) => {
    // Clean temp files
    req.files.forEach(f => {
      unlinkSync(f.path);
    });

    const id = Number(req.params.id);
    const resource = getResource('series');
    const categories = getResource('category') || [];

    const model = resource.find(r => r.id === id);
    model.title = req.body.title;
    model.description = req.body.description;

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

    setResource('series', resource);
    res.json(model);
  }
};
