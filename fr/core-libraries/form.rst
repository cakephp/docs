Formulaires Sans Models
#######################

.. php:namespace:: Cake\Form

.. php:class:: Form

La plupart du temps, vous aurez des formulaires avec des
:doc:`entities </orm/entities>` et des :doc:`tables </orm/table-objects>` de
l'ORM en arrière-plan ou d'autres stockages persistants, mais il y a des fois
où vous aurez besoin de valider un input de l'utilisateur et effectuer une
action si les données sont valides. L'exemple le plus courant est un formulaire
de contact.

Créer un Formulaire
===================

Généralement lorsque vous utilisez la classe Form, vous voudrez utiliser une
sous classe pour définir votre formulaire. Cela rend les tests plus faciles et
vous permet de réutiliser votre formulaire. Les formulaires sont situés dans
**src/Form** et ont habituellement ``Form`` comme suffixe de classe. Par
exemple, un simple formulaire de contact ressemblerait à ceci::

    // Dans src/Form/ContactForm.php
    namespace App\Form;

    use Cake\Form\Form;
    use Cake\Form\Schema;
    use Cake\Validation\Validator;

    class ContactForm extends Form
    {

        protected function _buildSchema(Schema $schema)
        {
            return $schema->addField('name', 'string')
                ->addField('email', ['type' => 'string'])
                ->addField('body', ['type' => 'text']);
        }

        protected function _buildValidator(Validator $validator)
        {
            return $validator->add('name', 'length', [
                    'rule' => ['minLength', 10],
                    'message' => 'Un nom est requis'
                ])->add('email', 'format', [
                    'rule' => 'email',
                    'message' => 'Une adresse email valide est requise',
                ]);
        }

        protected function _execute(array $data)
        {
            // Envoie un email.
            return true;
        }
    }

Dans l'exemple ci-dessus nous pouvons voir les 3 méthodes de hook fournies par
les formulaires:

* ``_buildSchema`` et utilisé pour définir le schema des données utilisé par
  FormHelper pour créer le formulaire HTML. Vous pouvez définir le type de
  champ, la longueur et la précision.
* ``_buildValidator`` Récupère une instance de
  :php:class:`Cake\\Validation\\Validator` à laquelle vous pouvez attacher des
  validateurs.
* ``_execute`` vous permet de définir le comportement que vous souhaitez lorsque
  ``execute()`` est appelée et que les données sont valides.

Vous pouvez toujours également définir des méthodes publiques additionnelles si
besoin.

Traiter les Données de Requêtes
===============================

Une fois que vous avez défini votre formulaire, vous pouvez l'utiliser dans
votre controller pour traiter et valider les données de la requête::

    // Dans un controller
    namespace App\Controller;

    use App\Controller\AppController;
    use App\Form\ContactForm;

    class ContactController extends AppController
    {
        public function index()
        {
            $contact = new ContactForm();
            if ($this->request->is('post')) {
                if ($contact->execute($this->request->getData())) {
                    $this->Flash->success('Nous reviendrons vers vous rapidement.');
                } else {
                    $this->Flash->error('Il y a eu un problème lors de la soumission de votre formulaire.');
                }
            }
            $this->set('contact', $contact);
        }
    }

Dans l'exemple ci-dessus, nous utilisons la méthode ``execute()`` pour lancer
la méthode ``_execute()`` de notre formulaire seulement lorsque les données
sont valides, et définissons un message flash en conséquence. Nous aurions
aussi pu utiliser la méthode ``validate()`` pour valider uniquement les données
de requête::

    $isValid = $form->validate($this->request->getData());

Définir des Valeurs pour le Formulaire
======================================

Pour définir les valeurs d'un formulaire sans model, vous pouvez utiliser
``$this->request->getData()`` comme dans tous formulaires créés par le FormHelper::

    // Dans uncontroller
    namespace App\Controller;

    use App\Controller\AppController;
    use App\Form\ContactForm;

    class ContactController extends AppController
    {
        public function index()
        {
            $contact = new ContactForm();
            if ($this->request->is('post')) {
                if ($contact->execute($this->request->getData())) {
                    $this->Flash->success('Nous reviendrons vers vous rapidement.');
                } else {
                    $this->Flash->error('Il y a eu un problème lors de la soumission de votre formulaire.');
                }
            }

            if ($this->request->is('get')) {
                //Values from the User Model e.g.
                $this->request->getData('name', 'John Doe');
                $this->request->getData('email','john.doe@example.com');
            }

            $this->set('contact', $contact);
        }
    }

Les valeurs ne doivent être définies que si la méthode de requête est GET,
sinon vous allez surcharger les données POST qui auraient pu être incorrectes
et non sauvegardées.

Récupérer les Erreurs d'un Formulaire
=====================================

Une fois qu'un formulaire a été validé, vous pouvez récupérer les erreurs
comme ceci::

    $errors = $form->errors();
    /* $errors contient
    [
        'email' => ['Une adresse email valide est requise']
    ]
    */

Invalider un Champ de Formulaire depuis un Controller
=====================================================

Il est possible d'invalider un champ individuel depuis un controller sans
utiliser la class Validator. Le scénario le plus courant est lorsque la
validation est faite sur un serveur distant. Dans ce cas, vous devez invalider
manuellement le champ suivant le retour du serveur distant::

    // Dans src/Form/ContactForm.php
    public function setErrors($errors)
    {
        $this->_errors = $errors;
    }

De la même façon que ce que la classe Validator aurait retourné l'erreur,
``$errors`` doit être sous ce format::

    ["fieldName" => ["validatorName" => "The error message to display"]]

Maintenant vous pourrez invalider des champs de formulaire en définissant le nom
du champ suivi du message d'erreur::

    // Dans un controller
    $contact = new ContactForm();
    $contact->setErrors(["email" => ["_required" => "Your email is required"]]);

Créez un formulaire HTML avec FormHelper pour voir le résultat.

Créer le HTML avec FormHelper
=============================

Une fois que vous avez créé une classe Form, vous voudrez probablement créer un
formulaire HTML. FormHelper comprend les objets Form de la même manière que des
entities de l'ORM::

    echo $this->Form->create($contact);
    echo $this->Form->input('name');
    echo $this->Form->input('email');
    echo $this->Form->input('body');
    echo $this->Form->button('Submit');
    echo $this->Form->end();

Le code ci-dessus crée un formulaire HTML pour le ``ContactForm`` que nous avons
défini précédemment. Les formulaires HTML créés avec FormHelper utiliseront les
schema et validator définis pour déterminer les types de champ, leurs longueurs
et les erreurs de validation.
