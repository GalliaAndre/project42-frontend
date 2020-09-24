const { getResource } = require('jgloo');

module.exports = {
  path: '/api/videos/:id',
  method: 'get',
  callback: (req, res) => {
    const resource = getResource('video') || [];
    const id = Number(req.params.id);
    const model = resource.find(r => r.id === id);

    if (!model) {
      return res.sendStatus(404);
    }

    const categories = getResource('category') || [];
    model.categories = model.categories.map(cId =>
      categories.find(c => c.id === cId)
    );

    res.json(model);
  }
};
