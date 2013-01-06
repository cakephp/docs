Listes de Contrôle d'Accès (ACL)
################################

Le comportement Acl fournit une solution pour intégrer sans souci un
modèle dans votre système ACL. Il peut créer à la fois les AROs et les
ACOs de manière transparente.

Pour utiliser le nouveau comportement, vous pouvez l'ajouter à la
propriété $actsAs de votre modèle. Quand vous l'ajoutez au tableau
actsAs, vous choisissez de créer l'entrée Acl correspondante comme un
ARO ou un ACO. Par défaut cela crée des AROs.

::

    class Utilisateur extends AppModel {
        var $actsAs = array('Acl' => array('type' => 'requester'));
    }

Ceci attacherait le comportement Acl en mode ARO. Pour joindre le
comportement ACL dans un mode ACO, utilisez :

::

    class Post extends AppModel {
        var $actsAs = array('Acl' => array('type' => 'controlled'));
    }

Vous pouvez aussi attacher le comportement à la volée, comme ceci :

::

        $this->Post->Behaviors->attach('Acl', array('type' => 'controlled'));

Utiliser le Comportement Acl
============================

La plupart des tâches du comportement Acl sont réalisées de façon
transparente, dans le callback afterSave() de votre modèle. Cependant,
son utilisation nécessite que votre Modèle ait une méthode parentNode()
définie. Ceci est utilisé par le comportement Acl, pour déterminer les
relations parent->enfant. Une méthode parentNode() de modèle doit
retourner null ou une référence au Modèle parent.

::

    function parentNode() {
        return null;
    }

Si vous voulez définir un nœud ACO ou ARO comme parent pour votre
Modèle, parentNode() doit retourner l'alias du nœud ACO ou ARO.

::

    function parentNode() {
            return 'noeud_racine';
    }

Voici un exemple plus complet. Utilisons un modèle exemple Utilisateur,
avec Utilisateur belongsTo Groupe.

::

    function parentNode() {
        if (!$this->id && empty($this->data)) {
            return null;
        }
        $data = $this->data;
        if (empty($this->data)) {
            $data = $this->read();
        } 
        if (!$data['Utilisateur']['groupe_id']) {
            return null;
        } else {
            $this->Groupe->id = $data['Utilisateur']['groupe_id'];
            $noeudGroupe = $this->Groupe->node();
            return array('Groupe' => array('id' => $noeudGroupe[0]['Aro']['foreign_key']));
        }
    }

Dans l'exemple ci-dessus, le retour est un tableau qui ressemble aux
résultats d'un find de modèle. Il est important d'avoir une valeur d'id
définie ou bien la relation parentNode échouera. Le comportement Acl
utilise ces données pour construire sa structure en arbre.

node()
======

Le Comportement Acl vous permet aussi de récupérer le nœud Acl associé à
un enregistrement de modèle. Après avoir défini $model->id. Vous pouvez
utiliser $model->node() pour récupérer le nœud Acl associé.

Vous pouvez aussi récupérer le nœud Acl de n'importe quelle ligne, en
passant un tableau de données en paramètre.

::

        $this->Utilisateur->id = 1;
        $noeud = $this->Utilisateur->node();
        
        $utilisateur = array('Utilisateur' => array(
            'id' => 1
        ));
        $noeud = $this->Utilisateur->node($utilisateur);

Ces deux exemples retourneront la même information de nœud Acl.
