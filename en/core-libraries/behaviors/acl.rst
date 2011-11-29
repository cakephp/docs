ACL
###

.. php:class:: AclBehavior()

The Acl behavior provides a way to seamlessly integrate a model
with your ACL system. It can create both AROs or ACOs
transparently.

To use the new behavior, you can add it to the $actsAs property of
your model. When adding it to the actsAs array you choose to make
the related Acl entry an ARO or an ACO. The default is to create
AROs::

    <?php
    class User extends AppModel {
        public $actsAs = array('Acl' => array('type' => 'requester'));
    }

This would attach the Acl behavior in ARO mode. To join the ACL
behavior in ACO mode use::

    <?php
    class Post extends AppModel {
        public $actsAs = array('Acl' => array('type' => 'controlled'));
    }

You can also attach the behavior on the fly like so::

    <?php
    $this->Post->Behaviors->attach('Acl', array('type' => 'controlled'));

Using the AclBehavior
=====================

Most of the AclBehavior works transparently on your Model's
afterSave(). However, using it requires that your Model has a
parentNode() method defined. This is used by the AclBehavior to
determine parent->child relationships. A model's parentNode()
method must return null or return a parent Model reference::

    <?php
    function parentNode() {
        return null;
    }

If you want to set an ACO or ARO node as the parent for your Model,
parentNode() must return the alias of the ACO or ARO node::

    <?php
    function parentNode() {
        return 'root_node';
    }

A more complete example. Using an example User Model, where User
belongsTo Group::

    <?php
    function parentNode() {
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
            $this->Group->id = $data['User']['group_id'];
            $groupNode = $this->Group->node();
            return array('Group' => array('id' => $groupNode[0]['Aro']['foreign_key']));
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

    <?php
    $this->User->id = 1;
    $node = $this->User->node();
    
    $user = array('User' => array(
        'id' => 1
    ));
    $node = $this->User->node($user);

Will both return the same Acl Node information.



.. meta::
    :title lang=en: ACL
    :keywords lang=en: group node,array type,root node,acl system,acl entry,parent child relationships,model reference,php class,aros,group id,aco,aro,user group,alias,fly