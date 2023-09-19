## Database files

- I temp enabled the 'data' folder so you can load each json file with the ability to expand and collapse fields
- Each file is exactly what I uploaded to the database
- After you've cloned this branch we can add 'data' to .ignore

## Api notes

I've temp commented out an area that checks for duplicates and also something to do with scheduling. So as of now we can submit gamestates without them getting rejected which is good for testing.

Example api request that would return the standings field from what is in the w_seasons.json file (which is a collection in the database)

```
https://TheSitesWierdName/app/api/season-data?league=w&season-number=8&field=standings
```

- /api/(read)/season-data api is where we can request any data from a particular season.
- season-data api takes in 3 parameters.
  - league name
  - season number
  - field
- inside of season-data api I have a switch statement that takes in the value from the field parameter. The idea is to return the requested field from the seasons collection.
- currently I only have 3 switch cases created and they are
  - standings (each teams record but NOT sorted yet. example a teams wins, losses, ties, etc...)
  - teamsDictCodes (used for returning all the teams 3 letter codes required for the game parser)
  - recent-results (used for displaying recent games in horizontal scoreboard)
    So you can replace 'standings' in the above URL with the just mentioned values

## Other notes

Inside of the utils folder is a subfolder tables and the methods inside here are used when a gamestate is uploaded. The two teams that are in the gamestate use these methods to increment there standings object. Example GP (games played is incremented by one) There is a method in dealing with each teams standings and here is where more stats can be added. Such as Goals against average or whatever...

The game parser I was given was a python file and in it are some variables that contain 'Dict' in the name so I kept them in places though they are python related but whatever.
