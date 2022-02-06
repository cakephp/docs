String
######

La classe String inclue des méthodes pratiques pour la création et la
manipulation des chaînes de caractères (string) et elle est normalement
accessible statiquement. Exemple : ``String::uuid()``.

uuid
====

La méthode uuid est utilisée pour générer un identifiant unique suivant
la `RFC 4122 <https://www.ietf.org/rfc/rfc4122.txt>`_. Une uuid est une
chaîne de caractère de 128 bits dans un format de type
485fc381-e790-47a3-9794-1337c0a8fe68.

::

    String::uuid(); // 485fc381-e790-47a3-9794-1337c0a8fe68

tokenize
========

``string tokenize ($data, $separator = ',', $leftBound = '(', $rightBound = ')')``

Segmente une chaîne en utilisant ``$separator``, ignore les occurrences
de ``$separator`` s'ils apparaissent entre ``$leftBound`` et
``$rightBound``.

insert
======

string insert ($string, $data, $options = array())

La méthode insert est utilisée pour créer des gabarits de chaîne et pour
permettre des remplacements clé/valeur.

::

    String::insert('Mon nom est :nom et j\'ai :age ans.', array('nom' => 'Bob', 'age' => '65'));
    // génère : "Mon nom est Bob et j'ai 65 ans."

cleanInsert
===========

string cleanInsert ($string, $options = array())

Nettoie une chaîne formatée par Set::insert avec les $options données,
en fonction de la clé 'clean' dans $options. La méthode utilisée par
défaut est text, mais html est également disponible. Le but de cette
fonction est de remplacer tous les espaces blancs et les balises
inutiles autour des paramètres qui ne se sont pas fait remplacés par
Set::insert.

Vous pouvez utilisez les options suivantes dans le tableau options :

::

    $options = array(
        'clean' => array(
            'method' => 'text', // ou html
        ),

        'before' => '',
        'after' => ''
    );

