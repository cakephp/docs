New Features in CakePHP 2.1
###########################

Models
======

Model::saveAll(), Model::saveAssociated(), Model::validateAssociated()
----------------------------------------------------------------------
``Model::saveAll()`` and friends now support passing the `fieldList` for multiple models.

Eg.
    <?php
    $this->SomeModel->saveAll($data, array(
        'fieldList' => array(
            'SomeModel' => array('field_1'),
            'AssociatedModel' => array('field_2', 'field_3')
        )
    ));
