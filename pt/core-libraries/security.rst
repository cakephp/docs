Utilitário de Segurança
#######################

.. php:namespace:: Cake\Utility

.. php:class:: Security

A `biblioteca de segurança
<https://api.cakephp.org/5.x/class-Cake.Utility.Security.html>`_
lida com medidas básicas de segurança, como fornecer métodos para
fazer hash e criptografar dados.

Criptografando e Descriptografando Dados
=========================================

.. php:staticmethod:: encrypt($text, $key, $hmacSalt = null)
.. php:staticmethod:: decrypt($cipher, $key, $hmacSalt = null)

Criptografa ``$text`` usando AES-256. A ``$key`` deve ser um valor com muita
variância nos dados, muito parecido com uma boa senha. O resultado retornado
será o valor criptografado com uma soma de verificação HMAC.

A extensão `openssl <https://php.net/openssl>`_ é necessária para criptografar/descriptografar.

Um exemplo de uso seria::

    // Assumindo que a chave está armazenada em algum lugar onde pode ser reutilizada para
    // descriptografia posteriormente.
    $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';
    $result = Security::encrypt($value, $key);

Se você não fornecer um sal HMAC, o valor de ``Security::getSalt()`` será usado.
Valores criptografados podem ser descriptografados usando
:php:meth:`Cake\\Utility\\Security::decrypt()`.

Este método **nunca** deve ser usado para armazenar senhas.

Descriptografa um valor criptografado anteriormente. Os parâmetros ``$key`` e ``$hmacSalt``
devem corresponder aos valores usados para criptografar ou a descriptografia falhará. Um
exemplo de uso seria::

    // Assumindo que a chave está armazenada em algum lugar onde pode ser reutilizada para
    // Descriptografia posteriormente.
    $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';

    $cipher = $user->secrets;
    $result = Security::decrypt($cipher, $key);

Se o valor não puder ser descriptografado devido a alterações na chave ou sal HMAC,
``false`` será retornado.

Fazendo Hash de Dados
======================

.. php:staticmethod:: hash( $string, $type = NULL, $salt = false )

Cria um hash de string usando o método fornecido. Retorna ao próximo
método disponível. Se ``$salt`` for definido como ``true``, o valor de sal da
aplicação será usado::

    // Usando o valor de sal da aplicação
    $sha1 = Security::hash('CakePHP Framework', 'sha1', true);

    // Usando um valor de sal personalizado
    $sha1 = Security::hash('CakePHP Framework', 'sha1', 'my-salt');

    // Usando o algoritmo de hash padrão
    $hash = Security::hash('CakePHP Framework');

O método ``hash()`` suporta as seguintes estratégias de hash:

- md5
- sha1
- sha256

E qualquer outro algoritmo de hash que a função ``hash()`` do PHP suporte.

.. warning::

    Você não deve usar ``hash()`` para senhas em novas aplicações.
    Em vez disso, você deve usar a classe ``DefaultPasswordHasher`` que usa bcrypt
    por padrão.

Obtendo Dados Aleatórios Seguros
=================================

.. php:staticmethod:: randomBytes($length)

Obtenha ``$length`` número de bytes de uma fonte aleatória segura. Esta função extrai
dados de uma das seguintes fontes:

* Função ``random_bytes`` do PHP.
* ``openssl_random_pseudo_bytes`` da extensão SSL.

Se nenhuma fonte estiver disponível, um aviso será emitido e um valor
inseguro será usado por motivos de compatibilidade com versões anteriores.

.. php:staticmethod:: randomString($length)

Obtenha uma string aleatória com ``$length`` de comprimento de uma fonte aleatória segura. Este método
extrai da mesma fonte aleatória que ``randomBytes()`` e codificará os dados
como uma string hexadecimal.

.. meta::
    :title lang=pt: Security
    :keywords lang=pt: security api,secret password,cipher text,php class,class security,text key,security library,object instance,security measures,basic security,security level,string type,fallback,hash,data security,singleton,inactivity,php encrypt,implementation,php security
