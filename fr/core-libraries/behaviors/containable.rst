Containable
########

.. php:class:: ContainableBehavior

Une nouvelle intégration au coeur de CakePHP est le Comportement "Containable" ``ContainableBehavior``. Ce comportement de modèle vous permet de filtrer et limiter les opérations de récupération de données "find". Utiliser Containable vous aidera a réduire l'utilisation inutile de votre base de données et augmentera la vitesse et la plupart des performances de votre application. La class vous aidera aussi a chercher et filtrer vos données pour vos utilisateurs d'une façon propre et consistante.

Le comportement "Containable" vous permet de rationaliser et simplifier les opérations de
construction du modèle. Il agit en modifiant temporairement ou définitivement les associations de vos modèles. Il fait cela en utilisant des "containements" pour génerer une série d'appels ``bindModel`` et ``unbindModel``.  

Pour utiliser le nouveau comportement, vous pouvez l'ajouter à la propriété $actAs de votre modèle::


    <?php
    class Post extends AppModel {
        public $actsAs = array('Containable');
    }

Vous pouvez aussi attacher le comportement à la volée::

    <?php
    $this->Post->Behaviors->attach('Containable');


.. _Utilisation de Containable:

Utilisation de Containable
~~~~~~~~~~~~~~~~~~~~~~~~~~

Pour voir comment Containable fonctionne, regardons quelques exemples. Premièrement, nous commencerons avec un appel find() sur un modèle nommé Post. Disons que ce Post a plusieurs (hasMany) Commentaire, et Post a et appartient à plusieurs (hasAndBelongsToMany) Tag. La quantité de données récupérées par un appel find() normal est assez étendue :: 


    <?php
    debug($this->Post->find('all'));
    
    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [titre] => Premier article
                        [contenu] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Commentaire] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [post_id] => 1
                                [auteur] => Daniel
                                [email] => dan@example.com
                                [siteweb] => http://example.com
                                [commentaire] => Premier commentaire
                                [created] => 2008-05-18 00:00:00
                            )
                        [1] => Array
                            (
                                [id] => 2
                                [post_id] => 1
                                [auteur] => Sam
                                [email] => sam@example.net
                                [siteweb] => http://example.net
                                [commentaire] => Second commentaire
                                [created] => 2008-05-18 00:00:00
                            )
                    )
                [Tag] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [name] => A
                            )
                        [1] => Array
                            (
                                [id] => 2
                                [name] => B
                            )
                    )
            )
    [1] => Array
            (
                [Post] => Array
                    (...

Pour certaines interfaces de votre application, vous pouvez ne pas avoir besoin d'autant 
d'information depuis le modèle Post. Le ``Comportement containable`` permet de reduire ce
que le find() retourne.

Par exemple, pour ne recuperer que les informations relative au post vous pouvez
faire cela::

<?php
$this->Post->contain();
$this->Post->find('all');

Vous pouvez utiliser la magie de "Containable" à l'interieur d'un appel find():: 

<?php
$this->Post->find('all', array('contain' => false));

Après avoir fait cela, vous vous retrouvez avec quelque chose de plus concis::

[0] => Array
        (
            [Post] => Array
                (
                    [id] => 1
                    [titre] => Premier article
                    [contenu] => aaa
                    [created] => 2008-05-18 00:00:00
                )
        )
[1] => Array
        (
            [Post] => Array
                (
                    [id] => 2
                    [titre] => Second article
                    [contenu] => bbb
                    [created] => 2008-05-19 00:00:00
                )
        )

Ceci n'est pas nouveau: en fait, vous pouvez obtenir le même résultat sans le ``comportement
Containable`` en faisant quelque chose comme ::

<?php
$this->Post->recursive = -1;
$this->Post->find('all');

Le ``comportement Containable`` s'exprime vraiment quand vous avez des associations complexes, et que vous voulez rogner le nombre d'information au même niveau.
La propriété $recursive des modèles est utile si vous voulez éviter un niveau de 
recursivité entier, mais pas pour choisir ce que vous garder à chaque niveau. regardons ensemble comment la methode ``contain()`` agit.

Le premier argument de la méthode accepte le nom, ou un tableau de noms, des modèles
à garder lors du find. Si nous désirons aller chercher tous les posts et les tags annexes
(sans aucune information de commentaire), nous devons essayer quelque chose comme ::

<?php
$this->Post->contain('Tag');
$this->Post->find('all');

Nous pouvons à nouveau utiliser la clef contain dans l'appel find()::

<?php
$this->Post->find('all', array('contain' => 'Tag'));

Sans le comportement Containable, nous finirions par utilisez la méthode ``unbindModel()`` du modèle, plusieurs fois si nous épluchons des modèles multiples. Le ``comportement Containable`` fourni un moyen plus propre pour accomplir cette même tâche.Contenant des associations plus profondes.

Des associations plus profondes
~~~~~~~~~~~~~~~~~~~~

Le comportment Containable permet également d'aller un peu plus loin : vous pouvez filtrer
les données des modèles associés . si vous regardez le résultats d'un appel find() classique,
notez le champ "auteur" dans le modèle "Commentaire". Si vous êtes interéssés dans les posts par les noms et les commentaires des auteurs - et rien d'autre - vous devez faire quelque chose comme ::

<?php
$this->Post->contain('Commentaire.auteur');
$this->Post->find('all');

// ou..

$this->Post->find('all', array('contain' => 'Commentaire.auteur'));

ici , nous avons dit au comportement Containable de nous donner l'informations de post, et uniquement le champs auteur du modèle Commentaire associé.
Le résultat du find ressemble à ::

[0] => Array
        (
            [Post] => Array
                (
                    [id] => 1
                    [titre] => Premier article
                    [contenu] => aaa
                    [created] => 2008-05-18 00:00:00
                )
            [Commentaire] => Array
                (
                    [0] => Array
                        (
                            [auteur] => Daniel
                            [post_id] => 1
                        )
                    [1] => Array
                        (
                            [auteur] => Sam
                            [post_id] => 1
                        )
                )
        )
[1] => Array
        (...

Comme vous pouvez le voir, les tableaux de Commentaire ne contiennent uniquement que le champ auteur (avec le post_id qui est requit par CakePHP pour présenter le résultat)

Vous pouvez également filtrer les 
donneés Commentaire associés en spécifiant une condition ::

<?php
$this->Post->contain('Commentaire.auteur = "Daniel"');
$this->Post->find('all');

//ou...

$this->Post->find('all', array('contain' => 'Commentaire.auteur = "Daniel"'));

Ceci nous donnes comme résultat les posts et commentaires dont
daniel est l'auteur::

[0] => Array
        (
            [Post] => Array
                (
                    [id] => 1
                    [title] => Premier article
                    [content] => aaa
                    [created] => 2008-05-18 00:00:00
                )
            [Commentaire] => Array
                (
                    [0] => Array
                        (
                            [id] => 1
                            [post_id] => 1
                            [auteur] => Daniel
                            [email] => dan@example.com
                            [siteweb] => http://example.com
                            [commentaire] => Premier commentaire
                            [created] => 2008-05-18 00:00:00
                        )
                )
        )

Des filtre supplémentaires peuvent être utilisées en utilisant les options de recherche standard ::         

<?php
$this->Post->find('all', array('contain' => array(
    'Commentaire' => array(
        'conditions' => array('Commentaire.auteur =' => "Daniel"),
        'order' => 'Commentaire.created DESC'
    )
)));

Voici un exemple d'utilisation du comportement Containable quand vous avez de profondes 
et complexes relations entre les modèles.

Examinons les associations de modèles suivants::

User->Profil
User->Compte->ResumeCompte
User->Post->PieceJointe->HistoriquePieceJointe->HistoriqueNotes
User->Post->Tag

Voici ce que nous recupérons des associations ci-dessus avec le comportement Containable ::


<?php
$this->User->find('all', array(
    'contain' => array(
        'Profil',
        'Compte' => array(
            'ResumeCompte'
        ),
        'Post' => array(
            'PieceJointe' => array(
                'fields' => array('id', 'nom'),
                'HistoriquePieceJointe' => array(
                    'HistoriqueNotes' => array(
                        'fields' => array('id', 'note')
                    )
                )
            ),
            'Tag' => array(
                'conditions' => array('Tag.name LIKE' => '%joyeux%')
            )
        )
    )
));

Garder à l'esprit que la clef 'contain' n'est utilisée qu'une seule fois dans le model principal, vous n'avez pas besoin d'utiliser 'contain' a nouveau dans les modèles liés.

.. note::

En utilisant les options 'fields' et 'contain' - faites attention d'inclure  toutes
les clefs étrangères que votre requête requiert directement ou indirectement.
Notez également que c'est parce que le comportement Containable doit être attaché à tous les modèles utilisés dans le contenu, que vous devez l'attacher à votre AppModel. 

Les options du Comportement Containable
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Le ``Comportment Containable`` a plusieurs options qui peuvent être définies quand le comportement est attaché à un modèle. Ces paramètres vous permettent d'affiner le comportement de Containable et de travailler plus facilement avec les autres comportements.

   - **recursive** (boolean, optional), définir à true pour permettre au comportement Containable, de déterminer automatiquement le niveau de récursivité nécessaire pour récupérer les modèles spécifiés et de paramétrer la récursivité du modèle à ce niveau. Le définir à false désactive cette fonctionnalité. La valeur par défaut est ``true``.
    - **notices** (boolean, optional), émet des alertes E_NOTICES pour les liaisons référencées dans un appel containable et qui ne sont pas valides. La valeur par défaut est true.
    - **autoFields** (boolean, optional), ajout automatique des champs nécessaires pour récupérer les liaisons requêtées. La valeur par défaut est ``true``.


Vous pouvez changer les paramètres du Comportement Containable à l'exécution, en ré-attachant le comportement comme vu au chapitre Utiliser les comportements :doc:`/models/additional-methods-and-properties`

Le comportement Containable peut quelque fois causer des problèles avec d'autres comportements ou des requêtes qui utilisent des fonctions d'aggrégations et/ou des clauses GROUP BY. Si vous obtenez des erreurs SQL invalides à cause du mélange de champs aggrégés et non-aggrégés, essayer de désactiver le paramètre ``autoFields``::



<?php
$this->Post->Behaviors->attach('Containable', array('autoFields' => false));

Utilisation du comportement Containable avec la pagination
===================================
En incluant le paramètre 'contain' dans la propriété ``$paginate``
la pagination sera appliqué à la fois au find('count') et au find('all') dans le modèle

Voir la section :ref:`using-containable` pour plus de détails.

Voici un exemple pour limiter les associations en paginant::

<?php
$this->paginate['Utilisateur'] = array(
    'contain' => array('Profil', 'Compte'),
    'order' => 'Utilisateur.pseudo'
);

$users = $this->paginate('User');

.. meta::
    :title lang=fr: Containable
    :keywords lang=fr: modèle behavior,author daniel,article content,new addition,wear and tear,array,aaa,email,fly,models