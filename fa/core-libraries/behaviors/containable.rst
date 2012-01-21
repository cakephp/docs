Containable
###########

.. php:class:: ContainableBehavior()

A new addition to the CakePHP 1.2 core is the
``ContainableBehavior``. This model behavior allows you to filter
and limit model find operations. Using Containable will help you
cut down on needless wear and tear on your database, increasing the
speed and overall performance of your application. The class will
also help you search and filter your data for your users in a clean
and consistent way.

Containable allows you to streamline and simplify operations on
your model bindings. It works by temporarily or permanently
altering the associations of your models. It does this by using
supplied the containments to generate a series of ``bindModel`` and
``unbindModel`` calls.

To use the new behavior, you can add it to the $actsAs property of
your model::

    <?php
    class Post extends AppModel {
        public $actsAs = array('Containable');
    }

You can also attach the behavior on the fly::

    <?php
    $this->Post->Behaviors->attach('Containable');

.. _using-containable:

Using Containable
~~~~~~~~~~~~~~~~~

To see how Containable works, let's look at a few examples. First,
we'll start off with a find() call on a model named Post. Let's say
that Post hasMany Comment, and Post hasAndBelongsToMany Tag. The
amount of data fetched in a normal find() call is rather
extensive::

    <?php
    debug($this->Post->find('all'));
    
    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => First article
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [post_id] => 1
                                [author] => Daniel
                                [email] => dan@example.com
                                [website] => http://example.com
                                [comment] => First comment
                                [created] => 2008-05-18 00:00:00
                            )
                        [1] => Array
                            (
                                [id] => 2
                                [post_id] => 1
                                [author] => Sam
                                [email] => sam@example.net
                                [website] => http://example.net
                                [comment] => Second comment
                                [created] => 2008-05-18 00:00:00
                            )
                    )
                [Tag] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [name] => Awesome
                            )
                        [1] => Array
                            (
                                [id] => 2
                                [name] => Baking
                            )
                    )
            )
    [1] => Array
            (
                [Post] => Array
                    (...

For some interfaces in your application, you may not need that much
information from the Post model. One thing the
``ContainableBehavior`` does is help you cut down on what find()
returns.

For example, to get only the post-related information, you can do
the following::

    <?php
    $this->Post->contain();
    $this->Post->find('all');

You can also invoke Containable's magic from inside the find()
call::

    <?php
    $this->Post->find('all', array('contain' => false));

Having done that, you end up with something a lot more concise::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => First article
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
            )
    [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [title] => Second article
                        [content] => bbb
                        [created] => 2008-05-19 00:00:00
                    )
            )

This sort of help isn't new: in fact, you can do that without the
``ContainableBehavior`` doing something like this::

    <?php
    $this->Post->recursive = -1;
    $this->Post->find('all');

Containable really shines when you have complex associations, and
you want to pare down things that sit at the same level. The
model's ``$recursive`` property is helpful if you want to hack off
an entire level of recursion, but not when you want to pick and
choose what to keep at each level. Let's see how it works by using
the ``contain()`` method.

The contain method's first argument accepts the name, or an array
of names, of the models to keep in the find operation. If we wanted
to fetch all posts and their related tags (without any comment
information), we'd try something like this::

    <?php
    $this->Post->contain('Tag');
    $this->Post->find('all');

Again, we can use the contain key inside a find() call::

    <?php
    $this->Post->find('all', array('contain' => 'Tag'));

Without Containable, you'd end up needing to use the
``unbindModel()`` method of the model, multiple times if you're
paring off multiple models. Containable creates a cleaner way to
accomplish this same task.

Containing deeper associations
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Containable also goes a step deeper: you can filter the data of the
*associated* models. If you look at the results of the original
find() call, notice the author field in the Comment model. If you
are interested in the posts and the names of the comment authors —
and nothing else — you could do something like the following::

    <?php
    $this->Post->contain('Comment.author');
    $this->Post->find('all');
    
    // or..
    
    $this->Post->find('all', array('contain' => 'Comment.author'));

Here, we've told Containable to give us our post information, and
just the author field of the associated Comment model. The output
of the find call might look something like this::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => First article
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [author] => Daniel
                                [post_id] => 1
                            )
                        [1] => Array
                            (
                                [author] => Sam
                                [post_id] => 1
                            )
                    )
            )
    [1] => Array
            (...

As you can see, the Comment arrays only contain the author field
(plus the post\_id which is needed by CakePHP to map the results).

You can also filter the associated Comment data by specifying a
condition::

    <?php
    $this->Post->contain('Comment.author = "Daniel"');
    $this->Post->find('all');
    
    //or...
    
    $this->Post->find('all', array('contain' => 'Comment.author = "Daniel"'));

This gives us a result that gives us posts with comments authored
by Daniel::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => First article
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [post_id] => 1
                                [author] => Daniel
                                [email] => dan@example.com
                                [website] => http://example.com
                                [comment] => First comment
                                [created] => 2008-05-18 00:00:00
                            )
                    )
            )

Additional filtering can be performed by supplying the standard :ref:`model-find` options::

    <?php
    $this->Post->find('all', array('contain' => array(
        'Comment' => array(
            'conditions' => array('Comment.author =' => "Daniel"),
            'order' => 'Comment.created DESC'
        )
    )));

Here's an example of using the ``ContainableBehavior`` when you've
got deep and complex model relationships.

Let's consider the following model associations::

    User->Profile
    User->Account->AccountSummary
    User->Post->PostAttachment->PostAttachmentHistory->HistoryNotes
    User->Post->Tag

This is how we retrieve the above associations with Containable::

    <?php
    $this->User->find('all', array(
        'contain' => array(
            'Profile',
            'Account' => array(
                'AccountSummary'
            ),
            'Post' => array(
                'PostAttachment' => array(
                    'fields' => array('id', 'name'),
                    'PostAttachmentHistory' => array(
                        'HistoryNotes' => array(
                            'fields' => array('id', 'note')
                        )
                    )
                ),
                'Tag' => array(
                    'conditions' => array('Tag.name LIKE' => '%happy%')
                )
            )
        )
    ));

Keep in mind that ``contain`` key is only used once in the main
model, you don't need to use 'contain' again for related models

.. note::

    When using 'fields' and 'contain' options - be careful to include
    all foreign keys that your query directly or indirectly requires.
    Please also note that because Containable must to be attached to
    all models used in containment, you may consider attaching it to
    your AppModel.

ContainableBehavior options
~~~~~~~~~~~~~~~~~~~~~~~~~~~

The ``ContainableBehavior`` has a number of options that can be set
when the Behavior is attached to a model. The settings allow you to
fine tune the behavior of Containable and work with other behaviors
more easily.


-  **recursive** (boolean, optional) set to true to allow
   containable to automatically determine the recursiveness level
   needed to fetch specified models, and set the model recursiveness
   to this level. setting it to false disables this feature. The
   default value is ``true``.
-  **notices** (boolean, optional) issues E\_NOTICES for bindings
   referenced in a containable call that are not valid. The default
   value is ``true``.
-  **autoFields**: (boolean, optional) auto-add needed fields to
   fetch requested bindings. The default value is ``true``.

You can change ContainableBehavior settings at run time by
reattaching the behavior as seen in
:doc:`/models/additional-methods-and-properties`

ContainableBehavior can sometimes cause issues with other behaviors
or queries that use aggregate functions and/or GROUP BY statements.
If you get invalid SQL errors due to mixing of aggregate and
non-aggregate fields, try disabling the ``autoFields`` setting.::

    <?php
    $this->Post->Behaviors->attach('Containable', array('autoFields' => false));

Using Containable with pagination
=================================

By including the 'contain' parameter in the ``$paginate`` property
it will apply to both the find('count') and the find('all') done on
the model

See the section :ref:`using-containable` for further details.

Here's an example of how to contain associations when paginating::

    <?php
    $this->paginate['User'] = array(
        'contain' => array('Profile', 'Account'),
        'order' => 'User.username'
    );

    $users = $this->paginate('User');


.. meta::
    :title lang=en: Containable
    :keywords lang=en: model behavior,author daniel,article content,new addition,wear and tear,array,aaa,email,fly,models