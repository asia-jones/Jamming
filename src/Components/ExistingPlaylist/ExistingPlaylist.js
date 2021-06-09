import React from 'react';
import './ExistingPlaylist.css';
import UserPlaylist from '../UserPlaylist/UserPlaylist';
import Track from '../Track/Track';

class ExistingPlaylist extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      hide: false
    };

    this.hideNames = this.hideNames.bind(this);
    this.backToPlaylist = this.backToPlaylist.bind(this);
  }

  hideNames(){
    this.setState({
      hide: true
    });
  }

  backToPlaylist(){
    this.setState({
      hide: false
    });
  }


  render() {
    return (
      <div className="Exist">
        {!this.state.hide ?
        <div className="ExistingPlaylist">
          {this.props.playlist.map(list => {
            return <UserPlaylist hideNames={this.hideNames} names={list} getTracks={this.props.getTracks} key={list.id} existingTracks={this.props.existingTracks}/>
          })}
          <button className="Back" onClick={this.props.onReset}>GO BACK</button>
        </div>
        :
        <div className="Playlist-tracks">
          {this.props.existingTracks.map(track => <Track track={track} key={track.id} isHidden={true} />)}
          <button className="Back" onClick={this.backToPlaylist}>BACK TO PLAYLISTS</button>
        </div>
      }
    </div>
    );
  }
}

export default ExistingPlaylist;
