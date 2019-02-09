# osu! request bot
***
A *simple* Electron-based osu! request bot for Twitch.tv and YouTube

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
2.  Install dependencies
```shell
npm i
```
3.  Create a `config.json` file and add this:
```json
{
    "twchannel":"octopussx",
    "twtoken":"oauth:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "ytchannel":"UC9TyHiTiHHlsnG73ji13wdg",
    "yttoken":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "prefix":"!r",
    "osutoken":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "port":1337
}
```
### Parameters:
-  twchannel — your Twitch channel name
-  twtoken — Twitch IRC OAuth token (https://twitchapps.com/tmi) *
-  ytchannel — your YouTube channel ID
-  yttoken — YouTube Data API v3 token *
-  prefix — request command
-  osutoken — osu! API token (https://osu.ppy.sh/p/api)
-  port — widget port

\* To disable bot - set token value to `null`

4.  Run it!
```shell
npm start
```

## Features
-  [X] Web-widget for streams
-  [ ] There shall be more...

## TODO
-  [X] Fix requests count on widget restart 
