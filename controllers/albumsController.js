const router = require('express').Router();
const Album = require('../models/albums').Album;
const Song = require('../models/albums').Song;

// NEW album FORM
router.get('/new', (req, res) => {
    res.render('albums/new.ejs');
  });
  
// Index route
router.get('/', (req, res) => {
    Album.find({}, (error, albums) => {
        res.render("albums/index.ejs", {albums})
    })
});
  
  // ADD EMPTY FORM TO album SHOW PAGE TO ADD song TO A album
  router.get('/:albumId', (req, res) => {
      // find album in db by id and add new song
      Album.findById(req.params.albumId, (error, album) => {
        res.render('albums/show.ejs', { album });
      });
    });
  
    router.delete('/:albumId', (req, res) => {
      console.log('DELETE album');
      // set the value of the album and song ids
      const albumId = req.params.albumId;
  
      // find album in db by id
      Album.findById(albumId, (err, foundAlbum) => {
        foundAlbum.remove();
          res.redirect('/albums');
      });
    });
  
  // CREATE A NEW Album
  router.post('/', (req, res) => {
      Album.create(req.body, (error, album) => {
        res.redirect(`/albums/${album.id}`);
      });
    });
  
    // CREATE Song EMBEDDED IN Album
  router.post('/:albumId/songs', (req, res) => {
      console.log(req.body);
      // store new song in memory with data from request body
      const newSong = new Song({ songTitle: req.body.songTitle });
    
      // find album in db by id and add new song
      Album.findById(req.params.albumId, (error, album) => {
        album.songs.push(newSong);
        album.save((err, album) => {
          res.redirect(`/albums/${album.id}`);
        });
      });
    });
  
    router.get('/:albumId/songs/:songId/edit', (req, res) => {
      // set the value of the album and song ids
      const albumId = req.params.albumId;
      const songId = req.params.songId;
      // find album in db by id
      Album.findById(albumId, (err, foundAlbum) => {
        // find song embedded in album
        const foundSong = foundAlbum.songs.id(songId);
        // update song text and completed with data from request body
        res.render('songs/edit.ejs', { foundAlbum, foundSong });
      });
    });
    
    // UPDATE song EMBEDDED IN A album DOCUMENT
    router.put('/:albumId/songs/:songId', (req, res) => {
      console.log('PUT ROUTE');
      // set the value of the album and song ids
      const albumId = req.params.albumId;
      const songId = req.params.songId;
    
      // find album in db by id
      Album.findById(albumId, (err, foundAlbum) => {
        // find song embedded in album
        const foundSong = foundAlbum.songs.id(songId);
        // update song text and completed with data from request body
        foundSong.songTitle = req.body.songTitle;
        foundAlbum.save((err, savedAlbum) => {
          res.redirect(`/albums/${foundAlbum.id}`);
        });
      });
    });
    
    router.delete('/:albumId/songs/:songId', (req, res) => {
      console.log('DELETE Song');
      // set the value of the album and song ids
      const albumId = req.params.albumId;
      const songId = req.params.songId;
    
      // find album in db by id
      Album.findById(albumId, (err, foundAlbum) => {
        // find song embedded in album
        foundAlbum.songs.id(songId).remove();
        // update song text and completed with data from request body
        foundAlbum.save((err, savedAlbum) => {
          res.redirect(`/albums/${foundAlbum.id}`);
        });
      });
    });
  
  
  module.exports = router;