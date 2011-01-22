2.4.2 Model and Database Conventions
------------------------------------

Model classnames are singular and CamelCased. Person, BigPerson,
and ReallyBigPerson are all examples of conventional model names.

Table names corresponding to CakePHP models are plural and
underscored. The underlying tables for the above mentioned models
would be people, big\_people, and really\_big\_people,
respectively.

You can use the utility library "Inflector" to check the
singular/plural of words. See the
:doc:`/core-utility-libraries/inflector` for more
information.

Field names with two or more words are underscored like,
first\_name.

Foreign keys in hasMany, belongsTo or hasOne relationships are
recognized by default as the (singular) name of the related table
followed by \_id. So if a Baker hasMany Cake, the cakes table will
refer to the bakers table via a baker\_id foreign key. For a
multiple worded table like category\_types, the foreign key would
be category\_type\_id.

Join tables, used in hasAndBelongsToMany (HABTM) relationships
between models should be named after the model tables they will
join in alphabetical order (apples\_zebras rather than
zebras\_apples).

All tables with which CakePHP models interact (with the exception
of join tables), require a singular primary key to uniquely
identify each row. If you wish to model a table which does not have
a single-field primary key, CakePHP's convention is that a
single-field primary key is added to the table. You have to add a
single-field primary key if you want to use that table's model.

CakePHP does not support composite primary keys. If you want to
directly manipulate your join table data, use direct
`query <http://docs.cakephp.org/view/1027/query>`_ calls or add a primary key to act on it
as a normal model. E.g.:

::

    CREATE TABLE posts_tags (
    id INT(10) NOT NULL AUTO_INCREMENT,
    post_id INT(10) NOT NULL,
    tag_id INT(10) NOT NULL,
    PRIMARY KEY(id)); 

Rather than using an auto-increment key as the primary key, you may
also use char(36). Cake will then use a unique 36 character uuid
(String::uuid) whenever you save a new record using the Model::save
method.
