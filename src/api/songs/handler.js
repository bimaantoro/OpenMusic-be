class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    const songPayload = this._validator.validatePostSongPayload(request.payload);

    const songId = await this._service.addSong(songPayload);

    return h.response({
      status: 'success',
      message: 'Song added successfully',
      data: {
        songId,
      },
    }).code(201);
  }

  async getSongsHandler(request) {
    const { title = '', performer = '' } = request.query;
    await this._validator.validateSongQuery({ title, performer });

    const lowerCaseTitle = title.toLowerCase();
    const lowerCasePerformer = performer.toLowerCase();

    const songs = await this._service.getSongs();

    if (title !== '' && performer !== '') {
      return {
        status: 'success',
        data: {
          songs: songs.filter((song) => song.title.toLowerCase().includes(lowerCaseTitle)
          && song.performer.toLowerCase().includes(lowerCasePerformer)),
        },
      };
    }

    if (title !== '') {
      return {
        status: 'success',
        data: {
          songs: songs.filter((song) => song.title.toLowerCase().includes(lowerCaseTitle)),
        },
      };
    }

    if (performer !== '') {
      return {
        status: 'success',
        data: {
          songs: songs.filter((song) => song.performer.toLowerCase().includes(lowerCasePerformer)),
        },
      };
    }

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { songId } = request.params;
    const song = await this._service.getSongById(songId);

    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    const { songId } = request.params;
    const songPayload = this._validator.validatePutSongPayload(request.payload);

    await this._service.editSongById(songId, songPayload);

    return {
      status: 'success',
      message: 'Song updated successfully',
    };
  }

  async deleteSongByIdHandler(request) {
    const { songId } = request.params;

    await this._service.deleteSongById(songId);

    return {
      status: 'success',
      message: 'Song deleted successfully',
    };
  }
}

module.exports = SongsHandler;
