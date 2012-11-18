ACL
###

Das ACL Verhalten bietet die Möglichkeit bequem und einfach alle
*Models* mit dem ACL System zu verbinden. Dabei können sowohl *AROs* als
auch *ACOs* definiert werden.

Um diese Verhaltensweise nutzen zu können, muss man es zu dem *$actsAs*
Array im Model hinzufügen. Dabei gibt man direkt an, ob es sich hierbei
um ein *ARO* oder ein *ACO* handelt. Standardmäßig erstellt man *AROs*.

Folgender Code würde das ACL-Verhalten im *ARO* Modus aktivieren.

::

    class User extends AppModel {
        var $actsAs = array('Acl' => array('type' => 'requester'));
    }

Folgender Code würde das ACL-Verhalten im *ACO* Modus aktivieren.

::

    class Post extends AppModel {
        var $actsAs = array('Acl' => array('type' => 'controlled'));
    }

So kann man das ACL-Verhalten direkt zur Laufzeit aktivieren:

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

Das ACL-Verhalten erlaubt es zu einem *Model-Record* die passende
*ACL-Node* zu finden. Wenn *$model->id* gesetzt ist, kann man einfach
*$model->node()* benutzen, um die dazu passende ACL-Node zu erhalten.

Man kann auch die *ACL-Node* für jede Zeile finden, indem man ein
data-array übergibt.

::

        $this->User->id = 1;
        $node = $this->User->node();
        
        $user = array('User' => array(
            'id' => 1
        ));
        $node = $this->User->node($user);

Beides würde die gleiche, dazugehörige *ACL-Node* zurückliefern.
