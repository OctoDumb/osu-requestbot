# osu! request bot
***
A *simple* Electron-based osu! request bot for Twitch.tv

## Requirements
-  Node.JS

## How to run

### App
Will add soon..

### Code
-  Clone this repository
```shell
git clone https://github.com/OctoDumb/osu-requestbot
```
-  Create a `config.json` file and add this:
```json
{
    "channel":"your channel",
    "token":"IRC token*",
    "bot":"your channel",
    "prefix":"request prefix (null for no prefix)",
    "osutoken":"your osu! API token",
    "port":1337
}
```
\* You can get one here: https://twitchapps.com/tmi/
-  Run it!
```shell
npm start
```

## Features
-  [X] Web-widget for streams
-  [ ] There shall be more...

## TODO
-  [X] Fix requests count on widget restart 
