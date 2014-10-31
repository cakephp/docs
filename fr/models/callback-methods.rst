Méthodes Callback
#################

Si vous voulez glisser un bout de logique applicative juste avant ou
après une opération d'un model CakePHP, utilisez les callbacks de model.
Ces fonctions peuvent être définies dans les classes de model (cela
comprend également votre classe AppModel). Notez bien les valeurs de
retour attendues pour chacune de ces méthodes spéciales.

Lors de l'utilisation de méthodes de callback, vous devriez vous rappeler que
les callbacks des behaviors sont lancés **avant** les callbacks des models.

beforeFind
==========

``beforeFind(array $query)``

Appelée avant toute opération liée à la recherche. Les ``$query``
passées à cette méthode de callback contiennent des informations sur
la requête courante : conditions, champs, etc.

Si vous ne souhaitez pas que l'opération de recherche commence (par
rapport à une décision liée aux options de ``$query``), retournez
*false*. Autrement, retournez la variable ``$query`` éventuellement
modifiée, ou tout ce que vous souhaitez voir passé à la méthode find()
ou ses équivalents.

Vous pouvez utiliser cette méthode de callback pour restreindre les
opérations de recherche en se basant sur le rôle de l'utilisateur, ou
prendre des décisions sur la politique de mise en cache en fonction de
la charge actuelle.

afterFind
=========

``afterFind(array $results, boolean $primary = false)``

Utilisez cette méthode de callback pour modifier les résultats qui ont
été retournés par une opération de recherche, ou pour effectuer toute
logique post-recherche. Le paramètre $results passé à cette méthode contient
les résultats retournés par l'opération find() du model, càd quelque
chose comme::

    $results = array(
        0 => array(
            'NomModel' => array(
                'champ1' => 'valeur1',
                'champ2' => 'valeur2',
            ),
        ),
    );

La valeur de retour de ce callback doit être le résultat de l'opération
de recherche (potentiellement modifié) qui a déclenché ce callback.

Le paramètre ``$primary`` indique si oui ou non le model courant est le model
d'où la requête provient en tant qu'association ou non. Si un model est
requêté en tant qu'association, le format de ``$results`` peut différer; à la
place du résultat, que vous auriez normalement obtenu à partir d'une opération
find, vous obtiendriez peut-être ceci::

    $results = array(
        'champ1' => 'valeur1',
        'champ2' => 'valeur2'
    );

.. warning::

    Un code nécessitant que ``$primary`` soit à true aura
    probablement l'erreur fatale "Cannot use string offset as an
    array" de la part de PHP si une recherche récursive est utilisée.

Ci-dessous un exemple de la manière dont afterfind peut être utilisée
pour formater des dates::

    public function afterFind($results, $primary = false) {
        foreach ($results as $key => $val) {
            if (isset($val['Event']['begindate'])) {
                $results[$key]['Event']['begindate'] = $this->dateFormatAfterFind(
                    $val['Event']['begindate']
                );
            }
        }
        return $results;
    }

    public function dateFormatAfterFind($dateString) {
        return date('d-m-Y', strtotime($dateString));
    }

beforeValidate
==============

``beforeValidate(array $options = array())``

Utilisez ce rappel pour modifier les données du model avant qu'elles ne
soient validées ou pour modifier les règles de validation si nécessaire.
Cette fonction doit aussi retourner *true*, sinon l'exécution du save()
courant sera annulée.

afterValidate
==============

``afterValidate()``

Appelée après que la donnée a été vérifiée pour les erreurs. Utilisez ce
callback pour lancer un nettoyage de données ou préparer des données si besoin. 

beforeSave
==========

``beforeSave(array $options = array())``

Placez toute logique de pré-enregistrement dans cette fonction. Cette fonction
s'exécute immédiatement après que les données du model ont été validées avec
succès, mais juste avant que les données ne soient sauvegardées. Cette fonction
devrait toujours retourner true si voulez que l'opération d'enregistrement
se poursuive.

Ce callback est particulièrement pratique, pour toute logique de manipulation
des données qui nécessite de se produire avant que vos données ne soient
stockées. Si votre moteur de stockage nécessite un format spécifique pour les
dates, accédez-y par $this->data et modifiez-les.

Ci-dessous un exemple montrant comment beforeSave peut-être utilisée pour la
conversion de date. Le code de l'exemple est utilisé pour une application qui
a une date de début, au format YYYY-MM-DD dans la base de données et au format
DD-MM-YYYY dans l'affichage de l'application. Bien sûr, ceci peut être très
facilement modifié. Utilisez le code ci-dessous dans le model approprié.

::

    public function beforeSave($options = array()) {
        if (!empty($this->data['Event']['begindate']) &&
            !empty($this->data['Event']['enddate'])
        ) {

            $this->data['Event']['begindate'] = $this->dateFormatBeforeSave(
                $this->data['Event']['begindate']
            );
            $this->data['Event']['enddate'] = $this->dateFormatBeforeSave(
                $this->data['Event']['enddate']
            );
        }
        return true;
    }

    public function dateFormatBeforeSave($dateString) {
        return date('Y-m-d', strtotime($dateString));
    }

.. tip::

    Assurez-vous que beforeSave() retourne true ou bien votre sauvegarde
    échouera.

afterSave
=========

``afterSave(boolean $created, array $options = array())``

Si vous avez besoin d'exécuter de la logique juste après chaque opération de
sauvegarde, placez-la dans cette méthode de rappel. Les données sauvegardées
seront disponibles dans ``$this->data``.

La valeur de ``$created`` sera true si un nouvel objet a été créé
(plutôt qu'un objet mis à jour).

Le tableau ``$options`` est le même que celui passé dans ``Model::save()``.

beforeDelete
============

``beforeDelete(boolean $cascade = true)``

Placez dans cette fonction, toute logique de pré-suppression. Cette fonction
doit retourner true si vous voulez que la suppression continue et
false si vous voulez l'annuler.

La valeur de ``$cascade`` sera ``true``, pour que les enregistrements qui
dépendent de cet enregistrement soient aussi supprimés.

.. tip::

    Assurez-vous que beforeDelete() retourne true, ou votre
    suppression ne va pas marcher.

::

    // en utilisant app/Model/ProduitCategory.php
    // Dans l'exemple suivant, ne laissez pas une catégorie être supprimée si
    // elle contient des produits. Un appel de $this->Produit->delete($id) de
    // ProduitsController.php a défini $this->id. En admettant que
    // 'ProduitCategory hasMany Produit', nous pouvons accéder à $this->Produit
    // dans le model.
    public function beforeDelete() {
        $count = $this->Product->find("count", array(
            "conditions" => array("produit_category_id" => $this->id)
        ));
        if ($count == 0) {
            return true;
        } else {
            return false;
        }
    }

afterDelete
===========

``afterDelete()``

Placez dans cette méthode de rappel, toute logique que vous souhaitez exécuter
après chaque suppression::

    // peut-être pour supprimer un enregistrement de la base de données,
    // vous pouvez aussi supprimer un fichier associé
    public function afterDelete() {
        $file = new File($this->data['SomeModel']['file_path']);
        $file->delete();
    }

onError
=======

``onError()``

Appelée si il se produit quelque problème que ce soit.


.. meta::
    :title lang=fr: Méthodes Callback
    :keywords lang=fr: donnée requêtée,conditions requêtes,classes model modèle,méthodes de callback,fonctions spéciales,valeurs retournées,homologues,tableau,logique,décisions
