ACL
###

O behavior Acl provê uma maneira discreta de integrar um model com o seu
sistema Acl. Ele pode criar AROs e ACOs de maneira transparente.

Para usar um novo behavior, basta adicioná-lo à propriedade $actAs do
seu model. Ao adicionar o behavior você pode optar por fazer dessa
entrada um ARO ou um ACO. O padrão é criar um ARO.

::

    class User extends AppModel {
        var $actsAs = array('Acl' => array('type' => 'requester'));
    }

A maneira acima vincula o behavior Acl como ARO. Para vincular como o
behavior como ACO use:

::

    class Post extends AppModel {
        var $actsAs = array('Acl' => array('type' => 'controlled'));
    }

Você pode ainda vincular o behavior Acl facilmente da seguinte maneira:

::

        $this->Post->Behaviors->attach('Acl', array('type' => 'controlled'));

Using the AclBehavior
=====================

Most of the AclBehavior works transparently on your Model's afterSave().
However, using it requires that your Model has a parentNode() method
defined. This is used by the AclBehavior to determine parent->child
relationships. A model's parentNode() method must return null or return
a parent Model reference.

::

    function parentNode() {
        return null;
    }

If you want to set an ACO or ARO node as the parent for your Model,
parentNode() must return the alias of the ACO or ARO node.

::

    function parentNode() {
            return 'root_node';
    }

A more complete example. Using an example User Model, where User
belongsTo Group.

::

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

In the above example the return is an array that looks similar to the
results of a model find. It is important to have the id value set or the
parentNode relation will fail. The AclBehavior uses this data to
construct its tree structure.

node()
======

The AclBehavior also allows you to retrieve the Acl node associated with
a model record. After setting $model->id. You can use $model->node() to
retrieve the associated Acl node.

You can also retrieve the Acl Node for any row, by passing in a data
array.

::

        $this->User->id = 1;
        $node = $this->User->node();
        
        $user = array('User' => array(
            'id' => 1
        ));
        $node = $this->User->node($user);

Will both return the same Acl Node information.
