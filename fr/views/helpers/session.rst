Session
#######

.. php:namespace:: Cake\View\Helper

.. php:class:: SessionHelper(View $view, array $config = [])

Le SessionHelper offre la majorité des fonctionnalités de l'objet Session et
les rend disponible dans votre vue.

La grande différence entre l'objet Session et le SessionHelper est que ce
dernier *ne peut pas* écrire dans la session.

Comme pour le Component Session, les données sont écrites et lues en
utilisant des structures de tableaux avec la :term:`notation avec points`,
comme ci-dessous::

    ['User' =>
        ['username' => 'super@example.com']
    ];

Étant donné ce tableau, le nœud sera accessible par ``User.username``, le point
indiquant le tableau imbriqué. Cette notation est utilisée pour toutes les
méthodes du SessionHelper où une variable ``$key`` est utilisée.

.. php:method:: read(string $key)

    :rtype: mixed

    Lire à partir de la Session. Retourne une chaîne de caractère ou un tableau
    dépendant des contenus de la session.

.. php:method:: check(string $key)

    :rtype: boolean

    Vérifie si une clé est dans la Session. Retourne un booléen sur l'existence
    d'un clé.

.. meta::
    :title lang=fr: SessionHelper
    :description lang=fr: Le SessionHelper offre la majorité des fonctionnalités disponibles dans votre vue.
    :keywords lang=fr: session helper,flash messages,session flash,session read,session check
