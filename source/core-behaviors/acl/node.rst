6.1.2 node()
------------

The AclBehavior also allows you to retrieve the Acl node associated
with a model record. After setting $model->id. You can use
$model->node() to retrieve the associated Acl node.

You can also retrieve the Acl Node for any row, by passing in a
data array.

::

        $this->User->id = 1;
        $node = $this->User->node();
        
        $user = array('User' => array(
            'id' => 1
        ));
        $node = $this->User->node($user);

Will both return the same Acl Node information.

6.1.2 node()
------------

The AclBehavior also allows you to retrieve the Acl node associated
with a model record. After setting $model->id. You can use
$model->node() to retrieve the associated Acl node.

You can also retrieve the Acl Node for any row, by passing in a
data array.

::

        $this->User->id = 1;
        $node = $this->User->node();
        
        $user = array('User' => array(
            'id' => 1
        ));
        $node = $this->User->node($user);

Will both return the same Acl Node information.
