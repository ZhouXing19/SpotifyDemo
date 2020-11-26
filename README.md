# Automatic Playlist Generator API by Spotify API

## Description

An automatic playlist generator API that produces a complementary playlist given specific input field.

- **Supported endpoints:**
  
    - Target BPM (beats per minute)
    - Target duration
    - An existing music library (coming soon)

The API will return playlist in JSON, with `tracks`, `albums`, `artists` listed.


## Installation

1. `git clone https://github.com/ZhouXing19/SpotifyDemo` to your local directory.

2. Configure the `.env` file, according to format provided in `.env.example`
   
   2.1. No need to change the `ACCESS_TOKEN` and `REFRESH_TOKEN` field.

   2.2. [Email me](mailto:zhouxing@uchicago.edu) to acquire the `CLIENT_ID` and `CLIENT_SECRET` ;)

3. Make sure you are on the root of this repository, and `npm install` 

4. `npm run devStart` to start the server. If you see:
        
        
        Server Started
        Connected to db
        

    Congrats, you are all set!

## Usage

1. In your browser, go to `http://localhost:3007/`, and authorize this app.
2. (Current Version, will be updated) After authorization, in `http://localhost:3007/callback?code={YOUR_ACCESS_CODE}` page, click on `Get popular`

## References:
- **[Spotify Authorization Flows](https://developer.spotify.com/documentation/general/guides/authorization-guide/)** 

- **[Spotify API endpoints](https://developer.spotify.com/console/)**
  

