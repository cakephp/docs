Cache
#####

A classe Cache do CakePHP disponibiliza um frontend genérico para
diversos sistemas da cache. Diferentes configurações e mecanismos de
Cache podem ser definidos em seu arquivo app/config/core.php

Cache::read()
=============

Cache::read($key, $config = null)

Cache::read() é usado para ler valores em cache armazenados sob o índice
da chave ``$key`` a partir de ``$config``. Se $config for null, a
configuração padrão será usada. ``Cache::read()`` vai retornar o valor
em cache se ele for um cache válido ou ``false`` se o cache tiver
expirado ou não existir.

Cache::write()
==============

Cache::write($key, $value, $config = null);

Cache::write() vai escrever $value para o Cache. Você pode ler ou
excluir este valor posteriormente a partir da referência ao índice
``$key``. Você pode especificar uma configuração opcional para
armazenamento em cache. Se ``$config`` não for especificado, a
configuração padrão será usada. Cache::write() pode armazenar qualquer
tipo de objeto e é ideal para armazenar resultados de buscas em models
(através de métodos find).

::

        if (($posts = Cache::read('posts')) === false) {
            $posts = $this->Post->find('all');
            Cache::write('posts', $posts);
        }

Usar Cache::write() e Cache::read() pode facilmente reduzir o número de
acessos à base de dados para recuperar posts.

Cache::delete()
===============

Cache::delete($key, $config = null)

``Cache::delete()`` permite que você remova completamente um objeto
armazenado no Cache.

Cache::config()
===============

``Cache::config()`` é usado para criar configurações de Cache
adicionais. Estas configurações adicionais podem incluir durações,
mecanismos, caminhos em disco ou prefixos diferentes que os da sua
configuração de cache padrão. Utilizar múltiplas configurações de cache
pode ajudar a reduzir a quantidade de vezes que você precise chamr
``Cache::set()`` bem como centralizar todas as suas configurações de
cache.

Você deve especificar que mecanismo de cache utilizar. O File **não** é
assumido por padrão.

::

    // short
    Cache::config('short', array(  
        'engine' => 'File',  
        'duration'=> '+1 hours',  
        'path' => CACHE,  
        'prefix' => 'cake_short_'
    ));

    // long
    Cache::config('long', array(  
        'engine' => 'File',  
        'duration'=> '+1 week',  
        'probability'=> 100,  
        'path' => CACHE . 'long' . DS,  
    ));

Pondo o código acima em seu arquivo ``app/config/core.php`` você estará
incluindo duas configurações de Cache adicionais. O nome destas
configurações, 'short' ou 'long' é usado como o parâmetro ``$config``
para o ``Cache::write()`` e ``Cache::read()``.

Cache::set()
============

``Cache::set()`` permite que você sobrescreva configurações de cache
temporariamente para uma operação (normalmente um read ou write). Se
você usar ``Cache::set()`` para modificar as configurações para uma
escrita, você também deve usar ``Cache::set()`` antes de ler os dados de
volta. Se você não fizer isto, as configurações padrão serão usadas
quando o índice de cache for lido.

::

    Cache::set(array('duration' => '+30 days'));
    Cache::write('results', $data);

    // mais tarde

    Cache::set(array('duration' => '+30 days'));
    $results = Cache::read('results');

Se você se vir chamando ``Cache::set()`` diversas vezes, você deveria
criar uma nova `configuração de Cache </pt/view/772/Cache-config>`_.
Isto vai eliminar a necessidade de se chamar ``Cache::set()``.
