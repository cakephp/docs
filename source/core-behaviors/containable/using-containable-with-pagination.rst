6.2.1 Using Containable with pagination
---------------------------------------

By including the 'contain' parameter in the ``$paginate`` property
it will apply to both the find('count') and the find('all') done on
the model

See the section
`Using Containable <http://book.cakephp.org/view/1324/Using-Containable>`_
for further details.

Here's an example of how to contain associations when paginating.

::

    $this->paginate['User'] = array(
        'contain' => array('Profile', 'Account'),
        'order' => 'User.username'
    );
    
    $users = $this->paginate('User');
