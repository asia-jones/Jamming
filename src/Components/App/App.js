import './App.css';
import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import ExistingPlaylist from '../ExistingPlaylist/ExistingPlaylist';
import TrackList from '../TrackList/TrackList';


class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName: ' ',
      playlistTracks: [],
      view: 'home',
      existingPlaylist: [],
      existingTracks: []
};

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.renderView = this.renderView.bind(this);
    this.handleView = this.handleView.bind(this);
    this.reset = this.reset.bind(this);
    this.getPlaylist = this.getPlaylist.bind(this);
    this.getTracks = this.getTracks.bind(this);
}

  addTrack(track){
    if(this.state.playlistTracks.find(song => song.id === track.id)){
      return;
    }
    this.state.playlistTracks.push(track);
    this.setState({playlistTracks: this.state.playlistTracks});
  }

  removeTrack(track){
    const id = track.id;
    const newTrack = this.state.playlistTracks.filter(song => song.id !== id);
    this.setState({playlistTracks: newTrack});
  }

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist(){
    let trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() =>{
    this.setState({playlistName: 'New Playlist', playlistTracks: []});
  });
  }

  search(term){
    Spotify.search(term).then(results => this.setState({searchResults: results}));
  }

  //Added to stop reload of tokens(refresh) on first search
  componentDidMount() {
  window.addEventListener('load', () => {Spotify.getAccessToken()});
}

  renderView(){
    if(this.state.view === 'home'){
      return (
        <div className="Toggle">
          <button className="Add-plalist"
            onClick={this.handleAdd}>ADD PLAYLIST</button>
          <button className="View-playlist"
            onClick={this.handleView}>VIEW PLAYLIST</button>
        </div>
      );
    }
    else if(this.state.view === 'add'){
      return(
        <Playlist playlistName={this.state.playlistName}
          playlistTracks = {this.state.playlistTracks}
          onRemove={this.removeTrack} onNameChange={this.updatePlaylistName}
          onSave={this.savePlaylist} onReset={this.reset} />
      );
    }
    else{
      return (

        <ExistingPlaylist onReset={this.reset} playlist={this.state.existingPlaylist} getTracks={this.getTracks} existingTracks={this.state.existingTracks} />
      );
    }
  }

  getPlaylist(){
    Spotify.getPlaylist().then(playlist =>
    this.setState({existingPlaylist: playlist}));

  }

  handleAdd(){
    this.setState({view: 'add'});
  }

  handleView(){
    this.setState({view: 'view'});
    this.getPlaylist();

  }

  reset(){
    this.setState({view: 'home'});

  }

  getTracks(id){
    Spotify.getTracks(id).then(track => {
      this.setState({existingTracks: track});
    });


  }


  render(){
    return(
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults = {this.state.searchResults}
              onAdd={this.addTrack} />
            {this.renderView()}

          </div>
        </div>
      </div>
    );

  }
}

export default App;
