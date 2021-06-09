let token;
const clientId = process.env.REACT_APP_CLIENT_ID; //Do not post this on GitHub
// Erase URL when ready to deploy app
const redirectUri = 'http://jumbled-bear.surge.sh';

const Spotify = {
  getAccessToken() {
    if (token) {
      return token;
    } else {
      /*Use windows location to get url then use match to grab accesstoken
      and expires in parameters*/
      const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
      const expireMatch = window.location.href.match(/expires_in=([^&]*)/);
      if (tokenMatch && expireMatch) {
        token = tokenMatch[1];
        const expire = Number(expireMatch[1]);

        window.setTimeout(() => token = '', expire * 1000);
        window.history.pushState('Access Token', null, '/');
        return token;
      } else {
        const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        window.location = url;
      }
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(response => response.json())
      .then(jsonResponse => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
          preview: track.preview_url
        }));
      });
  },

  savePlaylist(name, uris) {
    if (!name || !uris.length) {
      return;
    } else {
      let accessToken = Spotify.getAccessToken();
      let header = {
        Authorization: `Bearer ${accessToken}`
      };
      let userId;

      return fetch('https://api.spotify.com/v1/me', {
          headers: header
        })
        .then(response => response.json())
        .then(jsonResponse => {
          userId = jsonResponse.id
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
              headers: header,
              method: 'POST',
              body: JSON.stringify({
                name: name
              })
            })
            .then(response => response.json())
            .then(jsonResponse => {
              const playlistId = jsonResponse.id
              return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                  headers: header,
                  method: 'POST',
                  body: JSON.stringify({
                    uris: uris
                  })
                });
            });

        });


    }
  },

  getPlaylist(){
    let accessToken = Spotify.getAccessToken();
    return fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(response => response.json())
    .then(jsonResponse => {
      return jsonResponse.items.map(playlist => ({
        name: playlist.name,
        id: playlist.id
      }));
  });
},

  getTracks(id){
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(response => response.json())
      .then(jsonResponse => jsonResponse.items)
      .then(items => {
        return items.map( item => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
        uri: item.track.uri,
        preview: item.track.preview_url
      }))
    });

  }
};

export default Spotify;
