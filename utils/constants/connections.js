///////////////////////////
// THIS IS THE LIVE SETTING
///////////////////////////

const CONNECTION_MODE = "DARK95_LIVE"

/////////////////////////////
// THESE ARE TESTING SETTINGS
/////////////////////////////

// const CONNECTION_MODE = "HOME_DEV"
// const CONNECTION_MODE = "HOME_DARK_DEV"
// const CONNECTION_MODE = "MONGO_ATLAS_95"
// const CONNECTION_MODE = "MONGO_ATLAS_DEV"

// true will save the game file to the selected database
const WRITE_TO_DB = true;

// true will allow duplicates to pass through game state duplicate check
const ALLOW_DUPLICATES = false;

let DB_CONNECT;
let DOMAIN;
let ORIGIN

switch(CONNECTION_MODE){
    case "HOME_DEV":
        DB_CONNECT = process.env.HOME_URI;
        DOMAIN = "http://localhost:3000";
        ORIGIN = process.env.ALLOW_HOME_ORIGIN;
    break;
    case "HOME_DARK_DEV":
        DB_CONNECT = process.env.MONGODB_DARKSIDE_URI;
        DOMAIN = "http://localhost:3000";
        ORIGIN = process.env.ALLOW_HOME_ORIGIN;
    break;
    case "MONGO_ATLAS_95":
        DB_CONNECT = process.env.MONGODB_URI;
        DOMAIN = "http://localhost:3000";
        ORIGIN = process.env.ALLOW_HOME_ORIGIN;
        break;
    case "MONGO_ATLAS_DEV":
        DB_CONNECT = process.env.MONGODB_DEV_URI;
        DOMAIN = "http://localhost:3000";
        ORIGIN = process.env.ALLOW_HOME_ORIGIN;
        break;
    case "DARK95_LIVE":
        DB_CONNECT = process.env.MONGODB_DARKSIDE_URI;
        DOMAIN = "https://nhl95.vercel.app";
        ORIGIN = process.env.ALLOW_VERCEL_ORIGIN;
        break;
}

export {DB_CONNECT, DOMAIN, ORIGIN, WRITE_TO_DB, ALLOW_DUPLICATES}
