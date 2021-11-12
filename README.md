# Keyboard Purchases

1) Requires a database, should be abstracted enough to swap in whatever SQL database you want
  * I used MariaDB 10

2) Adding bulk data has to be done on your own because I got no clue how your stuff is organized
  * You may want to add stock/null values for things that you don't have unless I told the schema no null :)

3) It mostly works most of the time

4) The `get_image` python script should be cron'd or scheduled to run however frequiently you want. 
  * It just uses the github data to avoid pulling from archivist's CDNs