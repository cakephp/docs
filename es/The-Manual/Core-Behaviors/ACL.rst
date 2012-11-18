ACL
###

El comportamiento Acl provee una forma de integrar un modelo con tu
sistema ACL. Puede crear tanto los AROs o los ACOs transparentemente.

Para usar el nuevo comportamiento, puedes añadirlo a la propiedad
$actsAs de tu modelo. Cuando lo agregas al arreglo $actsAs, se pueden
elegir entre hacer la entrada actual como un ARO o un ACO. El valor por
defecto es para crear AROs.

::

    class User extends AppModel {
        var $actsAs = array('Acl' => array('type' => 'requester'));
    }

Esto incluye el comportamiento de Acl en el modo ARO. Para que el
comportamiento ACL sea ACO, se debe usar:

::

    class Post extends AppModel {
        var $actsAs = array('Acl' => array('type' => 'controlled'));
    }

Se puede agregar el comportamiento ACL al vuelo, de la siguiente forma:

::

        $this->Post->Behaviors->attach('Acl', array('type' => 'controlled'));

Using the AclBehavior
=====================

Muchos de los comportamientos ACL funcionan transparentemente en el
método afterSave() del Modelo. Sin embargo, usarlo requiere que tu
Modelo tenga el método parentNode() definido. Esto es usado por el
comportamiento ACL para determinar las relaciones padre-hijo. El método
parentNode() del modelo debe retornar null, o bien, retornar una
referencia al modelo padre.

::

    function parentNode() {
        return null;
    }

Si se quiere setear un nodo ACO o ARO como padre del modelo,
parentNode() debe retornar el alias del nodo ACO o ARO.

::

    function parentNode() {
            return 'root_node';
    }

Un ejemplo más completo. Usando un modelo User, donde User tiene la
relación belongsTo con el modelo Group.

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

En el ejemplo de arriba el valor de retorno es un arreglo que tiene la
misma estructura que el resultado de la operación find() del modelo. Es
importante setear el valor del id o la relacion parentNode fallará. El
comportamiento Acl usa esta data para construir la estructura del árbol.

node()
======

El comportamiento ACL también permite rescatar el nodo ACL asociado al
registro del modelo. Despues de setear $model->id se puede utilizar
$model->node() para rescatar el nodo ACL asociado.

Tambien se puede rescatar el nodo ACL de cualquier fila, pasandolo
dentro de un arreglo.

::

        $this->User->id = 1;
        $node = $this->User->node();
        
        $user = array('User' => array(
            'id' => 1
        ));
        $node = $this->User->node($user);

Ambos retornaran la misma información del nodo ACL.
