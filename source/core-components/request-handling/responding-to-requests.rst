5.5.4 Responding To Requests
----------------------------

In addition to request detection RequestHandler also provides easy
access to altering the output and content type mappings for your
application.

setContent($name, $type = null)

-  $name string - The name or file extension of the Content-type
   ie. html, css, json, xml.
-  $type mixed - The mime-type(s) that the Content-type maps to.

setContent adds/sets the Content-types for the given name. Allows
content-types to be mapped to friendly aliases and or extensions.
This allows RequestHandler to automatically respond to requests of
each type in its startup method. If you are using
Router::parseExtension, you should use the file extension as the
name of the Content-type. Furthermore, these content types are used
by prefers() and accepts().

setContent is best used in the beforeFilter() of your controllers,
as this will best leverage the automagicness of content-type
aliases.

The default mappings are:


-  **javascript** text/javascript
-  **js** text/javascript
-  **json** application/json
-  **css** text/css
-  **html** text/html, \*/\*
-  **text** text/plain
-  **txt** text/plain
-  **csv** application/vnd.ms-excel, text/plain
-  **form** application/x-www-form-urlencoded
-  **file** multipart/form-data
-  **xhtml** application/xhtml+xml, application/xhtml, text/xhtml
-  **xhtml-mobile** application/vnd.wap.xhtml+xml
-  **xml** application/xml, text/xml
-  **rss** application/rss+xml
-  **atom** application/atom+xml
-  **amf** application/x-amf
-  **wap** text/vnd.wap.wml, text/vnd.wap.wmlscript,
   image/vnd.wap.wbmp
-  **wml** text/vnd.wap.wml
-  **wmlscript** text/vnd.wap.wmlscript
-  **wbmp** image/vnd.wap.wbmp
-  **pdf** application/pdf
-  **zip** application/x-zip
-  **tar** application/x-tar

prefers($type = null)
Determines which content-types the client prefers. If no parameter
is given the most likely content type is returned. If $type is an
array the first type the client accepts will be returned.
Preference is determined primarily by the file extension parsed by
Router if one has been provided, and secondly by the list of
content-types in HTTP\_ACCEPT.

renderAs($controller, $type)

-  $controller - Controller Reference
-  $type - friendly content type name to render content for ex.
   xml, rss.

Change the render mode of a controller to the specified type. Will
also append the appropriate helper to the controller's helper array
if available and not already in the array.

respondAs($type, $options)

-  $type - Friendly content type name ex. xml, rss or a full
   content type like application/x-shockwave
-  $options - If $type is a friendly type name that has more than
   one content association, $index is used to select the content
   type.

Sets the response header based on content-type map names. If DEBUG
is greater than 1, the header is not set.

responseType()
Returns the current response type Content-type header or null if
one has yet to be set.

mapType($ctype)
Maps a content-type back to an alias
