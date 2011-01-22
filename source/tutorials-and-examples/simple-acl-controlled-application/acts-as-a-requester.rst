11.2.4 Acts As a Requester
--------------------------

For Auth and Acl to work properly we need to associate our users
and groups to rows in the Acl tables. In order to do this we will
use the ``AclBehavior``. The ``AclBehavior`` allows for the
automagic connection of models with the Acl tables. Its use
requires an implementation of ``parentNode()`` on your model. In
our ``User`` model we will add the following.

::

    var $name = 'User';
    var $belongsTo = array('Group');
    var $actsAs = array('Acl' => array('type' => 'requester'));
     
    function parentNode() {
        if (!$this->id && empty($this->data)) {
            return null;
        }
        if (isset($this->data['User']['group_id'])) {
        $groupId = $this->data['User']['group_id'];
        } else {
            $groupId = $this->field('group_id');
        }
        if (!$groupId) {
        return null;
        } else {
            return array('Group' => array('id' => $groupId));
        }
    }

Then in our ``Group`` Model Add the following:

::

    var $actsAs = array('Acl' => array('type' => 'requester'));
     
    function parentNode() {
        return null;
    }

What this does, is tie the ``Group`` and ``User`` models to the
Acl, and tell CakePHP that every-time you make a User or Group you
want an entry on the ``aros`` table as well. This makes Acl
management a piece of cake as your AROs become transparently tied
to your ``users`` and ``groups`` tables. So anytime you create or
delete a user/group the Aro table is updated.

Our controllers and models are now prepped for adding some initial
data, and our ``Group`` and ``User`` models are bound to the Acl
table. So add some groups and users using the baked forms by
browsing to http://example.com/groups/add and
http://example.com/users/add. I made the following groups:


-  administrators
-  managers
-  users

I also created a user in each group so I had a user of each
different access group to test with later. Write everything down or
use easy passwords so you don't forget. If you do a
``SELECT * FROM aros;`` from a mysql prompt you should get
something like the following:

::

    +----+-----------+-------+-------------+-------+------+------+
    | id | parent_id | model | foreign_key | alias | lft  | rght |
    +----+-----------+-------+-------------+-------+------+------+
    |  1 |      NULL | Group |           1 | NULL  |    1 |    4 |
    |  2 |      NULL | Group |           2 | NULL  |    5 |    8 |
    |  3 |      NULL | Group |           3 | NULL  |    9 |   12 |
    |  4 |         1 | User  |           1 | NULL  |    2 |    3 |
    |  5 |         2 | User  |           2 | NULL  |    6 |    7 |
    |  6 |         3 | User  |           3 | NULL  |   10 |   11 |
    +----+-----------+-------+-------------+-------+------+------+
    6 rows in set (0.00 sec)

This shows us that we have 3 groups and 3 users. The users are
nested inside the groups, which means we can set permissions on a
per-group or per-user basis.

11.2.4.1 Group-only ACL
~~~~~~~~~~~~~~~~~~~~~~~

In case we want simplified per-group only permissions, we need to
implement ``bindNode()`` in ``User`` model.

::

    function bindNode($user) {
        return array('model' => 'Group', 'foreign_key' => $user['User']['group_id']);
    }

This method will tell ACL to skip checking ``User`` Aro's and to
check only ``Group`` Aro's.

Every user has to have assigned ``group_id`` for this to work.

In this case our ``aros`` table will look like this:

::

    +----+-----------+-------+-------------+-------+------+------+
    | id | parent_id | model | foreign_key | alias | lft  | rght |
    +----+-----------+-------+-------------+-------+------+------+
    |  1 |      NULL | Group |           1 | NULL  |    1 |    2 |
    |  2 |      NULL | Group |           2 | NULL  |    3 |    4 |
    |  3 |      NULL | Group |           3 | NULL  |    5 |    6 |
    +----+-----------+-------+-------------+-------+------+------+
    3 rows in set (0.00 sec)
