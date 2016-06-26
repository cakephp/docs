ACL
###

.. php:class:: AclBehavior()

Le behavior Acl fournit une solution pour intégrer sans souci un model
dans votre système ACL. Il peut créer à la fois les AROs et les ACOs de
manière transparente.

Pour utiliser le nouveau behavior, vous pouvez l'ajouter à la propriété
$actsAs de votre model. Quand vous l'ajoutez au tableau actsAs, vous
choisissez de créer l'entrée Acl correspondante comme un ARO ou un ACO.
Par défaut, cela crée des AROs::

    class User extends AppModel {
        public $actsAs = array('Acl' => array('type' => 'requester'));
    }

Ceci attacherait le behavior Acl en mode ARO. Pour attacher le behavior
ACL en mode ACO, utilisez::

    class Post extends AppModel {
        public $actsAs = array('Acl' => array('type' => 'controlled'));
    }

Pour les models d'user et de group il est fréquent d'avoir à la fois
les noeuds ACO et ARO, pour permettre cela utilisez::

    class User extends AppModel {
        public $actsAs = array('Acl' => array('type' => 'both'));
    }

Vous pouvez aussi attacher le behavior à la volée, comme ceci::

    $this->Post->Behaviors->attach('Acl', array('type' => 'controlled'));

.. versionchanged:: 2.1
    Vous pouvez maintenant attacher en toute sécurité le behavior Acl
    (AclBehavior) à votre Appmodel. Aco, Aro et Noeud Acl (AclNode) sont
    dorénavant des extensions du Model et non plus de l'AppModel, ceci
    pouvait causer une boucle infinie. Si pour certaines raisons, votre
    application est dépendante de l'utilisation des models comme extension
    de l'AppModel, alors copiez Le Noeud Acl (AclNode) dans votre application
    et étendez à nouveau AppModel.

Utiliser le behavior Acl
========================

La plupart des tâches du behavior Acl sont réalisées de façon transparente,
dans le callback afterSave() de votre model. Cependant, son utilisation
nécessite que votre Model ait une méthode parentNode() définie. Ceci est
utilisé par le behavior Acl, pour déterminer les relations parent->enfant.
Une méthode parentNode() de model doit retourner null ou une référence au
Model parent::

    public function parentNode() {
        return null;
    }

Si vous voulez définir un nœud ACO ou ARO comme parent pour votre Model,
parentNode() doit retourner l'alias du nœud ACO ou ARO::

    public function parentNode() {
        return 'root_node';
    }

Voici un exemple plus complet. Utilisons un model d'exemple User, avec User
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
        }
        return array('Group' => array('id' => $data['User']['group_id']));
    }

Dans l'exemple ci-dessus, le retour est un tableau qui ressemble aux résultats
d'un find de model. Il est important d'avoir une valeur d'id définie ou bien
la relation parentNode échouera. Le behavior Acl utilise ces données pour
construire son arborescense.

node()
======

Le Behavior Acl vous permet aussi de récupérer le nœud Acl associé à un
enregistrement de model. Après avoir défini $model->id. Vous pouvez utiliser
$model->node() pour récupérer le nœud Acl associé.

Vous pouvez aussi récupérer le nœud Acl de n'importe quelle ligne, en passant
un tableau de données en paramètre::

    $this->User->id = 1;
    $noeud = $this->User->node();

    $user = array('User' => array(
        'id' => 1
    ));
    $noeud = $this->User->node($user);

Ces deux exemples retourneront la même information de nœud Acl.

Si vous avez paramétré le behavior Acl (AclBehavior) pour créer à la fois
les noeuds ARO et ACO, vous devez spécifier quel type de noeud vous desirez::

    $this->User->id = 1;
    $noeud = $this->User->node(null, 'Aro');

    $user = array('User' => array(
        'id' => 1
    ));
    $noeud = $this->User->node($user, 'Aro');

.. meta::
    :title lang=fr: ACL
    :keywords lang=fr: group node,array type,root node,acl system,acl entry,parent child relationships,model reference,php class,aros,group id,aco,aro,user group,alias,fly
