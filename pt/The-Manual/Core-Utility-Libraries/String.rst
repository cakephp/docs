String
######

A classe String inclui métodos de conveniência para criação e
manipulação de strings e é normalmente acessada estaticamente. Por
exemplo, ``String::uuid()``.

uuid
====

O método uuid é usado para gerar identificadores únicos de acordo com a
`RFC 4122 <https://www.ietf.org/rfc/rfc4122.txt>`_. Um uuid é uma string
de 128 bits no formato como 485fc381-e790-47a3-9794-1337c0a8fe68.

::

    String::uuid(); // 485fc381-e790-47a3-9794-1337c0a8fe68

tokenize
========

``string tokenize ($data, $separator = ',', $leftBound = '(', $rightBound = ')')``

Este método tokeniza uma string usando ``$separator``, ignorando
qualquer instância de ``$separator`` que apareça entre ``$leftBound`` e
``$rightBound``.

insert
======

string insert ($string, $data, $options = array())

O método insert é usado para criar modelos de string adequados para
substituição de pares chave/valor.

::

    String::insert('Meu nome é :nome e eu tenho :idade anos de idade.', array('nome' => 'Bob', 'idade' => '65'));
    // gera: "Meu nome é Bob e eu tenho 65 anos de idade."

cleanInsert
===========

string cleanInsert ($string, $options = array())

Limpa uma string formatada pelo Set::insert com as opções dadas,
dependendo da chave 'clean' em $options. O método padrão usado é text,
mas html também está disponível. O objetivo deste método é substituir
todos os espaços em branco e marcações indesejadas junto às entradas de
substituição que não tenham sido substitituídas pelo Set::insert.

Você pode usar as seguintes opções no array $options:

::

    $options = array(
        'clean' => array(
            'method' => 'text', // ou html
        ),

        'before' => '',
        'after' => ''
    );

