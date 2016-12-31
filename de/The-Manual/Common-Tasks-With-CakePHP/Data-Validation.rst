Datenvalidierung
################

Die Validierung von Daten ist ein enorm wichtiger Teil in jeder
Anwendung. Sie hilft, sicherzustellen, dass die Daten in einem Model mit
den Business Rules der Anwendung übereinstimmen. Zum Beispiel könntest
Du sicher stellen wollen, dass Passwörter mindestens acht Zeichen lang
sind oder dass Benutzernamen einzigartig sind. Validierungsregeln
festzulegen macht die Verarbeitung von Formularverarbeitung wesentlich
einfacher.

Es gibt viele verschiedene Aspekte im Validierungsprozess. In diesem
Abschnitt möchten wir dies aus Sicht des Models abdecken, im
Wesentlichen was passieren soll, wenn Du die save()-Methode Deines
Models aufrufst. Mehr Informationen zur Darstellung der
Validierungsfehler finden sich im Abschnitt zum FormHelper.

Der erste Schritt zur Validierung, ist die Festlegung der
Validierungsregeln im Model. Diese Regeln werden im
Model::validate-Array in der Definition Deiner Modelklasse dargestellt,
zum Beispiel:

::

    <?php
    class User extends AppModel {  
        var $name = 'User';
        var $validate = array();
    }
    ?>

Im diesem Beispiel wurde das $validate-Array im User-Model definiert, es
beinhaltet aber keine Regeln. Angenommen, die users-Tabelle besteht aus
den Feldern login, password, email und born, zeigt das folgende Beispiel
einige simple Validierungsregeln, die sich auf diese Felder beziehen:

::

    <?php
    class User extends AppModel {
        var $name = 'User';
        var $validate = array(
            'login' => 'alphaNumeric',
            'email' => 'email',
            'born' => 'date'
        );
    }
    ?>

Das folgende Beispiel zeigt, wie Validierungsregeln zu den Model-Feldern
hinzugefügt werden können. Das login-Feld soll nur aus Buchstaben und
Zahlen bestehen, die E-Mail-Adresse soll gültig sein und das born-Feld
soll ein gültiges Datum sein. Durch die Definition dieser Regeln kann
CakePHP automagisch Fehlermeldungen in Formularen anzeigen, wenn dieses
nicht valide sind.

CakePHP besitzt viele eingebaute Validierungsregeln, deren Benutzung
einfacher nicht sein könnte. Einige der eingebauten Regeln erlauben Dir,
die Formatierung von E-Mail-Adressen, URLs und Kreditkartennummern, zur
überprüfen - dazu später mehr.

Hier ein etwas komplexeres Beispiel, in welchem einige der eingebauten
Regeln verwendet werden:

::

    <?php
    class User extends AppModel {
        var $name = 'User';
        var $validate = array(
            'login' => array(
                'alphanumeric' => array(
                    'rule' => 'alphaNumeric',
                    'required' => true,
                    'message' => 'Alphabets and numbers only'
                    ),
                'between' => array(
                    'rule' => array('between', 5, 15),
                    'message' => 'Between 5 to 15 characters'
                )
            ),
            'password' => array(
                'rule' => array('minLength', '8'),
                'message' => 'Mimimum 8 characters long'
            ),
            'email' => 'email',
            'born' => array(
                'rule' => 'date',
                'message' => 'Enter a valid date',
                'allowEmpty' => true
            )
        );
    }
    ?>

Für das Feld login sind zwei Regeln definiert: es darf nur aus
Buchstaben und Zahlen bestehen und zwischen fünf und 15 Zeichen lang
sein. Dass Passwort muss mindestens acht Zeichen lang sein. Außerdem
müssen E-Mail-Adresse Gebursdatum gültig sein. Hier siehst Du auch, wie
man eigene Fehlermeldungen einbauen kann, falls die Validierung
fehlschlägt.

Wie das Beispiel zeigt, kann ein einzelnes Feld mehrerer
Validierungsregeln besitzen. Falls die eingebauten Regeln nicht
ausreichen, können eigene definiert werden.

Jetzt, wo Du einen groben Überblick über die Validierung hast, lass uns
lernen, wie Regeln im Model definiert werden. Es gibt hier drei
verschiedene Wege: einfache Arrays, eine Regel pro Feld und mehrere
Regeln pro Feld.

Einfache Regeln
===============

Wie der Name schon sagt, ist dies der einfachste Weg, eine
Validierungsregel zu definieren. Die allgemeine Syntax um auf diese Art
Regeln festzulegen sieht wie folgt aus:

::

    var $validate = array('fieldName' => 'ruleName');

Wobei 'fieldName' der Name des Feldes ist, auf welches die Regel
angewendet werden soll und 'ruleName' der Name einer vordefinierten
Regel wie 'alphaNumeric', 'email' oder 'isUnique'.

Um zum Beispiel sicherzustellen, dass ein Nutzer eine formal korrekte
E-Mail-Adresse angibt, kann man diese Regel verwenden:

::

    var $validate = array('user_email' => 'email');

Eine Regel pro Feld
===================

Diese Definitions-Technik schafft eine bessere Kontrolle über die
Funktionsweise der Validierungsregeln:

::

    var $validate = array(
        'fieldName1' => array(
            'rule' => 'ruleName', // or: array('ruleName', 'param1', 'param2' ...)
            'required' => true,
            'allowEmpty' => false,
            'on' => 'create', // or: 'update'
            'message' => 'Your Error Message'
        )
    );

Wie man hier sehen kann, ist jedes Feld (nur ein Feld im obigen
Beispiel) mit einem *Array* verknüpft, welches fünf Schlüsselwörter
beinhaltet: ‘\ *rule*\ ’, ‘\ *required*\ ’, ‘\ *allowEmpty*\ ’,
‘\ *on*\ ’ und ‘\ *message*\ ’. Alle Schlüsselwörter, ausser
‘\ *rule*\ ’ sind optional. Laß uns all diese Schlüsselwörter näher
Betrachten.

rule
----

Das ‘\ *rule*\ ’ Schlüsselwort definiert die Validierungsmethode und
erwartet einen einzelnen Wert oder ein *Array*. Der angegebene Wert für
‘\ *rule*\ ’ kann der Name einer Methode des Models sein, eine Methode
der Kern-Klasse *Validation*, oder eine *regular expression*. Eine
komplette Liste aller integrierten Regeln ist im nächsten Kapitel
"Mehrere Regeln pro Feld" dargestellt.

Falls die Regel keine Parameter benötigt, kann ‘\ *rule*\ ’ auch ein
einzelner Wert sein. z.B.:

::

    var $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric'
        )
    );

Falls die Regel Parameter erwartet (wie z.B. *max*, *min* oder *range*)
sollte ‘\ *rule*\ ’ als *Array* ausgezeichnet werden:

::

    var $validate = array(
        'password' => array(
            'rule' => array('minLength', 8)
        )
    );

Verigss nicht, das Schlüsselwort ‘\ *rule*\ ’ wird für *Array*-basierte
Regeldefinitionen benötigt.

required
--------

Dieser Schlüssel sollte ein boolscher Wert sein. Falls *‘required’*
*TRUE* ist, muss das Feld im Daten-*Array* existieren. Zum Beispiel wenn
die Validierungsregel wie folgt definiert ist:

::

    var $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric',
            'required' => true
        )
    );

Die Daten die zur *save()* Methode des Models gesendet werden, müssen
das Feld *'login'* enthalten. Wenn das nicht der Fall ist, schlägt die
Validierung fehl. Der Standard-Wert dieses Schlüssels ist der boolsche
Wert *FALSE*.

Ist der *'login'* Schlüssel enthalten, jedoch leer, wird die Validierung
erfolgreich sein. Ist der Schlüssel *‘required’* auf TRUE gesetzt, wird
nur überprüft ob der Feldname existiert.

allowEmpty
----------

Dem Schlüssel ``allowEmpty`` sollte ein boolscher Wert zugewiesen
werden. Falls ``allowEmpty`` "false" ist, müssen jene Daten, die an die
``save()``-Methode des Modells übergeben werden, den Feldnamen und einen
nicht leeren Wert enthalten. Wird "true" gesetzt, bewirkt ein leeres
Feld, dass die Gültigkeitsprüfung ausgelassen wird.

Der Standardwert von ``allowEmpty`` ist "null". Das bedeutet, dass das
Feld immer auf die Gültigkeitsregeln hin überprüft wird und selbst
erstellte Gültigkeitsregeln beachtet werden.

on
--

Der Schlüssel ‘on’ kann auf einen der folgenden Werte gesetzt werden:
‘update’ oder ‘create’ (ins Deutsche würde man ‘on’ mit dem
umgangssprachlichen ‘beim’ übersetzen). Dies erlaubt Dir zu steuern,
dass eine Regel wahlweise bei der Erstellung oder einem Update eines
Datensatzes angewandt werden soll.

Wenn eine Regel ‘on’ => ‘create’ beinhaltet, so wird sie nur angewandt,
wenn ein neuer Datensatz erstellt werden soll. Andersherum, wenn die
Regel ‘on’ => ‘update’ enthält, wird sie nur bei einer Änderung eines
Datensatzes beachtet.

Der Standardwert von ‘on’ ist "null". Wenn ‘on’ "null" ist wird die
entsprechende Regel sowohl bei ‘update’ als auch bei ‘create’ angewandt.

message
-------

Der Schlüssel ‘message’ erlaubt es Dir, eine eigene Fehlermeldung bzw.
Verletzungsmeldung für diese Regel zu bestimmen:

::

    var $validate = array(
        'password' => array(
            'rule' => array('minLength', 8),
            'message' => 'Password must be at least 8 characters long'
        )
    );

last
----

Den ``'last'`` Schlüssel auf ``true`` zu setzen, lässt den Validator im
Fehlerfall stoppen, anstatt mit der nächsten Regel fortzufahren. Dies
ist praktisch, wenn man die Validierung beenden möchte, wenn das Feld
einem `multi-rule Feld </de/view/133/Multiple-Rules-per-Field>`_
notEmpty ist.

::

    var $validate = array(
        'username' => array(
            'usernameRule-1' => array(
                'rule' => 'notEmpty',  
                'message' => 'Please enter a username.',
                'last' => true
             ),
            'usernameRule-2' => array(
                'rule' => array('minLength', 8),  
                'message' => 'Minimum length of 8 characters.'
            )  
        )
    );

Der Defaultwert für ``'last'`` ist ``false``.

Multiple Rules per Field
========================

The technique outlined above gives us much more flexibility than simple
rules assignment, but there’s an extra step we can take in order to gain
more fine-grained control of data validation. The next technique we’ll
outline allows us to assign multiple validation rules per model field.

If you would like to assign multiple validation rules to a single field,
this is basically how it should look:

::

     
    var $validate = array(
        'fieldName' => array(
            'ruleName' => array(
                'rule' => 'ruleName',
                // extra keys like on, required, etc. go here...
            ),
            'ruleName2' => array(
                'rule' => 'ruleName2',
                // extra keys like on, required, etc. go here...
            )
        )
    );

As you can see, this is quite similar to what we did in the previous
section. There, for each field we had only one array of validation
parameters. In this case, each ‘fieldName’ consists of an array of rule
indices. Each ‘ruleName’ contains a separate array of validation
parameters.

This is better explained with a practical example:

::

    var $validate = array(
        'login' => array(
            'loginRule-1' => array(
                'rule' => 'alphaNumeric',  
                'message' => 'Only alphabets and numbers allowed',
                'last' => true
             ),
            'loginRule-2' => array(
                'rule' => array('minLength', 8),  
                'message' => 'Minimum length of 8 characters'
            )  
        )
    );

The above example defines two rules for the login field: loginRule-1 and
loginRule-2. As you can see, each rule is identified with an arbitrary
name.

By default CakePHP tries to validate a field using all the validation
rules declared for it and returns the error message for the last failing
rule. But if the key ``last`` is set to ``true`` for a rule and it
fails, then the error message for that rule is returned and further
rules are not validated. So if you prefer to show the error message for
the first failing rule then set ``'last' => true`` for each rule.

If you plan on using internationalized error messages, you may want to
specify error messages in your view instead:

::

    echo $form->input('login', array(
        'label' => __('Login', true), 
        'error' => array(
                'loginRule-1' => __('Only alphabets and numbers allowed', true),
                'loginRule-2' => __('Minimum length of 8 characters', true)
            )
        )
    );

The field is now fully internationalized, and you are able to remove the
messages from the model. For more information on the \_\_() function,
see `Localization &
Internationalization </de/view/161/Internationalization-Localization>`_

Core Validation Rules
=====================

Die Validierungsklasse in CakePHP enthält viele Validierungsregeln, die
die Validierung von Model-Daten sehr vereinfachen. Es sind viele oft
benutzte Validierungstechniken enthalten, so dass es nicht nötig ist,
eigene Regeln zu schreiben. In diesem Abschnitt findet sich eine
komplette Liste aller Regeln mit einem Verwendungsbeispiel.

alphaNumeric
------------

Der Feldwert darf nur Buchstaben und Zahlen enthalten.

::

    var $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric',
            'message' => 'Benutzernamen dürfen nur Buchstaben und Zahlen enthalten.'
        )
    );

between
-------

Die Länge eines Datenfeldes muss innerhalb der angegebenen Zahlenwerte
liegen. Sowohl Minimum als auch Maximum müssen angegeben werden. Es gilt
dabei <= nicht < .

::

    var $validate = array(
        'password' => array(
            'rule' => array('between', 5, 15),
            'message' => 'Passwörter müssen zwischen 5 und 15 Zeichen lang sein.'
        )
    );

Die Länge der Daten ist "die Anzahl von Bytes in einer
String-Repräsentation der Daten". Beim Arbeiten mit nicht-ASCII-Zeichen
könnte der String also größer sein als die Anzahl der Zeichen.

blank
-----

Diese Regel wird verwendet um sicherzustellen, dass ein Feld leer ist
oder nur White Spaces enthalten sind. White Spaces beinhalten
characters, inklusive Space, Tab, Carriage Return und Newline.

::

    var $validate = array(
        'id' => array(
            'rule' => 'blank',
            'on' => 'create'
        )
    );

boolean
-------

Für das Feld ist nur ein boolescher Wert erlaubt. Gültige Werte sind
true oder false, Zahlen 0 oder 1 oder die Zeichen '0' oder '1'.

::

    var $validate = array(
        'myCheckbox' => array(
            'rule' => array('boolean'),
            'message' => 'Incorrect value for myCheckbox'
        )
    );

cc
--

This rule is used to check whether the data is a valid credit card
number. It takes three parameters: ‘type’, ‘deep’ and ‘regex’.

The ‘type’ key can be assigned to the values of ‘fast’, ‘all’ or any of
the following:

-  amex
-  bankcard
-  diners
-  disc
-  electron
-  enroute
-  jcb
-  maestro
-  mc
-  solo
-  switch
-  visa
-  voyager

If ‘type’ is set to ‘fast’, it validates the data against the major
credit cards’ numbering formats. Setting ‘type’ to ‘all’ will check with
all the credit card types. You can also set ‘type’ to an array of the
types you wish to match.

The ‘deep’ key should be set to a boolean value. If it is set to true,
the validation will check the Luhn algorithm of the credit card
(`https://en.wikipedia.org/wiki/Luhn\_algorithm <https://en.wikipedia.org/wiki/Luhn_algorithm>`_).
It defaults to false.

The ‘regex’ key allows you to supply your own regular expression that
will be used to validate the credit card number.

::

    var $validate = array(
        'ccnumber' => array(
            'rule' => array('cc', array('visa', 'maestro'), false, null),
            'message' => 'The credit card number you supplied was invalid.'
        )
    );

Vergleiche
----------

Vergleiche werden benutzt um numerische Werte miteinander zu
vergleichen. Unterstützt werden "is greater" (größer als), "is less"
(kleiner als), "greater or equal" (größer/gleich), "less or equal"
(kleiner/gleich), "equal to" (gleich) und "not equal" (ungleich). Es
folgen einige Beispiel:

::

    var $validate = array(
        'age' => array(
            'rule' => array('comparison', '>=', 18),
            'message' => 'Man muss mindestens 18 Jahre alt sein, um sich zu qualifizieren.'
        )
    );

    var $validate = array(
        'age' => array(
            'rule' => array('comparison', 'greater or equal', 18),
            'message' => 'Man muss mindestens 18 Jahre alt sein, um sich zu qualifizieren.'
        )
    );

date
----

This rule ensures that data is submitted in valid date formats. A single
parameter (which can be an array) can be passed that will be used to
check the format of the supplied date. The value of the parameter can be
one of the following:

-  ‘dmy’ e.g. 27-12-2006 or 27-12-06 (separators can be a space, period,
   dash, forward slash)
-  ‘mdy’ e.g. 12-27-2006 or 12-27-06 (separators can be a space, period,
   dash, forward slash)
-  ‘ymd’ e.g. 2006-12-27 or 06-12-27 (separators can be a space, period,
   dash, forward slash)
-  ‘dMy’ e.g. 27 December 2006 or 27 Dec 2006
-  ‘Mdy’ e.g. December 27, 2006 or Dec 27, 2006 (comma is optional)
-  ‘My’ e.g. (December 2006 or Dec 2006)
-  ‘my’ e.g. 12/2006 or 12/06 (separators can be a space, period, dash,
   forward slash)

If no keys are supplied, the default key that will be used is ‘ymd’.

::

    var $validate = array(
        'born' => array(
            'rule' => 'date',
            'message' => 'Enter a valid date in YY-MM-DD format.',
            'allowEmpty' => true
        )
    );

While many data stores require a certain date format, you might consider
doing the heavy lifting by accepting a wide-array of date formats and
trying to convert them, rather than forcing users to supply a given
format. The more work you can do for your users, the better.

decimal
-------

Diese Regel stellt sicher, dass die Daten eine gültige Dezimalzahl
darstellen. Ein angegebener Parameter legt die Anzahl der
Nachkommastellen fest. Wenn kein Parameter angegeben ist, werden die
Daten als wissenschaftliche Float-Zahl validiert. Dies führt dazu, dass
die Validierung fehlschlägt, wenn keine Nachkommstellen angegeben
werden.

::

    var $validate = array(
        'price' => array(
            'rule' => array('decimal', 2)
        )
    );

email
-----

Diese Regel überprüft, ob die Daten eine gültige E-Mail-Adresse
darstellen. Wird ein zweiter Parameter vom Typ Boolean als true
übergeben, versucht diese Regel außerdem, den Host der E-Mail-Adresse zu
verifizieren.

::

    var $validate = array('email' => array('rule' => 'email'));
     
    var $validate = array(
        'email' => array(
            'rule' => array('email', true),
            'message' => 'Bitte geben Sie eine gültige E-Mail-Adresse an.'
        )
    );

equalTo
-------

Diese Regel stellt sicher, dass Wert und Typ einem gegeben Wert
entsprechen.

::

    var $validate = array(
        'food' => array(
            'rule' => array('equalTo', 'cake'),  
            'message' => 'Dieser Wert muss der String cake sein.'
        )
    );

extension
---------

Mit dieser Regel kann die Dateiendung (z.B. .jpg oder .png) überprüft
werden. Es ist dabei möglich, mehrere valide Dateiendungen in einem
Array zu definieren.

::

    var $validate = array(
        'image' => array(
            'rule' => array('extension', array('gif', 'jpeg', 'png', 'jpg')),
            'message' => 'Please supply a valid image.'
        )
    );

file
----

Mit dieser Regel wird sichergestellt, dass der Wert ein korrekter
Dateiname ist. Diese Regel ist momentan noch nicht in gebrauch.

ip
--

Diese Regel stellt sicher, dass der Wert eine korrekte IPv4 Adresse ist.

::

    var $validate = array(
        'clientip' => array(
            'rule' => 'ip',
            'message' => 'Please supply a valid IP address.'
        )
    );

isUnique
--------

Der Wert dieses Felder muss einzigartig sein und kann nicht in einer
anderen Zeile verwendet werden.

::

    var $validate = array(
        'login' => array(
            'rule' => 'isUnique',
            'message' => 'This username has already been taken.'
        )
    );

minLength
---------

Der Wert muss eine bestimmte Anzahl Zeichen haben.

::

    var $validate = array(
        'login' => array(
            'rule' => array('minLength', 8),  
            'message' => 'Usernames must be at least 8 characters long.'
        )
    );

Die Länge hier ist die Anzahl Bytes in dem String. Beachte bitte, dass
die Länge daher grösser sein kann als die Anzahl Zeichen, beim Gebrauch
von nicht-ASCII Zeichen.

maxLength
---------

This rule ensures that the data stays within a maximum length
requirement.

::

    var $validate = array(
        'login' => array(
            'rule' => array('maxLength', 15),  
            'message' => 'Usernames must be no larger than 15 characters long.'
        )
    );

The length here is "the number of bytes in the string representation of
the data". Be careful that it may be larger than the number of
characters when handling non-ASCII characters.

money
-----

Diese Regel stellt sicher, dass der Wert eine korrekte Währungszahl ist.

Der zweite Parameter definiert, wo sich das Währungszeichen befindet
(links/rechts).

::

    var $validate = array(
        'salary' => array(
            'rule' => array('money', 'left'),
            'message' => 'Please supply a valid monetary amount.'
        )
    );

multiple
--------

Use this for validating a multiple select input. It supports parameters
"in", "max" and "min".

::

    var $validate = array(
        'multiple' => array(
            'rule' => array('multiple', array('in' => array('do', 'ray', 'me', 'fa', 'so', 'la', 'ti'), 'min' => 1, 'max' => 3)),
            'message' => 'Please select one, two or three options'
        )
    );

inList
------

This rule will ensure that the value is in a given set. It needs an
array of values. The field is valid if the field's value matches one of
the values in the given array.

Example:

::

        var $validate = array(
          'function' => array(
            'allowedChoice' => array(
                'rule' => array('inList', array('Foo', 'Bar')),
                'message' => 'Enter either Foo or Bar.'
            )
          )
        );

numeric
-------

Checks if the data passed is a valid number.

::

    var $validate = array(
        'cars' => array(
            'rule' => 'numeric',  
            'message' => 'Please supply the number of cars.'
        )
    );

notEmpty
--------

The basic rule to ensure that a field is not empty.

::

    var $validate = array(
        'title' => array( 
            'rule' => 'notEmpty',
            'message' => 'This field cannot be left blank'
        )
    );

Do not use this for a multiple select input as it will cause an error.
Instead, use "multiple".

phone
-----

Phone validates US phone numbers. If you want to validate non-US phone
numbers, you can provide a regular expression as the second parameter to
cover additional number formats.

::

    var $validate = array(
        'phone' => array(
            'rule' => array('phone', null, 'us')
        )
    );

postal
------

Postal is used to validate ZIP codes from the U.S. (us), Canada (ca),
U.K (uk), Italy (it), Germany (de) and Belgium (be). For other ZIP code
formats, you may provide a regular expression as the second parameter.

::

    var $validate = array(
        'zipcode' => array(
            'rule' => array('postal', null, 'us')
        )
    );

range
-----

This rule ensures that the value is in a given range. If no range is
supplied, the rule will check to ensure the value is a legal finite on
the current platform.

::

    var $validate = array(
        'number' => array(
            'rule' => array('range', -1, 11),
            'message' => 'Please enter a number between 0 and 10'
        )
    );

The above example will accept any value which is larger than 0 (e.g.,
0.01) and less than 10 (e.g., 9.99). Note: The range lower/upper are not
inclusive!!!

ssn
---

Ssn validates social security numbers from the U.S. (us), Denmark (dk),
and the Netherlands (nl). For other social security number formats, you
may provide a regular expression.

::

    var $validate = array(
        'ssn' => array(
            'rule' => array('ssn', null, 'us')
        )
    );

url
---

This rule checks for valid URL formats. Supports http(s), ftp(s), file,
news, and gopher protocols.

::

    var $validate = array(
        'website' => array(
            'rule' => 'url'
        )
    );

To ensure that a protocol is in the url, strict mode can be enabled like
so.

::

    var $validate = array(
        'website' => array(
            'rule' => array('url', true)
        )
    );

Benutzer Validierung Regeln
===========================

If you haven’t found what you need thus far, you can always create your
own validation rules. There are two ways you can do this: by defining
custom regular expressions, or by creating custom validation methods.

Benutzerdefinierte Validierung mit Regulären Ausdrücken
-------------------------------------------------------

Falls Sie eine Validierungsmethode benötigen, die Sie mit Regulären
Ausdrücken erreichen können/wollen, können Sie auch eigene
benutzerdefinierte Reguläre Ausdrücke als Validierungsregel für die
Daten des zu validierenden Feldes definieren.

::

    var $validate = array(
        'login' => array(
            'rule' => array('custom', '/^[a-z0-9]{3,}$/i'),  
            'message' => 'Nur Buchstaben und Zahlen, mindestens 3 Zeichen'
        )
    );

Das Beispiel hier überprüft, ob die Daten des login Feldes nur
Buchstaben und Zahlen mit einer Mindestlänge von 3 Zeichen enthalten.

Adding your own Validation Methods
----------------------------------

Sometimes checking data with regular expression patterns is not enough.
For example, if you want to ensure that a promotional code can only be
used 25 times, you need to add your own validation function, as shown
below:

::

    <?php
    class User extends AppModel {
        var $name = 'User';
      
        var $validate = array(
            'promotion_code' => array(
                'rule' => array('limitDuplicates', 25),
                'message' => 'This code has been used too many times.'
            )
        );
     
        function limitDuplicates($check, $limit){
            //$check will have value: array('promomotion_code' => 'some-value')
            //$limit will have value: 25
            $existing_promo_count = $this->find( 'count', array('conditions' => $check, 'recursive' => -1) );
            return $existing_promo_count < $limit;
        }
    }
    ?>

The current field to be validated is passed into the function as first
parameter as an associated array with field name as key and posted data
as value.

If you want to pass extra parameters to your validation function, add
elements onto the ‘rule’ array, and handle them as extra params (after
the main ``$check`` param) in your function.

Your validation function can be in the model (as in the example above),
or in a behavior that the model implements. This includes mapped
methods.

Model/behavior methods are checked first, before looking for a method on
the ``Validation`` class. This means that you can override existing
validation methods (such as ``alphaNumeric()``) at an application level
(by adding the method to ``AppModel``), or at model level.

When writing a validation rule which can be used by multiple fields,
take care to extract the field value from the $check array. The $check
array is passed with the form field name as its key and the field value
as its value. The full record being validated is stored in $this->data
member variable.

::

    <?php
    class Post extends AppModel {
      var $name = 'Post';
      
      var $validate = array(
        'slug' => array(
          'rule' => 'alphaNumericDashUnderscore',
          'message' => 'Slug can only be letters, numbers, dash and underscore'
          )
        );
        
        function alphaNumericDashUnderscore($check) {
          // $data array is passed using the form field name as the key
          // have to extract the value to make the function generic
          $value = array_values($check);
          $value = $value[0];
          
          return preg_match('|^[0-9a-zA-Z_-]*$|', $value);
        }
    }
    ?>

Daten im Controller validieren
==============================

Normalerweise werden Daten beim Aufruf der ``save``-Methode des Models
validiert. In einigen Fällen jedoch möchte man Daten validieren, ohne
sie gleichzeitig zu speichern. Zum Beispiel wenn dem Benutzer noch
zusätzliche Informationen anzeigt werden sollen, bevor die Daten in die
Datenbank geschrieben werden. Die Validierung erfordert ein etwas
anderes Vorgehen als beim Speichern:

Zuerst werden die Daten an das Model übergeben:

::

    $this->ModelName->set( $this->data );

Anschließend wird zur Validierung der Daten die ``validates``-Methode
des Models aufgerufen. Die Methode gibt ``true`` zurück, wenn die
Validierung erfolgreich ist oder ``false``, wenn sie fehlschlägt.

::

    if ($this->ModelName->validates()) {
        // die Daten sind valide
    } else {
        // die Daten sind nicht valide
    }

Es könnte sein, dass du nur eine Teilmenge der Validierungsregeln in
deinem Model zur Validierung einsetzen möchtest. Angenommen, du hast ein
User-Model mit Feldern "first\_name", "last\_name", "email" und
"password". Wird ein User hinzugefügt oder bearbeitet, möchtest du alle
vier entsprechenden Regeln validieren. Loggt sich ein User jedoch nur
ein, sollen nur die "email" und "password" Regeln geprüft werden. In dem
Fall kannst du ein Array, welches die zu validierenden Felder angibt,
mit übergeben, für unser Beispiel also:

::

    if ($this->User->validates(array('fieldList' => array('email', 'password')))) {    
    // Gültig
    } else {     
    // Ungültig
    }

Die ``validates``-Methode ruft die ``invalidFields``-Methode auf, welche
die Eigenschaft ``validationErrors`` des Models befüllt. Die
``invalidFields``-Methode gibt die Daten zudem als Rückgabewert aus.

::

    $errors = $this->ModelName->invalidFields(); // enthält das validationErrors-Array

Denke daran, dass Du die Daten über die ``set``-Methode an das Model
übergeben musst, bevor sie validiert werden können. Dies ist ein
Unterschied zum Speichern über die ``save``-Methode, bei der Du die
Daten als Parameter übergeben kannst. Es ist jedoch nicht notwendig, die
``validates``-Methode vor jedem ``save`` aufzurufen, da die Daten beim
Speichern automatisch validiert werden.

Um mehrere Models in einem Schritt zu validieren, solltest Du
folgendermaßen vorgehen:

::

    if ($this->ModelName->saveAll($this->data, array('validate' => 'only'))) {
      // die Daten sind valide
    } else {
      // die Daten sind nicht valide
    }

