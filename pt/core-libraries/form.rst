Formulário Modeless
###################

.. php:namespace:: Cake\Form

.. php:class:: Form

Muitas vezes você precisará ter formulários associados ao :doc:`ORM entities </orm/entities>`
e :doc:`ORM tables </orm/table-objects>` ou outras persistência de dados,
mas há vezes quando você precisará validar um campo de usuário e então realizar uma
ação se o dado é válido. O exemplo mais comum para esta situação é o formulário de contato.

Criando o Formulário
====================

Geralmente quando se usa a classe Form será necessário utilizar uma sub-classe para definir
seu formulário. Isso facilita o teste, e permite o reuso do formulário. Formulários ficam dentro
de **src/Form** e comumente tem  ``Form`` como sufixo da classe. Por exemplo,
um simples formulário de contato poderia ficar assim::

    // em src/Form/ContactForm.php
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
            // Envie um email.
            return true;
        }
    }

No exemplo acima vemos os 3 métodos hooks que o formulário fornece:

* ``_buildSchema`` é usado para definir o esquema de dados usado pelo FormHelper
  para criar um formulário HTML. Você pode definir o tipo de campo, tamanho, e precisão.
* ``_buildValidator`` Pega uma instância do :php:class:`Cake\\Validation\\Validator`
  que você pode você juntar com os validadores.
* ``_execute`` permite definir o comportamento desejado quando o
  ``execute()`` é chamado e o dado é válido.

Você sempre pode adicionar métodos públicos a sua maneira.

Processando Requisição de Dados
===============================

Uma vez definido o formulário, é possível usá-lo em seu controller para processar
e validar os dados::

    // No Controller
    namespace App\Controller;

    use App\Controller\AppController;
    use App\Form\ContactForm;

    class ContactController extends AppController
    {
        public function index()
        {
            $contact = new ContactForm();
            if ($this->request->is('post')) {
                if ($contact->execute($this->request->data)) {
                    $this->Flash->success('We will get back to you soon.');
                } else {
                    $this->Flash->error('There was a problem submitting your form.');
                }
            }
            $this->set('contact', $contact);
        }
    }

No exemplo acima, usamos o método ``execute()`` para chamar o nosso método
``_execute()`` do formulário apenas quando o dado é válido, e definimos as mensagens flash
adequadas. Poderíamos também ter usado o método ``validate()`` apenas para validar
a requisição de dados::

    $isValid = $form->validate($this->request->data);
    

Definindo os Valores do Formulário
==================================

Na sequência para definir os valores para os campos do formulário modelesse, basta apenas definir
os valores usando ``$this->request->data``, como em todos os outros formulários criados pelo FormHelper::

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
                if ($contact->execute($this->request->data)) {
                    $this->Flash->success('Retornaremos o contato em breve.');
                } else {
                    $this->Flash->error('Houve um problema ao enviar seu formulário.');
                }
            }
            
            if ($this->request->is('get')) {
                //Values from the User Model e.g.
                $this->request->data['name'] = 'John Doe';
                $this->request->data['email'] = 'john.doe@example.com';
            }
            
            $this->set('contact', $contact);
        }
    }
    
Valores devem apenas serem definidos se a requesição é do tipo GET, caso contrário
você sobreescreverá os dados anteriormente passados via POST que de certa forma
poderiam estar incorretos e não salvos.

Pegando os Erros do Formulário
==============================

Uma vez sido validado, o formulário pode recuperar seus próprios erros::

    $errors = $form->errors();
    /* $errors contains
    [
        'email' => ['A valid email address is required']
    ]
    */

Invalidando Campos Individuais do Formulário no Controller
==========================================================

É possível invalidar campos únicos do controller sem o uso da classe Validator.
O Uso mais comum neste caso é quando a validação
é feita no servidor remoto. Neste caso, você deve manualmente invalidar
os campos de acordo com a resposta do servidor::

    // em src/Form/ContactForm.php
    public function setErrors($errors)
    {
        $this->_errors = $errors;
    }

Conforme como a classe validadora poderia ter retornado os erros, ``$errors``
deve estar neste formato::

    ["fieldName" => ["validatorName" => "The error message to display"]]

Agora você pode invalidar os campos determinar o fieldName, e então
definir as mensagens de erro::

    // Em um controller
    $contact = new ContactForm();
    $contact->setErrors(["email" => ["_required" => "Seu email é necessário"]]);

Prossiga para Criação do HTML com o FormHelper para ver o resultado.

Criando o HTML com FormHelper
=============================

Uma vez sido criado uma class Form, 
Once you've created a Form class, você provavelmente vai querer criar um formulário
HTML para isso. FormHelper compreende objetos Form apenas como entidades ORM::

    echo $this->Form->create($contact);
    echo $this->Form->input('name');
    echo $this->Form->input('email');
    echo $this->Form->input('body');
    echo $this->Form->button('Submit');
    echo $this->Form->end();

O código acima criar um formulário HTML para o ``ContactForm`` definidos anteriormente.
Formulários HTML criados com FormHelper usará o esquema definido
e validador para determinar os tipos de campos, tamanhos máximos, e validação de erros.
