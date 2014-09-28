CakePHP en un Coup d'Oeil
#########################

CakePHP est conçu pour rendre les tâches communes de développement web simples
et faciles. En fournissant une boite à outil tout-en-un pour vous aider à
démarrer, les différentes parties de CakePHP fonctionnent aussi bien ensemble
que séparément.

Le but de cette présentation est d'introduire les concepts généraux de CakePHP,
et de vous donner un aperçu rapide de la façon dont ces concepts sont mis en
œuvre dans CakePHP. Si vous êtes impatient de démarrer un projet, cous pouvez
:doc:`commencer avec le tutoriel </tutorials-and-examples/blog/blog>`, ou
:doc:`plonger dans la documentaion </topics>`.

Conventions plutôt que de Configuration
=======================================

CakePHP fournit une structure organisationnelle de base qui couvre les noms de
classes, les noms de fichiers, les noms de table de base de données, et
d'autres conventions. Même si les conventions prennent du temps à apprendre, en
suivant les conventions offertes par CakePHP, vous pouvez éviter les
configurations inutiles et construire une structure d'application uniforme
qui rend le travail avec de multiples projets un jeu d'enfant. Le :doc:`chapitre
sur les conventions </intro/conventions>` couvre les différentes conventions
utilisées par CakePHP.

La Couche Model (Modèle)
========================

La couche Model représente la partie de l'application qui exécute la logique
applicative. Elle est responsable de récupérer les données et de les convertir
selon des concepts significatifs pour votre application. Cela inclut le
traitement, la validation, l'association et beaucoup d'autres tâches
concernant la manipulation des données.

Dans le cas d'un réseau social, la couche Model s'occuperait des tâches telles
que sauvegarder les données utilisateur, sauvegarder les associations d'amis,
enregistrer et récupérer les photos des utilisateurs, trouver des suggestions
de nouveaux amis, etc ...
Tandis que les objets Models seront "Friend", "User", "Comment", "Photo".
Si nous voulions charger des données depuis notre table ``users``, nous
pourrions faire::

    use Cake\ORM\TableRegistry;

    $users = TableRegistry::get('Users');
    $query = $users->find();
    foreach ($query as $row) {
        echo $row->username;
    }

Vous remarquerez peut-être que nous n'avons pas eu à écrire de code avant que
nous puissions commencer à travailler avec nos données. En utilisant les
conventions, CakePHP utilisera des classes standards pour les classes table
et entity qui n'ont pas encore été définies.

Si nous voulions créer un nouvel utilisateur et l'enregistrer (avec validation),
nous ferions ceci::

    use Cake\ORM\TableRegistry;

    $users = TableRegistry::get('Users');
    $user = $users->newEntity(['email' => 'mark@example.com']);
    $users->save($user);

La Couche View (Vue)
====================

La View retourne une présentation des données modélisées. Etant séparée des
objets Model, elle est responsable de l'utilisation des informations dont
elle dispose pour produire n'importequ'elle interface de présentation
nécessaire à votre application.

Par exemple, la view pourrait utiliser les données du model pour rendre une
page HTML les contenant ou un résultat au format XML pour que d'autres
l'utilisent::

    // Dans un fichier view, nous afficherons un 'element' pour chaque utilisateur (user).
    <?php foreach ($users as $user): ?>
        <div class="user">
            <?= $this->element('user', ['user' => $user]) ?>
        </div>
    <?php endforeach; ?>


La couche View fournit un certain nombre d'extensions tels que
:ref:`les Elements <view-elements>` et les :doc:`Cells </views/cells>` pour vous
permettre de ré-utiliser facilement votre logique de présentation.

La couche Vue n'est pas seulement limitée au HTML ou à la répresentation en
texte de données. Elle peut aussi être utilisée pour offrir une grande variété
de formats tels que JSON, XML et grâce à une arhitecture modulable tout autre
format dont vous auriez besoin.

La Couche Controller (Contrôleur)
=================================

La couche Controller gère les requêtes des utilisateurs.
Elle est responsable de retourner une réponse avec l'aide mutuelle des couches
Model et View.

Les Controllers peuvent être imaginés comme des managers qui ont pour mission
que toutes les ressources nécessaires pour accomplir une tâche soient déléguées
aux bonnes personnes. Il attend des requêtes des clients, vérifie leur validité
selon l'authentification et les règles d'autorisation, délègue la récupération
et le traitement des données à la couche Model, puis sélectionne les types de
présentation acceptés par client pour finalement déléguer le processus 
de rendu à la couche View. Un example de controller d'enregistrement
d'utilisateur serait::

    public function add() {
        $user = $this->Users->newEntity();
        if ($this->request->is('post')) {
            $user = $this->Users->patchEntity($user, $this->request->data);
            if ($this->Users->save($user, ['validate' => 'registration'])) {
                $this->Flash->success(__('Vous êtes maintenant enregistré.'));
            } else {
                $this->Flash->error(__('Il y a eu un problème.'));
            }
        }
        $this->set('user', $user);
    }

Notez que nous n'avons jamais explicitement rendu de vue. Les conventions de
CakePHP prendront soin de sélectionner la bonne vue et de la rendre à la vue
avec les données préparées avec ``set()``.

.. _request-cycle:

Cycle de Requête CakePHP
========================

Maintenant que vous êtes familier avec les différentes couches de CakePHP,
voyons comment fonctionne le cycle d'une requête CakePHP:

.. figure:: /_static/img/typical-cake-request.png
   :align: center
   :alt: Schéma de principe d'une requête typique CakePHP

Le cycle d'une requête CakePHP typique débute avec une requête utilisateur
qui demande une page ou une ressource de votre application. À haut niveau
chaque requête passe par les étapes suivantes:

#. La requête est d'abord aiguillée par les routes.
#. Après que la requête a été routée, le dispatcher va sélectionner le bon
   objet controller pour la traiter.
#. L'action du controller est appellée et le controller interragit avec les
   Models et Components nécessaires.
#. Le controller delègue la création de la response à la View générer le
   résultat obtenu à partir des données de model.

Que le Début
============

Espérons que ce bref aperçu ait éveillé votre intérêt. Quelques autres grandes 
fonctionnalités de CakePHP sont:

* Un framework de :doc:`cache</core-libraries/caching>` framework qui s'intègre
  avec Memcache, Redis et d'autres.
* Un :doc:`outil de génération de code
  </console-and-shells/code-generation-with-bake>` puissant pour partir sur les
  chapeaux de roue.
* Un :doc:`framework de tests intégéré</development/testing>` pour vous assurer
  que votre code fonctionne correctement.

Les prochaines étapes évidentes sont de :doc:`télécharger CakePHP </installation>`
, lire le
:doc:`tutoriel and construire un truc génial </tutorials-and-examples/blog/blog>`.

Lectures Complémentaires
========================

.. toctree::
    :maxdepth: 1

    /intro/where-to-get-help
    /intro/conventions
    /intro/cakephp-folder-structure

.. meta::
    :title lang=fr: Pour Commencer
    :keywords lang=fr: structure de dossier,noms de table,requête initiale,table base de données,structure organisationnelle,rst,noms de fichiers,conventions,mvc,page web,sit
