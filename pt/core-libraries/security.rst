Segurança
#########

.. php:namespace:: Cake\Utility

.. php:class:: Security

A `biblioteca de segurança
<https://api.cakephp.org/3.x/class-Cake.Utility.Security.html>`_
trabalha com medidas básicas de segurança fornecendo métodos para
`hash` e criptografia de dados.

Criptografando e Descriptografando Dados
==========================================

.. php:staticmethod:: encrypt($text, $key, $hmacSalt = null)
.. php:staticmethod:: decrypt($cipher, $key, $hmacSalt = null)

Criptografando ``$text`` usando AES-256. A ``$key`` deve ser um valor com
dados variados como uma senha forte. O resultado retornado será o valor
criptografado com um `HMAC checksum`.

Este método irá usar `openssl <http://php.net/openssl>`_ ou `mcrypt
<http://php.net/mcrypt>`_ dependendo de qual deles estiver disponível em seu sistema. Dados criptografados em uma implementação são portáveis para a outra.

.. warning::
    A extensão `mcrypt <http://php.net/mcrypt>`_ foi considerada obsoleta no PHP7.1


Este método **nunca** deve ser usado para armazenar senhas. Em vez disso, você deve usar
o método de ``hash`` de mão única fornecidos por
:php:meth:`~Cake\\Utility\\Security::hash()`. Um exemplo de uso pode ser::

    // Assumindo que $key está gravada em algum lugar, ela pode ser reusada para
    // descriptografar depois.
    $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';
    $result = Security::encrypt($value, $key);

Se você não fornecer um ``HMAC salt``, o valor em ``Security.salt`` será usado.
Os valores criptografados podem ser descriptografados usando
:php:meth:`Cake\\Utility\\Security::decrypt()`.

Descriptografando um valor criptografado anteriormente. Os parametros ``$key`` e ``$hmacSalt``
devem corresponder aos valores utilizados para a criptografia senão o processo falhará.

Exemplo::

    // Assumindo que $key está gravada em algum lugar, ela pode ser reusada para
    // descriptografar depois.
    $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';

    $cipher = $user->secrets;
    $result = Security::decrypt($cipher, $key);

Se o valor não puder ser descriptografado por mudanças em ``$key`` ou ``HMAC salt``
o método retornará ``false``.

.. _force-mcrypt:

Escolhendo uma implementação de criptografia
--------------------------------------------

Se você está atualizando sua aplicação do CakePHP 2.x, os dados criptografados
não serão compatíveis com openssl por que seus dados criptografados não são totalmente
compatíveis com AES. Se você não quiser ter o trabalho de refazer a criptografia dos seus
dados, você pode forçar o CakePHP a usar ``mcrypt`` através do método ``engine()``::

    // Em config/bootstrap.php
    use Cake\Utility\Crypto\Mcrypt;

    Security::engine(new Mcrypt());

O código acima permitirá que você leia dados de versões anteriores do CakePHP
e criptografar novos dados para serem compatíveis com OpenSSL.

Fazendo Hash de dados
=====================

.. php:staticmethod:: hash( $string, $type = NULL, $salt = false )

Criando um hash de uma string usando o método acima. Se ``$salt`` estiver
setado como ``true`` o salt da aplicação será utilizado::

    // Usando salt definido na aplicação
    $sha1 = Security::hash('CakePHP Framework', 'sha1', true);

    // Usando um salt customizado
    $sha1 = Security::hash('CakePHP Framework', 'sha1', 'my-salt');

    // Usando o padrão do algoritmo de hash
    $hash = Security::hash('CakePHP Framework');

O método ``hash()`` suporta as seguintes estratégias de hash:

- md5
- sha1
- sha256

E qualquer outro algoritmo de hash que a função ``hash()`` do PHP suporta.

.. warning::

    Você não deve usar ``hash()`` para senhas em novas aplicações, o ideal
    é usar a classe ``DefaultPasswordHasher`` que usa ``bcrypt`` por padrão.

Gerando dados aleatórios seguros
================================

.. php:staticmethod:: randomBytes($length)

Obter ``$length`` número de bytes de uma fonte segura aleatória. Esta função
utiliza um dos seguntes métodos:

* Função ``random_bytes`` do PHP.
* Função ``openssl_random_pseudo_bytes`` da extensão SSL.

Se nenhuma das opções estiverem disponíveis um ``warning`` será emitido e um
valor não seguro será usado por motivos de compatibilidade.

.. versionadded:: 3.2.3
    O método  randomBytes foi adicionado na versão 3.2.3.

.. meta::
    :title lang=pt: Segurança
    :keywords lang=pt: api segurança,senha,cipher text,php class,class security,text key,security library,object instance,security measures,basic security,security level,string type,fallback,hash,data security,singleton,inactivity,php encrypt,implementation,php security
