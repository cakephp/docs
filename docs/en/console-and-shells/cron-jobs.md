# Running Shells as cronjobs

A common thing to do with a shell is making it run as a cronjob to
clean up the database once in a while or send newsletters. This is
trivial to setup, for example:

``` text
*/5  *    *    *    *  cd /full/path/to/my_app && bin/cake myshell myparam
# *    *    *    *    *  command to execute
# │    │    │    │    │
# │    │    │    │    │
# │    │    │    │    \───── day of week (0 - 6) (0 to 6 are Sunday to Saturday,
# |    |    |    |           or use names)
# │    │    │    \────────── month (1 - 12)
# │    │    \─────────────── day of month (1 - 31)
# │    \──────────────────── hour (0 - 23)
# \───────────────────────── min (0 - 59)
```

Change into the project root before running `bin/cake`, as shown above.
In the legacy layout use `app/Console/cake` instead.

You can see more info here: <https://en.wikipedia.org/wiki/Cron>
