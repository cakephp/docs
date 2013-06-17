Validation des Donnnées
#######################

La validation des données est une partie importante de toute application, 
puisqu'elle permet de s'assurer que les données d'un model respectent les 
règles métiers de l'application. Par exemple, vous aimeriez vérifier que les 
mots de passe sont longs d'au moins huit caractères ou bien vous assurer que 
les noms d'users sont uniques. La définition des règles de validation 
facilite grandement la gestion des formulaires.

Il y a de nombreux aspects différents dans le processus de validation. Ce 
que nous aborderons dans cette section c'est le côté model des choses. En 
résumé : ce qui se produit lorsque vous appelez la méthode save() de votre 
model. Pour obtenir plus d'informations sur la manière d'afficher les erreurs 
de validation, regardez la section traitant des helpers  
:doc:`/core-libraries/helpers/form`.

La première étape pour la validation de données est de créer les règles dans 
le Model. Pour ce faire, utilisez le tableau Model::validate dans la 
définition du model, par exemple::

    class User extends AppModel {  
        public $name = 'User';
        public $validate = array();
    }

Dans l'exemple ci-dessus, le tableau ``$validate`` est ajouté au model 
User, mais ce tableau ne contient pas de règles de validation. 
En supposant que la table "users" ait les champs "login", 
"mot_de_passe", "email" et "date_de_naissance", l'exemple ci-dessous 
montre quelques règles simples de validation qui s'appliquent à ces champs::

    class User extends AppModel {
        public $name = 'User';
        public $validate = array(
            'login' => 'alphaNumeric',
            'email' => 'email',
            'date_de_naissance'  => 'date'
        );
    }


Ce dernier exemple montre comment des règles de validation peuvent être 
ajoutées aux champs d'un model. Pour le champ 'login', seules les lettres 
et les chiffres sont autorisés, l'email doit être valide et la date de 
naissance doit être une date valide. La définition de règles de validation 
active l'affichage "automagique" de messages d'erreurs dans les formulaires 
par CakePHP, si les données saisies ne respectent pas les règles définies.

CakePHP a de nombreuses règles et leur utilisation peut être très simple. 
Certaines de ces règles intégrées vous permettent de vérifier le format des 
adresses emails, des URLs, des numéros de carte de crédit, etc. - mais nous 
couvrirons cela en détail plus loin.

Voici un autre exemple de validation plus complexe qui tire avantage de 
quelques-unes de ces règles pré-définies::

    class User extends AppModel {
        public $name = 'User';
        public $validate = array(
            'login' => array(
                'alphaNumeric' => array(
                    'rule'     => 'alphaNumeric',
                    'required' => true,
                    'message'  => 'Chiffres et lettres uniquement !'
                ),
                'between' => array(
                    'rule'    => array('between', 5, 15),
                    'message' => 'Entre 5 et 15 caractères'
                )
            ),
            'mot_de_passe' => array(
                'rule'    => array('minLength', '8'),
                'message' => '8 caractères minimum'
            ),
            'email' => 'email',
            'date_de_naissance' => array(
                'rule'       => 'date',
                'message'    => 'Entrez une date valide',
                'allowEmpty' => true
            )
        );
    }

Deux règles de validation sont définies pour le login : il doit contenir 
des lettres et des chiffres uniquement et sa longueur doit être comprise 
entre 5 et 15. Le mot de passe doit avoir au minimum 8 caractères. L'email 
doit avoir un format correct et la date de naissance être une date valide. 
Vous pouvez voir dans cet exemple comment personnaliser les messages que 
CakePHP affichera en cas de non respect de ces règles.

Comme le montre l'exemple ci-dessus, un seul champ peut avoir plusieurs règles 
de validation. Si les règles pré-définies ne correspondent pas à vos critères, 
vous pouvez toujours ajouter vos propres règles de validation, selon vos 
besoins.

Maintenant que nous avons vu, en gros, comment la validation fonctionne, voyons 
comme ces règles sont définies dans le model. Il y a trois manières 
différentes pour définir les règles de validation : tableaux simples, une règle 
par champ et plusieurs règles par champ.

Règles simples
==============

Comme le suggère le nom, c'est la manière la plus simple de définir une 
règle de validation. La syntaxe générale pour définir des règles de cette 
manière est::

    public $validate = array('nomChamp' => 'nomRegle');

Où 'nomChamp' est le nom du champ pour lequel la règle est définie, et 
'nomRegle' est un nom prédéfini, comme 'alphaNumeric', 'email' ou 'isUnique'.

Par exemple, pour s'assurer que l'user fourni une adresse email 
correcte, vous pouvez utiliser cette règle::

    public $validate = array('email_user' => 'email');


Une règle par champ
===================

Cette technique de définition permet un meilleur contrôle sur le fonctionnement 
des règles de validation. Mais avant d'aborder ce point, regardons le schéma 
d'utilisation général pour ajouter une règle à un seul champ::

    public $validate = array(
        'champ1' => array(
            'rule'       => 'nomRegle', // ou bien : array('nomRegle', 'parametre1', 'parametre2' ...)
            'required'   => true,
            'allowEmpty' => false,
            'on'         => 'create', // ou bien: 'update'
            'message'    => 'Votre message d\'erreur'
        )
    );

La clé 'rule' est obligatoire. Si vous définissez uniquement 
'required' => true, la validation du formulaire ne fonctionnera pas 
correctement. C'est à cause du fait que 'required' n'est pas à proprement 
parlé une règle.

Comme vous pouvez le voir ici, chaque champ (un seul est présenté ci-dessus) 
est associé à un tableau contenant cinq clés : ‘rule‘, ‘required‘, 
‘allowEmpty‘, ‘on‘ et ‘message‘. Toutes les clés sont optionnelles sauf 
'rule'. Regardons en détail ces clés.

La clé 'rule'
-------------

La clé 'rule' définit la méthode de validation et attend soit une valeur 
simple, soit un tableau. La règle spécifiée peut-être le nom d'une méthode 
dans votre model, une méthode de la classe globale Validation ou une 
expression régulière. Pour une liste complète des règles pré-définies, 
allez voir :ref:`core-validation-rules`.

Si la règle ne nécessite pas de paramètre, 'rule' peut-être une simple 
valeur, comme::

    public $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric'
        )
    );

Si la règle nécessite quelques paramètres (tels que un maximum, un 
minimum ou une plage de valeurs), 'rule' doit être un tableau::

    public $validate = array(
        'mot_de_passe' => array(
            'rule' => array('minLength', 8)
        )
    );

Souvenez-vous, la clé 'rule' est obligatoire pour les définitions de 
règles sous forme de tableau.

La clé 'required'
-----------------

Cette clé doit être définie par une valeur booléenne, ou ``create`` ou 
``update``. Si 'required' est ``true`` alors le champ doit être présent 
dans le tableau de données. Tandis que mettre le champ à ``create`` ou 
``update`` rendra le champ nécessaire seulement lors des opérations de 
création ou de mise à jour. Par exemple, si la règle de validation a 
été définie comme suit::

    public $validate = array(
        'login' => array(
            'rule'     => 'alphaNumeric',
            'required' => true
        )
    );

Les données envoyées à la méthode save() du model doivent contenir des 
données pour le champ 'login'. Dans le cas contraire, la validation 
échouera. La valeur par défaut de cette clé est le booléen 'false'.

``required => true`` ne signifie pas la même chose que la règle de validation 
``notEmpty()``. ``required => true`` indique que la *clé* du tableau doit être 
présente - cela ne veut pas dire qu'elle doit avoir une valeur. Par 
conséquent, la validation échouera si le champ n'est pas présent dans le jeu 
de données, mais pourra réussir (en fonction de la règle) si la valeur soumise 
est vide ('').

.. versionchanged:: 2.1
    Support pour ``create`` et ``update`` a été ajouté.

La Clé 'allowEmpty'
-------------------

Si définie à ``false``, la valeur du champ doit être **non vide**, ceci 
étant déterminé par ``!empty($value) || is_numeric($value)``. La vérification 
numérique est là pour que CakePHP fasse ce qu'il faut quand ``$valeur`` vaut 
zéro.

La différence entre ``required`` et ``allowEmpty`` peut être confuse. 
``'required' => true`` signifie que vous ne pouvez pas sauvegarder le model, 
si la *clé* pour ce champ n'est pas présente dans ``$this->data`` (la 
vérification est réalisé avec isset) ; tandis que ``'allowEmpty' => false`` 
s'assure que la *valeur* du champ courant est "non vide", comme décrit 
ci-dessus. 

La clé 'on'
-----------

La clé 'on' peut prendre l'une des valeurs suivantes : 'update' ou 'create'. 
Ceci fournit un mécanisme qui permet à une règle donnée d'être appliquée 
pendant la création ou la mise à jour d'un enregistrement.

Si une règle est définie à 'on' => 'create', elle sera seulement appliquée 
lors de la création d'un nouvel enregistrement. Autrement, si elle est 
définie à 'on' => 'update', elle s'appliquera uniquement lors de la mise 
à jour de l'enregistrement.

La valeur par défaut pour 'on' est 'null'. Quand 'on' est nul, la règle 
s'applique à la fois pendant la création et la mise à jour.

La clé 'message'
----------------

La clé ‘message’ vous permet de définir un message d'erreur de validation 
personnalisé pour la règle::

    public $validate = array(
        'mot_de_passe' => array(
            'rule'    => array('minLength', 8),
            'message' => 'Le mot de passe doit comporter au moins 8 caractères'
        )
    );

Plusieurs règles par champs
===========================

La technique que nous venons de voir nous donne plus de flexibilité que 
l'assignation simple de règles, mais il y a une étape supplémentaire que 
nous pouvons mettre en œuvre, pour avoir un contrôle encore plus fin sur la 
validation des données. La prochaine technique que nous allons voir nous 
permet d'affecter plusieurs règles de validation par champ de model.

Si vous souhaitiez affecter plusieurs règles de validation à un seul champ, 
voici basiquement comment il faudrait faire::

    public $validate = array(
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

Comme vous pouvez le voir, cela ressemble beaucoup à ce que nous avons vu 
dans la section précédente. Ici pour chaque champ, nous avons uniquement un 
tableau de paramètres de validation. Dans ce cas, chaque ‘nomChamp‘ est un 
tableau de règles indexé. Chaque 'nomRegle' contient un tableau indépendant 
de paramètres de validation.

Ce sera plus explicite avec un exemple pratique::

    public $validate = array(
        'login' => array(
            'regleLogin-1' => array(
                'rule'    => 'alphaNumeric',  
                'message' => 'Lettres et chiffres uniquement',
                'last'    => true
             ),
            'regleLogin-2' => array(
                'rule'    => array('minLength', 8),  
                'message' => 'Taille minimum de 8 caractères'
            )  
        )
    );

L'exemple ci-dessus définit deux règles pour le champ 'login': 'regleLogin-1' 
et 'regleLogin-2'. Comme vous pouvez le voir, chaque règle est identifiée avec 
un nom arbitraire.

Quand vous utilisez des règles multiples par champ, les clés 'required' et
'allowEmpty' doivent être utilisées seulement une fois dans la première règle.

last
-------

Dans le cas de règles multiples par champ, si une des règles échoue, le message
d'erreur pour cette règle va par défaut être retourné et les règles suivantes
pour ce champ ne seront pas testées. Si vous voulez que la validation continue
bien qu'une règle ait échouée, définissez la clé ``last`` à ``false`` pour
cette règle.

Dans l'exemple suivant, même si "rule1" échoue "rule2" va être testée
et les messages d'erreur pour les deux règles ayant échoués seront retournées
si "rule2" échoue aussi::

    public $validate = array(
        'login' => array(
            'rule1' => array(
                'rule'    => 'alphaNumeric',
                'message' => 'Only alphabets and numbers allowed',
                'last'    => false
             ),
            'rule2' => array(
                'rule'    => array('minLength', 8),
                'message' => 'Minimum length of 8 characters'
            )
        )
    );

Quand vous spécifiez des règles de validation dans ce tableau de formulaire, il
est aussi possible d'éviter de fournir la clé ``message``. Regardez cette
exemple::

    public $validate = array(
        'login' => array(
            'Only alphabets and numbers allowed' => array(
                'rule'    => 'alphaNumeric',
             ),
        )
    );

Si les règles de ``alphaNumeric`` échouent, la clé du tableau pour cette règle
'Only alphabets and numbers allowed' sera retourné en message d'erreur si la
clé ``message`` n'est pas définie.


Règles personnalisées de validation des données
===============================================

Si ce qui précède ne vous convient pas, vous pouvez toujours créer vos propres 
règles de validation. Il y a deux moyens de réaliser cela : en définissant 
des expressions régulières ou en créant des méthodes de validation 
personnalisées.

Validation avec Expression Régulière personnalisée
--------------------------------------------------

Si la technique de validation dont vous avez besoin peut être complétée par 
l'utilisation d'une expression régulière, vous pouvez définir une expression 
personnalisée comme une règle de validation de champ::

    public $validate = array(
        'login' => array(
            'rule'    => '/^[a-z0-9]{3,}$/i',
            'message' => 'Seulement des lettres et des entiers, minimum 3 caractères'
        )
    );

L'exemple ci-dessus vérifie que le login contient seulement des lettres et des 
entiers et qu'il a au minimum trois caractères.

L'expression régulière dans ``rule`` doit être délimitée par des slashes (/). 
Le 'i' final optionnel après le dernier slash signifie que l'expression 
régulière est *i*\ nsensible à la casse.

Ajouter vos propres méthodes de validation
------------------------------------------

Parfois, la vérification des données par un motif d'expression régulière ne 
suffit pas. Par exemple, si vous voulez vous assurer qu'un coupon de réduction 
(code promo) n'est pas utilisé plus de 25 fois, vous devez ajouter votre 
propre méthode de validation, comme indiqué ci-dessous::

    class User extends AppModel {
        public $name = 'User';

        public $validate = array(
            'code_promo' => array(
                'rule'    => array('limiteUtilisations', 25),
                'message' => 'Ce code promo a dépassé son nombre maximal d\'utilisation.'
            )
        );

        public function limiteUtilisations($check, $limit) {
            // $check aura comme valeur : array('code_promo' => 'une valeur')
            // $limit aura comme valeur : 25
             $compteur_code_actuel = $this->find( 'count', array(
                'conditions' => $check,
                'recursive' => -1
            ));
            return $compteur_code_actuel < $limit;
        }
    }

Le champ en cours de validation est passé à la fonction comme premier 
paramètre, sous la forme d'un tableau associatif avec le nom du champ 
comme clé et les données postées comme valeur.

Si vous voulez passer des paramètres supplémentaires à votre fonction de 
validation, ajoutez des éléments dans le tableau ’rule’ et manipulez-les 
comme des paramètres supplémentaires (après le paramètre principal ``$check``) 
dans votre fonction.

Votre fonction de validation peut être dans le model (comme dans l'exemple) 
ou dans un behavior (comportement) que votre model implémente. Ceci inclus 
les méthodes mappées.

Les méthodes des models/behaviors sont vérifiées en premier, avant de 
chercher pour une méthode dans la class ``Validation``. Cela veut dire que vous 
pouvez écraser les méthodes de validation existantes (telle que 
``alphaNumeric()``) au niveau de l'application (en ajoutant la méthode dans 
``AppModel``) ou au niveau du model.

Quand vous écrivez une règle de validation qui peut être utilisée par 
plusieurs champs, prenez soin d'extraire la valeur du champ du tableau 
$check. Le tableau $check est passé avec le nom du champ comme clé et la 
valeur du champ comme valeur. Le champ complet qui doit être validé est 
stocké dans une variable de $this->data::

    class Post extends AppModel {
        public $name = 'Post';

        public $validate = array(
            'slug' => array(
                'rule'    => 'alphaNumericDashUnderscore',
                'message' => 'Le slug ne peut contenir que des lettres, des nombres, des tirets ou des underscores.'
            )
        );

        public function alphaNumericDashUnderscore($check) {
            // le tableau $check est passé en utilisant le nom du champ de formulaire comme clé
            // nous devons extraire la valeur pour rendre la fonction générique
            $valeur = array_values($check);
            $valeur = $valeur[0];

            return preg_match('|^[0-9a-zA-Z_-]*$|', $valeur);
        }
    }

.. note::

    Vos propres méthodes de validation doivent avoir une visibilité ``public``.
    Les méthodes de Validation qui sont ``protected`` et ``private`` ne sont
    pas supportées.

Cette méthode devrait retourner ``true`` si la valeur est valide. Si la
validation échoue, elle retourne ``false``. L'autre caleur de retour valide
est une chaîne de caractères qui sera montrée en message d'erreur. Retourner
une chaîne de caractères signifie que la validation a échoué. La chaîne de
caractère va surcharger le message défini dans le tableau $validate et sera
montré dans le formulaire de vue comme la raison pour laquelle le champ n'est
pas valide.


Changer dynamiquement les règles de validation
==============================================

Utiliser la propriété ``$validate`` pour déclarer les règles de validation est
une bonne façon de définir des règles statiques pour chaque model. Néanmoins,
il y a d'autres cas où vous voudrez ajouter, modifier ou retirer dynamiquement
des règles de validation d'un ensemble pré-défini.

Toutes les règles de validation sont stockées dans un objet ``ModelValidator``,
qui contient chaque règle pour chaque champ définie dans votre model. Définir
de nouvelles règles de validation est aussi facile que de dire à cet objet
de stocker de nouvelles méthodes de validation pour les champs que vous
souhaitez.


Ajouter de nouvelles règles de validation
-----------------------------------------

.. versionadded:: 2.2

Les objets ``ModelValidator`` permettent de nombreuses façons d'ajouter de
nouveaux champs à définir. Le premier est l'utilisation de la méthode ``add``::

    // Dans une classe de model
    $this->validator()->add('password', 'required', array(
        'rule' => 'notEmpty',
        'required' => 'create'
    ));

Cela va ajouter une règle simple au champ `password` dans le model. Vous pouvez
chainer plusieurs appels à ajouter pour créer autant de règles que vous
souhaitez::

    // Dans une classe de model
    $this->validator()
        ->add('password', 'required', array(
            'rule' => 'notEmpty',
            'required' => 'create'
        ))
        ->add('password', 'size', array(
            'rule' => array('between', 8, 20),
            'message' => 'Password should be at least 8 chars long'
        ));

Il est aussi possible d'ajouter des règles multiples en une fois pour un
champ unique::

    $this->validator()->add('password', array(
        'required' => array(
            'rule' => 'notEmpty',
            'required' => 'create'
        ),
        'size' => array(
            'rule' => array('between', 8, 20),
            'message' => 'Password should be at least 8 chars long'
        )
    ));

De façon alternative, vous pouvez utiliser l'objet validator pour définir
les règles directement aux champs en utilisant l'interface de tableau::

    $validator = $this->validator();
    $validator['username'] = array(
        'unique' => array(
            'rule' => 'isUnique',
            'required' => 'create'
        ),
        'alphanumeric' => array(
            'rule' => 'alphanumeric'
        )
    );

Modifier les règles de validation courantes
-------------------------------------------

.. versionadded:: 2.2

Modifier les règles de validation courantes est aussi possible en utilisant
l'objet validator, il y a plusieurs façons pour modifier les règles courantes,
les méthodes d'ajout à un champ ou le retrait complet d'une règle à partir
d'une règle définie d'un champ::

    // Dans une classe de model
    $this->validator()->getField('password')->setRule('required', array(
        'rule' => 'required',
        'required' => true
    ));

Vous pouvez aussi complètement remplacer toutes les règles pour un champ en
utilisant une méthode similiare::

    // Dans une classe de model
    $this->validator()->getField('password')->setRules(array(
        'required' => array(...),
        'otherRule' => array(...)
    ));

Si vous souhaitez juste modifier une propriété unique dans une règle dans
laquelle vous pouvez définir des propriétés directement dans l'objet
``CakeValidationRule``::

    // Dans une classe de model
    $this->validator()->getField('password')
        ->getRule('required')->message = 'This field cannot be left blank';

Les propriétés dans toute ``CakeValidationRule`` sont nommées avec le tableau
de clés valides que vous pouvez utiliser pour définir de telles règles en
utilisant la propriété ``$validate`` dans le model.

Comme avec l'ajout de nouvelle règle à l'ensemble, il est aussi possible de
modifier les règles existantes en utilisant l'interface de tableau::

    $validator = $this->validator();
    $validator['username']['unique'] = array(
        'rule' => 'isUnique',
        'required' => 'create'
    );

    $validator['username']['unique']->last = true;
    $validator['username']['unique']->message = 'Name already taken';


Retirer des règles d'un ensemble
--------------------------------

.. versionadded:: 2.2

Il est possible de retirer complètement toutes les règles pour un champ ou de
supprimer une règle unique dans un ensemble de règles de champ::

    // Retire complètement toutes les règles pour un champ
    $this->validator()->remove('username');

    // Retire la règle 'required' de password
    $this->validator()->remove('password', 'required');

De façon optionnelle, vous pouvez utiliser l'interface de tableau pour supprimer
les règles à partir d'un ensemble::

    $validator = $this->validator();
    // Retire complètement toutes les règles pour un champ
    unset($validator['username']);

    // Retire la règle 'required' de password
    unset($validator['password']['required']);

.. _core-validation-rules:

Règles de validation incluses
=============================

.. php:class:: Validation

La classe de validation de CakePHP contient un certain nombre de règles 
prédéfinies, qui rendent la validation des données plus simple dans vos 
models. Cette classe contient de nombreuses règles souvent utilisées que 
vous n'aurez pas à ré-écrire vous même. Ci-dessous vous trouverez une liste 
complète de toutes les règles, illustrées par des exemples d'utilisation.


.. php:staticmethod:: alphaNumeric(mixed $check)

    Les données pour ce champ ne doivent contenir que chiffres et lettres::

        public $validate = array(
            'login' => array(
                'rule'    => 'alphaNumeric',
                'message' => 'Les données pour ce champ ne doivent contenir que lettres et chiffres.'
            )
        );


.. php:staticmethod:: between(string $check, integer $min, integer $max)

    La longueur des données du champ doit être comprise dans la plage 
    numérique spécifiée. Les valeurs minimum et maximum doivent être toutes 
    les deux fournies. Cette méthode utilise <= et non <::

        public $validate = array(
            'mot_de_passe' => array(
                'rule'    => array('between', 5, 15),
                'message' => 'Le mot de passe doit avoir une longueur comprise entre 5 et 15 caractères.'
            )
        );

    La longueur des données est "le nombre d'octets dans la représentation 
    des données sous forme de chaîne". Faites attention, car elle peut être 
    plus grande que le nombre de caractères quand vous manipulez des caractères 
    non-ASCII.


.. php:staticmethod:: blank(mixed $check)

    Cette règle est utilisé pour vérifier que le champ est laissé vide ou que 
    seulement des caractères blancs y sont présent. Les caractères blancs 
    incluent l'espace, la tabulation, le retour chariot et nouvelle ligne.::

        public $validate = array(
            'id' => array(
                'rule' => 'blank',
                'on'   => 'create'
            )
        );


.. php:staticmethod:: boolean(string $check)

    Les données pour ce champ doivent être une valeur booléenne. Les valeurs 
    possibles sont : true ou false, les entiers 0 ou 1, les chaînes '0' ou 
    '1'.::

        public $validate = array(
            'maCaseACocher' => array(
                'rule'    => array('boolean'),
                'message' => 'Valeur incorrecte pour maCaseACocher'
            )
        );


.. php:staticmethod:: cc(mixed $check, mixed $type = 'fast', boolean $deep = false, string $regex = null)

    Cette règle est utilisée pour vérifier si une donnée est un numéro de 
    carte de crédit valide. Elle prend trois paramètres : ‘type’, ‘deep’ et 
    ‘regex’.

    Le paramètre ‘type‘ peut être assigné aux valeurs ‘fast’, ‘all’ ou à 
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

    Si ‘type’ est défini à ‘fast’, cela valide les données de la majorité des 
    formats numériques de cartes de crédits. Définir ‘type’ à ‘all’ vérifiera 
    tous les types de cartes de crédits. Vous pouvez aussi définir 'type’ 
    comme un tableau des types que vous voulez détecter.

    Le paramètre ‘deep’ devrait être défini comme une valeur booléenne. S'il 
    est défini à true, la validation vérifiera l'algorithme Luhn de la carte 
    de crédit 
    (`http://en.wikipedia.org/wiki/Luhn\_algorithm <http://en.wikipedia.org/wiki/Luhn_algorithm>`_). 
    Par défaut, elle est à false.

    Le paramètre ‘regex’ vous permet de passer votre propre expression 
    régulière, laquelle sera utilisée pour valider le numéro de la carte de 
    crédit::

        public $validate = array(
            'numero_cc' => array(
                'rule'    => array('cc', array('visa', 'maestro'), false, null),
                'message' => 'Le numéro de carte de crédit que vous avez saisi était invalide.'
            )
        );


.. php:staticmethod:: comparison(mixed $check1, string $operator = null, integer $check2 = null)

    Comparison est utilisé pour comparer des valeurs numériques. Il supporte 
    “est supérieur”, “est inférieur”, “supérieur ou égal”, “inférieur ou 
    égal”, “égal à” et “non égal”. Quelques exemples sont indiqués 
    ci-dessous::

        public $validate = array(
            'age' => array(
                'rule'    => array('comparison', '>=', 18),
                'message' => 'Vous devez avoir 18 ans au moins pour vous inscrire.'
            )
        );

        public $validate = array(
            'age' => array(
                'rule'    => array('comparison', 'greater or equal', 18),
                'message' => 'Vous devez avoir 18 ans au moins pour vous inscrire.'
            )
        );


.. php:staticmethod:: custom(mixed $check, string $regex = null)

    Utilisé quand une règle personnalisée est nécessaire::

        public $validate = array(
            'infinite' => array(
                'rule'    => array('custom', '\u221E'),
                'message' => 'Merci de rentrer un nombre infini.'
            )
        );


.. php:staticmethod:: date(string $check, mixed $format = 'ymd', string $regex = null)

    Cette règle s'assure que les données soumises sont des formats de date 
    valides. Un seul paramètre (qui peut être un tableau) doit être passé 
    et sera utilisé pour vérifier le format de la date soumise. La valeur 
    de ce paramètre peut être l'une des suivantes :

    -  ‘dmy’, par exemple : 27-12-2006 ou 27-12-06 (les séparateurs peuvent 
       être l'espace, le point, le tiret, le slash)
    -  ‘mdy’, par exemple : 12-27-2006 ou 12-27-06 (les séparateurs peuvent 
       être l'espace, le point, le tiret, le slash)
    -  ‘ymd’, par exemple : 2006-12-27 ou 06-12-27 (les séparateurs peuvent 
       être l'espace, le point, le tiret, le slash)
    -  ‘dMy’, par exemple : 27 Décembre 2006 ou 27 Déc 2006
    -  ‘Mdy’, par exemple : Décembre 27, 2006 ou Déc 27, 2006 (la virgule 
       est optionnelle)
    -  ‘My’, par exemple : (Décembre 2006 ou Déc 2006)
    -  ‘my’, par exemple : 12/2006 ou 12/06 (les séparateurs peuvent être 
       l'espace, le point, le tiret, le slash)

    Si aucune clé n'est soumise, la clé par défaut 'ymd' sera utilisée::

        public $validate = array(
            'date_de_naissance' => array(
                'rule'       => array('date', 'ymd'),
                'message'    => 'Entrez une date valide au format AA-MM-JJ.',
                'allowEmpty' => true
            )
        );

    Etant donné que de nombreux moteurs de stockage réclament un certain 
    format de date, vous devriez envisager de faire le plus gros du travail 
    en acceptant un large choix de formats et en essayant de les convertir, 
    plutôt que de forcer les gens à les soumettre dans un format donné. Le 
    plus de travail vous ferez pour les users, le mieux ce sera.
    

.. php:staticmethod:: datetime(array $check, mixed $dateFormat = 'ymd', string $regex = null)
    
    Cette règle s'assure que les données sont dans format datetime valide. 
    Un paramètre (qui peut être un tableau) peut être passé pour spécifier le 
    format de la date. La valeur du paramètre peut être une ou plusieurs des 
    valeurs suivantes:

    -  ‘dmy’, par exemple : 27-12-2006 or 27-12-06 (les séparateurs peuvent 
       être l'espace, le point, le tiret, le slash)
    -  ‘mdy’, par exemple : 12-27-2006 or 12-27-06 (les séparateurs peuvent 
       être l'espace, le point, le tiret, le slash)
    -  ‘ymd’, par exemple : 2006-12-27 or 06-12-27 (les séparateurs peuvent 
       être l'espace, le point, le tiret, le slash)
    -  ‘dMy’, par exemple : 27 December 2006 or 27 Dec 2006
    -  ‘Mdy’, par exemple : December 27, 2006 or Dec 27, 2006 (le point est 
       optionnel)
    -  ‘My’, par exemple : (December 2006 or Dec 2006)
    -  ‘my’, par exemple : 12/2006 or 12/06 (les séparateurs peuvent 
       être l'espace, le point, le tiret, le slash)

    Si aucune clé n'est fournie, la clé par défaut qui sera utilisée est 
    ‘ymd’::

        public $validate = array(
            'birthday' => array(
                'rule'    => array('datetime', 'dmy'),
                'message' => 'Merci de rentrer une date et un time valide.'
            )
        );

    Un second paramètre peut aussi être passé pour spécifier une expression 
    réguière personnalisée. Si un paramètre est utilisé, ce sera la seule 
    validation qui apparaitra.
    
    Notez que au contraire de date(), datetime() validera une date et un time.


.. php:staticmethod:: decimal(integer $check, integer $places = null, string $regex = null)

    Cette règle s'assure que la donnée est un nombre décimal valide. Un 
    paramètre peut être passé pour spécifier le nombre de décimales requises 
    après le point. Si aucun paramètre n'est passé, la donnée sera validée 
    comme un nombre scientifique à virgule flottante, entraînant une erreur 
    si aucune décimale n'est trouvée après le point::

        public $validate = array(
            'prix' => array(
                'rule' => array('decimal', 2)
            )
        );


.. php:staticmethod:: email(string $check, boolean $deep = false, string $regex = null)

    Celle-ci vérifie que la donnée soit une adresse email valide. En passant 
    un booléen true comme second paramètre de cette règle, elle tentera de 
    vérifier aussi, que l'hôte de l'adresse soit valide::
    
        public $validate = array('email' => array('rule' => 'email'));
        
        public $validate = array(
            'email' => array(
                'rule'    => array('email', true),
                'message' => 'Merci de soumettre une adresse email valide.'
            )
        );


.. php:staticmethod:: equalTo(mixed $check, mixed $compareTo)

    Cette règle s'assurera que la valeur est égal à la valeur passée et 
    qu'elle est du même type.

    ::

        public $validate = array(
            'nourriture' => array(
                'rule'    => array('equalTo', 'gâteau'),
                'message' => 'Cette valeur devrait être la chaîne gâteau'
            )
        );


.. php:staticmethod:: extension(mixed $check, array $extensions = array('gif', 'jpeg', 'png', 'jpg'))

    Cette règle vérifie les extensions valides de fichier, comme .jpg ou .png. 
    Permet la vérification d'extensions multiples, en les passant sous forme 
    de tableau.

    ::

        public $validate = array(
            'image' => array(
                'rule'    => array('extension', array('gif', 'jpeg', 'png', 'jpg')),
                'message' => 'Merci de soumettre une image valide.'
            )
        );

.. php:staticmethod:: fileSize($check, $operator = null, $size = null)

    Cette règle vous permet de vérifier les tailles de fichier. Vous pouvez
    utiliser ``$operator`` pour décider du type de comparaison que vous
    souhaitez utiliser. Tous les opérateurs supportés par
    :php:func:`~Validation::comparison()` sont ici aussi supportés. Cette
    méthode va gérer automatiquement les tableaux de valeur à partir de
    ``$_FILES`` en lisant la clé ``tmp_name`` si ``$check`` est un tableau qui
    contient cette clé::

        public $validate = array(
            'image' => array(
                'rule' => array('fileSize', '<=', '1MB'),
                'message' => 'L\'Image doit être inférieur à 1MB'
            )
        );

    .. versionadded:: 2.3
        Cette méthode a été ajoutée dans 2.3

.. php:staticmethod:: inList(string $check, array $list)

    Cette règle s'assurera que la valeur est dans un ensemble donné. Elle 
    nécessite un tableau des valeurs. Le champ est valide si sa valeur 
    vérifie l'une des valeurs du tableau donné.

    Exemple::

        public $validate = array(
            'fonction' => array(
                 'choixAutorise' => array(
                     'rule'    => array('inList', array('Foo', 'Bar')),
                     'message' => 'Entrez soit Foo, soit Bar.'
                 )
             )
         );


.. php:staticmethod:: ip(string $check, string $type = 'both')

    Cette règle s'assurera qu'une adresse IPv4 ou IPv6 valide ait été soumise.
    Accepte 'both' en option (par défaut), 'IPv4' ou 'IPv6'.

    ::

        public $validate = array(
            'ip_client' => array(
                'rule'    => array('ip', 'IPv4'), // or 'IPv6' ou 'both' (default)
                'message' => 'Merci de soumettre une adresse IP valide.'
            )
        );


.. php:method:: Model::isUnique()

    La donnée pour le champ doit être unique, elle ne peut être utilisée par 
    aucune autre ligne.

    ::

        public $validate = array(
            'login' => array(
                'rule'    => 'isUnique',
                'message' => 'Ce nom d\'user a déjà été choisi.'
            )
        );

.. php:staticmethod:: luhn(string|array $check, boolean $deep = false)

    L'algorithme Luhn: A checksum formula to validate a variety of 
    identification numbers. Regardez 
    http://en.wikipedia.org/wiki/Luhn_algorithm pour plus d'informations.


.. php:staticmethod:: maxLength(string $check, integer $max)

    Cette règle s'assure que la donnée respecte la longueur maximale requise.

    ::

        public $validate = array(
            'login' => array(
                'rule'    => array('maxLength', 15),
                'message' => 'Les noms d\'user ne doivent pas dépasser 15 caractères.'
            )
        );

    The length here is "the number of bytes in the string
    representation of the data". Be careful that it may be larger than
    the number of characters when handling non-ASCII characters.

.. php:staticmethod:: mimeType(mixed $check, array $mimeTypes)

    .. versionadded:: 2.2

    Cette règle vérifie la validité d'un mimeType

    ::

        public $validate = array(
            'image' => array(
                'rule'    => array('mimeType', array('image/gif')),
                'message' => 'Invalid mime type.'
            ),
        );

.. php:staticmethod:: minLength(string $check, integer $min)

    Cette règle s'assure que les données ont une obligation de longueur minimum.

    ::

        public $validate = array(
            'login' => array(
                'rule'    => array('minLength', 8),
                'message' => 'Usernames must be at least 8 characters long.'
            )
        );

    La longueur ici est "le nombre d'octets dans la représentation des données 
    sous forme de chaîne". Faites attention car elle pourrait être plus grande 
    que le nombre de caractères en manipulant des caractères non-ASCII.


.. php:staticmethod:: money(string $check, string $symbolPosition = 'left')

    Cette règle s'assurera que la valeur est une somme monétaire valide.

    Le second paramètre définit où le symbole est situé (gauche/droite).

    ::

        public $validate = array(
            'salaire' => array(
                'rule'    => array('money', 'left'),
                'message' => 'Merci de soumettre une somme monétaire valide.'
            )
        );

.. php:staticmethod:: multiple(mixed $check, mixed $options = array())

    Utilisez cette règle pour valider un champ select multiple. Elle 
    accepte les paramètres "in", "max" et "min".

    ::

        public $validate = array(
            'multiple' => array(
                'rule' => array('multiple', array(
                    'in'  => array('do', 'ré', 'mi', 'fa', 'sol', 'la', 'si'),
                    'min' => 1,
                    'max' => 3
                )),
                'message' => 'Merci de choisir une, deux ou trois options'
            )
        );


.. php:staticmethod:: notEmpty(mixed $check)

    La règle de base pour s'assurer qu'un champ n'est pas vide.::

        public $validate = array(
            'titre' => array( 
                'rule'    => 'notEmpty',
                'message' => 'Ce champ ne peut pas rester vide'
            )
        );

    Ne l'utilisez pas pour un champ select multiple, sinon cela causera 
    une erreur. A la place, utilisez "multiple".


.. php:staticmethod:: numeric(string $check)

    Vérifie si la donnée passée est un nombre valide.::

        public $validate = array(
            'cars' => array(
                'rule'    => 'numeric',
                'message' => 'Merci de soumettre le nombre de voitures.'
            )
        );

.. php:staticmethod:: naturalNumber(mixed $check, boolean $allowZero = false)

    .. versionadded:: 2.2

    Cette règle vérifie si une donnée passée est un nombre entier naturel
    valide. Si ``$allowZero`` est défini à true, la valeur zero est aussi
    acceptée.

    ::

        public $validate = array(
            'wheels' => array(
                'rule'    => 'naturalNumber',
                'message' => 'Merci de fournir le nombre de pneus.'
            ),
            'airbags' => array(
                'rule'    => array('naturalNumber', true),
                'message' => 'Merci de remplir le nombre d'airbags.'
            ),
        );

.. php:staticmethod:: phone(mixed $check, string $regex = null, string $country = 'all')

    Phone valide les numéros de téléphone US. Si vous voulez valider des 
    numéros de téléphones non-US, vous pouvez fournir une expression 
    régulière comme second paramètre pour couvrir des formats de numéros 
    additionnels.

    ::

        public $validate = array(
            'telephone' => array(
                'rule' => array('phone', null, 'us')
            )
        );


.. php:staticmethod:: postal(mixed $check, string $regex = null, string $country = 'us')

    Postal est utilisé pour valider des codes postaux des U.S.A. (us), du 
    Canada (ca), du Royaume-Uni (uk), de l'Italie (it), d'Allemagne (de) et 
    de Belgique (be). Pour les autres formats de codes postaux, vous devez 
    fournir une expression régulière comme second paramètre.

    ::

        public $validate = array(
            'code_postal' => array(
                'rule' => array('postal', null, 'us')
            )
        );


.. php:staticmethod:: range(string $check, integer $lower = null, integer $upper = null)

    Cette règle s'assure que la valeur est dans une fourchette donnée. Si 
    aucune fourchette n'est soumise, la règle s'assurera que la valeur est 
    un nombre limite valide pour la plateforme courante.

    ::

        public $validate = array(
            'nombre' => array(
                'rule'    => array('range', -1, 11),
                'message' => 'Merci d\'entrer un nombre entre 0 et 10'
            )
        );

    L'exemple ci-dessus acceptera toutes les valeurs qui sont plus grandes que 
    0 (par ex, 0.01) et plus petite que 10 (par ex, 9.99). Note : Les deux 
    extrémités données (-1 et 11) ne sont pas incluses !!!
    
    .. note::
    
        The range lower/upper are not inclusive


.. php:staticmethod:: ssn(mixed $check, string $regex = null, string $country = null)

    Ssn valide les numéros de sécurité sociale des U.S.A. (us), du Danemark 
    (dk) et des Pays-Bas (nl). Pour les autres formats de numéros de sécurité 
    sociale, vous devez fournir une expression régulière.

    ::

        public $validate = array(
            'ssn' => array(
                'rule' => array('ssn', null, 'us')
            )
        );


.. php:staticmethod:: time(string $check)

    La validation du Time, détermine si une chaîne de caractères est un time 
    valide. Valide le time en 24hr (HH:MM) ou am/pm ([H]H:MM[a|p]m). 
    N'autorise/ne valide pas les secondes.


.. php:staticmethod:: url(string $check, boolean $strict = false)

    Cette règle vérifie les formats valides d'URL. Elle supporte les 
    protocoles http(s), ftp(s), file, news et gopher::

        public $validate = array(
            'siteweb' => array(
                'rule' => 'url'
            )
        );

    Pour s'assurer qu'un protocole est présent dans l'url, le mode strict 
    mode peut être activé comme ceci::

        public $validate = array(
            'siteweb' => array(
                'rule' => array('url', true)
            )
        );


.. php:staticmethod:: userDefined(mixed $check, object $object, string $method, array $args = null)

    Lance une validation de définition d'user.


.. php:staticmethod:: uuid(string $check)

    Vérifie que la valeur est une valeur uuid valide: http://tools.ietf.org/html/rfc4122

Localized Validation
====================

Les règles de validation phone() et postal() vont envoyer les 
préfixes de pays qu'elles ne savent pas gérer à une autre classe avec le
nom afférant. Par exemple si vous vivez aux Pays-Bas, vous pourriez créer une
classe comme::

    class NlValidation {
        public static function phone($check) {
            // ...
        }
        public static function postal($check) {
            // ...
        }
    }

Ce fichier pourra être placé dans ``APP/Validation/`` ou
``App/PluginName/Validation/``, mais doit être importé via App::uses() avant
tout tentative d'utilisation. Dans votre validation de model, vous pourrez
utiliser votre classe NlValidation en faisant ce qui suit::

    public $validate = array(
        'phone_no' => array('rule' => array('phone', null, 'nl')),
        'postal_code' => array('rule' => array('postal', null, 'nl')),
    );

Quand vos données de model sont validées, la Validation va voir qu'elle ne peut
pas gérer la locale ``nl`` et va tenter de déléguer à
``NlValidation::postal()`` et le retour de cette méthode va être utilisée comme
réussite/echec pour la validation. Cette approche vous permet de créer des 
classes qui gèrent un sous-ensemble ou groupe de locales, chose qu'un large
switch ne pourrait pas faire. L'utilisation des méthodes de validation
individuelle n'a pas changé, la possibilité de faire passer à un autre
validateur a été ajouté.

.. tip::

    Le Plugin Localized contient déjà beaucoup de règles prêtes à être
    utilisées: https://github.com/cakephp/localized
    Aussi n'hésitez pas à contribuer aen donnant vos règles de validation
    localisées.

.. toctree::

    data-validation/validating-data-from-the-controller


.. meta::
    :title lang=fr: Validation des Donnnées
    :keywords lang=fr: règles de validation,données de validation,erreurs de validation,données validation,numéros de carte de crédit,librairies du coeur,mot de passe email,champs du model,champ login,définition du model,classe php,plusieurs aspects différents,huit caractères,lettres et nombres,règles business,processus de validation,validation de date,messages d'erreurs,tableau,format
