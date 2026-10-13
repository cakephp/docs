# Running Shells as cronjobs

::: pieceofcake2
In the pieceofcake2 fork with the modern layout, change into the project root and use `bin/cake`
(for example `cd /full/path/to/project && bin/cake myshell myparam`).
`vendor/bin/cake` works with both layouts.
:::

A common thing to do with a shell is making it run as a cronjob to
clean up the database once in a while or send newsletters. This is
trivial to setup, for example:

``` text
*/5  *    *    *    *  cd /full/path/to/app && Console/cake myshell myparam
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

You can see more info here: <https://en.wikipedia.org/wiki/Cron>
