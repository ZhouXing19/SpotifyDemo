var request = require('request'); // "Request" library
const fs = require('fs');
const got = require('got');
const CONSTANTS = require('../util/Constants.js')

var updateAttributeEnv = function(envPath, attrName, newVal){
    var dataArray = fs.readFileSync(envPath,'utf8').split('\n');
    var replacedArray = dataArray.map((line) => {
        if (line.split('=')[0] == attrName){
            return attrName + "=" + String(newVal);
        } else {
            return line;
        }
    })
    fs.writeFileSync(envPath, "");
    for (let i = 0; i < replacedArray.length; i++) {
        fs.appendFileSync(envPath, replacedArray[i] + "\n"); 
    }
}

module.exports = {
    loginCallBack: async (req, res) => {
        let userCode = req.query.code;
    
        // 2. Have your application request refresh and access tokens; Spotify returns access and refresh tokens
    
        var authOptions = {
            url: CONSTANTS.API_ENDPOINTS.authorization_endpoint,
            form: {
                code: userCode,
                redirect_uri: process.env.REDIRECT_URI,
                grant_type: 'authorization_code'
        },
            headers: {
            'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
        },
            json: true
        };
    
        request.post(authOptions, async function(error, response, body){
            if (!error && response.statusCode === 200) {
                var access_token = body.access_token,
                    refresh_token = body.refresh_token;
    
                updateAttributeEnv('./.env', 'ACCESS_TOKEN', String(access_token));
                updateAttributeEnv('./.env', 'REFRESH_TOKEN', String(refresh_token));
                const url =  CONSTANTS.API_ENDPOINTS.profile_endpoint;
    
                // 3. Use the access token to access the Spotify Web API; Spotify returns requested data
                var options = {
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    };
                
                let results = await got(url, options).json();
                res.send(`
                    <h1> Welcome Back! </h1>
                    Username: <b> ${results.display_name}</b> 
                    <br/>
                    Email: <b> ${results.email}</b>
                    <br/>
                    AccessCode: ${access_token}
                    <br/>
                    
                    <br/>
                    <br/>
                    <br/>

                    <form action="/playlists" method="GET">
                    tempo: <input type="text" name="tempo" /> <br/>
                    duration: <input type="text" name="duration"/> <br/>
                    energy: <input type="text" name="energy"/> <br/>
                    liveness: <input type="text" name="liveness"/> <br/>
                    loudness: <input type="text" name="loudness"/> <br/>
                    minPopularity: <input type="text" name="minPopularity"/> <br/>
                    speechiness: <input type="text" name="speechiness"/> <br/>
                    <input type="submit" value="Get by target value"/>
                    
                    </form>
`)
    
            }
    
        });
    
    }


}