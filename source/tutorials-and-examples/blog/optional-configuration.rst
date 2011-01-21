11.1.4 Optional Configuration
-----------------------------

There are three other items that can be configured. Most developers
complete these laundry-list items, but they're not required for
this tutorial. One is defining a custom string (or "salt") for use
in security hashes. The second is defining a custom number (or
"seed") for use in encryption. The third item is allowing CakePHP
write access to its ``tmp`` folder.

The security salt is used for generating hashes. Change the default
salt value by editing ``/app/config/core.php`` line 203. It doesn't
much matter what the new value is, as long as it's not easily
guessed.

::

    <?php
    /**
     * A random string used in security hashing methods.
     */
    Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');
    ?>

The cipher seed is used for encrypt/decrypt strings. Change the
default seed value by editing ``/app/config/core.php`` line 208. It
doesn't much matter what the new value is, as long as it's not
easily guessed.

::

    <?php
    /**
     * A random numeric string (digits only) used to encrypt/decrypt strings.
     */
    Configure::write('Security.cipherSeed', '7485712659625147843639846751');
    ?>

The final task is to make the ``app/tmp`` directory web-writable.
The best way to do this is to find out what user your webserver
runs as (``<?php echo `whoami`; ?>``) and change the ownership of
the ``app/tmp`` directory to that user. The final command you run
(in \*nix) might look something like this.

::

    $ chown -R www-data app/tmp

If for some reason CakePHP can't write to that directory, you'll be
informed by a warning while not in production mode.

11.1.4 Optional Configuration
-----------------------------

There are three other items that can be configured. Most developers
complete these laundry-list items, but they're not required for
this tutorial. One is defining a custom string (or "salt") for use
in security hashes. The second is defining a custom number (or
"seed") for use in encryption. The third item is allowing CakePHP
write access to its ``tmp`` folder.

The security salt is used for generating hashes. Change the default
salt value by editing ``/app/config/core.php`` line 203. It doesn't
much matter what the new value is, as long as it's not easily
guessed.

::

    <?php
    /**
     * A random string used in security hashing methods.
     */
    Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');
    ?>

The cipher seed is used for encrypt/decrypt strings. Change the
default seed value by editing ``/app/config/core.php`` line 208. It
doesn't much matter what the new value is, as long as it's not
easily guessed.

::

    <?php
    /**
     * A random numeric string (digits only) used to encrypt/decrypt strings.
     */
    Configure::write('Security.cipherSeed', '7485712659625147843639846751');
    ?>

The final task is to make the ``app/tmp`` directory web-writable.
The best way to do this is to find out what user your webserver
runs as (``<?php echo `whoami`; ?>``) and change the ownership of
the ``app/tmp`` directory to that user. The final command you run
(in \*nix) might look something like this.

::

    $ chown -R www-data app/tmp

If for some reason CakePHP can't write to that directory, you'll be
informed by a warning while not in production mode.
