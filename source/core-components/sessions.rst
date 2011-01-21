5.7 Sessions
------------

The CakePHP session component provides a way to persist client data
between page requests. It acts as a wrapper for the $\_SESSION as
well as providing convenience methods for several $\_SESSION
related functions.

Sessions can be persisted in a few different ways. The default is
to use the settings provided by PHP; however, other options exist.

cake
    Saves the session files in your app's tmp/sessions directory.
database
    Uses CakePHP's database sessions.
cache
    Use the caching engine configured by Cache::config(). Very useful
    in conjunction with Memcache (in setups with multiple application
    servers) to store both cached data and sessions.
php
    The default setting. Saves session files as indicated by php.ini

To change the default Session handling method alter the
Session.save Configuration to reflect the option you desire. If you
choose 'database' you should also uncomment the Session.database
settings and run the database session SQL file located in
app/config

To provide a custom configuration, set Session.save Configuration
to a filename. CakePHP will use your file in the CONFIGS directory
for the settings.

::

    // app/config/core.php
    Configure::write('Session.save','my_session');


#. ``// app/config/core.php``
#. ``Configure::write('Session.save','my_session');``

This will allow you to customize the session handling.

::

    // app/config/my_session.php
    //
    // Revert value and get rid of the referrer check even when,
    // Security.level is medium
    ini_restore('session.referer_check');
    
    ini_set('session.use_trans_sid', 0);
    ini_set('session.name', Configure::read('Session.cookie'));
    
    // Cookie is now destroyed when browser is closed, doesn't 
    // persist for days as it does by default for security
    // low and medium
    ini_set('session.cookie_lifetime', 0);
    
    // Cookie path is now '/' even if you app is within a sub 
    // directory on the domain
    $this->path = '/';
    ini_set('session.cookie_path', $this->path);
    
    // Session cookie now persists across all subdomains
    ini_set('session.cookie_domain', env('HTTP_BASE'));


#. ``// app/config/my_session.php``
#. ``//``
#. ``// Revert value and get rid of the referrer check even when,``
#. ``// Security.level is medium``
#. ``ini_restore('session.referer_check');``
#. ``ini_set('session.use_trans_sid', 0);``
#. ``ini_set('session.name', Configure::read('Session.cookie'));``
#. ``// Cookie is now destroyed when browser is closed, doesn't``
#. ``// persist for days as it does by default for security``
#. ``// low and medium``
#. ``ini_set('session.cookie_lifetime', 0);``
#. ``// Cookie path is now '/' even if you app is within a sub``
#. ``// directory on the domain``
#. ``$this->path = '/';``
#. ``ini_set('session.cookie_path', $this->path);``
#. ``// Session cookie now persists across all subdomains``
#. ``ini_set('session.cookie_domain', env('HTTP_BASE'));``

5.7 Sessions
------------

The CakePHP session component provides a way to persist client data
between page requests. It acts as a wrapper for the $\_SESSION as
well as providing convenience methods for several $\_SESSION
related functions.

Sessions can be persisted in a few different ways. The default is
to use the settings provided by PHP; however, other options exist.

cake
    Saves the session files in your app's tmp/sessions directory.
database
    Uses CakePHP's database sessions.
cache
    Use the caching engine configured by Cache::config(). Very useful
    in conjunction with Memcache (in setups with multiple application
    servers) to store both cached data and sessions.
php
    The default setting. Saves session files as indicated by php.ini

To change the default Session handling method alter the
Session.save Configuration to reflect the option you desire. If you
choose 'database' you should also uncomment the Session.database
settings and run the database session SQL file located in
app/config

To provide a custom configuration, set Session.save Configuration
to a filename. CakePHP will use your file in the CONFIGS directory
for the settings.

::

    // app/config/core.php
    Configure::write('Session.save','my_session');


#. ``// app/config/core.php``
#. ``Configure::write('Session.save','my_session');``

This will allow you to customize the session handling.

::

    // app/config/my_session.php
    //
    // Revert value and get rid of the referrer check even when,
    // Security.level is medium
    ini_restore('session.referer_check');
    
    ini_set('session.use_trans_sid', 0);
    ini_set('session.name', Configure::read('Session.cookie'));
    
    // Cookie is now destroyed when browser is closed, doesn't 
    // persist for days as it does by default for security
    // low and medium
    ini_set('session.cookie_lifetime', 0);
    
    // Cookie path is now '/' even if you app is within a sub 
    // directory on the domain
    $this->path = '/';
    ini_set('session.cookie_path', $this->path);
    
    // Session cookie now persists across all subdomains
    ini_set('session.cookie_domain', env('HTTP_BASE'));


#. ``// app/config/my_session.php``
#. ``//``
#. ``// Revert value and get rid of the referrer check even when,``
#. ``// Security.level is medium``
#. ``ini_restore('session.referer_check');``
#. ``ini_set('session.use_trans_sid', 0);``
#. ``ini_set('session.name', Configure::read('Session.cookie'));``
#. ``// Cookie is now destroyed when browser is closed, doesn't``
#. ``// persist for days as it does by default for security``
#. ``// low and medium``
#. ``ini_set('session.cookie_lifetime', 0);``
#. ``// Cookie path is now '/' even if you app is within a sub``
#. ``// directory on the domain``
#. ``$this->path = '/';``
#. ``ini_set('session.cookie_path', $this->path);``
#. ``// Session cookie now persists across all subdomains``
#. ``ini_set('session.cookie_domain', env('HTTP_BASE'));``
