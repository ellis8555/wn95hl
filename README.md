## Database files

- I temp enabled the 'data' folder so you can load each json file with the ability to expand and collapse fields
- Each file is exactly what I uploaded to the database
- After you've cloned this branch we can add 'data' to .ignore

## Api notes

Example api request that would return the standings field from what is in the w_seasons.json file (which is a collection in the database)

```
https://TheSitesWierdName/app/api/season-data?league=w&season-number=8&field=standings
```

- /api/(read)/season-data api is where we can request any data from a particular season. This data can be seen in './data/w_seasons.json'
- season-data api takes in 3 parameters.
  - league name
  - season number
  - field
- inside of season-data api I have a switch statement that takes in the value from the field parameter. The idea is to return the requested field from the seasons collection.
- currently I only have 3 switch cases created and they are
  - standings (each teams record but NOT sorted yet. example a teams wins, losses, ties, etc...)
  - teamsDictCodes (used for returning all the teams 3 letter codes required for the game parser)
  - recent-results (used for displaying recent games in horizontal scoreboard)
