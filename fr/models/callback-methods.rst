Méthodes Callback
#################

Si vous voulez glisser un bout de logique applicative juste avant ou 
après une opération d’un model CakePHP, utilisez les callbacks de model. 
Ces fonctions peuvent être définies dans les classes de model (cela 
comprend également votre classe AppModel). Notez bien les valeurs de 
retour attendues pour chacune de ces méthodes spéciales. 

beforeFind
==========

``beforeFind(mixed $queryData)``

Appelée avant toute opération liée à la recherche. Les ``$donneesRequete`` 
passées à cette méthode de callback contiennent des informations sur 
la requête courante : conditions, champs, etc.

Si vous ne souhaitez pas que l'opération de recherche commence (par 
rapport à une décision liée aux options de ``$donneesRequete``), retournez 
*false*. Autrement, retournez la variable ``$donneesRequete`` éventuellement 
modifiée, ou tout ce que vous souhaitez voir passé à la méthode find() 
ou ses équivalents.

Vous pouvez utiliser cette méthode de callback pour restreindre les 
opérations de recherche en se basant sur le rôle de l'utilisateur, ou 
prendre des décisions sur la politique de mise en cache en fonction de 
la charge actuelle.

afterFind
=========

``afterFind(array $results, bool $primary)``

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
que la requête originelle  parameter indicates whether or not the current
model was the model that the query originated on or whether or not
this model was queried as an association. If a model is queried as
an association the format of ``$results`` can differ; à la place du résultat, 
que vous auriez normalement obtenu à partir d'une opération find, vous 
obtiendriez peut-être ça::

    $results = array(
        'champ1' => 'valeur1',
        'champ2' => 'valeur2'
    );

.. warning::

    Un code nécessitant que ``$primaire`` soit vrai auront probablement 
    l'erreur fatale "Cannot use string offset as an array" de la part de 
    PHP si une recherche récursive est utilisée. 

Ci-dessous un exemple de la manière dont afterfind peut être utilisé 
pour formater des dates::

    public function afterFind($results) {
        foreach ($results as $key => $val) {
            if (isset($val['Event']['begindate'])) {
                $results[$key]['Event']['begindate'] = $this->dateFormatAfterFind($val['Event']['begindate']);
            }
        }
        return $results;
    }
    
    public function dateFormatAfterFind($dateString) {
        return date('d-m-Y', strtotime($dateString));
    }

beforeValidate
==============

``beforeValidate()``

Utilisez ce rappel pour modifier les données du model avant qu'elles ne 
soient validées ou pour modifier les règles de validation si nécessaire. 
Cette fonction doit aussi retourner *vrai*, sinon l'exécution du save() 
courant sera annulée.

beforeSave
==========

``beforeSave()``

Placez toute logique de pré-enregistrement dans cette fonction. Cette fonction 
s'exécute immediatement après que les données du model ont été validées avec 
succès, mais juste avant que les données ne soient sauvegardées. Cette fonction 
devrait toujours retourner vrai si voulez que l'opération d'enregistrement 
se poursuive.

Ce callback est particulièrement pratique, pour toute logique de manipulation 
des données qui nécessite de se produire avant que vos données ne soient 
stockées. Si votre moteur de stockage nécessite un format spécifique pour les 
dates, accédez-y par $this->data et modifiez-les.

Ci-dessous un exemple montrant comment beforeSave peut-être utilisé pour la 
conversion de date. Le code de l'exemple est utilisé pour une application qui 
a une date de début, au format YYYY-MM-DD dans la base de données et au format 
DD-MM-YYYY dans l'affichage de l'application. Bien sûr, ceci peut être très 
facilement modifié. Utilisez le code ci-dessous dans le model approprié.

::

    public function beforeSave() {
        if (!empty($this->data['Event']['begindate']) && !empty($this->data['Event']['enddate'])) {
            $this->data['Event']['begindate'] = $this->dateFormatBeforeSave($this->data['Event']['begindate']);
            $this->data['Event']['enddate'] = $this->dateFormatBeforeSave($this->data['Event']['enddate']);
        }
        return true;
    }

    public function dateFormatBeforeSave($dateString) {
        return date('Y-m-d', strtotime($dateString));
    }

.. tip::

    Assurez-vous que beforeSave() retourne vrai ou bien votre sauvegarde 
    échouera.

afterSave
=========

``afterSave(boolean $created)``

Si vous avez besoin d'exécuter de la logique juste après chaque opération de 
sauvegarde, placez-la dans cette méthode de rappel.

La valeur de ``$created`` sera vrai si un nouvel objet a été créé (plutôt qu'un 
objet mis à jour). 

beforeDelete
============

``beforeDelete(boolean $cascade)``

Placez dans cette fonction, toute logique de pré-suppression. Cette fonction 
doit retourner vrai si vous voulez que la suppression continue et faux si 
vous voulez l'annuler.

La valeur de ``$cascade`` sera ``true``, pour que les enregistrements qui 
dépendent de cet enregistrement soient aussi supprimés.

.. tip::

    Assurez vous que beforeDelete() retourne true, ou votre suppression ne va 
    pas marcher.

::

    // using app/Model/ProduitCategory.php
    // Dans l'exemple suivant, ne laissez pas une catégorie être supprimée si elle contient des produits.
    // Un appel de $this->Produit->delete($id) de ProduitsController.php a défini $this->id .
    // En admettant que 'ProduitCategory hasMany Produit', nous pouvons accéder à $this->Produit dans le model.
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
après chaque suppression.

onError
=======

``onError()``

Appelée si quelque problème se produit.


.. meta::
    :title lang=fr: Méthodes Callback
    :keywords lang=fr: donnée requêtée,conditions requêtes,classes model modèle,méthodes de callback,fonctions spéciales,valeurs retournées,homologues,tableau,logique,décisions
