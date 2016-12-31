Validation des données
######################

La validation des données est une partie importante de toute
application, puisqu'elle permet de s'assurer que les données d'un modèle
respectent les règles métiers de l'application. Par exemple, vous
aimeriez vérifier que les mots de passe sont longs d'au moins huit
caractères ou bien vous assurer que les noms d'utilisateurs sont
uniques. La définition des règles de validation facilite grandement la
gestion des formulaires.

Il y a de nombreux aspects différents dans le processus de validation.
Ce que nous aborderons dans cette section c'est le côté modèle des
choses. En résumé : ce qui se produit lorsque vous appelez la méthode
save() de votre modèle. Pour obtenir plus d'informations sur la manière
d'afficher les erreurs de validation, regardez la section traitant de
`l'assistant Form </fr/view/182/Form>`_.

La première étape pour la validation de données est de créer les règles
dans le Modèle. Pour ce faire, utilisez le tableau Model::validate dans
la définition du modèle, par exemple :

::

    <?php
    class Utilisateur extends AppModel {  
        var $name = 'Utilisateur';
        var $validate = array();
    }
    ?>

Dans l'exemple ci-dessus, le tableau $validate est ajouté au modèle
Utilisateur, mais ce tableau ne contient pas de règles de validation. En
supposant que la table "utilisateurs" ait les champs "login",
"mot\_de\_passe", "email" et "date\_de\_naissance", l'exemple ci-dessous
montre quelques règles simples de validation qui s'appliquent à ces
champs :

::

    <?php
    class Utilisateur extends AppModel {
        var $name = 'Utilisateur';
        var $validate = array(
            'login' => 'alphaNumeric',
            'email' => 'email',
            'date_de_naissance' => 'date'
        );
    }
    ?>

Ce dernier exemple montre comment des règles de validation peuvent être
ajoutées aux champs d'un modèle. Pour le champ 'login', seules les
lettres et les chiffres sont autorisés, l'email doit être valide et la
date de naissance doit être une date valide. La définition de règles de
validation active l'affichage "automagique" de messages d'erreurs dans
les formulaires par CakePHP, si les données saisies ne respectent pas
les règles définies.

CakePHP a de nombreuses règles et leur utilisation peut être très
simple. Certaines de ces règles intégrées vous permettent de vérifier le
format des adresses emails, des URLs, des numéros de carte de crédit,
etc. - mais nous couvrirons cela en détail plus loin.

Voici un autre exemple de validation plus complexe qui tire avantage de
quelques-unes de ces règles pré-définies :

::

    <?php
    class User extends AppModel {
        var $name = 'User';
        var $validate = array(
            'login' => array(
                'alphaNumeric' => array(
                    'rule' => 'alphaNumeric',
                    'required' => true,
                    'message' => 'Chiffres et lettres uniquement !'
                    ),
                'between' => array(
                    'rule' => array('between', 5, 15),
                    'message' => 'Entre 5 et 15 caractères'
                )
            ),
            'mot_de_passe' => array(
                'rule' => array('minLength', '8'),
                'message' => '8 caractères minimum'
            ),
            'email' => 'email',
            'date_de_naissance' => array(
                'rule' => 'date',
                'message' => 'Entrez une date valide',
                'allowEmpty' => true
            )
        );
    }
    ?>

Deux règles de validation sont définies pour le login : il doit contenir
des lettres et des chiffres uniquement et sa longueur doit être comprise
entre 5 et 15. Le mot de passe doit avoir au minimum 8 caractères.
L'email doit avoir un format correct et la date de naissance être une
date valide. Vous pouvez voir dans cet exemple comment personnaliser les
messages que CakePHP affichera en cas de non respect de ces règles.

Comme le montre l'exemple ci-dessus, un seul champ peut avoir plusieurs
règles de validation. Si les règles pré-définies ne correspondent pas à
vos critères, vous pouvez toujours ajouter vos propres règles de
validation, selon vos besoins.

Maintenant que nous avons vu, en gros, comment la validation fonctionne,
voyons comme ces règles sont définies dans le modèle. Il y a trois
manières différentes pour définir les règles de validation : tableaux
simples, une règle par champ et plusieurs règles par champ.

Note des traducteurs francophones : la règle "alphaNumeric" ne
fonctionne pas pour notre alphabet, les caractères accentués ne sont pas
validés. Pour cela, nous devrons donc passer par une expression
régulière.

Règles simples
==============

Comme le suggère le nom, c'est la manière la plus simple de définir une
règle de validation. La syntaxe générale pour définir des règles de
cette manière est :

::

    var $validate = array('nomChamp' => 'nomRegle');

Où 'nomChamp' est le nom du champ pour lequel la règle est définie, et
'nomRegle' est un nom prédéfini, comme 'alphaNumeric', 'email' ou
'isUnique'.

Par exemple, pour s'assurer que l'utilisateur fourni une adresse email
correcte, vous pouvez utiliser cette règle :

::

    var $validate = array('utilisateur_email' => 'email');

Une règle par champ
===================

Cette technique de définition permet un meilleur contrôle sur le
fonctionnement des règles de validation. Mais avant d'aborder ce point,
regardons le schéma d'utilisation général pour ajouter une règle à un
seul champ :

::

    var $validate = array(
        'champ1' => array(
            'rule' => 'nomRegle', // ou bien : array('nomRegle', 'parametre1', 'parametre2' ...)
            'required' => true,
            'allowEmpty' => false,
            'on' => 'create', // ou bien : 'update'
            'message' => 'Votre message d\'erreur'
        )
    );

La clé 'rule' est obligatoire. Si vous définissez uniquement 'required'
=> true, la validation du formulaire ne fonctionnera pas correctement.
C'est à cause du fait que 'required' n'est pas à proprement parlé une
règle.

Comme vous pouvez le voir ici, chaque champ (un seul est présenté
ci-dessus) est associé à un tableau contenant cinq clés : 'rule',
'required', 'allowEmpty', 'on' et 'message'. Toutes les clés sont
optionnelles sauf 'rule'. Regardons en détail ces clés.

La clé 'rule'
-------------

La clé 'rule' définit la méthode de validation et attend soit une valeur
simple, soit un tableau. La règle spécifiée peut-être le nom d'une
méthode dans votre modèle, une méthode de la classe globale Validation
ou une expression régulière. Pour une liste complète des règles
pré-définies, allez voir `Règles de validation
incluses </fr/view/134/Core-Validation-Rules>`_.

Si la règle ne nécessite pas de paramètre, 'rule' peut-être une simple
valeur, comme :

::

    var $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric'
        )
    );

Si la règle nécessite quelques paramètres (tels que un maximum, un
minimum ou une plage de valeurs), 'rule' doit être un tableau :

::

    var $validate = array(
        'password' => array(
            'rule' => array('minLength', 8)
        )
    );

Souvenez-vous, la clé 'rule' est obligatoire pour les définitions de
règles sous forme de tableau.

required
--------

Cette clé doit être définie par une valeur booléenne. Si 'required' est
'true' alors le champ doit être présent dans le tableau de données. Par
exemple, si la règle de validation a été définie comme suit :

::

    var $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric',
            'required' => true
        )
    );

Les données envoyées à la méthode save() du modèle doivent contenir des
données pour le champ 'login'. Dans le cas contraire, la validation
échouera. La valeur par défaut de cette clé est le booléen 'false'.

``required => true`` ne signifie pas la même chose que la règle de
validation ``notEmpty()``. ``required => true`` indique que la *clé* du
tableau doit être présente - cela ne veut pas dire qu'elle doit avoir
une valeur. Par conséquent, la validation échouera si le champ n'est pas
présent dans le jeu de données, mais pourra réussir (en fonction de la
règle) si la valeur soumise est vide ('').

allowEmpty
----------

Si définie à 'false', la valeur du champ doit être "non vide", ceci
étant déterminé par ``!empty($valeur) || is_numeric($valeur)``. La
vérification numérique est là pour que CakePHP fasse ce qu'il faut quand
``$valeur`` vaut zéro.

La différence entre ``required`` et ``allowEmpty`` peut être confuse.
``'required' => true`` signifie que vous ne pouvez pas sauvegarder le
modèle, si la clé pour ce champ n'est pas présente dans ``$this->data``
(la vérification est réalisé avec ``isset``) ; tandis que
``'allowEmpty' => false`` s'assure que la valeur du champ courant est
"non vide", comme décrit ci-dessus.

on
--

La clé 'on' peut prendre l'une des valeurs suivantes : 'update' ou
'create'. Ceci fournit un mécanisme qui permet à une règle donnée d'être
appliquée pendant la création ou la mise à jour d'un enregistrement.

Si une règle est définie à 'on' => 'create', elle sera seulement
appliquée lors de la création d'un nouvel enregistrement. Autrement, si
elle est définie à 'on' => 'update', elle s'appliquera uniquement lors
de la mise à jour de l'enregistrement.

La valeur par défaut pour 'on' est 'null'. Quand 'on' est nul, la règle
s'applique à la fois pendant la création et la mise à jour.

message
-------

La clé ‘message’ vous permet de définir un message d'erreur de
validation personnalisé pour la règle :

::

    var $validate = array(
        'password' => array(
            'rule' => array('minLength', 8),
            'message' => 'Le mot de passe doit comporter au moins 8 caractères'
        )
    );

last
----

Définir la clé ``'last'`` à ``true`` entraînera l'arrêt du validateur à
la règle courante si elle échoue, plutôt que de continuer avec la règle
suivante. Ceci est pratique si vous voulez arrêter la validation au cas
où le champ est non vide dans un `champ
multi-règles </fr/view/133/Multiple-Rules-per-Field>`_.

::

    var $validate = array(
        'nom_utilisateur' => array(
            'nom_utilisateurRegle-1' => array(
                'rule' => 'notEmpty',  
                'message' => 'Entrez un nom d\'utilisateur svp.',
                'last' => true
             ),
            'nom_utilisateurRegle-2' => array(
                'rule' => array('minLength', '8'),  
                'message' => '8 caractères au moins.'
            )  
        )
    );

La valeur par défaut de ``'last'`` est ``false``.

Plusieurs règles par champs
===========================

La technique que nous venons de voir nous donne plus de flexibilité que
l'assignation simple de règles, mais il y a une étape supplémentaire que
nous pouvons mettre en œuvre, pour avoir un contrôle encore plus fin sur
la validation des données. La prochaine technique que nous allons voir
nous permet d'affecter plusieurs règles de validation par champ de
modèle.

Si vous souhaitiez affecter plusieurs règles de validation à un seul
champ, voici basiquement comment il faudrait faire :

::

     
    var $validate = array(
        'nomChamp' => array(
            'nomRegle' => array(
                'rule' => 'nomRegle',
                // clés supplémentaires comme 'on', 'required', etc. à mettre ici
            ),
            'nomRegle2' => array(
                'rule' => 'nomRegle2',
                // clés supplémentaires comme 'on', 'required', etc. à mettre ici
            )
        )
    );

Comme vous pouvez le voir, cela ressemble beaucoup à ce que nous avons
vu dans la section précédente. Ici pour chaque champ, nous avons
uniquement un tableau de paramètres de validation. Dans ce cas, chaque
'nomChamp' est un tableau de règles indexé. Chaque 'nomRegle' contient
un tableau indépendant de paramètres de validation.

Ce sera plus explicite avec un exemple pratique :

::

    var $validate = array(
        'login' => array(
            'regle1' => array(
                'rule' => 'alphaNumeric',  
                'message' => 'Lettres et chiffres uniquement'
             ),
            'regle2' => array(
                'rule' => array('minLength', '8'),  
                'message' => 'Taille minimum de 8 caractères'
            ),  
        )
    );

L'exemple ci-dessus définit deux règles pour le champ 'login':
'alphanumeric' et 'minlength'. Comme vous pouvez le voir, chaque règle
est identifiée avec un nom arbitraire.

Par défaut, CakePHP essaye de valider un champ en utilisant toutes les
règles de validation déclarées pour lui et renvoi le message d'erreur
pour la dernière règle qui n'est pas passée. Mais si la clé ``last`` est
définie à ``true`` pour une règle et qu'elle ne passe pas, le message
d'erreur pour cette règle est retourné et les règles suivantes ne sont
pas validées. Donc si vous préférez voir le message d'erreur de la
première règle qui ne passe pas au lieu de la dernière, définissez
``'last' => true`` pour chaque règle.

Si vous prévoyez d'utiliser des messages d'erreur internationalisé
(traduits), vous pouvez définir les messages d'erreur dans vos vues :

::

    echo $form->input('login', array(
      'label' => __('Login', true),
      'error' => array(
        'regle1' => __('Caractères alphanumériques seulement', true),
        'regle2' => __('Longueur minimum de 8 caractères', true)
       )
    ));

Le champ est maintenant pleinement internationalisé, et vous pouvez
enlever les messages d'erreurs du modèle. Pour plus d'information sur la
function ``__()``, allez voir la section "Localisation et
Internationalisation".

Règles de validation incluses
=============================

La classe de validation de CakePHP contient un certain nombre de règles
prédéfinies, qui rendent la validation des données plus simple dans vos
modèles. Cette classe contient de nombreuses règles souvent utilisées
que vous n'aurez pas à ré-écrire vous même. Ci-dessous vous trouverez
une liste complète de toutes les règles, illustrées par des exemples
d'utilisation.

alphaNumeric
------------

Les données pour ce champ ne doivent contenir que chiffres et lettres.

::

    var $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric',
            'message' => 'Les données pour ce champ ne doivent contenir que lettres et chiffres.'
        )
    );

*Note des traducteurs francophones* : la règle "alphaNumeric" ne
fonctionne pas pour notre alphabet, les caractères accentués ne sont pas
validés. Pour cela, nous devrons donc passer par une expression
régulière.

between
-------

La longueur des données du champ doit être comprise dans la plage
numérique spécifiée. Les valeurs minimum et maximum doivent être toutes
les deux fournies. Cette méthode utilise <= et non <.

::

    var $validate = array(
        'mot_passe' => array(
            'rule' => array('between', 5, 15),
            'message' => 'Le mot de passe doit avoir une longueur comprise entre 5 et 15 caractères.'
        )
    );

La longueur des données est "le nombre d'octets dans la représentation
des données sous forme de chaîne". Faites attention, car elle peut être
plus grande que le nombre de caractères quand vous manipulez des
caractères non-ASCII.

blank
-----

Cette règle est utilisé pour vérifier que le champ est laissé vide ou
que seulement des caractères blancs y sont présent. Les caractères
blancs incluent l'espace, la tabulation, le retour chariot et nouvelle
ligne.

::

    var $validate = array(
        'id' => array(
            'rule' => 'blank',
            'on' => 'create'
        )
    );

boolean
-------

Les données pour ce champ doivent être une valeur booléenne. Les valeurs
possibles sont : true ou false, les entiers 0 ou 1, les chaînes '0' ou
'1'.

::

    var $validate = array(
        'maCaseACocher' => array(
            'rule' => array('boolean'),
            'message' => 'Valeur incorrecte pour maCaseACocher'
        )
    );

cc
--

Cette règle est utilisée pour vérifier si une donnée est un numéro de
carte de crédit valide. Elle prend trois paramètres : 'type', 'deep' et
'regex'.

Le paramètre 'type' peut être assigné aux valeurs 'fast', 'all' ou à
l'une des suivantes :

-  amex
-  bankcard
-  diners
-  disc
-  electron
-  enroute
-  jcb
-  maestro
-  mc
-  solo
-  switch
-  visa
-  voyager

Si 'type' est défini à 'fast', cela valide les données de la majorité
des formats numériques de cartes de crédits. Définir 'type' à 'all'
vérifiera tous les types de cartes de crédits. Vous pouvez aussi définir
'type' comme un tableau des types que vous voulez détecter.

Le paramètre 'deep' devrait être défini comme une valeur booléenne. S'il
est défini à *true*, la validation vérifiera l'algorithme Luhn de la
carte de crédit
(`https://en.wikipedia.org/wiki/Luhn\_algorithm <https://en.wikipedia.org/wiki/Luhn_algorithm>`_).
Par défaut, elle est à *false*.

Le paramètre 'regex' vous permet de passer votre propre expression
régulière, laquelle sera utilisée pour valider le numéro de la carte de
crédit.

::

    var $validate = array(
        'numero_cc' => array(
            'rule' => array('cc', array('visa', 'maestro'), false, null),
            'message' => 'Le numéro de carte de crédit que vous avez saisi était invalide.'
        )
    );

comparison
----------

Comparison est utilisé pour comparer des valeurs numériques. Il supporte
"est supérieur", "est inférieur", "supérieur ou égal", "inférieur ou
égal", "égal à" et "non égal". Quelques exemples sont indiqués
ci-dessous :

::

    var $validate = array(
        'age' => array(
            'rule' => array('comparison', '>=', 18),
            'message' => 'Vous devez avoir 18 ans au moins pour vous inscrire.'
    );

    var $validate = array(
        'age' => array(
            'rule' => array('comparison', 'greater or equal', 18),
            'message' => 'Vous devez avoir 18 ans au moins pour vous inscrire.'
        )
    );

date
----

Cette règle s'assure que les données soumises sont des formats de date
valides. Un seul paramètre (qui peut être un tableau) doit être passé et
sera utilisé pour vérifier le format de la date soumise. La valeur de ce
paramètre peut être l'une des suivantes :

-  'dmy', par exemple : 27-12-2006 ou 27-12-06 (les séparateurs peuvent
   être l'espace, le point, le tiret, le slash)
-  'mdy', par exemple : 12-27-2006 ou 12-27-06 (les séparateurs peuvent
   être l'espace, le point, le tiret, le slash)
-  'ymd', par exemple : 2006-12-27 ou 06-12-27 (les séparateurs peuvent
   être l'espace, le point, le tiret, le slash)
-  'dMy', par exemple : 27 Décembre 2006 ou 27 Déc 2006
-  'Mdy', par exemple : Décembre 27, 2006 ou Déc 27, 2006 (la virgule
   est optionnelle)
-  'My', par exemple : (Décembre 2006 ou Déc 2006)
-  'my', par exemple : 12/2006 ou 12/06 (les séparateurs peuvent être
   l'espace, le point, le tiret, le slash)

Si aucune clé n'est soumise, la clé par défaut 'ymd' sera utilisée.

::

    var $validate = array(
        'naissance' => array(
            'rule' => 'date',
            'message' => 'Entrez une date valide au format AA-MM-JJ.',
            'allowEmpty' => true
        )
    );

Etant donné que de nombreux moteurs de stockage réclament un certain
format de date, vous devriez envisager de faire le plus gros du travail
en acceptant un large choix de formats et en essayant de les convertir,
plutôt que de forcer les gens à les soumettre dans un format donné. Le
plus de travail vous ferez pour les utilisateurs, le mieux ce sera.

decimal
-------

Cette règle s'assure que la donnée est un nombre décimal valide. Un
paramètre peut être passé pour spécifier le nombre de décimales requises
après le point. Si aucun paramètre n'est passé, la donnée sera validée
comme un nombre scientifique à virgule flottante, entraînant une erreur
si aucune décimale n'est trouvée après le point.

::

    var $validate = array(
        'prix' => array(
            'rule' => array('decimal', 2)
        )
    );

email
-----

Celle-ci vérifie que la donnée soit une adresse email valide. En passant
un booléen true comme second paramètre de cette règle, elle tentera de
vérifier aussi, que l'hôte de l'adresse soit valide.

::

    var $validate = array('email' => array('rule' => 'email'));
     
    var $validate = array(
        'email' => array(
            'rule' => array('email', true),
            'message' => 'Merci de soumettre une adresse email valide.'
        )
    );

equalTo
-------

Cette règle s'assurera que la valeur est égal à la valeur passée et
qu'elle est du même type.

::

    var $validate = array(
        'nourriture' => array(
            'rule' => array('equalTo', 'gâteau'),  
            'message' => 'Cette valeur devrait être la chaîne gâteau'
        )
    );

extension
---------

Cette règle vérifie les extensions valides de fichier, comme .jpg ou
.png. Permet la vérification d'extensions multiples, en les passant sous
forme de tableau.

::

    var $validate = array(
        'image' => array(
            'rule' => array('extension', array('gif', 'jpeg', 'png', 'jpg')),
            'message' => 'Merci de soumettre une image valide.'
        )
    );

file
----

Cette règle s'assure que la valeur est un nom de fichier valide. Cette
règle de validation n'est pour le moment pas fonctionnelle.

ip
--

Cette règle s'assurera qu'une adresse IPv4 valide ait été soumise.

::

    var $validate = array(
        'ip_client' => array(
            'rule' => 'ip',
            'message' => 'Merci de soumettre une adresse IP valide.'
        )
    );

isUnique
--------

La donnée pour le champ doit être unique, elle ne peut être utilisée par
aucune autre ligne.

::

    var $validate = array(
        'login' => array(
            'rule' => 'isUnique',
            'message' => 'Ce nom d\'utilisateur a déjà été choisi.'
        )
    );

minLength
---------

Cette règle s'assure que la donnée satisfait à la longueur minimale
requise.

::

    var $validate = array(
        'login' => array(
            'rule' => array('minLength', '8'),  
            'message' => 'Les noms d\'utilisateur doivent avoir au moins 8 caractères.'
        )
    );

La longueur des données est "le nombre d'octets dans la représentation
des données sous forme de chaîne". Faites attention, car elle peut être
plus grande que le nombre de caractères quand vous manipulez des
caractères non-ASCII.

maxLength
---------

Cette règle s'assure que la donnée respecte la longueur maximale
requise.

::

    var $validate = array(
        'login' => array(
            'rule' => array('maxLength', '15'),  
            'message' => 'Les noms d\'utilisateur ne doivent pas dépasser 15 caractères.'
        )
    );

La longueur ici est "le nombre d'octets dans la représentation des
données sous forme de chaîne". Faites attention car elle pourrait être
plus grande que le nombre de caractères en manipulant des caractères
non-ASCII.

money
-----

Cette règle s'assurera que la valeur est une somme monétaire valide.

Le second paramètre définit où le symbole est situé (gauche/droite).

::

    var $validate = array(
        'salaire' => array(
            'rule' => array('money', 'left'),
            'message' => 'Merci de soumettre une somme monétaire valide.'
        )
    );

multiple
--------

Utilisez cette règle pour valider un champ select multiple. Elle accepte
les paramètres "in", "max" et "min".

::

    var $validate = array(
        'multiple' => array(
            'rule' => array('multiple', array('in' => array('do', 'ré', 'mi', 'fa', 'sol', 'la', 'si'), 'min' => 1, 'max' => 3)),
            'message' => 'Merci de choisir une, deux ou trois options'
        )
    );

inList
------

Cette règle s'assurera que la valeur est dans un ensemble donné. Elle
nécessite un tableau des valeurs. Le champ est valide si sa valeur
vérifie l'une des valeurs du tableau donné.

Exemple :

::

        var $validate = array(
          'fonction' => array(
            'choixAutorise' => array(
                'rule' => array('inList', array('Foo', 'Bar')),
                'message' => 'Entrez soit Foo, soit Bar.'
            )
          )
        );

numeric
-------

Vérifie si la donnée passée est un nombre valide.

::

    var $validate = array(
        'voitures' => array(
            'rule' => 'numeric',  
            'message' => 'Merci de soumettre le nombre de voitures.'
        )
    );

notEmpty
--------

La règle de base pour s'assurer qu'un champ n'est pas vide.

::

    var $validate = array(
        'titre' => array( 
            'rule' => 'notEmpty',
            'message' => 'Ce champ ne peut pas rester vide'
        )
    );

Ne l'utilisez pas pour un champ select multiple, sinon cela causera une
erreur. A la place, utilisez "multiple".

phone
-----

Phone valide les numéros de téléphone US. Si vous voulez valider des
numéros de téléphones non-US, vous pouvez fournir une expression
régulière comme second paramètre pour couvrir des formats de numéros
additionnels.

::

    var $validate = array(
        'telephone' => array(
            'rule' => array('phone', null, 'us')
        )
    );

postal
------

Postal est utilisé pour valider des codes postaux des U.S.A. (us), du
Canada (ca), du Royaume-Uni (uk), de l'Italie (it), d'Allemagne (de) et
de Belgique (be). Pour les autres formats de codes postaux, vous devez
fournir une expression régulière comme second paramètre.

::

    var $validate = array(
        'code_postal' => array(
            'rule' => array('postal', null, 'us')
        )
    );

range
-----

Cette règle s'assure que la valeur est dans une fourchette donnée. Si
aucune fourchette n'est soumise, la règle s'assurera que la valeur est
un nombre limite valide pour la plateforme courante.

::

    var $validate = array(
        'nombre' => array(
            'rule' => array('range', -1, 11),
            'message' => 'Merci d\'entrer un nombre entre 0 et 10'
        )
    );

L'exemple ci-dessus acceptera toutes les valeurs qui sont plus grandes
que 0 (par ex, 0.01) et plus petite que 10 (par ex, 9.99). Note : Les
deux extrémités données (-1 et 11) ne sont pas incluses !!!

ssn
---

Ssn valide les numéros de sécurité sociale des U.S.A. (us), du Danemark
(dk) et des Pays-Bas (nl). Pour les autres formats de numéros de
sécurité sociale, vous devez fournir une expression régulière.

::

    var $validate = array(
        'ssn' => array(
            'rule' => array('ssn', null, 'us')
        )
    );

url
---

Cette règle vérifie les formats valides d'URL. Elle supporte les
protocoles http(s), ftp(s), file, news et gopher.

::

    var $validate = array(
        'siteweb' => array(
            'rule' => 'url'
        )
    );

Pour s'assurer qu'un protocole est présent dans l'url, le mode strict
mode peut être activé comme ceci.

::

    var $validate = array(
        'siteweb' => array(
            'rule' => array('url', true)
        )
    );

Règles personnalisées de validation des données
===============================================

Si ce qui précède ne vous convient pas, vous pouvez toujours créer vos
propres règles de validation. Il y a deux moyens de réaliser cela : en
définissant des expressions régulières ou en créant des méthodes de
validation personnalisées.

Validation avec Expression Régulière personnalisée
--------------------------------------------------

Si la technique de validation dont vous avez besoin peut être complétée
par l'utilisation d'une expression régulière, vous pouvez définir une
expression personnalisée comme une règle de validation de champ.

::

    var $validate = array(
        'login' => array(
            'rule' => array('custom', '/^[a-z0-9]{3,}$/i'),  
            'message' => 'Seulement des lettres et des entiers, minimum 3 caractères'
        )
    );

L'exemple ci-dessus vérifie que le login contient seulement des lettres
et des entiers et qu'il a au minimum trois caractères.

L'expression régulière dans ``rule`` doit être délimitée par des
*slashes* (/). Le "i" final optionnel après le dernier *slash* signifie
que l'expression régulière est insensible à la casse.

Ajouter vos propres méthodes de validation
------------------------------------------

Parfois, la vérification des données par un motif d'expression régulière
ne suffit pas. Par exemple, si vous voulez vous assurer qu'un coupon de
réduction (code promo) n'est pas utilisé plus de 25 fois, vous devez
ajouter votre propre méthode de validation, comme indiqué ci-dessous :

::

    <?php
    class Utilisateur extends AppModel {
        var $name = 'Utilisateur';
      
        var $validate = array(
            'code_promo' => array(
                'rule' => array('limiteUtilisations', 25),
                'message' => 'Ce code promo a dépassé son nombre maximal d\'utilisation.'
            )
        );
     
        function limiteUtilisations($check, $limit){
        //$check aura comme valeur : array('code_promo' => 'une valeur')
       //$limit aura comme valeur : 25
            $compteur_code_actuel = $this->find( 'count', array('conditions' => $data, 'recursive' => -1) );
            return $compteur_code_actuel < $limit;
        }
    }
    ?>

Le champ en cours de validation est passé à la fonction comme premier
paramètre, sous la forme d'un tableau associatif avec le nom du champ
comme clé et les données postées comme valeur.

Si vous voulez passer des paramètres supplémentaires à votre fonction de
validation, ajoutez des éléments dans le tableau 'rule' et manipulez-les
comme des paramètres supplémentaires (après le paramètre principal
``$check``) dans votre fonction.

Votre fonction de validation peut être dans le modèle (comme dans
l'exemple) ou dans un comportement (*behavior*) que votre modèle
implémente. Ceci inclus les méthodes mappées.

Les méthodes des modèles/comportements sont vérifiées en premier, avant
de chercher pour une méthode dans la class ``Validation``. Cela veut
dire que vous pouvez écraser les méthodes de validation existantes
(telle que ``alphaNumeric()``) au niveau de l'application (en ajoutant
la méthode dans ``AppModel``) ou au niveau du modèle.

Quand vous écrivez une règle de validation qui peut être utilisée par
plusieurs champs, prenez soin d'extraire la valeur du champ du tableau
``$check``. Le tableau ``$check`` est passé avec le nom du champ comme
clé et la valeur du champ comme valeur. Le champ complet qui doit être
validé est stocké dans une variable de $this->data.

::

    <?php
    class Message extends AppModel {
        var $name = 'Message';
        var $validate = array(
            'pseudo' => array(
                'rule' => 'alphaNumericDashUnderscore',
                'message' => 'Le pseudo ne peut contenir que des lettres, des nombres, des tirets ou des underscores.
            )
        );

        function alphaNumericDashUnderscore($check) {
            // le tableau $check est passé en utilisant le nom du champ de formulaire comme clé
            // nous devons extraire la valeur pour rendre la fonction générique
            $valeur = array_values($data);
            $valeur = $valeur[0];

            return preg_match('|^[0-9a-zA-Z_-]*$|', $valeur);
        }
    }
    ?>

Valider des données à partir du contrôleur
==========================================

Alors que d'habitude, vous utiliser la méthode *save* de votre modèle,
il peut vous arriver parfois de vouloir tester et valider vos données
sans les sauvegarder. Par exemple, vous souhaitez peut-être afficher des
informations complémentaires à l'utilisateur avant de sauvegarder
définitivement le tout dans votre base de données. Dans ce cas,
uniquement tester les données requiert une technique un peu différente
de la sauvegarde habituelle.

Tout d'abord, envoyez les données à votre modèle :

::

    $this->NomDuModele->set( $this->data );

Ensuite, pour vérifier que les données sont valides, utilisez la méthode
de validation de votre modèle, qui retournera *true* (vrai) si les
données sont valides, et *false* (faux) sinon :

::

    if ($this->NomDuModele->validates()) {
        // Si les données sont valides
    } else {
        // Si elles ne le sont pas
    }

La méthode de validation appelle la méthode *invalidFields* qui remplit
la propriété *validationErrors* du modèle. Elle retourne également ces
erreurs comme résultat de son appel :

::

    $erreurs = $this->NomDuModele->invalidFields(); // renvoie le tableau d'erreurs validationErrors

Il est important de noter que les données doivent être envoyées au
modèle avant de pouvoir être validées. C'est différent de la méthode de
sauvegarde (*save*) qui vous permet de les envoyer en tant que
paramètre. De même, gardez en mémoire qu'il n'est pas nécessaire
d'appeler la méthode de validation avant de sauvegarder vos données, car
la méthode *save* validera automatiquement ces données avant de les
sauvegarder de manière définitive.

Pour valider vos données dans plusieurs modèles, l'approche suivante
peut être utilisée :

::

    if ($this->Model->saveAll($this->data, array('validate' => 'only'))) {
      // Les données sont valides
    } else {
      // Les données ne sont pas valides
    }

Si vous avez validé les données avant sauvegarde, vous pouvez désactiver
la validation pour éviter une seconde vérification.

::

    if ($this->Model->saveAll($this->data, array('validate' => false))) {
        // sauvegarde sans validation
    } 

