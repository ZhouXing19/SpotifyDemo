const PLATLISTS_ID = {
    us_top_50: '37i9dQZEVXbLRQDuF5jeBp',
    global_top_50: '37i9dQZEVXbMDoHDwVN2tF'
};

const API_ENDPOINTS = {
    profile_endpoint: 'https://api.spotify.com/v1/me',
    playlist_endpoint: 'https://api.spotify.com/v1/playlists/',
    search_endpoint: 'https://api.spotify.com/v1/search',
    recommendations_endpoint: 'https://api.spotify.com/v1/recommendations',
    authorization_endpoint: 'https://accounts.spotify.com/api/token',
};

module.exports = {
    PLATLISTS_ID,
    API_ENDPOINTS,
}