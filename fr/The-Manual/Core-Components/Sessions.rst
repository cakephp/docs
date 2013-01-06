Sessions
########

Le composant session de CakePHP fournit le moyen de faire persister les
données client entre les pages requêtées. Il agit comme une interface
pour $\_SESSION et offre aussi des méthodes pratiques pour de nombreuses
fonctions relatives à $\_SESSION.

Les sessions peuvent persister de différentes façons. Par défaut, elles
utilisent les paramètres fournis par PHP, cependant, d'autres options
existent.

cake
    Sauvegarde les fichiers de session dans votre dossier tmp/sessions
    de app.
database
    Utilise les sessions en base de données de CakePHP
cache
    Utilise le moteur de cache configuré par Cache::config(). Très utile
    quand utilisé conjointement avec Memcache (dans les configurations
    avec des multiples serveurs d'applications) pour stocker à la fois
    les données mises en cache et les sessions.
php
    C'est le paramètre par défaut. Sauvegarde les fichiers de session
    comme indiqué dans php.ini

Pour changer la méthode de manipulation des session par défaut, changez
la configuration de Session.save selon vos objectifs. Si vous choisissez
'database', vous devriez aussi décommenter les paramètres de
Session.datababase et exécuter le fichier SQL de base de données de
session qui se trouve dans app/config.

Méthodes
========

Le composant Session est utilisé pour interagir avec les informations de
session. Il inclut les fonctions CRUD basiques, mais aussi des
fonctionnalités pour créer des messages de *feedback* aux utilisateurs.

Il est important de noter que ces structures en tableaux peuvent être
créées dans la session en utilisant la notation avec un point. Par
exemple, Utilisateur.identifiant se réfèrera au tableau suivant :

::

        array('Utilisateur' => 
                array('identifiant' => 'ClarkKent@dailyplanet.com')
        );

Les points sont utilisés pour indiquer les tableaux imbriqués. Cette
notation est utilisée pour toutes les méthodes du composant Session dans
lesquelles une variable $name est utilisée.

write
-----

``write($name, $value)``

Ecrit dans la Session, en mettant $value dans $name. $name peut-être un
tableau séparé par un point. Par exemple :

::

    $this->Session->write('Personne.couleurYeux', 'Vert');

Cela écrit la valeur 'Vert' dans la session sous Personne =>
couleurYeux.

setFlash
--------

``setFlash($message, $layout = 'default', $params = array(), $key = 'flash')``

Utilisé pour définir une variable de session qui peut être utilisée pour
un rendu dans la Vue. $layout vous permet de contrôler quel gabarit
(situé dans ``/app/views/layouts``) doit être utilisé pour le rendu du
message. Si vous laissez ``$layout`` sur 'default', le message sera
encadré par ce qui suit :

::

    <div id="flashMessage" class="message"> [message] </div>

$params vous permet de passer des variables additionnelles pour le
gabarit rendu. $key place l'index $messages dans le tableau Message. Par
défaut, c'est 'flash'.

Des paramètres peuvent être passés pour modifier le ``div`` rendu, par
exemple, ajouter "class" dans le tableau $params, affectera une classe
CSS au ``div`` de sortie, en utilisant ``$session->flash()`` dans votre
gabarit ou votre vue.

::

    $this->Session->setFlash('Message textuel d\'exemple', 'default', array('class' => 'classe_exemple'))

Le résultat après utilisation de ``$session->flash()`` avec l'exemple
ci-dessus devrait être :

::

    <div id="flashMessage" class="classe_exemple">Message textuel d'exemple</div>

read
----

``read($name)``

Retourne la valeur de $name dans la session. Si $name vaut null, la
session entière sera retournée. Par ex :

::

    $vert = $this->Session->read('Personne.couleurYeux');

Récupère la valeur "vert" dans la session.

check
-----

``check($name)``

Utilisé pour vérifier qu'une variable de Session a été créée. Retourne
vrai si la variable existe et faux dans le cas contraire.

delete
------

``delete($name) /*ou*/ del($name)``

Supprime les données de Session de $name. Par ex :

::

    $this->Session->del('Personne.couleurYeux');

Notre donnée de session n'a plus la valeur 'Vert' ni même l'index
couleurYeux attribué. Cependant, le modèle Personne est toujours dans la
Session. Pour supprimer de la session toutes les informations de
Personne, utilisez :

::

    $this->Session->del('Personne');

destroy
-------

La méthode ``destroy`` supprimera le cookie de session et toutes les
données de session stockées dans le fichier temporaire du système. Cela
va détruire la session PHP et ensuite en créer une nouvelle.

::

    $this->Session->destroy()

error
-----

``error()``

Utilisé pour déterminer la dernière erreur dans une session.
