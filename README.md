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
    "channel":"octopussx", /* Channel name */
    "token":"oauth:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", /* IRC token *(link below) */
    "bot":"octopussx", /* Channel name again */
    "prefix":"!r", /* Request command */
    "osutoken":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", /* osu! API token */
    "port":1337 /* Widget port */
}
```
\* IRC OAuth: https://twitchapps.com/tmi/
-  Run it!
```shell
npm start
```

## Features
-  [X] Web-widget for streams
-  [ ] There shall be more...

## TODO
-  [X] Fix requests count on widget restart 
