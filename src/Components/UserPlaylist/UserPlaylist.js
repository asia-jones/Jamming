import React from 'react';
import './UserPlaylist.css';


class UserPlaylist extends React.Component {
  constructor(props){
    super(props);
    this.handleShow = this.handleShow.bind(this);

  }

  handleShow(){
      this.props.getTracks(this.props.names.id);
      this.props.hideNames();

    }


  render() {
    return (
      <div className="UserPlaylist">
        <p onClick={this.handleShow}>{this.props.names.name}</p>
      </div>
    );
  }
}

export default UserPlaylist;
