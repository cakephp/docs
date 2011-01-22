3.3.5 Pretty URLs and Lighttpd
------------------------------

While lighttpd features a rewrite module, it is not an equivalent
of Apache's mod\_rewrite. To get 'pretty URLs' while using Lighty,
you have two options. Option one is using mod\_rewrite, the second
one is by using a LUA script and mod\_magnet.

**Using mod\_rewrite**
The easiest way to get pretty URLs is by adding this script to your
lighty config. Just edit the URL, and you should be okay. Please
note that this doesn't work on Cake installations in
subdirectories.

::

    $HTTP["host"] =~ "^(www\.)?example.com$" {
            url.rewrite-once = (
                    # if the request is for css|files etc, do not pass on to Cake
                    "/(css|files|img|js)/(.*)" => "/$1/$2",
                    "^([^\?]*)(\?(.+))?$" => "/index.php?url=$1&$3",
            )
            evhost.path-pattern = "/home/%2-%1/www/www/%4/app/webroot/"
    }

**Using mod\_magnet**
To use pretty URLs with CakePHP and Lighttpd, place this lua script
in /etc/lighttpd/cake.

::

    -- little helper function
    function file_exists(path)
      local attr = lighty.stat(path)
      if (attr) then
          return true
      else
          return false
      end
    end
    function removePrefix(str, prefix)
      return str:sub(1,#prefix+1) == prefix.."/" and str:sub(#prefix+2)
    end
    
    -- prefix without the trailing slash
    local prefix = ''
    
    -- the magic ;)
    if (not file_exists(lighty.env["physical.path"])) then
        -- file still missing. pass it to the fastcgi backend
        request_uri = removePrefix(lighty.env["uri.path"], prefix)
        if request_uri then
          lighty.env["uri.path"]          = prefix .. "/index.php"
          local uriquery = lighty.env["uri.query"] or ""
          lighty.env["uri.query"] = uriquery .. (uriquery ~= "" and "&" or "") .. "url=" .. request_uri
          lighty.env["physical.rel-path"] = lighty.env["uri.path"]
          lighty.env["request.orig-uri"]  = lighty.env["request.uri"]
          lighty.env["physical.path"]     = lighty.env["physical.doc-root"] .. lighty.env["physical.rel-path"]
        end
    end
    -- fallthrough will put it back into the lighty request loop
    -- that means we get the 304 handling for free. ;)

If you run your CakePHP installation from a subdirectory, you must
set prefix = 'subdirectory\_name' in the above script.

Then tell Lighttpd about your vhost:

::

    $HTTP["host"] =~ "example.com" {
            server.error-handler-404  = "/index.php"
    
            magnet.attract-physical-path-to = ( "/etc/lighttpd/cake.lua" )
    
            server.document-root = "/var/www/cake-1.2/app/webroot/"
    
            # Think about getting vim tmp files out of the way too
            url.access-deny = (
                    "~", ".inc", ".sh", "sql", ".sql", ".tpl.php",
                    ".xtmpl", "Entries", "Repository", "Root",
                    ".ctp", "empty"
            )
    }
