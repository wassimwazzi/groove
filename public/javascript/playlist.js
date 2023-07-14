// function fetchPlaylistSongs(playlistId) {
//   fetch(`/api/playlists/${playlistId}/songs`)
//     .then((response) => response.json())
//     .then((songs) => {
//       const playlistSongs = document.querySelector('.playlist-songs')
//       playlistSongs.innerHTML = ''
//       songs.forEach((song) => {
//         playlistSongs.innerHTML += `
//           <li>
//             <a href="/songs/${song.id}">${song.title}</a>
//           </li>
//         `
//       })
//     })
// }
