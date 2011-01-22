6.1 ACL
-------

The Acl behavior provides a way to seamlessly integrate a model
with your ACL system. It can create both AROs or ACOs
transparently.

To use the new behavior, you can add it to the $actsAs property of
your model. When adding it to the actsAs array you choose to make
the related Acl entry an ARO or an ACO. The default is to create
AROs.

::

    class User extends AppModel {
        var $actsAs = array('Acl' => array('type' => 'requester'));
    }

This would attach the Acl behavior in ARO mode. To join the ACL
behavior in ACO mode use:

::

    class Post extends AppModel {
        var $actsAs = array('Acl' => array('type' => 'controlled'));
    }

You can also attach the behavior on the fly like so:

::

        $this->Post->Behaviors->attach('Acl', array('type' => 'controlled'));
