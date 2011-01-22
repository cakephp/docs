11.2.1 Preparing our Application
--------------------------------

First, let's get a copy of fresh Cake code.

To get a fresh download, visit the CakePHP project at Cakeforge:
http://github.com/cakephp/cakephp/downloads and download the stable
release. For this tutorial you need the latest 1.3 release.

You can also checkout/export a fresh copy of our trunk code at:
git://github.com/cakephp/cakephp.git

Once you've got a fresh copy of cake setup your database.php config
file, and change the value of Security.salt in your
app/config/core.php. From there we will build a simple database
schema to build our application on. Execute the following SQL
statements into your database.

::

    CREATE TABLE users (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password CHAR(40) NOT NULL,
        group_id INT(11) NOT NULL,
        created DATETIME,
        modified DATETIME
    );
    
     
    CREATE TABLE groups (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created DATETIME,
        modified DATETIME
    );
    
    
    CREATE TABLE posts (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT(11) NOT NULL,
        title VARCHAR(255) NOT NULL,
        body TEXT,
        created DATETIME,
        modified DATETIME
    );
    
    CREATE TABLE widgets (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        part_no VARCHAR(12),
        quantity INT(11)
    );

These are the tables we will be using to build the rest of our
application. Once we have the table structure in the database we
can start cooking. Use
:doc:`/core-console-applications/code-generation-with-bake` to quickly
create your models, controllers, and views.

To use cake bake, call "cake bake all" and this will list the 4
tables you inserted into mySQL. Select "1. Group", and follow the
prompts. Repeat for the other 3 tables, and this will have
generated the 4 controllers, models and your views for you.

Avoid using Scaffold here. The generation of the ACOs will be
seriously affected if you bake the controllers with the Scaffold
feature.

While baking the Models cake will automagically detect the
associations between your Models (or relations between your
tables). Let cake supply the correct hasMany and belongsTo
associations. If you are prompted to pick hasOne or hasMany,
generally speaking you'll need a hasMany (only) relationships for
this tutorial.

Leave out admin routing for now, this is a complicated enough
subject without them. Also be sure **not** to add either the Acl or
Auth Components to any of your controllers as you are baking them.
We'll be doing that soon enough. You should now have models,
controllers, and baked views for your users, groups, posts and
widgets.
