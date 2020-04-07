[![Codacy Badge](https://api.codacy.com/project/badge/Grade/164dd58eda3d4adb981095303f55362d)](https://www.codacy.com?utm_source=github.com&utm_medium=referral&utm_content=Mattis6666/Venus&utm_campaign=Badge_Grade)
[![Build Status](https://travis-ci.com/Mattis6666/Venus.svg?token=zfRp6sQK95ixCpZjsWq9&branch=master)](https://travis-ci.com/Mattis6666/Venus)

# VenusTs

## Set up your own Venus Instance

-   Clone the repo
-   Run `yarn install` to install all dependencies
-   Create [a discord bot](https://discordapp.com/developers/applications 'Create a Discord Bot!') and a [MongoDB database](https://www.mongodb.com/ 'Create a MongoDB database!')
-   Adjust config.ts to your needs.\
    Template for the MongoString:
    ````css
    mongodb+srv://USERNAME:PASSWORD.@YOURLINK/DATABASENAME?retryWrites=true&w=majority
    ````
-   Run `yarn dev` to run the bot

## Translate Venus

-   Clone the repo
-   Create a copy of `/i18n/en_GB` to `/i18n/yourlanguage_YOURCOUNTRY` and add your folder's name to `/src/interfaces/Languages.ts`
-   Simply change all the strings in all command files.\
    DO NOT replace `{TEXT}` or Text inside ``.You can move them around, but do not change or remove them.
-   Create a pull request with your changes.

## License

````
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
````
