var request = require('request'); // "Request" library
const fs = require('fs');

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
            url: 'https://accounts.spotify.com/api/token',
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
    
        request.post(authOptions, function(error, response, body){
            if (!error && response.statusCode === 200) {
                var access_token = body.access_token,
                    refresh_token = body.refresh_token;
    
                updateAttributeEnv('./.env', 'ACCESS_TOKEN', String(access_token));
                updateAttributeEnv('./.env', 'REFRESH_TOKEN', String(refresh_token));
    
                // 3. Use the access token to access the Spotify Web API; Spotify returns requested data
                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                    };
                
                request.get(options, function(error, response, body) {
                    res.send(`
                    <h1> Welcome Back! </h1>
                    Username: <b> ${body.display_name}</b> 
                    <br/>
                    Email: <b> ${body.email}</b>
                    <br/>
                    AccessCode: ${access_token}`)
    
                });
    
            }
    
        });
    
    }


}