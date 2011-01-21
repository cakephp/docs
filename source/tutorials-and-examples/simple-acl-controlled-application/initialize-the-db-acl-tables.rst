11.2.3 Initialize the Db Acl tables
-----------------------------------

Before we create any users or groups we will want to connect them
to the Acl. However, we do not at this time have any Acl tables and
if you try to view any pages right now, you will get a missing
table error ("Error: Database table acos for model Aco was not
found."). To remove these errors we need to run a schema file. In a
shell run the following:
::

        cake schema create DbAcl

This schema will prompt you to drop and create the tables. Say yes
to dropping and creating the tables.

If you don't have shell access, or are having trouble using the
console, you can run the sql file found in
/path/to/app/config/schema/db\_acl.sql.

With the controllers setup for data entry, and the Acl tables
initialized we are ready to go right? Not entirely, we still have a
bit of work to do in the user and group models. Namely, making them
auto-magically attach to the Acl.

11.2.3 Initialize the Db Acl tables
-----------------------------------

Before we create any users or groups we will want to connect them
to the Acl. However, we do not at this time have any Acl tables and
if you try to view any pages right now, you will get a missing
table error ("Error: Database table acos for model Aco was not
found."). To remove these errors we need to run a schema file. In a
shell run the following:
::

        cake schema create DbAcl

This schema will prompt you to drop and create the tables. Say yes
to dropping and creating the tables.

If you don't have shell access, or are having trouble using the
console, you can run the sql file found in
/path/to/app/config/schema/db\_acl.sql.

With the controllers setup for data entry, and the Acl tables
initialized we are ready to go right? Not entirely, we still have a
bit of work to do in the user and group models. Namely, making them
auto-magically attach to the Acl.
