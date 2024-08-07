const PlaylistsHandler = require('./handler');
const routes = require('./routes');

const playlists = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, {
    playlistsService, validator,
  }) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistsService,
      validator,
    );
    server.route(routes(playlistsHandler));
  },
};

module.exports = playlists;
