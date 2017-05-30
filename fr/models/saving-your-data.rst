Sauvegarder vos Données
#######################

CakePHP rend la sauvegarde des données d'un model très rapide. Les données
prêtes à être sauvegardées doivent être passées à la méthode ``save()`` du
model en utilisant le format basique suivant::

    Array
    (
        [NomDuModele] => Array
        (
            [nomduchamp1] => 'valeur'
            [nomduchamp2] => 'valeur'
        )
    )

La plupart du temps vous n'aurez même pas à vous préoccuper de ce format :
le :php:class:`FormHelper` et les méthodes de recherche de CakePHP réunissent
les données sous cette forme. Si vous utilisez un de ces helpers, les données
sont également disponibles dans ``$this->request->data`` pour un usage rapide
et pratique.

Voici un exemple simple d'une action de controller qui utilise un model
CakePHP pour sauvegarder les données dans une table de la base de données::

    public function edit($id) {
        //Est-ce que des données de formulaires ont été POSTées ?
        if ($this->request->is('post')) {
           //Si les données du formulaire peuvent être validées et sauvegardées ...
           if($this->Recipe->save($this->request->data)) {
               //On définit une message flash en session et on redirige.
               $this->Session->setFlash("Recipe sauvegardée !");
               return $this->redirect('/recettes');
           }
        }
        //Si aucune données de formulaire, on récupère la recipe à éditer
        //et on la passe à la vue
        $this->set('recipe', $this->Recipe->findById($id));
    }

Quand save() est appelée, la donnée qui lui est passée en premier paramètre
est validée en utilisant le mécanisme de validation de CakePHP (voir le
chapitre :doc:`/models/data-validation` pour plus d'informations). Si pour une
raison quelconque vos données ne se sauvegardent pas, pensez à regarder si
des règles de validation ne sont pas insatisfaites. Vous pouvez débugger cette
situation en affichant :php:attr:`Model::$validationErrors`::

    if ($this->Recipe->save($this->request->data)) {
        // Traite le succès.
    }
    debug($this->Recipe->validationErrors);

Il y a quelques autres méthodes du model liées à la sauvegarde que vous
trouverez utiles :

Model::set($one, $two = null)
=============================

``Model::set()`` peut être utilisé pour définir un ou plusieurs champs de
données du tableau de donnés à l'intérieur d'un Model. C'est utile pour
l'utilisation de models avec les fonctionnalités ActiveRecord offertes
par le model::

    $this->Post->read(null, 1);
    $this->Post->set('title', 'Nouveau titre pour l\'article');
    $this->Post->save();

C'est un exemple de l'utilisation de ``set()`` pour mettre à jour les champs
uniques, dans une approche ActiveRecord. Vous pouvez aussi utiliser ``set()``
pour assigner de nouvelles valeurs aux champs multiples::

    $this->Post->read(null, 1);
    $this->Post->set(array(
        'title' => 'Nouveau titre',
        'published' => false
    ));
    $this->Post->save();

Ce qui est au-dessus met à jour les champs title et published et sauvegarde
l'enregistrement dans le base de données.

Model::clear()
==============

Cette méthode peut être utilisée pour réinitialiser l'état du model et effacer
toutes les données non sauvegardées et les erreurs de validation.

.. versionadded:: 2.4


Model::save(array $data = null, boolean $validate = true, array $fieldList = array())
=====================================================================================

La méthode ci-dessus sauvegarde des données formatées sous forme tabulaire.
Le second paramètre vous permet de mettre de côté la validation, et le
troisième vous permet de fournir une liste des champs du model devant être
sauvegardés. Pour une sécurité accrue, vous pouvez limiter les champs
sauvegardés à ceux listés dans ``$fieldList``.

.. note::
    Si ``$fieldList`` n'est pas fourni, un utilisateur malicieux peut ajouter
    des champs supplémentaires dans le formulaire de données (si vous
    n'utilisez pas :php:class:`SecurityComponent`), et ainsi changer la valeur
    de champs qui n'étaient pas prévus à l'origine.

La méthode save a aussi une syntaxe alternative::

    save(array $data = null, array $params = array())

Le tableau ``$params`` peut avoir n'importe quelle option disponible
suivante en clé:

* ``validate`` Défini à true/false pour activer/désactiver la validation.
* ``fieldList`` Un tableau de champs que vous souhaitez autoriser pour la
  sauvegarde.
* ``callbacks`` Défini à false permet la désactivation des callbacks. En
  utilisant 'before' ou 'after' activera seulement ces callbacks.
* ``counterCache`` (depuis 2.4) Booléen pour contrôler la mise à jour des
  counter caches (si il y en a).
* ``atomic`` (depuis 2.6) Booléen pour indiquer que vous voulez sauvegarder
  les enregistrements dans une transaction.

Plus d'informations sur les callbacks du model sont disponibles
:doc:`ici <callback-methods>`.


.. tip::

    Si vous ne voulez pas le que champ ``modified`` soit mis à jour pendant
    la sauvegarde de certaines données, ajoutez ``'modified' => false``
    à votre tableau de ``$data``.

Une fois qu'une sauvegarde est terminée, l'ID de l'objet peut être trouvé dans
l'attribut ``$id`` de l'objet Model - quelque chose de spécialement pratique
quand on crée de nouveaux objets.

::

    $this->Ingredient->save($nouvellesDonnees);
    $nouvelIngredientId = $this->Ingredient->id;

La création ou la mise à jour est contrôlée par le champ ``id`` du model.
Si ``$Model->id`` est défini, l'enregistrement avec cette clé primaire est
mis à jour. Sinon, un nouvel enregistrement est créé::

    // Création: id n'est pas défini ou est null
    $this->Recipe->create();
    $this->Recipe->save($this->request->data);

    // Mise à jour: id est défini à une valeur numérique
    $this->Recipe->id = 2;
    $this->Recipe->save($this->request->data);

.. tip::

    Lors de l'appel à save() dans une boucle, n'oubliez pas d'appeler
    ``clear()``.


Si vous voulez mettre à jour une valeur, plutôt qu'en créer une, assurez-vous
que vous avez passé le champ de la clé primaire  dans le tableau data::

    $data = array('id' => 10, 'title' => 'Mon Nouveau Titre');
    // Cela mettra à jour la Recipe avec un id 10
    $this->Recipe->save($data);

Model::create(array $data = array())
====================================

Cette méthode initialise la classe du model pour sauvegarder de nouvelles
informations.
Cela ne crée pas réellement un enregistrement dans la base de données mais
efface Model::$id et définit Model::$data basé sur les champs par défaut dans
votre base de données. Si vous n'avez défini aucun champ par défaut dans votre
base de données, Model::$data sera défini comme un tableau vide.

Si le paramètre ``$data`` (utilisant le format de tableau souligné ci-dessus)
est passé, il sera fusionné avec les champs par défaut de la base de données
et l'instance du model sera prête à être sauvegardée avec ces données
(accessible dans ``$this->data``).

Si ``false`` ou ``null`` sont passés pour le paramètre ``$data``, Model::$data
sera défini comme un tableau vide.

.. tip::

    Si vous voulez insérer une nouvelle ligne au lieu de mettre à jour une
    ligne existante, vous devriez toujours appeler en premier lieu create().
    Cela évite les conflits avec d'éventuels appels à save en amont dans les
    callbacks ou à tout autre endroit.

Model::saveField(string $fieldName, string $fieldValue, $validate = false)
==========================================================================

Utilisée pour sauvegarder la valeur d'un seul champ. Fixez l'ID du model
(``$this->ModelName->id = $id``) juste avant d'appeler ``saveField()``. Lors de
l'utilisation de cette méthode, ``$fieldName`` ne doit contenir que le nom du
champ, pas le nom du model et du champ.

Par exemple, pour mettre à jour le titre d'un article de blog, l'appel
depuis un controller à ``saveField`` ressemblerait à quelque chose comme::

    $this->Post->saveField('title', 'Un nouveau titre pour un Nouveau Jour');

.. warning::

    Vous ne pouvez pas arrêter la mise à jour du champ ``modified`` avec cette
    méthode, vous devrez utiliser la méthode save().

La méthode saveField a aussi une syntaxe alternative::

    saveField(string $fieldName, string $fieldValue, array $params = array())

Le tableau ``$params`` peut avoir en clé, les options disponibles
suivantes:

* ``validate`` Définie à true/false pour activer/désactiver la validation.
* ``callbacks`` Définie à false pour désactiver les callbacks. Utiliser
  'before' ou 'after' activera seulement ces callbacks.
* ``counterCache`` (depuis 2.4) Booléen pour contrôler la mise à jour des
  counter caches (si il y en a).


Model::updateAll(array $fields, mixed $conditions)
==================================================

Met à jour plusieurs enregistrements en un seul appel. Les enregistrements à
mettre à jour, ainsi qu'avec leurs valeurs, sont identifiés par le tableau
``$fields``. Les enregistrements à mettre à jour sont identifiés par le tableau
``$conditions``. Si l'argument ``$conditions`` n'est pas fourni ou si il n'est
pas défini à ``true``, tous les enregistrements seront mis à jour.

Par exemple, si je voulais approuver tous les bakers qui sont membres
depuis plus d'un an, l'appel à update devrait ressembler à quelque chose
du style::

    $thisYear = date('Y-m-d H:i:s', strtotime('-1 year'));

    $this->Baker->updateAll(
        array('Baker.approve' => true),
        array('Baker.created <=' => $thisYear)
    );

Le tableau ``$fields`` accepte des expressions SQL. Les valeurs littérales
doivent être manuellement quotées en utilisant :php:meth:`DboSource::value()`.
Par exemple, si une de vos méthodes de model appelait ``updateAll()``,
vous feriez ce qui suit::

    $db = $this->getDataSource();
    $value = $db->value($value, 'string');
    $this->updateAll(
        array('Baker.status' => $value),
        array('Baker.status' => 'old')
    );

.. note::

    Même si le champ modifié existe pour le model qui vient d'être mis à jour,
    il ne sera pas mis à jour automatiquement par l'ORM. Ajoutez le seulement
    manuellement au tableau si vous avez besoin de le mettre à jour.

Par exemple, pour fermer tous les tickets qui appartiennent à un certain
client::

    $this->Ticket->updateAll(
        array('Ticket.status' => "'closed'"),
        array('Ticket.client_id' => 453)
    );

Par défaut, updateAll() joindra automatiquement toute association belongsTo
pour les bases de données qui suportent la jointure. Pour éviter cela,
délier les associations temporairement.

Model::saveMany(array $data = null, array $options = array())
=============================================================

La méthode utilisée pour sauvegarder les lignes multiples du même model en
une fois. Les options suivantes peuvent être utilisées:

* ``validate``: Définie à false pour désactiver la validation, true pour
  valider chaque enregistrement avant la sauvegarde, 'first' pour valider
  *tous* les enregistrements avant qu'un soit sauvegardé (par défaut),
* ``atomic``: Si true (par défaut), essaiera de sauvegarder tous les
  enregistrements en une seule transaction.
  Devrait être définie à false si la base de données/table ne supporte pas les
  transactions.
* ``fieldList``: Equivalent au paramètre $fieldList dans Model::save()
* ``deep``: (since 2.1) Si défini à true, les données associées sont aussi
  sauvegardées, regardez aussi saveAssociated.
* ``callbacks`` Défini à false pour désactiver les callbacks. En utilisant
  'before' ou 'after' va activer seulement ces callbacks.
* ``counterCache`` (depuis 2.4) Booléen pour contrôler la mise à jour des
  counter caches (si il y en a).

Pour sauvegarder de multiples enregistrements d'un unique model, $data
a besoin d'être un tableau d'enregistrements indexé numériquement comme
ceci::

    $data = array(
        array('title' => 'titre 1'),
        array('title' => 'titre 2'),
    )

.. note::

    Notez que nous passons les indices numériques de la variable habituelle
    ``$data`` contenant le clé Article. Quand vous passez plusieurs
    enregistrements du même model, les tableaux d'enregistrements doivent
    être seulement indexés numériquement sans la clé model.

Il est aussi possible d'avoir les données dans le format suivant::

    $data = array(
        array('Article' => array('title' => 'title 1')),
        array('Article' => array('title' => 'title 2')),
    )

Pour sauvegarder les données associées avec ``$options['deep'] = true``
(depuis 2.1), les deux exemples ci-dessus ressembleraient à cela::

    $data = array(
        array('title' => 'title 1', 'Assoc' => array('field' => 'value')),
        array('title' => 'title 2'),
    );
    $data = array(
        array(
            'Article' => array('title' => 'title 1'),
            'Assoc' => array('field' => 'value')
        ),
        array('Article' => array('title' => 'title 2')),
    );
    $Model->saveMany($data, array('deep' => true));

Gardez à l'esprit que si vous souhaitez mettre à jour un enregistrement au lieu
d'en créer un nouveau, vous devez juste ajouter en index la clé primaire à la
ligne de donnée::

    array(
        // Ceci crée une nouvelle ligne
        array('Article' => array('title' => 'New article')),
        // Ceci met à jour une ligne existante
        array('Article' => array('id' => 2, 'title' => 'title 2')),
    )


Model::saveAssociated(array $data = null, array $options = array())
===================================================================

Méthode utilisée pour sauvegarder des associations de model en une seule fois.
Les options suivantes peuvent être utilisées:

* ``validate``: Définie à false pour désactiver la validation, true pour
  valider chaque enregistrement avant sauvegarde, 'first' pour valider *tous*
  les enregistrements avant toute sauvegarde (par défaut).
* ``atomic``: Si à true (par défaut), va tenter de sauvegarder tous les
  enregistrements en une seule transaction.
  Devrait être définie à false si la base de données/table ne supporte pas les
  transactions.
* ``fieldList``: Equivalent au paramètre $fieldList de Model::save().
* ``deep``: (depuis 2.1) Si définie à true, les données pas seulement associées
  directement vont être sauvegardées, mais aussi les données associées
  imbriquées plus profondément. Par défaut à false.
* ``counterCache`` (depuis 2.4) Booléen pour contrôler la mise à jour des
  counter caches (si il y en a).

Pour sauvegarder un enregistrement et tous ses enregistrements liés avec une
association hasOne ou belongsTo, le tableau de données devra ressembler à
cela::

    array(
        'User' => array('username' => 'billy'),
        'Profile' => array('sex' => 'Male', 'occupation' => 'Programmer'),
    )

Pour sauvegarder un enregistrement et ses enregistrements liés avec une
association hasMany, le tableau de données devra ressembler à cela::

    $data = array(
        'Article' => array('title' => 'My first article'),
        'Comment' => array(
            array('body' => 'Comment 1', 'user_id' => 1),
            array('body' => 'Comment 2', 'user_id' => 12),
            array('body' => 'Comment 3', 'user_id' => 40),
        ),
    );

Et pour sauvegarder un enregistrement avec ses enregistrements liés par hasMany
qui ont plus de deux niveaux d'association de profondeur, le tableau de données
devra être comme suit::

   $data = array(
        'User' => array('email' => 'john-doe@cakephp.org'),
        'Cart' => array(
            array(
                'payment_status_id' => 2,
                'total_cost' => 250,
                'CartItem' => array(
                    array(
                        'cart_product_id' => 3,
                        'quantity' => 1,
                        'cost' => 100,
                    ),
                    array(
                        'cart_product_id' => 5,
                        'quantity' => 1,
                        'cost' => 150,
                    )
                )
            )
        )
    );

.. note::

    Si cela réussit, la clé étrangère du model principal va être stockée dans
    le champ id du model lié, par ex: ``$this->RelatedModel->id``.

.. warning::

    Attention quand vous vérifiez les appels saveAssociated avec l'option
    atomic définie à false. Elle retourne un tableau au lieu d'un boléen.

.. versionchanged:: 2.1
    Vous pouvez maintenant aussi sauvegarder les données associées avec
    la configuration ``$options['deep'] = true;``.

Pour sauvegarder un enregistrement et ses enregistrements liés avec une
association hasMany ainsi que les données associées plus profondément
de type Comment belongsTo User, le tableau de données devra ressembler à
ceci::

    $data = array(
        'Article' => array('title' => 'My first article'),
        'Comment' => array(
            array('body' => 'Comment 1', 'user_id' => 1),
            array(
                'body' => 'Save a new user as well',
                'User' => array('first' => 'mad', 'last' => 'coder')
            ),
        ),
    );

Et sauvegarder cette donnée avec::

    $Article->saveAssociated($data, array('deep' => true));

.. versionchanged:: 2.1
    ``Model::saveAll()`` et ses amis supportent maintenant qu'on leur passe
    `fieldList` pour des models multiples.

Exemple d'utilisation de ``fieldList`` avec de multiples models::

    $this->SomeModel->saveAll($data, array(
        'fieldList' => array(
            'SomeModel' => array('field_1'),
            'AssociatedModel' => array('field_2', 'field_3')
        )
    ));

La fieldList sera un tableau d'alias de model en clé et de tableaux avec les
champs en valeur. Les noms de model ne sont pas imbriqués comme dans les
données à sauvegarder.

Model::saveAll(array $data = null, array $options = array())
============================================================

La fonction ``saveAll`` est juste un wrapper autour des méthodes ``saveMany``
et ``saveAssociated``. Elle va inspecter les données et déterminer quel type
de sauvegarde elle devra effectuer. Si les données sont bien formatées en
un tableau indicé numériquement, ``saveMany`` sera appelée, sinon
``saveAssociated`` sera utilisée.

Cette fonction reçoit les mêmes options que les deux précédentes, et est
généralement une fonction rétro-compatible. Il est recommandé d'utiliser
soit ``saveMany`` soit ``saveAssociated`` selon le cas.


Sauvegarder les Données de Models Liés (hasOne, hasMany, belongsTo)
===================================================================

Quand vous travaillez avec des models associés, il est important de réaliser
que la sauvegarde de données de model devrait toujours être faite avec le model
CakePHP correspondant. Si vous sauvegardez un nouveau Post et ses Comments
associés, alors vous devriez utiliser les deux models Post et Comment pendant
l'opération de sauvegarde.

Si aucun des enregistrements du model associé n'existe pour l'instant dans le
système (par exemple, vous voulez sauvegarder un nouveau User et ses
enregistrements du Profile lié en même temps), vous aurez besoin de sauvegarder
d'abord le model principal, ou le model parent.

Pour avoir une bonne idée de la façon de faire, imaginons que nous ayons une
action dans notre UsersController qui gère la sauvegarde d'un nouveau User et
son Profile lié. L'action montrée en exemple ci-dessous supposera que vous
avez POSTé assez de données (en utilisant FormHelper) pour créer un User
unique et un Profile unique::

    public function add() {
        if (!empty($this->request->data)) {
            // Nous pouvons sauvegarder les données de l'User:
            // it should be in $this->request->data['User']

            $user = $this->User->save($this->request->data);

            // Si l\'user a été sauvegardé, maintenant nous ajoutons cette information aux données
            // et sauvegardons le Profile.

            if (!empty($user)) {
                // L'ID de l\'user nouvellement crée a été défini
                // dans $this->User->id.
                $this->request->data['Profile']['user_id'] = $this->User->id;

                // Parce que notre User hasOne Profile, nous pouvons accéder
                // au model Profile à travers le model User:
                $this->User->Profile->save($this->request->data);
            }
        }
    }

Comme règle, quand vous travaillez avec des associations hasOne, hasMany,
et belongsTo, tout est question de clé. L'idée de base est de récupérer la clé
d'un autre model et de la placer dans le champ clé étrangère sur l'autre.
Parfois, cela pourra gêner l'utilisation de l'attribut ``$id`` de la classe
model après un ``save()``, mais d'autres fois, cela impliquera juste la
collecte de l'ID provenant d'un champ caché d'un formulaire qui vient
d'être POSTé d'une action d'un controller.

Pour compléter l'approche fondamentale utilisée ci-dessus, CakePHP offre
également une méthode très pratique ``saveAssociated()``, qui vous permet
de valider et de sauvegarder de multiples models en une fois. De plus,
``saveAssociated()`` fournit un support transactionnel pour s'assurer
de l'intégrité des données dans votre base de données (par ex: si un model
échoue dans la sauvegarde, les autres models ne seront également pas
sauvegardés).

.. note::

    Pour que les transactions fonctionnent correctement dans MySQL, vos tables
    doivent utiliser le moteur InnoDB. Souvenez-vous que les tables MyISAM ne
    supportent pas les transactions.

Voyons comment nous pouvons utiliser ``saveAssociated()`` pour sauvegarder les
models Company et Account en même temps.

Tout d'abord, vous avez besoin de construire votre formulaire pour les deux
models Company et Account (nous supposerons que Company hasMany Account)::

    echo $this->Form->create('Company', array('action' => 'add'));
    echo $this->Form->input('Company.name', array('label' => 'Company name'));
    echo $this->Form->input('Company.description');
    echo $this->Form->input('Company.location');

    echo $this->Form->input('Account.0.name', array('label' => 'Account name'));
    echo $this->Form->input('Account.0.username');
    echo $this->Form->input('Account.0.email');

    echo $this->Form->end('Add');

Regardez comment nous avons nommé les champs de formulaire pour le model
Account. Si Company est notre model principal, ``saveAssociated()`` va
s'attendre à ce que les données du model lié (Account) arrivent dans un
format spécifique. Et avoir ``Account.0.fieldName`` est exactement ce dont
nous avons besoin.

.. note::

    Le champ ci-dessus est nécessaire pour une association hasMany. Si
    l'association entre les models est hasOne, vous devrez utiliser la
    notation ModelName.fieldName pour le model associé.

Maintenant, dans notre CompaniesController nous pouvons créer une action
``add()``::

    public function add() {
        if (!empty($this->request->data)) {
            // Utilisez ce qui suit pour éviter les erreurs de validation:
            unset($this->Company->Account->validate['company_id']);
            $this->Company->saveAssociated($this->request->data);
        }
    }

C'est tout pour le moment. Maintenant nos models Company et Account seront
validés et sauvegardés en même temps. Par défaut ``saveAssociated``
validera toutes les valeurs passées et ensuite essaiera d'effectuer une
sauvegarde pour chacun.

Sauvegarder hasMany through data
================================

Regardons comment les données stockées dans une table jointe pour deux models
sont sauvegardées. Comme montré dans la section :ref:`hasMany-through`,
la table jointe est associée pour chaque model en utilisant un type de relation
`hasMany`. Notre exemple est une problématique lancée par la Tête de l'Ecole
CakePHP qui nous demande d'écrire une application qui lui permette de connecter
la présence d'un étudiant à un cours avec les journées assistées et
validées. Jettez un œil au code suivant. ::

   // Controller/CourseMembershipController.php
   class CourseMembershipsController extends AppController {
       public $uses = array('CourseMembership');

       public function index() {
           $this->set(
                'courseMembershipsList',
                $this->CourseMembership->find('all')
            );
       }

       public function add() {
           if ($this->request->is('post')) {
               if ($this->CourseMembership->saveAssociated($this->request->data)) {
                   return $this->redirect(array('action' => 'index'));
               }
           }
       }
   }

   // View/CourseMemberships/add.ctp

   <?php echo $this->Form->create('CourseMembership'); ?>
       <?php echo $this->Form->input('Student.first_name'); ?>
       <?php echo $this->Form->input('Student.last_name'); ?>
       <?php echo $this->Form->input('Course.name'); ?>
       <?php echo $this->Form->input('CourseMembership.days_attended'); ?>
       <?php echo $this->Form->input('CourseMembership.grade'); ?>
       <button type="submit">Save</button>
   <?php echo  $this->Form->end(); ?>


Le tableau de données ressemblera à ceci quand il sera soumis. ::

    Array
    (
        [Student] => Array
        (
            [first_name] => Joe
            [last_name] => Bloggs
        )

        [Course] => Array
        (
            [name] => Cake
        )

        [CourseMembership] => Array
        (
            [days_attended] => 5
            [grade] => A
        )

    )

CakePHP va heureusement être capable de sauvegarder le lot ensemble et
d'assigner les clés étrangères de Student et de Course dans CourseMembership
avec un appel `saveAssociated` avec cette structure de données. Si nous lançons
l'action index de notre CourseMembershipsController, la structure de données
reçue maintenant par un find('all') est::

    Array
    (
        [0] => Array
        (
            [CourseMembership] => Array
            (
                [id] => 1
                [student_id] => 1
                [course_id] => 1
                [days_attended] => 5
                [grade] => A
            )

            [Student] => Array
            (
                [id] => 1
                [first_name] => Joe
                [last_name] => Bloggs
            )

            [Course] => Array
            (
                [id] => 1
                [name] => Cake
            )
        )
    )

Il y a bien sûr beaucoup de façons de travailler avec un model joint. La
version ci-dessus suppose que vous voulez sauvegarder tout en une fois.
Il y aura des cas où vous voudrez créer les Student et Course
indépendamment et associer les deux ensemble avec CourseMemberShip plus tard.
Donc, vous aurez peut-être un formulaire qui permet la sélection de students
et de courses existants à partir d'une liste de choix ou d'une entrée d'un ID
et ensuite les deux meta-champs pour CourseMembership, par ex. ::

        // View/CourseMemberships/add.ctp

        <?php echo $this->Form->create('CourseMembership'); ?>
            <?php
                echo $this->Form->input(
                    'Student.id',
                    array(
                        'type' => 'text',
                        'label' => 'Student ID',
                        'default' => 1
                    )
                );
            ?>
            <?php
                echo $this->Form->input(
                    'Course.id',
                    array(
                        'type' => 'text',
                        'label' => 'Course ID',
                        'default' => 1
                    )
                );
            ?>
            <?php echo $this->Form->input('CourseMembership.days_attended'); ?>
            <?php echo $this->Form->input('CourseMembership.grade'); ?>
            <button type="submit">Save</button>
        <?php echo $this->Form->end(); ?>

Et le POST résultant::

    Array
    (
        [Student] => Array
        (
            [id] => 1
        )

        [Course] => Array
        (
            [id] => 1
        )

        [CourseMembership] => Array
        (
            [days_attended] => 10
            [grade] => 5
        )
    )

Encore une fois, CakePHP est bon pour nous et envoie les id de Student et de
Course dans CourseMembership avec `saveAssociated`.

.. _saving-habtm:

Sauvegarder les Données de Model Lié (HABTM=HasAndBelongsToMany)
----------------------------------------------------------------

Sauvegarder les models qui sont associés avec hasOne, belongsTo, et hasMany
est assez simple: vous venez de remplir le champ de la clé étrangère avec l'ID
du model associé. Une fois que c'est fait, vous appelez juste la méthode
``save()`` sur un model, et tout se relie correctement. Un exemple du format
requis pour le tableau de données passé à ``save()`` pour le model Tag model
est montré ci-dessous::

    Array
    (
        [Recipe] => Array
            (
                [id] => 42
            )
        [Tag] => Array
            (
                [name] => Italian
            )
    )

Vous pouvez aussi utiliser ce format pour sauvegarder plusieurs enregistrements
et leurs associations HABTM avec ``saveAll()``, en utilisant un tableau comme
celui qui suit::

    Array
    (
        [0] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 42
                    )
                [Tag] => Array
                    (
                        [name] => Italian
                    )
            )
        [1] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 43
                    )
                [Tag] => Array
                    (
                        [name] => Pasta
                    )
            )
        [2] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 51
                    )
                [Tag] => Array
                    (
                        [name] => Mexican
                    )
            )
        [3] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 17
                    )
                [Tag] => Array
                    (
                        [name] => American (new)
                    )
            )
    )

Passer le tableau ci-dessus à ``saveAll()`` va créer les tags contenus, chacun
associé avec leur recipies respectives.

Un autre exemple utile est lorsque quand vous souhaitez sauver de nombreusex
Tags dans un Post. Vous devez transmettre les données HABTM associeés dans le
format de tableau HABTM suivant. Notez que vous devez passer uniquement l'id
du modèle HABTM associé mais il doit être imbriquées à nouveau::

    Array
    (
        [0] => Array
            (
                [Post] => Array
                    (
                        [title] => 'Saving HABTM arrays'
                    )
                [Tag] => Array
                    (
                        [Tag] => Array(1, 2, 5, 9)
                    )
            )
        [1] => Array
            (
                [Post] => Array
                    (
                        [title] => 'Dr Who's Name is Revealed'
                    )
                [Tag] => Array
                    (
                        [Tag] => Array(7, 9, 15, 19)
                    )
            )
        [2] => Array
            (
                [Post] => Array
                    (
                        [title] => 'I Came, I Saw and I Conquered'
                    )
                [Tag] => Array
                    (
                        [Tag] => Array(11, 12, 15, 19)
                    )
            )
        [3] => Array
            (
                [Post] => Array
                    (
                        [title] => 'Simplicity is the Ultimate Sophistication'
                    )
                [Tag] => Array
                    (
                        [Tag] => Array(12, 22, 25, 29)
                    )
            )
    )

Passer le tableau ci-dessus à la fonction ``saveAll($data, array('deep' => true))``
remplira la table jointe posts_tags avec l'association Tag vers Post.

Par exemple, nous allons construire un formulaire qui crée un nouveau tag et
génèrerons le tableau de données approprié pour l'associer à la volée avec
certaines recipies.

Le formulaire le plus simple ressemblerait à ceci (nous supposerons que
``$recipe_id`` est déjà définie à une valeur)::

    <?php echo $this->Form->create('Tag');?>
        <?php echo $this->Form->input(
            'Recipe.id',
            array('type' => 'hidden', 'value' => $recipe_id)); ?>
        <?php echo $this->Form->input('Tag.name'); ?>
    <?php echo $this->Form->end('Add Tag'); ?>

Dans cet exemple, vous pouvez voir le champ caché ``Recipe.id`` dont la valeur
est définie selon l'ID de la recette que nous voulons lier au tag.

Quand la méthode ``save()`` est appelée dans le controller, elle va
automatiquement sauvegarder les données HABTM dans la base de données::

    public function add() {
        // Sauvegarder l'association
        if ($this->Tag->save($this->request->data)) {
            // faire quelque chose en cas de succès
        }
    }

Avec le code précédent, notre Tag nouveau est crée et associé avec un Recipe,
dont l'ID a été défini dans ``$this->request->data['Recipe']['id']``.

Les autres façons possibles pour présenter nos données associées peuvent
inclure une liste déroulante. Les données peuvent être envoyées d'un model en
utilisant la méthode ``find('list')`` et assignées à une variable de vue du
nom du model. Une entrée avec le même nom va automatiquement envoyer ces
données dans un ``<select>``::

    // dans le controller:
    $this->set('tags', $this->Recipe->Tag->find('list'));

    // dans la vue:
    $form->input('tags');

Un scénario plus probable avec une relation HABTM incluerait un
``<select>`` défini pour permettre des sélections multiples. Par exemple, un
Recipe peut avoir plusieurs Tags lui étant assignés. Dans ce cas, les données
du model sont triées de la même façon, mais l'entrée du formulaire est déclarée
légèrement différemment. Le nom du Tag est défini en utilisant la convention
``ModelName``::

    // dans le controller:
    $this->set('tags', $this->Recipe->Tag->find('list'));

    // dans la vue:
    $this->Form->input('Tag');

En utilisant le code précédent, un liste déroulante est créée, permettant aux
multiples choix d'être automatiquement sauvegardés au Recipe existant en étant
ajouté à la base de données.

Self HABTM
~~~~~~~~~~

Normalement HABTM est utilisé pour lier 2 models ensemble mais il peut
aussi être utilisé avec seulement 1 model, mais il nécéssite une attention
plus grande encore.

La clé est dans la configuration du model ``className``. En ajoutant
simplement une relation ``Project`` HABTM ``Project`` entraine des
problèmes lors des enregistrements de données.
En configurant le ``className`` au nom de models et en utilisant l'alias
en clé, nous évitons ces problèmes. ::

    class Project extends AppModel {
        public $hasAndBelongsToMany = array(
            'RelatedProject' => array(
                'className'              => 'Project',
                'foreignKey'             => 'projects_a_id',
                'associationForeignKey'  => 'projects_b_id',
            ),
        );
    }

Créer des éléments de form et sauvegarder les données fonctionne de la même
façon qu'avant mais vous utilisez l'alias à la place. Ceci::

    $this->set('projects', $this->Project->find('list'));
    $this->Form->input('Project');

Devient ceci::

    $this->set('relatedProjects', $this->Project->find('list'));
    $this->Form->input('RelatedProject');

Que faire quand HABTM devient compliqué?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Par défaut, quand vous sauvegardez une relation HasAndBelongsToMany, CakePHP
supprime toutes les lignes de la table jointe avant d'en sauvegarder de
nouvelles. Par exemple, si vous avez un Club qui a 10 Children (Enfant)
associés. Vous mettez ensuite à jour le Club avec 2 Children. Le Club aura
seulement 2 Children, et pas 12.

Notez aussi que si vous voulez ajouter plus de champs à joindre (quand il a été
crée ou les meta informations), c'est possible avec les tables jointes HABTM,
mais il est important de comprendre que vous avez une option facile.

HasAndBelongsToMany entre deux models est en réalité un raccourci pour trois
models associés à travers les deux associations hasMany et belongsTo.

Etudiez cet exemple::

    Child hasAndBelongsToMany Club

Une autre façon de regarder cela est d'ajouter un model Membership::

    Child hasMany Membership
    Membership belongsTo Child, Club
    Club hasMany Membership.

Ces deux exemples sont presque les mêmes. Ils utilisent le même nombre de
champs nommés dans la base de données et le même nombre de models.
Les différences importantes sont que le model "join" est nommé différemment
et que son comportement est plus prévisible.

.. tip::

    Quand votre table jointe contient des champs supplémentaires en plus
    des deux clés étrangères, vous pouvez éviter de perdre les valeurs des
    champs supplémentaires en définissant la clé ``'unique'`` du tableau à
    ``'keepExisting'``. Vous pouvez le penser comme quelque chose de
    similaire à 'unique' => true, mais sans perdre les données des champs
    supplémentaires pendant l'opération de sauvegarde. Regardez:
    :ref:`les tablaux des associations HABTM <ref-habtm-arrays>`.

Cependant, dans la plupart des cas, il est plus facile de faire un model pour
la table jointe et de configurer les associations hasMany, belongsTo comme
montré dans l'exemple ci-dessus au lieu d'utiliser une association HABTM.

Datatables
==========

Tandis que CakePHP peut avoir des sources de données qui ne sont pas des driven
de base de données, la plupart du temps, elles le sont. CakePHP est pensé pour
être agnostique et va fonctionner avec MySQL, Microsoft SQL Server, PostgreSQL et
autres. Vous pouvez créer vos tables de base de données comme vous l'auriez
fait normalement. Quand vous créez vos classes Model, elles seront
automatiquement liées aux tables que vous avez créées. Les noms de table sont
par convention en minuscules et au pluriel avec tous les mots de la table
séparés par des underscores. Par exemple, un nom de model Ingredient s'attendra
à un nom de table ingredients. Un nom de Model de EventRegistration s'attendra
à un nom de table de event_registrations. CakePHP va inspecter vos tables
pour déterminer le type de données de chaque champ et utiliser cette
information pour automatiser plusieurs fonctionnalités comme l'affichage des
champs de formulaires dans la vue. Les noms de champ sont par convention en
minuscules et séparés par des underscores.

Utiliser created et modified
----------------------------

En définissant un champ ``created`` ou ``modified`` dans votre table de base
de données en type datetime (par défaut à null), CakePHP va reconnaître ces
champs et les remplir automatiquement dès qu'un enregistrement est crée ou
sauvegardé dans la base de données (à moins que les données déjà sauvegardées
contiennent une valeur pour ces champs).

Les champs ``created`` et ``modified`` vont être définis à la date et heure
courante quand l'enregistrement est ajouté pour la première fois. Le champ
modifié sera mis à jour avec la date et l'heure courante dès que
l'enregistrement sera sauvegardé.

Si vous avez ``created`` ou ``modified`` des données dans votre $this->data
(par ex à partir d'un Model::read ou d'un Model::set) avant un Model::save(),
alors les valeurs seront prises à partir de $this->data et ne seront pas mises
à jour automagiquement. Si vous ne souhaitez pas cela, vous pouvez utiliser
``unset($this->data['Model']['modified'])``, etc... Alternativement vous pouvez
surcharger Model::save() pour toujours le faire pour vous::

    class AppModel extends Model {

        public function save($data = null, $validate = true, $fieldList = array()) {
            // Nettoie la valeur du champ modified avant chaque sauvegarde
            $this->set($data);
            if (isset($this->data[$this->alias]['modified'])) {
                unset($this->data[$this->alias]['modified']);
            }
            return parent::save($this->data, $validate, $fieldList);
        }

    }

Si vous sauvegardez des données avec un ``fieldList`` et que les champs
``created`` et ``modified`` ne sont pas présents dans la liste blanche, les
valeurs pour ces champs vont continuer à être automatiquement remplies. Si les
champs ``created`` et ``modified`` sont dans ``fieldList``, ils fonctionneront
comme n'importe quels autres champs.

.. meta::
    :title lang=fr: Sauvegarder vos Données
    :keywords lang=fr: models doc,modèles doc,règles de validation,donnée validation,message flash,modèle null,table php,donnée requêtée,classe php,donnée modèle,table de base de données,tableau,recettes,succès,raison,snap,modèle de données
