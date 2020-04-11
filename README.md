[![Codacy Badge](https://api.codacy.com/project/badge/Grade/164dd58eda3d4adb981095303f55362d)](https://www.codacy.com?utm_source=github.com&utm_medium=referral&utm_content=Mattis6666/Venus&utm_campaign=Badge_Grade)
[![Build Status](https://travis-ci.com/Mattis6666/Venus.svg?token=zfRp6sQK95ixCpZjsWq9&branch=master)](https://travis-ci.com/Mattis6666/Venus)

<center> <h1>VenusTs </h1> </center>
<img src="https://media.discordapp.net/attachments/695787942983106620/695984239023226890/Venus_Title_Basic.png?width=1440&height=314">
I'm a discord junkie. And as such, I need proper bots. But Mee6, Dyno and co. just never satisfied my needs.
So I thought, why not try to make a better bot? And thus, I created VenusTs. 
<hr>
Venus aims to be a bot that combines the features of all big bots into one single bot and do their job better.<br>She is not finished yet, however that doesn't make her unstable. Her base structure is finished, so updates to her do not break anything!

This means however, that she will receive many many updates adding more and more features.
You can find the current features below
<center> <h2> Features </h2> </center>

|            |                                                                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Anime      | Anime lookup, hug, cuddle and co                                                                                                       |
| Moderation | Fletched out Moderation system with Modlog featuring warns, mutes and co                                                               |
| Fun        | Little mini games like TicTacToe, Minesweeper, random trivia, 8ball                                                                    |
| Utility    | And of course utility! Venus will look up words for you, yoink emotes (reupload emotes from another server to your own), and many more |
| Tags       | Create custom commands that output either regular text or an embed                                                                     |
| Welcome    | Welcome messages, neat welcome cards and auto-role                                                                                     |

You can customise many of her settings:
- Prefix
- Disabled commands
- Disabled channels
- Language ~ Current options are English, German, Turkish and Dutch. More languages soon to be added!
- And many more

## Set up your own Venus Instance

-   Clone the repo
-   Run `yarn install` to install all dependencies
-   Create [a discord bot](https://discordapp.com/developers/applications 'Create a Discord Bot!') and a [MongoDB database](https://www.mongodb.com/ 'Create a MongoDB database!')
-   Adjust config.ts to your needs.\
    Template for the MongoString:
    ```
    mongodb+srv://USERNAME:PASSWORD.@YOURLINK/DATABASENAME?retryWrites=true&w=majority
    ```
-   Run `yarn dev` to run the bot

## Translate Venus

-   Clone the repo
-   Create a copy of `/i18n/en_GB` to `/i18n/yourlanguage_YOURCOUNTRY` and add your folder's name to `/src/interfaces/Languages.ts`
-   Simply change all the strings in all command files.\
    DO NOT replace `{TEXT}` or Text inside ``.You can move them around, but do not change or remove them.
-   Create a pull request with your changes.

## License

```
MIT License

Copyright (c) 2020 Mattis "VenNeptury" H

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
