Формы без Модели
################

.. php:namespace:: Cake\Form

.. php:class:: Form

В большинстве случаев у вас будут формы, опирающиеся на :doc:`сущности ORM </orm/entities>` (entities)
и :doc:`таблицы ORM </orm/table-objects>`  или другие постоянные хранилища(peristent stores), но бывают случаи
когда вам необходимо проверить действие пользователя, а затем выполнить действие, если данные
действительны. Наиболее распространенным примером этого является контактная форма.

Создание формы
==============

Как правило, при использовании класса Form вы хотите использовать подкласс для определения
вашей формы. Это упрощает тестирование и позволяет повторно использовать вашу форму.
Формы помещаются в **src/Form** и обычно имеют ``Form`` в качестве суффикса класса.
Например, простая контактная форма будет выглядеть так::

    // в src/Form/ContactForm.php
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
                    'message' => 'A name is required'
                ])->add('email', 'format', [
                    'rule' => 'email',
                    'message' => 'A valid email address is required',
                ]);
        }

        protected function _execute(array $data)
        {
            // Отправить письмо.
            return true;
        }
    }

В приведенном выше примере мы видим, 3 защищённых(protected) метода:

* ``_buildSchema`` - используется для определения данных схемы, которые
  используются FormHelper для создания HTML-формы. Вы можете определить
  тип поля, длину и точность.
* ``_buildValidator`` - получает экземпляр :php:class:`Cake\\Validation\\Validator`,
  к которому вы можете присоединить валидаторы.
* ``_execute`` - позволяет определить поведение, которое вы хотите выполнить,
  когда вызывается ``execute()`` и данные являются валидными.

Вы всегда можете определить дополнительные общедоступные методы, как вам это нужно.

Обработка данных запроса
========================

После того, как вы определили форму, вы можете использовать её в своем контроллере,
для обработки и проверки данных запроса::

    // В контроллере
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
                    $this->Flash->success('Мы скоро свяжемся с вами.');
                } else {
                    $this->Flash->error('Возникла проблема с отправкой вашей формы.');
                }
            }
            $this->set('contact', $contact);
        }
    }

В приведенном выше примере мы используем метод ``execute()`` для запуска метода ``_execute()``
нашей формы только тогда, когда данные валидные, и соответственно устанавливают флеш-сообщения.
Мы могли бы также использовать метод ``validate()`` только для проверки данных запроса::

    $isValid = $form->validate($this->request->getData());

Установка значений формы
========================

Чтобы установить значения для полей формы без моделей форм, можно определить значения
с помощью ``$this->request->data()``, как и во всех других формах, созданных FormHelper::

    // В контроллере
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
                    $this->Flash->success('Мы скоро свяжемся с вами.');
                } else {
                    $this->Flash->error('Возникла проблема с отправкой вашей формы.');
                }
            }

            if ($this->request->is('get')) {
                // Значения, например, из пользовательской модели.
                $this->request->data('name', 'John Doe');
                $this->request->data('email','john.doe@example.com');
            }

            $this->set('contact', $contact);
        }
    }

Значения должны быть определены только в том случае, если методом запроса является GET-метод,
иначе вы перезапишете предыдущие данные POST, которые могли быть неверными и не были сохранены.

Получение ошибок в форме
========================

Как только форма была проверена, вы можете получить от нее ошибки::

    $errors = $form->errors();
    /* $errors contains
    [
        'email' => ['Требуется валидный адрес электронной почты']
    ]
    */

Невалидность отдельных полей формы из контроллера
=================================================

Можно исключить отдельные поля из контроллера без использования класса Validator.
Наиболее распространенным вариантом использования этого является проверка
правильности работы на удалённом сервере. В таком случае вы должны вручную
аннулировать поля, соответствующие обратной связи с удаленного сервера::

    // в src/Form/ContactForm.php
    public function setErrors($errors)
    {
        $this->_errors = $errors;
    }

Согласно тому, как класс validator вернул бы ошибки, ``$errors`` должен быть
в таком формате::

    ["fieldName" => ["validatorName" => "Отображаемое сообщение об ошибке"]]

Теперь вы сможете аннулировать поля формы, установив fieldName, а затем
установить сообщения об ошибках::

    // В контроллере
    $contact = new ContactForm();
    $contact->setErrors(["email" => ["_required" => "Ваш адрес электронной почты"]]);

Перейдите к созданию HTML с помощью FormHelper, чтобы увидеть результаты.

Создание HTML с помощью FormHelper
==================================

Создав класс Form, вы, скорее всего, захотите создать для него HTML-форму.
FormHelper понимает объекты формы, подобные объектам ORM::

    echo $this->Form->create($contact);
    echo $this->Form->control('name');
    echo $this->Form->control('email');
    echo $this->Form->control('body');
    echo $this->Form->button('Submit');
    echo $this->Form->end();

Вышеизложенное создало бы HTML-форму для ``ContactForm``, которую мы определили ранее.
HTML-формы, созданные с помощью FormHelper, будут использовать определенную схему и
валидатор для определения типов полей, максимальной длинны и ошибок проверки(валидации).
