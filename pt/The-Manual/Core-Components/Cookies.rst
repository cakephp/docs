Cookies
#######

O CookieComponent é um empacotador em torno do método nativo do PHP
setcookie. Antes de tentar utilizar o CookieComponent, você deve ter
certeza que 'Cookie' está listado em seus arrays $components das suas
controladoras.

Configurar Controladora
=======================

Existe um número de variáveis controladoras que permitem você configurar
a forma que os cookies são criados e gerenciados. Definindo essas
variávies especiais no método beforeFilter() da sua controladora,
permite você definir como o CookieComponent trabalha.

Variável Cookie

padrão

descrição

string $name

'CakeCookie'

O nome do cookie.

string $key

null

Essa string é usada para criptografar o valor escrito no cookie. É
recomendado que essa string seja randômica e difícil de adivinhar.

string $domain

''

O nome do domínio permite acessar o cookie. Por exemplo: Use
'seudominio.com.br' para permitir acesso para todos seus subdomínios.

int ou string $time

'5 Dias'

O momento em que seu cookie expirará. Inteiros são interpretados como
segundos e um valor 0 é equivalente para um 'session.cookie': por
exemplo, o cookie expira quando seu browser é fechado. Se uma string
estiver setada, isso será interpretado com a função PHP strtotime().
Você pode setar isso diretamente dentro do método write().

string $path

'/'

O caminho do servidor em que o cookie será aplicado. Se $cookiePath é
setado para '/foo/', o cookie ira apenas estar liberado dentro do
diretório /foo/ e todos seus sub-diretórios como /foo/bar/ do seu
domínio. O valor padrão é a entrada do domínio. Você pode setar isso
diretamente dentro do método write().

boolean $secure

false

Indica que o cookie deveria ser apenas transmitido dentro de uma conexão
segura. Quando setado para true (verdadeiro), o cookie irá apenas estar
serado se uma conexão existir. Você pode setar isso diretamente dentro
do método write().

A seguir um pedaço de código de uma controladora mostra como incluir o
CookieComponent e configurar as variáveis controladoras necessárias para
escrever um cookie chamado 'baker\_id' para o domínio 'exemplo.com.br'
que precisa de uma conexão segura, está disponível no caminho
‘/bakers/preferences/’, e expira em uma hora.

::

    var $components    = array('Cookie');
    function beforeFilter() {
      $this->Cookie->name = 'baker_id';
      $this->Cookie->time =  3600;  // ou '1 hora'
      $this->Cookie->path = '/bakers/preferences/'; 
      $this->Cookie->domain = 'exemplo.com.br';   
      $this->Cookie->secure = true;  //i.e. apenas envia se usar uma conexão segura (HTTPS)
      $this->Cookie->key = 'qSI232qs*&sXOw!';
    }

Agora, vamos procurar como usar os diferentes métodos do componente
Cookie.

Usando o componente
===================

Essa seção descreve os métodos do CookieComponent.

**write(mixed $key, mixed $value, boolean $encrypt, mixed $expires)**

O método write() é o coração do componente cookie, $key é o nome da
variável cookie que você quer, e o $value é a informação para ser
armazenada.

::

    $this->Cookie->write('name','Larry');

Você pode também agrupar suas variáveis fornecendo uma pequena notação
no parâmetro key.

::

    $this->Cookie->write('User.name', 'Larry');
      $this->Cookie->write('User.role','Lead');  

Se você quer escrever mais que um valor no cookie, como um horário, você
pode passar um array:

::

    $this->Cookie->write(
      array('name'=>'Larry','role'=>'Lead')
      );  

Todos os valores no cookie são criptografados por padrão. Se você quer
armazenar esses valores como texto puro, sete o terceiro parâmetro do
método writer() para false.

::

    $this->Cookie->write('name','Larry',false);

O último parâmetro para write é $expires – o número de segundos antes do
seu cookir expirar. Por conveniência, esse parâmetro pode também ser
passado como uma string que a função PHP strtotime() entenda:

::

    //Ambos cookies expiram em uma hora
      $this->Cookie->write('first_name','Larry',false, 3600);
      $this->Cookie->write('last_name','Masters',false, '1 hour');

**read(mixed $key)**

Esse método é usado para ler o valor da variável cookie com o nome
especificado por $key.

::

    // Saídas “Larry”
      echo $this->Cookie->read('name');
      
      //Você pode também usar a notação curta para ler
      echo $this->Cookie->read('User.name');
      
      //Obter as variáveis que você tem agrupada
      //usando uma notação curta como um array, usando algo como
      $this->Cookie->read('User');
      
      // algo como a saída do array('name' => 'Larry', 'role'=>'Lead')

**del(mixed $key)**

Deleta uma variável cookie do nome em $key. Trabalha com notação curta.

::

      //Delete a variable
      $this->Cookie->del('bar')
      
      //Deleta a  variável cookie bar, mas não todos debaixo de foo
      $this->Cookie->del('foo.bar')
     

**destroy()**

Destroy o cookie atual.
