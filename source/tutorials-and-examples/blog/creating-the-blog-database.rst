11.1.2 Creating the Blog Database
---------------------------------

Next, lets set up the underlying database for our blog. if you
haven't already done so, create an empty database for use in this
tutorial, with a name of your choice. Right now, we'll just create
a single table to store our posts. We'll also throw in a few posts
right now to use for testing purposes. Execute the following SQL
statements into your database:

::

    /* First, create our posts table: */
    CREATE TABLE posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );
    
    /* Then insert some posts for testing: */
    INSERT INTO posts (title,body,created)
        VALUES ('The title', 'This is the post body.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('A title once again', 'And the post body follows.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('Title strikes back', 'This is really exciting! Not.', NOW());

The choices on table and column names are not arbitrary. If you
follow Cake's database naming conventions, and Cake's class naming
conventions (both outlined in
:doc:`/basic-principles-of-cakephp/cakephp-conventions`), you'll be able to take
advantage of a lot of free functionality and avoid configuration.
Cake is flexible enough to accomodate even the worst legacy
database schema, but adhering to convention will save you time.

Check out :doc:`/basic-principles-of-cakephp/cakephp-conventions` for more
information, but suffice it to say that naming our table 'posts'
automatically hooks it to our Post model, and having fields called
'modified' and 'created' will be automagically managed by Cake.
