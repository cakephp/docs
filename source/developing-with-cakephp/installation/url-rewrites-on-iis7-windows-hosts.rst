3.3.7 URL Rewrites on IIS7 (Windows hosts)
------------------------------------------

IIS7 does not natively support .htaccess files. While there are
add-ons that can add this support, you can also import htaccess
rules into IIS to use CakePHP's native rewrites. To do this, follow
these steps:


#. Use Microsoft's Web Platform Installer to install the URL
   Rewrite Module 2.0.
#. Create a new file in your CakePHP folder, called web.config
#. Using Notepad or another XML-safe editor, copy the following
   code into your new web.config file...

::

    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                <rule name="Imported Rule 1" stopProcessing="true">
                <match url="^(.*)$" ignoreCase="false" />
                <conditions logicalGrouping="MatchAll">
                            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                </conditions>
    
                <action type="Rewrite" url="index.php?url={R:1}" appendQueryString="true" />
    
                </rule>
    
                <rule name="Imported Rule 2" stopProcessing="true">
                  <match url="^$" ignoreCase="false" />
                  <action type="Rewrite" url="/" />
                </rule>
                <rule name="Imported Rule 3" stopProcessing="true">
                  <match url="(.*)" ignoreCase="false" />
                  <action type="Rewrite" url="/{R:1}" />
                </rule>
                <rule name="Imported Rule 4" stopProcessing="true">
                  <match url="^(.*)$" ignoreCase="false" />
                  <conditions logicalGrouping="MatchAll">
                            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                  </conditions>
                  <action type="Rewrite" url="index.php?url={R:1}" appendQueryString="true" />
                </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>


#. ``<?xml version="1.0" encoding="UTF-8"?>``
#. ``<configuration>``
#. ``<system.webServer>``
#. ``<rewrite>``
#. ``<rules>``
#. ``<rule name="Imported Rule 1" stopProcessing="true">``
#. ``<match url="^(.*)$" ignoreCase="false" />``
#. ``<conditions logicalGrouping="MatchAll">``
#. ``<add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />``
#. ``<add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />``
#. ``</conditions>``
#. ``<action type="Rewrite" url="index.php?url={R:1}" appendQueryString="true" />``
#. ``</rule>``
#. ``<rule name="Imported Rule 2" stopProcessing="true">``
#. ``<match url="^$" ignoreCase="false" />``
#. ``<action type="Rewrite" url="/" />``
#. ``</rule>``
#. ``<rule name="Imported Rule 3" stopProcessing="true">``
#. ``<match url="(.*)" ignoreCase="false" />``
#. ``<action type="Rewrite" url="/{R:1}" />``
#. ``</rule>``
#. ``<rule name="Imported Rule 4" stopProcessing="true">``
#. ``<match url="^(.*)$" ignoreCase="false" />``
#. ``<conditions logicalGrouping="MatchAll">``
#. ``<add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />``
#. ``<add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />``
#. ``</conditions>``
#. ``<action type="Rewrite" url="index.php?url={R:1}" appendQueryString="true" />``
#. ``</rule>``
#. ``</rules>``
#. ``</rewrite>``
#. ``</system.webServer>``
#. ``</configuration>``

It is also possible to use the Import functionality in IIS's URL
Rewrite module to import rules directly from CakePHP's .htaccess
files in root, /app/, and /app/webroot/ - although some editing
within IIS may be necessary to get these to work. When Importing
the rules this way, IIS will automatically create your web.config
file for you.

Once the web.config file is created with the correct IIS-friendly
rewrite rules, CakePHP's links, css, js, and rerouting should work
correctly.

3.3.7 URL Rewrites on IIS7 (Windows hosts)
------------------------------------------

IIS7 does not natively support .htaccess files. While there are
add-ons that can add this support, you can also import htaccess
rules into IIS to use CakePHP's native rewrites. To do this, follow
these steps:


#. Use Microsoft's Web Platform Installer to install the URL
   Rewrite Module 2.0.
#. Create a new file in your CakePHP folder, called web.config
#. Using Notepad or another XML-safe editor, copy the following
   code into your new web.config file...

::

    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                <rule name="Imported Rule 1" stopProcessing="true">
                <match url="^(.*)$" ignoreCase="false" />
                <conditions logicalGrouping="MatchAll">
                            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                </conditions>
    
                <action type="Rewrite" url="index.php?url={R:1}" appendQueryString="true" />
    
                </rule>
    
                <rule name="Imported Rule 2" stopProcessing="true">
                  <match url="^$" ignoreCase="false" />
                  <action type="Rewrite" url="/" />
                </rule>
                <rule name="Imported Rule 3" stopProcessing="true">
                  <match url="(.*)" ignoreCase="false" />
                  <action type="Rewrite" url="/{R:1}" />
                </rule>
                <rule name="Imported Rule 4" stopProcessing="true">
                  <match url="^(.*)$" ignoreCase="false" />
                  <conditions logicalGrouping="MatchAll">
                            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                  </conditions>
                  <action type="Rewrite" url="index.php?url={R:1}" appendQueryString="true" />
                </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>


#. ``<?xml version="1.0" encoding="UTF-8"?>``
#. ``<configuration>``
#. ``<system.webServer>``
#. ``<rewrite>``
#. ``<rules>``
#. ``<rule name="Imported Rule 1" stopProcessing="true">``
#. ``<match url="^(.*)$" ignoreCase="false" />``
#. ``<conditions logicalGrouping="MatchAll">``
#. ``<add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />``
#. ``<add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />``
#. ``</conditions>``
#. ``<action type="Rewrite" url="index.php?url={R:1}" appendQueryString="true" />``
#. ``</rule>``
#. ``<rule name="Imported Rule 2" stopProcessing="true">``
#. ``<match url="^$" ignoreCase="false" />``
#. ``<action type="Rewrite" url="/" />``
#. ``</rule>``
#. ``<rule name="Imported Rule 3" stopProcessing="true">``
#. ``<match url="(.*)" ignoreCase="false" />``
#. ``<action type="Rewrite" url="/{R:1}" />``
#. ``</rule>``
#. ``<rule name="Imported Rule 4" stopProcessing="true">``
#. ``<match url="^(.*)$" ignoreCase="false" />``
#. ``<conditions logicalGrouping="MatchAll">``
#. ``<add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />``
#. ``<add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />``
#. ``</conditions>``
#. ``<action type="Rewrite" url="index.php?url={R:1}" appendQueryString="true" />``
#. ``</rule>``
#. ``</rules>``
#. ``</rewrite>``
#. ``</system.webServer>``
#. ``</configuration>``

It is also possible to use the Import functionality in IIS's URL
Rewrite module to import rules directly from CakePHP's .htaccess
files in root, /app/, and /app/webroot/ - although some editing
within IIS may be necessary to get these to work. When Importing
the rules this way, IIS will automatically create your web.config
file for you.

Once the web.config file is created with the correct IIS-friendly
rewrite rules, CakePHP's links, css, js, and rerouting should work
correctly.
