6.4.1 Requirements
------------------

To use the tree behavior, your database table needs 3 fields as
listed below (all are ints):


-  parent - default fieldname is parent\_id, to store the id of the
   parent object
-  left - default fieldname is lft, to store the lft value of the
   current row.
-  right - default fieldname is rght, to store the rght value of
   the current row.

If you are familiar with MPTT logic you may wonder why a parent
field exists - quite simply it's easier to do certain tasks if a
direct parent link is stored on the database - such as finding
direct children.

The ``parent`` field must be able to have a NULL value! It might
seem to work, if you just give the top elements a parent value of
zero, but reordering the tree (and possible other operations) will
fail.
