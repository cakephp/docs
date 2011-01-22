6.1.1 Using the AclBehavior
---------------------------

Most of the AclBehavior works transparently on your Model's
afterSave(). However, using it requires that your Model has a
parentNode() method defined. This is used by the AclBehavior to
determine parent->child relationships. A model's parentNode()
method must return null or return a parent Model reference.

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

In the above example the return is an array that looks similar to
the results of a model find. It is important to have the id value
set or the parentNode relation will fail. The AclBehavior uses this
data to construct its tree structure.
