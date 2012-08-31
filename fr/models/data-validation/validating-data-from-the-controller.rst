Validation des données à partir du Controller
#############################################

Alors que normalement vous n'utiliseriez que la méthode save du modèle,
il peut arriver que vous souhaitiez valider les données sans les sauvegarder.
Par exemple, vous souhaitez afficher des informations supplémentaires à
l'utilisateur avant qu'il ne sauvegarde les données dans la base. Valider
les données nécessite un processus légèrement différentde la méthode save.

Tout d'abord, mettez les données au modèle::

    <?php
    $this->ModelName->set($this->request->data);

Ensuite, pour vérifier si les données sont validées, utilisez la méthide 
validates du modèle, qui va retourner true si elles sont valides et false 
si elles ne le sont pas::

    <?php
    if ($this->ModelName->validates()) {
        // La logique est validée
    } else {
        // La logique n'est pas validée
        $errors = $this->ModelName->validationErrors;
    }

Il peut être souhaité de valider votre modèle seulement en utilisant
un sous-ensemble des validations spécifiées dans le modèle. Par exemple,
si vous avez un modèle Utilisateur avec les champs prenom, nom, email et 
mot_de_passe. Dans ce cas, quand vous créez ou modifiez un utilisateur,
vous ne voulez pas valider les 4 règles des champs. Pourtant quant un
utilisateur se connecte, vous voulez validez seulement les règles de
l'email et du mot_de_passe. Pour le faire, vous pouvez passer un tableau
d'options spécifiant les champs sur lesquels vous voulez la validation.
Par exemple ::

    <?php
    if ($this->User->validates(array('fieldList' => array('email', 'mot_de_passe')))) {
        // valide
    } else {
        // invalide
    }

La méthode validates invoque la méthode invalidFields qui
remplit la propriété validationErrors du modèle. La méthode
invalidFields retourne aussi cette donnée comme résultat::

    <?php
    $errors = $this->ModelName->invalidFields(); // contient le tableau des 
    ErreursDeValidation (validationErrors)

La liste des erreurs de validation n'est pas supprimée entre les différents 
appels à ``invalidFields()``. Donc si vous validez dans une boucle et que vous 
voulez chaque jeu d'erreurs séparement, n'utilisez pas ``invalidFields()``. 
Utilisez plutôt ``validates()`` et accéder à la propriété ``validationErrors`` 
du modèle.

Il est important de noter que les données doivent être envoyées au modèle
avant que les données soient validées. C'est différent de la méthode save
qui autorise aux données d'être passées comme paramètre. Aussi,
garder à l'esprit qu'il n'est pas requis d'appeler validates antérieurement
à l'appel save puisque save va automatiquement valider les données avant 
l'enregistrement effectif.

Pour valider de multiple modèles, l'approche suivante devrait être utilisée::

    <?php
    if ($this->ModelName->saveAll($this->request->data, array('validate' => 'only'))) {
      // valide
    } else {
      // ne valide pas
    }

Si vous avez validé les données avant l'enregistrement, vous pouvez stopper la 
validation du save pour éviter un deuxième contrôle::

    <?php
    if ($this->ModelName->saveAll($this->request->data, array('validate' => false))) {
        // saving without validation
    } 


.. meta::
    :title lang=fr: Validation des données depuis un controlleur
    :keywords lang=fr: règles de mot de passe,validations,sous-ensemble,tableau,logs,logique,email,prénom nom,modèles,options,données du modèle