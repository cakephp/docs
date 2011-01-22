6.4 Tree
--------

It's fairly common to want to store hierarchical data in a database
table. Examples of such data might be categories with unlimited
subcategories, data related to a multilevel menu system or a
literal representation of hierarchy such as is used to store access
control objects with ACL logic.

For small trees of data, or where the data is only a few levels
deep it is simple to add a parent\_id field to your database table
and use this to keep track of which item is the parent of what.
Bundled with cake however, is a powerful behavior which allows you
to use the benefits of
`MPTT logic <http://dev.mysql.com/tech-resources/articles/hierarchical-data.html>`_
without worrying about any of the intricacies of the technique -
unless you want to ;).
