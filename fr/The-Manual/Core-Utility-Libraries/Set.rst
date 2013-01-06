Set
###

La gestion des tableaux, si elle est bien faite, peut être un outil
utile et puissant pour développer un code plus intelligent et optimisé.
CakePHP offre un ensemble très utile de fonctionnalités statiques dans
la classe Set, qui vous permettra de faire cela.

La classe Set de CakePHP peut être appelée depuis n'importe quel modèle
ou contrôleur, de la même manière qu'on appelle *Inflector*. Exemple :
Set::combine().

Syntaxe Path Set-compatible
===========================

La syntaxe Path est utilisée (par exemple) par sort et elle est utilisée
pour définir un chemin.

Exemple (en utilisant Set::sort()) :

::

    $a = array(
        0 => array('Personne' => array('nom' => 'Jeff')),
        1 => array('Chemise' => array('couleur' => 'noir'))
    );
    $resultat = Set::sort($a, '{n}.Personne.nom', 'asc');
    /* $resultat ressemble maintenant à : 
        Array
        (
            [0] => Array
                (
                    [Chemise] => Array
                        (
                            [couleur] => noir
                        )
                )
            [1] => Array
                (
                    [Personne] => Array
                        (
                            [nom] => Jeff
                        )
                )
        )
    */

Comme vous pouvez le voir dans l'exemple ci-dessus, certaines choses
sont entourées par des {}, d'autres non. Dans le tableau ci-dessous,
vous pouvez voir quelles options sont disponibles.

Expression

Définition

{n}

Représente une clé numérique

{s}

Représente une chaîne

Foo

Toute chaîne (sans accolades englobantes) est traitée comme une chaîne
littérale.

{[a-z]+}

Toute chaîne encadrée dans des accolades (à part {n} et {s}) est
interprétée comme une expression régulière.

Cette section a besoin d'être développée.

insert
======

``array Set::insert ($list, $path, $data = null)``

Insère $data dans un tableau défini par $path.

::

    $a = array(
        'pages' => array('nom' => 'page')
    );
    $resultat = Set::insert($a, 'fichiers', array('nom' => 'fichiers'));
    /* $resultat ressemble maintenant à : 
        Array
        (
            [pages] => Array
                (
                    [nom] => page
                )
            [fichiers] => Array
                (
                    [nom] => fichiers
                )
        )
    */

    $a = array(
        'pages' => array('nom' => 'page')
    );
    $resultat = Set::insert($a, 'pages.nom', array());
    /* $resultat ressemble maintenant à : 
        Array
        (
            [pages] => Array
                (
                    [nom] => Array
                        (
                        )
                )
        )
    */

    $a = array(
        'pages' => array(
            0 => array('nom' => 'principale'),
            1 => array('nom' => 'à propos')
        )
    );
    $resultat = Set::insert($a, 'pages.1.variables', array('titre' => 'titre page'));
    /* $resultat ressemble maintenant à : 
        Array
        (
            [pages] => Array
                (
                    [0] => Array
                        (
                            [nom] => principale
                        )
                    [1] => Array
                        (
                            [nom] => à propos
                            [variables] => Array
                                (
                                    [titre] => titre page
                                )
                        )
                )
        )
    */

sort
====

``array Set::sort ($data, $path, $dir)``

Trie un tableau par une valeur quelconque, déterminée par un chemin
"Set-compatible".

::

    $a = array(
        0 => array('Personne' => array('nom' => 'Jeff')),
        1 => array('Chemise' => array('couleur' => 'noir'))
    );
    $resultat = Set::sort($a, '{n}.Personne.nom', 'asc');
    /* $resultat ressemble maintenant à : 
        Array
        (
            [0] => Array
                (
                    [Chemise] => Array
                        (
                            [couleur] => noir
                        )
                )
            [1] => Array
                (
                    [Personne] => Array
                        (
                            [nom] => Jeff
                        )
                )
        )
    */

    $resultat = Set::sort($a, '{n}.Chemise', 'asc');
    /* $resultat ressemble maintenant à : 
        Array
        (
            [0] => Array
                (
                    [Personne] => Array
                        (
                            [nom] => Jeff
                        )
                )
            [1] => Array
                (
                    [Chemise] => Array
                        (
                            [couleur] => noir
                        )
                )
        )
    */

    $resultat = Set::sort($a, '{n}', 'desc');
    /* $resultat ressemble maintenant à : 
        Array
        (
            [0] => Array
                (
                    [Chemise] => Array
                        (
                            [couleur] => noir
                        )
                )
            [1] => Array
                (
                    [Personne] => Array
                        (
                            [nom] => Jeff
                        )
                )
        )
    */

    $a = array(
        array(7,6,4),
        array(3,4,5),
        array(3,2,1),
    );

    $resultat = Set::sort($a, '{n}.{n}', 'asc');
    /* $resultat ressemble maintenant à : 
        Array
        (
            [0] => Array
                (
                    [0] => 3
                    [1] => 2
                    [2] => 1
                )
            [1] => Array
                (
                    [0] => 3
                    [1] => 4
                    [2] => 5
                )
            [2] => Array
                (
                    [0] => 7
                    [1] => 6
                    [2] => 4
                )
        )
    */

reverse
=======

``array Set::reverse ($object)``

Set::reverse est l'opposé de set::map. Il convertit un objet en un
tableau. Si $object n'est pas un objet, la fonction retournera
simplement $object.

::

    $result = Set::reverse(null);
    // Null
    $result = Set::reverse(false);
    // false
    $a = array(
        'Post' => array('id'=> 1, 'titre' => 'Premier Post'),
        'Commentaire' => array(
            array('id'=> 1, 'titre' => 'Premier Commentaire'),
            array('id'=> 2, 'titre' => 'Second Commentaire')
        ),
        'Tag' => array(
            array('id'=> 1, 'titre' => 'Premier Tag'),
            array('id'=> 2, 'titre' => 'Second Tag')
        ),
    );
    $map = Set::map($a); // Transforme $a en classe Object
    /* $map ressemble maintenant à :
        stdClass Object
        (
            [_name_] => Post
            [id] => 1
            [titre] => Premier Post
            [Commentaire] => Array
                (
                    [0] => stdClass Object
                        (
                            [id] => 1
                            [titre] => Premier Commentaire
                        )
                    [1] => stdClass Object
                        (
                            [id] => 2
                            [titre] => Second Commentaire
                        )
                )
            [Tag] => Array
                (
                    [0] => stdClass Object
                        (
                            [id] => 1
                            [titre] => Premier Tag
                        )
                    [1] => stdClass Object
                        (
                            [id] => 2
                            [titre] => Second Tag
                        )
                )
        )
    */

    $resultat = Set::reverse($map);
    /* $resultat ressemble maintenant à :
        Array
        (
            [Post] => Array
                (
                    [id] => 1
                    [titre] => Premier Post
                    [Commentaire] => Array
                        (
                            [0] => Array
                                (
                                    [id] => 1
                                    [titre] => Premier Commentaire
                                )
                            [1] => Array
                                (
                                    [id] => 2
                                    [titre] => Second Commentaire
                                )
                        )
                    [Tag] => Array
                        (
                            [0] => Array
                                (
                                    [id] => 1
                                    [titre] => Premier Tag
                                )
                            [1] => Array
                                (
                                    [id] => 2
                                    [titre] => Second Tag
                                )
                        )
                )
        )
    */

    $resultat = Set::reverse($a['Post']); // Retourne simplement le tableau
    /* $resultat ressemble maintenant à :
        Array
        (
            [id] => 1
            [titre] => Premier Post
        )
    */
        

combine
=======

``array Set::combine ($data, $path1 = null, $path2 = null, $groupPath = null)``

Crée un tableau associatif avec $path1 comme chemin pour construire ses
clés et éventuellement $path2 comme chemin pour récupérer les valeurs.
Si $path2 n'est pas spécifié, toutes les valeurs seront initialisées à
null (utile pour Set::merge). Facultativement, vous pouvez grouper les
valeurs par ce qu'on obtient en suivant le chemin spécifié dans
$groupPath.

::


    $resultat = Set::combine(array(), '{n}.Utilisateur.id', '{n}.Utilisateur.Donnees');
    // $resultat == array();

    $resultat = Set::combine('', '{n}.Utilisateur.id', '{n}.Utilisateur.Donnees');
    // $resultat == array();

    $a = array(
        array(
            'Utilisateur' => array(
                'id' => 2, 
                'groupe_id' => 1,
                'Donnees' => array(
                    'utilisateur' => 'mariano.iglesias',
                    'nom' => 'Mariano Iglesias'
                )
            )
        ),
        array(
            'Utilisateur' => array(
                'id' => 14, 
                'groupe_id' => 2,
                'Donnees' => array(
                    'utilisateur' => 'phpnut', 
                    'nom' => 'Larry E. Masters'
                )
            )
        ),
        array(
            'Utilisateur' => array(
                'id' => 25, 
                'groupe_id' => 1,
                'Donnees' => array(
                    'utilisateur' => 'gwoo',
                    'nom' => 'The Gwoo'
                )
            )
        )
    );
    $resultat = Set::combine($a, '{n}.Utilisateur.id');
    /* $resultat devrait ressembler à cela : 
        Array
        (
            [2] => 
            [14] => 
            [25] => 
        )
    */

    $resultat = Set::combine($a, '{n}.Utilisateur.id', '{n}.Utilisateur.inexistant');
    /* $resultat devrait ressembler à cela : 
        Array
        (
            [2] => 
            [14] => 
            [25] => 
        )
    */

    $resultat = Set::combine($a, '{n}.Utilisateur.id', '{n}.Utilisateur.Donnees');
    /* $resultat devrait ressembler à cela : 
        Array
        (
            [2] => Array
                (
                    [utilisateur] => mariano.iglesias
                    [nom] => Mariano Iglesias
                )
            [14] => Array
                (
                    [utilisateur] => phpnut
                    [nom] => Larry E. Masters
                )
            [25] => Array
                (
                    [utilisateur] => gwoo
                    [nom] => The Gwoo
                )
        )
    */

    $resultat = Set::combine($a, '{n}.Utilisateur.id', '{n}.Utilisateur.Donnees.nom');
    /* $resultat devrait ressembler à cela : 
        Array
        (
            [2] => Mariano Iglesias
            [14] => Larry E. Masters
            [25] => The Gwoo
        )
    */

    $resultat = Set::combine($a, '{n}.Utilisateur.id', '{n}.Utilisateur.Donnees', '{n}.Utilisateur.groupe_id');
    /* $resultat devrait ressembler à cela : 
        Array
        (
            [1] => Array
                (
                    [2] => Array
                        (
                            [utilisateur] => mariano.iglesias
                            [nom] => Mariano Iglesias
                        )
                    [25] => Array
                        (
                            [utilisateur] => gwoo
                            [nom] => The Gwoo
                        )
                )
            [2] => Array
                (
                    [14] => Array
                        (
                            [utilisateur] => phpnut
                            [nom] => Larry E. Masters
                        )
                )
        )
    */

    $resultat = Set::combine($a, '{n}.Utilisateur.id', '{n}.Utilisateur.Donnees.nom', '{n}.Utilisateur.groupe_id');
    /* $resultat devrait ressembler à cela :  
        Array
        (
            [1] => Array
                (
                    [2] => Mariano Iglesias
                    [25] => The Gwoo
                )
            [2] => Array
                (
                    [14] => Larry E. Masters
                )
        )
    */

    $resultat = Set::combine($a, '{n}.Utilisateur.id', array('{0} : {1}', '{n}.Utilisateur.Donnees.utilisateur', '{n}.Utilisateur.Donnees.nom'), '{n}.Utilisateur.groupe_id');
    /* $resultat devrait ressembler à cela : 
        Array
        (
            [1] => Array
                (
                    [2] => mariano.iglesias : Mariano Iglesias
                    [25] => gwoo : The Gwoo
                )
            [2] => Array
                (
                    [14] => phpnut : Larry E. Masters
                )
        )       
    */

    $resultat = Set::combine($a, array('{0} : {1}', '{n}.Utilisateur.Donnees.utilisateur', '{n}.Utilisateur.Donnees.nom'), '{n}.Utilisateur.id');
    /* $resultat devrait ressembler à cela : 
        Array
        (
            [mariano.iglesias : Mariano Iglesias] => 2
            [phpnut : Larry E. Masters] => 14
            [gwoo : The Gwoo] => 25
        )
    */

    $resultat = Set::combine($a, array('{1} : {0}', '{n}.Utilisateur.Donnees.utilisateur', '{n}.Utilisateur.Donnees.nom'), '{n}.Utilisateur.id');
    /* $resultat devrait ressembler à cela : 
        Array
        (
            [Mariano Iglesias : mariano.iglesias] => 2
            [Larry E. Masters : phpnut] => 14
            [The Gwoo : gwoo] => 25
        )       
    */

    $resultat = Set::combine($a, array('%1$s : %2$d', '{n}.Utilisateur.Donnees.utilisateur', '{n}.Utilisateur.id'), '{n}.Utilisateur.Donnees.nom');

    /* $resultat devrait ressembler à cela : 
        Array
        (
            [mariano.iglesias : 2] => Mariano Iglesias
            [phpnut : 14] => Larry E. Masters
            [gwoo : 25] => The Gwoo
        )
    */

    $resultat = Set::combine($a, array('%2$d : %1$s', '{n}.Utilisateur.Donnees.utilisateur', '{n}.Utilisateur.id'), '{n}.Utilisateur.Donnees.nom');
    /* $resultat devrait ressembler à cela :  
        Array
        (
            [2 : mariano.iglesias] => Mariano Iglesias
            [14 : phpnut] => Larry E. Masters
            [25 : gwoo] => The Gwoo
        )
    */

normalize
=========

``array Set::normalize ($list, $assoc = true, $sep = ',', $trim = true)``

Normalise une chaîne ou une liste de tableau.

::

    $a = array('Arbre', 'CompteurDeCache','Telechargement' => array(
                'repertoire' => 'produits',
                'champs' => array('image_1_id', 'image_2_id', 'image_3_id', 'image_4_id', 'image_5_id')
    ));
    $b =  array('Cachable' => array('actif' => false),
            'Limite',
            'Liaison',
            'Validateur',
            'Transactionnel');
    $resultat = Set::normalize($a);
    /* $resultat ressemble maintenant à :
        Array
        (
            [Arbre] => 
            [CompteurDeCache] => 
            [Telechargement] => Array
                (
                    [repertoire] => produits
                    [champs] => Array
                        (
                            [0] => image_1_id
                            [1] => image_2_id
                            [2] => image_3_id
                            [3] => image_4_id
                            [4] => image_5_id
                        )
                )
        )
    */
    $resultat = Set::normalize($b);
    /* $resultat ressemble maintenant à :
        Array
        (
            [Cachable] => Array
                (
                    [actif] => 
                )

            [Limite] => 
            [Liaison] => 
            [Validateur] => 
            [Transactionnel] => 
        )
    */
    $resultat = Set::merge($a, $b); // Maintenant mixons les deux et normalisons
    /* $resultat ressemble maintenant à :
        Array
        (
            [0] => Arbre
            [1] => CompteurDeCache
            [Telechargement] => Array
                (
                    [repertoire] => produits
                    [champs] => Array
                        (
                            [0] => image_1_id
                            [1] => image_2_id
                            [2] => image_3_id
                            [3] => image_4_id
                            [4] => image_5_id
                        )

                )
            [Cachable] => Array
                (
                    [actif] => 
                )
            [2] => Limite
            [3] => Liaison
            [4] => Validateur
            [5] => Transactionnel
        )
    */
    $resultat = Set::normalize(Set::merge($a, $b));
    /* $resultat ressemble maintenant à :
        Array
        (
            [Arbre] => 
            [CompteurDeCache] => 
            [Telechargement] => Array
                (
                    [repertoire] => products
                    [champs] => Array
                        (
                            [0] => image_1_id
                            [1] => image_2_id
                            [2] => image_3_id
                            [3] => image_4_id
                            [4] => image_5_id
                        )

                )
            [Cachable] => Array
                (
                    [actif] => 
                )
            [Limite] => 
            [Liaison] => 
            [Validateur] => 
            [Transactionnel] => 
        )
    */

countDim
========

``integer Set::countDim ($array = null, $all = false, $count = 0)``

Chiffre les dimensions d'un tableau. Si $all est défini comme false (qui
est définit par défaut) il ne prendra en considération que la dimension
du premier élément du tableau.

::

    $data = array('one', '2', 'three');
    $result = Set::countDim($data);
    // $result == 1

    $data = array('1' => '1.1', '2', '3');
    $result = Set::countDim($data);
    // $result == 1

    $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => '3.1.1'));
    $result = Set::countDim($data);
    // $result == 2

    $data = array('1' => '1.1', '2', '3' => array('3.1' => '3.1.1'));
    $result = Set::countDim($data);
    // $result == 1

    $data = array('1' => '1.1', '2', '3' => array('3.1' => '3.1.1'));
    $result = Set::countDim($data, true);
    // $result == 2

    $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
    $result = Set::countDim($data);
    // $result == 2

    $data = array('1' => array('1.1' => '1.1.1'), '2', '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
    $result = Set::countDim($data, true);
    // $result == 3

    $data = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => '2.1.1.1'))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
    $result = Set::countDim($data, true);
    // $result == 4

    $data = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => array('2.1.1.1')))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
    $result = Set::countDim($data, true);
    // $result == 5

    $data = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => array('2.1.1.1' => '2.1.1.1.1')))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
    $result = Set::countDim($data, true);
    // $result == 5

    $set = array('1' => array('1.1' => '1.1.1'), array('2' => array('2.1' => array('2.1.1' => array('2.1.1.1' => '2.1.1.1.1')))), '3' => array('3.1' => array('3.1.1' => '3.1.1.1')));
    $result = Set::countDim($set, false, 0);
    // $result == 2

    $result = Set::countDim($set, true);
    // $result == 5
        

isEqual
=======

``boolean Set::isEqual ($val1, $val2 = null)``

Détermine si deux ensembles ou tableaux sont égaux.

::

    $result = Set::isEqual(array(1), array(1,1));
    // False
    $result = Set::isEqual(array(1), array(1));
    // True

diff
====

``array Set::diff ($val1, $val2 = null)``

Calcule la différence entre un ensemble et un tableau, deux ensembles ou
deux tableaux

::

    $a = array(
        0 => array('name' => 'main'),
        1 => array('name' => 'about')
    );
    $b = array(
        0 => array('name' => 'main'),
        1 => array('name' => 'about'),
        2 => array('name' => 'contact')
    );

    $result = Set::diff($a, $b);
    /* $result donnera: 
        Array
        (
            [2] => Array
                (
                    [name] => contact
                )
        )
    */
    $result = Set::diff($a, array());
    /* $result donnera: 
        Array
        (
            [0] => Array
                (
                    [name] => main
                )
            [1] => Array
                (
                    [name] => about
                )
        )
    */
    $result = Set::diff(array(), $b);
    /* $result donnera: 
        Array
        (
            [0] => Array
                (
                    [name] => main
                )
            [1] => Array
                (
                    [name] => about
                )
            [2] => Array
                (
                    [name] => contact
                )
        )
    */

    $b = array(
        0 => array('name' => 'me'),
        1 => array('name' => 'about')
    );

    $result = Set::diff($a, $b);
    /* $result donnera: 
        Array
        (
            [0] => Array
                (
                    [name] => main
                )
        )
    */

check
=====

``boolean/array Set::check ($data, $path = null)``

Vérifie si un chemin particulier est défini dans un tableau. Si $path
est vide, $data sera retournée plutôt qu'un booléen.

::

    $set = array(
        'Mon Index 1' => array('Premier' => 'Le premier item')
    );
    $result = Set::check($set, 'Mon Index 1.Premier');
    // $result == True
    $result = Set::check($set, 'Mon Index 1');
    // $result == True
    $result = Set::check($set, array());
    // $result == array('Mon Index 1' => array('Premier' => 'Le premier item'))
    $set = array(
        'Mon Index 1' => array('Premier' => 
            array('Second' => 
                array('Troisieme' => 
                    array('Quatrieme' => 'Lourd. Imbriqué.'))))
    );
    $result = Set::check($set, 'Mon Index 1.Premier.Second');
    // $result == True
    $result = Set::check($set, 'Mon Index 1.Premier.Second.Troisieme');
    // $result == True
    $result = Set::check($set, 'Mon Index 1.Premier.Second.Troisieme.Quatrieme');
    // $result == True
    $result = Set::check($set, 'Mon Index 1.Premier.Seconds.Troisieme.Quatrieme');
    // $result == False

remove
======

``array Set::remove ($list, $path = null)``

Supprime un élément dans un ensemble ou un tableau tel que défini par
$path.

::

    $a = array(
        'pages'     => array('name' => 'page'),
        'files'     => array('name' => 'files')
    );

    $result = Set::remove($a, 'files');
    /* $result donnera: 
        Array
        (
            [pages] => Array
                (
                    [name] => page
                )

        )
    */

classicExtract
==============

``array Set::classicExtract ($data, $path = null)``

Obtient une valeur d'un tableau ou un objet qui est contenue dans un
chemin donné en utilisant une syntaxe de chemin en tableau, à savoir:

-  "{n}.Person.{[a-z]+}" - Ou "{n}" représente une clé numerique,
   "Person" représente une chaîne.
-  "{[a-z]+}" (à savoir: toutes chaînes entre crochet comme {n} et {s}
   seront interprétées comme une expression régulière.)

**Exemple 1**

::

    $a = array(
        array('Article' => array('id' => 1, 'title' => 'Article 1')),
        array('Article' => array('id' => 2, 'title' => 'Article 2')),
        array('Article' => array('id' => 3, 'title' => 'Article 3')));
    $result = Set::classicExtract($a, '{n}.Article.id');
    /* $result donnera:
        Array
        (
            [0] => 1
            [1] => 2
            [2] => 3
        )
    */
    $result = Set::classicExtract($a, '{n}.Article.title');
    /* $result donnera:
        Array
        (
            [0] => Article 1
            [1] => Article 2
            [2] => Article 3
        )
    */
    $result = Set::classicExtract($a, '1.Article.title');
    // $result == "Article 2"

    $result = Set::classicExtract($a, '3.Article.title');
    // $result == null

**Exemple 2**

::

    $a = array(
        0 => array('pages' => array('name' => 'page')),
        1 => array('fruites'=> array('name' => 'fruit')),
        'test' => array(array('name' => 'jippi')),
        'dot.test' => array(array('name' => 'jippi'))
    );

    $result = Set::classicExtract($a, '{n}.{s}.name');
    /* $result donnera: 
    Array
        (
            [0] => Array
                (
                    [0] => page
                )
            [1] => Array
                (
                    [0] => fruit
                )
        )
    */
    $result = Set::classicExtract($a, '{s}.{n}.name');
    /* $result donnera: 
        Array
        (
            [0] => Array
                (
                    [0] => jippi
                )
            [1] => Array
                (
                    [0] => jippi
                )
        )
    */
    $result = Set::classicExtract($a,'{\w+}.{\w+}.name');
    /* $result donnera: 
        Array
        (
            [0] => Array
                (
                    [pages] => page
                )
            [1] => Array
                (
                    [fruites] => fruit
                )
            [test] => Array
                (
                    [0] => jippi
                )
            [dot.test] => Array
                (
                    [0] => jippi
                )
        )
    */
    $result = Set::classicExtract($a,'{\d+}.{\w+}.name');
    /* $result donnera: 
        Array
        (
            [0] => Array
                (
                    [pages] => page
                )
            [1] => Array
                (
                    [fruites] => fruit
                )
        )
    */
    $result = Set::classicExtract($a,'{n}.{\w+}.name');
    /* $result donnera: 
        Array
        (
            [0] => Array
                (
                    [pages] => page
                )
            [1] => Array
                (
                    [fruites] => fruit
                )
        )
    */
    $result = Set::classicExtract($a,'{s}.{\d+}.name');
    /* $result donnera: 
        Array
        (
            [0] => Array
                (
                    [0] => jippi
                )
            [1] => Array
                (
                    [0] => jippi
                )
        )
    */
    $result = Set::classicExtract($a,'{s}');
    /* $result donnera: 
        Array
        (

            [0] => Array
                (
                    [0] => Array
                        (
                            [name] => jippi
                        )
                )
            [1] => Array
                (
                    [0] => Array
                        (
                            [name] => jippi
                        )
                )
        )
    */
    $result = Set::classicExtract($a,'{[a-z]}');
    /* $result donnera: 
        Array
        (
            [test] => Array
                (
                    [0] => Array
                        (
                            [name] => jippi
                        )
                )

            [dot.test] => Array
                (
                    [0] => Array
                        (
                            [name] => jippi
                        )
                )
        )
    */
    $result = Set::classicExtract($a, '{dot\.test}.{n}');
    /* $result donnera: 
        Array
        (
            [dot.test] => Array
                (
                    [0] => Array
                        (
                            [name] => jippi
                        )
                )
        )
    */

matches
=======

``boolean Set::matches ($conditions, $data=array(), $i = null, $length=null)``

Set:: matchs peut être utilisé pour voir si un seul élément ou un XPath
donné correspond à certaines conditions.

::

    $a = array(
        array('Article' => array('id' => 1, 'title' => 'Article 1')),
        array('Article' => array('id' => 2, 'title' => 'Article 2')),
        array('Article' => array('id' => 3, 'title' => 'Article 3')));
    $res=Set::matches(array('id>2'), $a[1]['Article']);
    // returns false
    $res=Set::matches(array('id>=2'), $a[1]['Article']);
    // returns true
    $res=Set::matches(array('id>=3'), $a[1]['Article']);
    // returns false
    $res=Set::matches(array('id<=2'), $a[1]['Article']);
    // returns true
    $res=Set::matches(array('id<2'), $a[1]['Article']);
    // returns false
    $res=Set::matches(array('id>1'), $a[1]['Article']);
    // returns true
    $res=Set::matches(array('id>1', 'id<3', 'id!=0'), $a[1]['Article']);
    // returns true
    $res=Set::matches(array('3'), null, 3);
    // returns true
    $res=Set::matches(array('5'), null, 5);
    // returns true
    $res=Set::matches(array('id'), $a[1]['Article']);
    // returns true
    $res=Set::matches(array('id', 'title'), $a[1]['Article']);
    // returns true
    $res=Set::matches(array('non-existant'), $a[1]['Article']);
    // returns false
    $res=Set::matches('/Article[id=2]', $a);
    // returns true
    $res=Set::matches('/Article[id=4]', $a);
    // returns false
    $res=Set::matches(array(), $a);
    // returns true

extract
=======

``array Set::extract ($path, $data=null, $options=array())``

Set::extract utilise la syntaxe de base de XPath 2.0 pour retourner un
sous-ensemble de données depuis un find ou un find all. Cette fonction
permet de retrouver vos données rapidement sans avoir à faire une boucle
à travers un tableau multi-dimensionnel ou parcourir une structure
arborescente.

Si $path est un tableau ou $data est vide alors l'appel sera délégué à
Set::classicExtract.

::

    // Usage habituel:
    $users = $this->User->find("all");
    $results = Set::extract('/User/id', $users);
    // results retourne:
    // array(1,2,3,4,5,...);

Currently implemented selectors:

+--------------------------------------------+--------------------------------------------------------------------------------+
| Selector                                   | Note                                                                           |
+============================================+================================================================================+
| /User/id                                   | Similar to the classic {n}.User.id                                             |
+--------------------------------------------+--------------------------------------------------------------------------------+
| /User[2]/name                              | Selects the name of the second User                                            |
+--------------------------------------------+--------------------------------------------------------------------------------+
| /User[id<2]                                | Selects all Users with an id < 2                                               |
+--------------------------------------------+--------------------------------------------------------------------------------+
| /User[id>2][<5]                            | Selects all Users with an id > 2 but < 5                                       |
+--------------------------------------------+--------------------------------------------------------------------------------+
| /Post/Comment[author\_name=john]/../name   | Selects the name of all Posts that have at least one Comment written by john   |
+--------------------------------------------+--------------------------------------------------------------------------------+
| /Posts[title]                              | Selects all Posts that have a 'title' key                                      |
+--------------------------------------------+--------------------------------------------------------------------------------+
| /Comment/.[1]                              | Selects the contents of the first comment                                      |
+--------------------------------------------+--------------------------------------------------------------------------------+
| /Comment/.[:last]                          | Selects the last comment                                                       |
+--------------------------------------------+--------------------------------------------------------------------------------+
| /Comment/.[:first]                         | Selects the first comment                                                      |
+--------------------------------------------+--------------------------------------------------------------------------------+
| /Comment[text=/cakephp/i]                  | Selects all comments that have a text matching the regex /cakephp/i            |
+--------------------------------------------+--------------------------------------------------------------------------------+
| /Comment/@\*                               | Selects the key names of all comments                                          |
+--------------------------------------------+--------------------------------------------------------------------------------+

Pour le moment, seul les chemins absolus commençant par un simple '/'
sont fonctionnels. Si vous trouvez le moindre bug, vous êtes priez de le
signalez. Toutes suggestions de fonctionnalités supplémentaires sont les
bienvenues.

Pour en apprendre plus sur Set::extract() référez vous à la fonction
testExtract() dans /cake/tests/cases/libs/set.test.php.

format
======

``array Set::format ($data, $format, $keys)``

Retourne une série de valeurs extraites d'un tableau, formatée en
chaines.

::

    $data = array(
        array('Person' => array('first_name' => 'Nate', 'last_name' => 'Abele', 'city' => 'Boston', 'state' => 'MA', 'something' => '42')),
        array('Person' => array('first_name' => 'Larry', 'last_name' => 'Masters', 'city' => 'Boondock', 'state' => 'TN', 'something' => '{0}')),
        array('Person' => array('first_name' => 'Garrett', 'last_name' => 'Woodworth', 'city' => 'Venice Beach', 'state' => 'CA', 'something' => '{1}')));

    $res = Set::format($data, '{1}, {0}', array('{n}.Person.first_name', '{n}.Person.last_name'));
    /*
    Array
    (
        [0] => Abele, Nate
        [1] => Masters, Larry
        [2] => Woodworth, Garrett
    )
    */

    $res = Set::format($data, '{0}, {1}', array('{n}.Person.city', '{n}.Person.state'));
    /*
    Array
    (
        [0] => Boston, MA
        [1] => Boondock, TN
        [2] => Venice Beach, CA
    )
    */
    $res = Set::format($data, '{{0}, {1}}', array('{n}.Person.city', '{n}.Person.state'));
    /*
    Array
    (
        [0] => {Boston, MA}
        [1] => {Boondock, TN}
        [2] => {Venice Beach, CA}
    )
    */
    $res = Set::format($data, '{%2$d, %1$s}', array('{n}.Person.something', '{n}.Person.something'));
    /*
    Array
    (
        [0] => {42, 42}
        [1] => {0, {0}}
        [2] => {0, {1}}
    )
    */
    $res = Set::format($data, '%2$d, %1$s', array('{n}.Person.first_name', '{n}.Person.something'));
    /*
    Array
    (
        [0] => 42, Nate
        [1] => 0, Larry
        [2] => 0, Garrett
    )
    */
    $res = Set::format($data, '%1$s, %2$d', array('{n}.Person.first_name', '{n}.Person.something'));
    /*
    Array
    (
        [0] => Nate, 42
        [1] => Larry, 0
        [2] => Garrett, 0
    )
    */

enum
====

``string Set::enum ($select, $list=null)``

La méthode enum fonctionne bien avec les éléments html select. Il
retourne une valeur depuis une liste de tableau si la clé existe.

Si une $list séparée par des virgules est passée, si les tableaux sont
numériques et si la première clé est 0 alors $list = 'no, yes' sera
traduit par $list = array(0 => 'no', 1=> 'yes');

Si un tableau est utilisé, les clés peuvent être des strings exemple:
array('no' => 0, 'yes' => 1);

$list est défini par défaut ) 0 = no et 1 = yes si param n'est pas passé

::

    $res = Set::enum(1, 'one, two');
    // $res est 'two'

    $res = Set::enum('no', array('no' => 0, 'yes' => 1));
    // $res est 0

    $res = Set::enum('first', array('first' => 'one', 'second' => 'two'));
    // $res est 'one'

numeric
=======

``boolean Set::numeric ($array=null)``

Vérifie que toutes les valeurs du tableau sont numériques

::


        $data = array('un');
        $res = Set::numeric(array_keys($data));
        
        // $res est vrai
        
        $data = array(1 => 'un');
        $res = Set::numeric($data);

        // $res est faux
        
        $data = array('un');
        $res = Set::numeric($data);
        
        // $res est faux
        
        $data = array('un' => 'deux');
        $res = Set::numeric($data);
        
        // $res est faux
        
        $data = array('un' => 1);
        $res = Set::numeric($data);
        
        // $res est vrai
        
        $data = array(0);
        $res = Set::numeric($data);
        
        // $res est vrai
        
        $data = array('un', 'deux', 'trois', 'quatre', 'cinq');
        $res = Set::numeric(array_keys($data));
        
        // $res est vrai
        
        $data = array(1 => 'un', 2 => 'deux', 3 => 'trois', 4 => 'quatre', 5 => 'cinq');
        $res = Set::numeric(array_keys($data));
        
        // $res est vrai
        
        $data = array('1' => 'un', 2 => 'deux', 3 => 'trois', 4 => 'quatre', 5 => 'cinq');
        $res = Set::numeric(array_keys($data));
        
        // $res est vrai
        
        $data = array('un', 2 => 'deux', 3 => 'trois', 4 => 'quatre', 'a' => 'cinq');
        $res = Set::numeric(array_keys($data));
        
        // $res est faux

map
===

``object Set::map ($class = 'stdClass', $tmp = 'stdClass')``

Cette méthode mappe le contenu de l'objet Set vers une hiérarchie
d'objets, tout en gardant les clés numériques dans un tableau d'objets.

Pour faire simple, la fonction map transforme les éléments d'un tableau
en des objets de classe initialisés. Par défaut, il transforme un
tableau en un objet stdClass, cependant vous pouvez mapper des valeurs
dans n'importe quel type de classe. Exemple:
Set::map($array\_of\_values, 'nameOfYourClass');

::

    $data = array(
        array(
            "IndexedPage" => array(
                "id" => 1,
                "url" => 'http://blah.com/',
                'hash' => '68a9f053b19526d08e36c6a9ad150737933816a5',
                'get_vars' => '',
                'redirect' => '',
                'created' => "1195055503",
                'updated' => "1195055503",
            )
        ),
        array(
            "IndexedPage" => array(
                "id" => 2,
                "url" => 'http://blah.com/',
                'hash' => '68a9f053b19526d08e36c6a9ad150737933816a5',
                'get_vars' => '',
                'redirect' => '',
                'created' => "1195055503",
                'updated' => "1195055503",
            ),
        )
    );
    $mapped = Set::map($data);

    /* $mapped ressemble maintenant à cela:

        Array
        (
            [0] => stdClass Object
                (
                    [_name_] => IndexedPage
                    [id] => 1
                    [url] => http://blah.com/
                    [hash] => 68a9f053b19526d08e36c6a9ad150737933816a5
                    [get_vars] => 
                    [redirect] => 
                    [created] => 1195055503
                    [updated] => 1195055503
                )

            [1] => stdClass Object
                (
                    [_name_] => IndexedPage
                    [id] => 2
                    [url] => http://blah.com/
                    [hash] => 68a9f053b19526d08e36c6a9ad150737933816a5
                    [get_vars] => 
                    [redirect] => 
                    [created] => 1195055503
                    [updated] => 1195055503
                )

        )

    */

Set::map() utilisé avec une classe personnalisée comme second paramètre:

::

    class MyClass {
        function sayHi() {
            echo 'Hi!';
        }
    }

    $mapped = Set::map($data, 'MyClass');
    //Maintenant, vous pouvez accéder à toutes les propriétés comme dans l'exemple ci-dessus,
    //mais vous pouvez aussi appeler la méthode MyClass.
    $mapped->[0]->sayHi();

pushDiff
========

``array Set::pushDiff ($array1, $array2)``

Cette fonction fusionne deux tableaux et push la différence dans array2
en bas du tableau résultant.

**Exemple 1**

::

    $array1 = array('ModelOne' => array('id'=>1001, 'field_one'=>'a1.m1.f1', 'field_two'=>'a1.m1.f2'));
    $array2 = array('ModelOne' => array('id'=>1003, 'field_one'=>'a3.m1.f1', 'field_two'=>'a3.m1.f2', 'field_three'=>'a3.m1.f3'));
    $res = Set::pushDiff($array1, $array2);

    /* $res ressemble maintenant à cela: 
        Array
        (
            [ModelOne] => Array
                (
                    [id] => 1001
                    [field_one] => a1.m1.f1
                    [field_two] => a1.m1.f2
                    [field_three] => a3.m1.f3
                )
        )           
    */

**Exemple 2**

::

    $array1 = array("a"=>"b", 1 => 20938, "c"=>"string");
    $array2 = array("b"=>"b", 3 => 238, "c"=>"string", array("extra_field"));
    $res = Set::pushDiff($array1, $array2);
    /* $res ressemble maintenant à cela: 
        Array
        (
            [a] => b
            [1] => 20938
            [c] => string
            [b] => b
            [3] => 238
            [4] => Array
                (
                    [0] => extra_field
                )
        )
    */

filter
======

``array Set::filter ($var, $isArray=null)``

Filtre les éléments vides d'un tableau de route, à l'exclusion de '0'.

::

    $res = Set::filter(array('0', false, true, 0, array('one thing', 'I can tell you', 'is you got to be', false)));

    /* $res ressemble maintenant à cela: 
        Array (
            [0] => 0
            [2] => 1
            [3] => 0
            [4] => Array
                (
                    [0] => one thing
                    [1] => I can tell you
                    [2] => is you got to be
                    [3] => 
                )
        )
    */

merge
=====

``array Set::merge ($arr1, $arr2=null)``

Cette fonction peut être considéré comme un hybride entre les fonctions
PHP array\_merge et array\_merge\_recursive. La différence étant que si
une clé du tableau contient un autre tableau, alors la fonction se
comporte de manière récursive (à la différence array\_merge), mais ne le
fait pas si les clés contiennent des chaînes (à la différence
array\_merge\_recursive). Voir le test unitaire pour plus d'information.

Cette fonction peut marcher avec un nombre illimité d'arguments et
transformer le type de paramètres (typecasts) non rangés en tableaux
dans des tableaux.

::

    $arry1 = array(
        array(
            'id' => '48c2570e-dfa8-4c32-a35e-0d71cbdd56cb',
            'name' => 'mysql raleigh-workshop-08 < 2008-09-05.sql ',
            'description' => 'Importing an sql dump'
        ),
        array(
            'id' => '48c257a8-cf7c-4af2-ac2f-114ecbdd56cb',
            'name' => 'pbpaste | grep -i Unpaid | pbcopy',
            'description' => 'Remove all lines that say "Unpaid".',
        )
    );
    $arry2 = 4;
    $arry3 = array(0=>"test array", "cats"=>"dogs", "people" => 1267);
    $arry4 = array("cats"=>"felines", "dog"=>"angry");
    $res = Set::merge($arry1, $arry2, $arry3, $arry4);

    /* $res ressemble maintenant à cela: 
    Array
    (
        [0] => Array
            (
                [id] => 48c2570e-dfa8-4c32-a35e-0d71cbdd56cb
                [name] => mysql raleigh-workshop-08 < 2008-09-05.sql 
                [description] => Importing an sql dump
            )

        [1] => Array
            (
                [id] => 48c257a8-cf7c-4af2-ac2f-114ecbdd56cb
                [name] => pbpaste | grep -i Unpaid | pbcopy
                [description] => Remove all lines that say "Unpaid".
            )

        [2] => 4
        [3] => test array
        [cats] => felines
        [people] => 1267
        [dog] => angry
    )
    */

contains
========

``boolean Set::contains ($val1, $val2 = null)``

Détermine si un ensemble ou un tableau contient les clés et les valeurs
exactes d'un autre tableau.

::

    $a = array(
        0 => array('name' => 'main'),
        1 => array('name' => 'about')
    );
    $b = array(
        0 => array('name' => 'main'),
        1 => array('name' => 'about'),
        2 => array('name' => 'contact'),
        'a' => 'b'
    );

    $result = Set::contains($a, $a);
    // True
    $result = Set::contains($a, $b);
    // False
    $result = Set::contains($b, $a);
    // True

