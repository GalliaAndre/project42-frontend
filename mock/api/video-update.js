const { getResource, setResource } = require('jgloo');
const { unlinkSync } = require('fs');

module.exports = {
  path: '/api/videos/:id',
  method: 'post',
  callback: (req, res) => {
    // Clean temp files
    req.files.forEach(f => {
      unlinkSync(f.path);
    });

    const id = Number(req.params.id);
    const resource = getResource('video');

    const model = resource.find(r => r.id === id);
    model.title = req.body.title;
    model.description = req.body.description;
    model.published = req.body.published === 'true';
    model.categories = req.body.categories.map(cId => Number(cId));
    model.series = Number(req.body.series);

    setResource('video', resource);
    res.json(model);
  }
};
