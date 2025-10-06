Formulários sem Models
######################

.. php:namespace:: Cake\Form

.. php:class:: Form

Na maioria das vezes você terá formulários associados ao :doc:`ORM entities </orm/entities>`
e :doc:`ORM tables </orm/table-objects>` ou outras persistências de dados,
mas há vezes quando você precisará validar dados de usuário e então realizar uma
ação se os dados forem válidos. O exemplo mais comum para isto é um formulário de contato.

Criando o Formulário
====================

Geralmente quando se usa a classe Form você vai querer usar uma sub-classe para definir
seu formulário. Isso facilita o teste, e permite reusar seu formulário. Formulários ficam dentro
de **src/Form** e comumente têm  ``Form`` como sufixo da classe. Por exemplo,
um simples formulário de contato ficaria assim::

    // em src/Form/ContactForm.php
    namespace App\Form;

    use Cake\Form\Form;
    use Cake\Form\Schema;
    use Cake\Validation\Validator;

    class ContactForm extends Form
    {
        protected function _buildSchema(Schema $schema): Schema
        {
            return $schema->addField('name', 'string')
                ->addField('email', ['type' => 'string'])
                ->addField('body', ['type' => 'text']);
        }

        public function validationDefault(Validator $validator): Validator
        {
            $validator->minLength('name', 10)
                ->email('email');

            return $validator;
        }

        protected function _execute(array $data): bool
        {
            // Envie um email.
            return true;
        }
    }

No exemplo acima vemos os 3 métodos hooks que o formulário fornece:

* ``_buildSchema`` é usado para definir o esquema de dados usado pelo FormHelper
  para criar um formulário HTML. Você pode definir o tipo de campo, tamanho, e precisão.
* ``validationDefault`` Pega uma instância do :php:class:`Cake\\Validation\\Validator`
  que você pode anexar validadores.
* ``_execute`` permite definir o comportamento que você deseja que aconteça quando
  ``execute()`` é chamado e os dados são válidos.

Você sempre pode definir métodos públicos adicionais conforme necessário também.

Processando Dados de Requisição
================================

Uma vez que você definiu seu formulário, é possível usá-lo em seu controller para processar
e validar os dados de requisição::

    // Em um controller
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
                    $this->Flash->success('Retornaremos o contato em breve.');
                } else {
                    $this->Flash->error('Houve um problema ao enviar seu formulário.');
                }
            }
            $this->set('contact', $contact);
        }
    }

No exemplo acima, usamos o método ``execute()`` para executar o método
``_execute()`` do nosso formulário apenas quando os dados são válidos, e definimos as mensagens flash
adequadas. Se quisermos usar um conjunto de validação não padrão, podemos usar a
opção ``validate``::

    if ($contact->execute($this->request->getData(), 'update')) {
        // Lidar com sucesso do formulário.
    }

Esta opção também pode ser definida como ``false`` para desabilitar a validação.

Poderíamos também ter usado o método ``validate()`` apenas para validar
os dados de requisição::

    $isValid = $form->validate($this->request->getData());

    // Você também pode usar outros conjuntos de validação. O seguinte
    // usaria as regras definidas por `validationUpdate()`
    $isValid = $form->validate($this->request->getData(), 'update');

Definindo os Valores do Formulário
===================================

Você pode definir valores padrão para formulários sem models usando o método ``setData()``.
Valores definidos com este método sobrescreverão dados existentes no objeto de formulário::

    // Em um controller
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
                    $this->Flash->success('Retornaremos o contato em breve.');
                } else {
                    $this->Flash->error('Houve um problema ao enviar seu formulário.');
                }
            }

            if ($this->request->is('get')) {
                $contact->setData([
                    'name' => 'John Doe',
                    'email' => 'john.doe@example.com'
                ]);
            }

            $this->set('contact', $contact);
        }
    }

Valores devem apenas ser definidos se o método de requisição é GET, caso contrário
você sobrescreverá seus dados POST anteriores que podem ter erros de validação
que precisam ser corrigidos. Você pode usar ``set()`` para adicionar ou substituir campos individuais
ou um subconjunto de campos::

    // Definir um campo.
    $contact->set('name', 'John Doe');

    // Definir múltiplos campos;
    $contact->set([
        'name' => 'John Doe',
        'email' => 'john.doe@example.com',
    ]);

Obtendo Erros do Formulário
============================

Uma vez que um formulário foi validado, você pode recuperar os erros dele::

    $errors = $form->getErrors();
    /* $errors contém
    [
        'name' => ['length' => 'Nome deve ter pelo menos dois caracteres'],
        'email' => ['format' => 'Um endereço de email válido é necessário'],
    ]
    */

    $error = $form->getError('email');
    /* $error contém
    [
        'format' => 'Um endereço de email válido é necessário',
    ]
    */

Invalidando Campos Individuais do Formulário no Controller
===========================================================

É possível invalidar campos individuais do controller sem o uso da classe Validator.
O uso mais comum para isto é quando a validação
é feita em um servidor remoto. Neste caso, você deve manualmente invalidar
os campos de acordo com o feedback do servidor remoto::

    // em src/Form/ContactForm.php
    public function setErrors($errors)
    {
        $this->_errors = $errors;
    }

Conforme como a classe validadora teria retornado os erros, ``$errors``
deve estar neste formato::

    ['fieldName' => ['validatorName' => 'A mensagem de erro para exibir']]

Agora você será capaz de invalidar campos do formulário definindo o fieldName, e então
definir as mensagens de erro::

    // Em um controller
    $contact = new ContactForm();
    $contact->setErrors(['email' => ['_required' => 'Seu email é necessário']]);

Prossiga para Criação do HTML com FormHelper para ver os resultados.

Criando o HTML com FormHelper
==============================

Uma vez que você criou uma classe Form, você provavelmente vai querer criar um formulário
HTML para ela. FormHelper compreende objetos Form assim como entidades ORM::

    echo $this->Form->create($contact);
    echo $this->Form->control('name');
    echo $this->Form->control('email');
    echo $this->Form->control('body');
    echo $this->Form->button('Submit');
    echo $this->Form->end();

O código acima criaria um formulário HTML para o ``ContactForm`` que definimos anteriormente.
Formulários HTML criados com FormHelper usarão o esquema definido e validador para
determinar os tipos de campos, tamanhos máximos, e erros de validação.
