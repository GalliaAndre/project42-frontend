const { getResource, setResource } = require('jgloo');

module.exports = {
  path: '/api/videos/:id',
  method: 'delete',
  callback: (req, res) => {
    const id = Number(req.params.id);

    let resource = getResource('video') || [];
    const index = resource.findIndex(r => r.id === id);
    if (index === -1) {
      return res.sendStatus(404);
    }

    resource = resource.filter(r => r.id !== id);
    setResource('video', resource);

    res.json(id);
  }
};
