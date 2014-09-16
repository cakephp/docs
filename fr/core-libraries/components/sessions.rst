Sessions
########

.. php:class:: SessionComponent(ComponentCollection $collection, array $config = [])

Le component session de CakePHP fournit le moyen de faire persister les données
client entre les pages requêtées. Il agit comme une interface pour ``$_SESSION``
et offre aussi des méthodes pratiques pour de nombreuses fonctions relatives
à ``$_SESSION``.

Les sessions peuvent être paramétrées de différentes façons dans CakePHP.  Pour
plus d'information, vous devriez lire la documentation sur la :doc:`
configuration des Sessions </development/sessions>`

Interagir avec les Données de Session
=====================================

Le component Session est utilisé pour interagir avec les informations de
session. Il inclut les fonctions CRUD basiques, mais aussi des fonctionnalités
pour créer des messages de feedback aux utilisateurs.

Il est important de noter que ces structures en tableaux peuvent être créées
dans la session en utilisant la notation avec un point
:term:`notation avec points`.
Par exemple, ``User.username`` se référera au tableau suivant::

    ['User' =>
        ['username' => 'clark-kent@dailyplanet.com']
    ];

Les points sont utilisés pour indiquer les tableaux imbriqués. Cette notation
est utilisée pour toutes les méthodes du component Session quelques soient
le nom/la clé utilisé.

.. php:method:: write($name, $value)

    Écrit dans la Session, en mettant $value dans $name.
    $name peut-être un tableau séparé par un point. Par exemple ::

        $this->Session->write('Person.eyeColor', 'Green');

    Cela écrit la valeur 'Green' dans la session sous Person => eyeColor.

.. php:method:: read($name)

    Retourne la valeur de $name dans la Session. Si $name vaut null, la
    session entière sera retournée. Par ex ::

        $green = $this->Session->read('Person.eyeColor');

    Récupère la valeur "Green" de la session. La lecture de données
    inexistante retournera null.

.. php:method:: check($name)

    Utilisée pour vérifier qu'une variable de Session a été créée.
    Retourne ``true`` si la variable existe et false dans le cas contraire.

.. php:method:: delete($name)

    Supprime les données de Session de $name. Par ex

        $this->Session->delete('Person.eyeColor');

    Notre donnée de session n'a plus la valeur 'Green' ni même l'index
    eyeColor attribué. Cependant, le model Person est toujours dans la
    Session. Pour supprimer de la session toutes les informations de Person,
    utilisez ::

        $this->Session->delete('Person');

.. php:method:: destroy()

    La méthode ``destroy`` supprimera le cookie de session et toutes les
    données de session stockées dans le fichier temporaire du système. Cela
    va détruire la session PHP et ainsi en créer une nouvelle.::

        $this->Session->destroy();

.. meta::
    :title lang=fr: Sessions
    :keywords lang=fr: php array,dailyplanet com,configuration documentation,dot notation,feedback messages,reading data,session data,page requests,clark kent,dots,existence,sessions,convenience,cakephp
