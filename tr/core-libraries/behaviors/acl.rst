ACL
###

.. php:class:: AclBehavior()

The Acl behavior provides a way to seamlessly integrate a model
with your ACL system. It can create both AROs or ACOs
transparently.

To use the new behavior, you can add it to the $actsAs property of
your model. When adding it to the actsAs array you choose to make
the related Acl entry an ARO or an ACO. The default is to create
ACOs::

    class User extends AppModel {
        public $actsAs = array('Acl' => array('type' => 'requester'));
    }

This would attach the Acl behavior in ARO mode. To join the ACL
behavior in ACO mode use::

    class Post extends AppModel {
        public $actsAs = array('Acl' => array('type' => 'controlled'));
    }

For User and Group models it is common to have both ACO and ARO nodes,
to achieve this use::

    class User extends AppModel {
        public $actsAs = array('Acl' => array('type' => 'both'));
    }

You can also attach the behavior on the fly like so::

    $this->Post->Behaviors->load('Acl', array('type' => 'controlled'));

.. versionchanged:: 2.1
    You can now safely attach AclBehavior to AppModel. Aco, Aro and AclNode
    now extend Model instead of AppModel, which would cause an infinite loop.
    If your application depends on having those models to extend AppModel for some reason,
    then copy AclNode to your application and have it extend AppModel again.


Using the AclBehavior
=====================

Most of the AclBehavior works transparently on your Model's
afterSave(). However, using it requires that your Model has a
parentNode() method defined. This is used by the AclBehavior to
determine parent->child relationships. A model's parentNode()
method must return null or return a parent Model reference::

    public function parentNode() {
        return null;
    }

If you want to set an ACO or ARO node as the parent for your Model,
parentNode() must return the alias of the ACO or ARO node::

    public function parentNode() {
        return 'root_node';
    }

A more complete example. Using an example User Model, where User
belongsTo Group::

    public function parentNode() {
        if (!$this->id && empty($this->data)) {
            return null;
        }
        $data = $this->data;
        if (empty($this->data)) {
            $data = $this->read();
        }
        if (!$data['User']['group_id']) {
            return null;
        } else {
            return array('Group' => array('id' => $data['User']['group_id']));
        }
    }

In the above example the return is an array that looks similar to
the results of a model find. It is important to have the id value
set or the parentNode relation will fail. The AclBehavior uses this
data to construct its tree structure.

node()
======

The AclBehavior also allows you to retrieve the Acl node associated
with a model record. After setting $model->id. You can use
$model->node() to retrieve the associated Acl node.

You can also retrieve the Acl Node for any row, by passing in a
data array::

    $this->User->id = 1;
    $node = $this->User->node();

    $user = array('User' => array(
        'id' => 1
    ));
    $node = $this->User->node($user);

Will both return the same Acl Node information.

If you had setup AclBehavior to create both ACO and ARO nodes, you need to
specify which node type you want::

    $this->User->id = 1;
    $node = $this->User->node(null, 'Aro');

    $user = array('User' => array(
        'id' => 1
    ));
    $node = $this->User->node($user, 'Aro');

.. meta::
    :title lang=en: ACL
    :keywords lang=en: group node,array type,root node,acl system,acl entry,parent child relationships,model reference,php class,aros,group id,aco,aro,user group,alias,fly
