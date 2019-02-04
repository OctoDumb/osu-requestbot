# osu! request bot
***
A *simple* Electron-based osu! request bot for Twitch.tv

## Requirements
-  Node.JS

## How to run

### App
Will add soon..

### Code
1.  Clone this repository
```shell
git clone https://github.com/OctoDumb/osu-requestbot
```
2.  Create a `config.json` file and add this:
```json
{
    "channel":"octopussx",
    "token":"oauth:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "bot":"octopussx",
    "prefix":"!r",
    "osutoken":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "port":1337
}
```
[b]Parameters:[/b]
-  channel — your channel name
-  token — IRC OAuth token (https://twitchapps.com/tmi)
-  bot — your channel name again
-  prefix — request command
-  osutoken — osu! API token (https://osu.ppy.sh/p/api)
-  port — widget port

3.  Run it!
```shell
npm start
```

## Features
-  [X] Web-widget for streams
-  [ ] There shall be more...

## TODO
-  [X] Fix requests count on widget restart 
