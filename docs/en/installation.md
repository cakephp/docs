---
title: Installation Guide
description: "CakePHP is designed to be easy to install and configure. This guide will walk you through getting CakePHP up and running in just a few minutes."
---

# Installation

CakePHP is designed to be easy to install and configure. This guide will walk you through getting CakePHP up and running in just a few minutes.

## System Requirements

::: tip Quick Check
Verify your PHP version meets the requirements:

```bash
php -v
```

:::

**Minimum Requirements:**

| Component  | Version |
| ---------- | ------- |
| PHP        | |minphpversion| (|phpversion| supported) |
| Extensions | `mbstring`, `intl`, `pdo`, `simplexml` |
| Composer   | Latest stable |

**Supported Databases:**

- MySQL 5.7+
- MariaDB 10.1+
- PostgreSQL 9.6+
- Microsoft SQL Server 2012+
- SQLite 3.8.9+

::: warning Web Server Requirements
Your web server's PHP version must match your CLI PHP version (|minphpversion|+). All database drivers require the appropriate PDO extension.
:::

## Installation Methods

Choose the method that best fits your workflow:

### Method 1: Using Composer

The standard way to install CakePHP:

::: code-group

```bash [Install Composer]
# Linux/macOS
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Verify installation
composer --version
```

```powershell [Windows]
# Download and run the Windows installer
# https://getcomposer.org/Composer-Setup.exe

# Verify installation
composer --version
```

:::

Now you can create a new CakePHP project:

```bash [Create Project]
# Create a new CakePHP 5 application
composer create-project --prefer-dist cakephp/app:~|cakeversion| my_app_name

# Navigate to your app
cd my_app_name

# Start development server
bin/cake server

# Or if you have frankenphp available
bin/cake server --frankenphp
```

::: tip Version Constraints
Your `composer.json` version constraint controls updates:

- `"cakephp/cakephp": "|cakeversion|.*"` - Patch releases only (recommended)
- `"cakephp/cakephp": "^|cakeversion|"` - Minor + patch releases (may require config changes)
:::

### Method 2: Using DDEV + Composer

Perfect for local development environments:

::: code-group

```bash [New Project]
# Create and configure project
mkdir my-cakephp-app && cd my-cakephp-app
ddev config --project-type=cakephp --docroot=webroot
ddev composer create --prefer-dist cakephp/app:~|cakeversion|

# Launch in browser
ddev launch
```

```bash [Existing Project]
# Clone your repository
git clone <your-cakephp-repo>
cd <your-cakephp-project>

# Configure DDEV
ddev config --project-type=cakephp --docroot=webroot
ddev composer install

# Launch in browser
ddev launch
```

:::

::: info Learn More
Check [DDEV Documentation](https://ddev.readthedocs.io/) for installation and advanced configuration.
:::

### Method 3: Docker

For containerized development:

```bash
# Create project using Composer in Docker
docker run --rm -v $(pwd):/app composer create-project \
  --prefer-dist cakephp/app:~|cakeversion| my_app

# Start PHP development server (install required extensions first)
cd my_app
docker run -it --rm -p 8765:8765 -v $(pwd):/app \
  -w /app php:8.2-cli bash -c "apt-get update && apt-get install -y libicu-dev && docker-php-ext-install intl mbstring && php bin/cake server -H 0.0.0.0"
```

::: warning Development Only
The built-in server is for development only. Never use it in production environments.
:::

## File Permissions

CakePHP uses the **tmp** and **logs** directories for various operations like caching, sessions, and logging.

::: warning Permission Setup Required
Ensure **logs** and **tmp** (including all subdirectories) are writable by your web server user.
:::

### Quick Setup (Unix/Linux/macOS)

If your web server and CLI users differ, set permissions for the directories:

::: code-group

```bash [Linux with ACL]
# Auto-detect web server user and set permissions using ACL
HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
setfacl -R -m u:${HTTPDUSER}:rwx tmp logs
setfacl -R -d -m u:${HTTPDUSER}:rwx tmp logs
```

```bash [macOS / Without ACL]
# Auto-detect web server user and set permissions using chmod
HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
sudo chown -R $(whoami):${HTTPDUSER} tmp logs
sudo chmod -R 775 tmp logs
```

```bash [Simple Alternative]
# If auto-detection doesn't work, use broader permissions
chmod -R 777 tmp logs
```

:::

::: warning macOS Note
macOS does not include `setfacl` by default. Use the chmod method or install ACL tools via Homebrew: `brew install acl`
:::

### Make Console Executable

::: code-group

```bash [Unix/Linux/macOS]
chmod +x bin/cake
```

```bash [Windows]
# .bat file is already executable
# For WSL or shared directories, ensure execute permissions are shared
```

```bash [Alternative]
# If you cannot change permissions
php bin/cake.php
```

:::

## Development Server

The fastest way to get started. CakePHP includes a development server built on PHP's built-in web server:

::: code-group

```bash [Default]
# Starts at http://localhost:8765
bin/cake server
```

```bash [Custom Host/Port]
# Useful for network access or port conflicts
bin/cake server -H 192.168.1.100 -p 5000
```

```bash [Network Access]
# Allow access from other devices on your network
bin/cake server -H 0.0.0.0
```

:::

::: tip Success!
Visit **<http://localhost:8765>** and you should see the CakePHP welcome page with green checkmarks.
:::

::: danger Production Warning
**Never** use the development server in production. It's designed only for local development and lacks security hardening, performance optimizations, and proper process management.
:::

## Production Deployment

For production environments, configure your web server to serve from the **webroot** directory.

### Directory Structure

After installation, your structure should look like this:

```text
my_app/
├── bin/
├── config/
├── logs/
├── plugins/
├── src/
├── templates/
├── tests/
├── tmp/
├── vendor/
├── webroot/          # ← Web server document root
│   ├── css/
│   ├── img/
│   ├── js/
│   ├── .htaccess
│   └── index.php
├── .gitignore
├── .htaccess
├── composer.json
└── README.md
```

::: tip Configuration Required
Point your web server's DocumentRoot to `/path/to/my_app/webroot/`
:::

## Web Server Configuration

::: info Configuration Examples
The following examples are illustrative starting points. You should fine-tune these configurations to match your application's specific requirements, security policies, and performance needs.
:::

Choose your web server and follow the appropriate configuration:

### Apache

Apache works out of the box with CakePHP's included `.htaccess` files.

::: code-group

```apache [Virtual Host]
<VirtualHost *:80>
    ServerName myapp.local
    DocumentRoot /var/www/myapp/webroot

    <Directory /var/www/myapp/webroot>
        Options FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/myapp_error.log
    CustomLog ${APACHE_LOG_DIR}/myapp_access.log combined
</VirtualHost>
```

```apache [Enable mod_rewrite]
# Ensure mod_rewrite is enabled
LoadModule rewrite_module modules/mod_rewrite.so

# Verify with:
apache2ctl -M | grep rewrite
```

```apache [Subdirectory Install]
# If installing in a subdirectory like /~username/myapp/
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /~username/myapp
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

:::

::: details Troubleshooting Apache
**If rewrites aren't working:**

1. Verify `AllowOverride All` is set in your DocumentRoot directive
2. Check that `.htaccess` files exist in root and webroot directories
3. Ensure `mod_rewrite` is loaded
4. Restart Apache after configuration changes

**Performance optimization:**

```apache
# Add to webroot/.htaccess to prevent CakePHP from handling static assets
RewriteCond %{REQUEST_URI} !^/(webroot/)?(img|css|js)/(.*)$
```

:::

### nginx

nginx requires manual rewrite configuration:

```nginx
server {
    listen 80;
    server_name myapp.local;

    root /var/www/myapp/webroot;
    index index.php;

    access_log /var/log/nginx/myapp_access.log;
    error_log /var/log/nginx/myapp_error.log;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        try_files $uri =404;
        include fastcgi_params;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_intercept_errors on;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

::: warning PHP-FPM Socket
Modern PHP-FPM uses Unix sockets instead of TCP. Update `fastcgi_pass` to match your setup:

- Unix socket: `unix:/var/run/php/php8.2-fpm.sock`
- TCP: `127.0.0.1:9000`
:::

### Caddy / FrankenPHP

Modern web server with automatic HTTPS. FrankenPHP extends Caddy with a built-in PHP runtime:

::: code-group

```text [Caddy + PHP-FPM]
myapp.local {
    root * /var/www/myapp/webroot
    php_fastcgi unix//var/run/php/php8.2-fpm.sock
    encode gzip
    file_server

    try_files {path} {path}/ /index.php?{query}
}
```

```dockerfile [FrankenPHP Docker]
# Dockerfile in your project root
FROM dunglas/frankenphp

# Copy your CakePHP application
COPY . /app

# FrankenPHP defaults to /app/public as document root.
# CakePHP uses webroot/ instead, so override it:
ENV SERVER_ROOT=/app/webroot

# Install dependencies (composer.json lives in /app)
RUN composer install --no-dev --optimize-autoloader

# Build and run:
# docker build -t myapp .
# docker run -p 80:80 -p 443:443 myapp
```

```bash [FrankenPHP Binary]
# Download FrankenPHP
curl -L https://github.com/dunglas/frankenphp/releases/latest/download/frankenphp-linux-x86_64 -o frankenphp
chmod +x frankenphp

# Run with your CakePHP app
./frankenphp php-server --root /var/www/myapp/webroot
```

```text [FrankenPHP Caddyfile]
# Caddyfile in your project root
{
    frankenphp
}

myapp.local {
    root * /var/www/myapp/webroot
    php_server
    encode zstd gzip
    file_server
}
```

:::

::: tip Local Development
For local development, you can use the built-in CakePHP development server with FrankenPHP support:

```bash
bin/cake server --frankenphp
```

This requires the `frankenphp` binary to be available in your `PATH`.
:::

::: info Why FrankenPHP?
FrankenPHP combines PHP with Caddy, providing automatic HTTPS, HTTP/3, and modern compression without needing PHP-FPM. Particularly efficient for containerized deployments.
:::

### IIS (Windows)

1. Install [URL Rewrite Module 2.0](https://www.iis.net/downloads/microsoft/url-rewrite)
2. Create `web.config` in your application root:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="Exclude webroot" stopProcessing="true">
                    <match url="^webroot/(.*)$" ignoreCase="false" />
                    <action type="None" />
                </rule>
                <rule name="Rewrite assets" stopProcessing="true">
                    <match url="^(font|img|css|files|js|favicon.ico)(.*)$" />
                    <action type="Rewrite" url="webroot/{R:1}{R:2}" />
                </rule>
                <rule name="Rewrite to index.php" stopProcessing="true">
                    <match url="^(.*)$" ignoreCase="false" />
                    <action type="Rewrite" url="index.php" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
```

## Without URL Rewriting

If you cannot enable URL rewriting, you can use CakePHP's built-in non-rewritten `index.php` URLs.

In **config/app.php**, uncomment:

```php
'App' => [
    // ...
    'baseUrl' => env('SCRIPT_NAME'),
]
```

Remove these `.htaccess` files:

- `/.htaccess`
- `/webroot/.htaccess`

Your URLs will include `index.php`:

- **With rewriting:** `https://myapp.com/articles/view/1`
- **Without rewriting:** `https://myapp.com/index.php/articles/view/1`

## Next Steps

Your CakePHP installation is complete! Here's what to do next:

::: tip Ready to Build?
Follow the [Quick Start Guide](quickstart) to create your first CakePHP application in minutes.
:::

**Learn More:**

- [Configuration](development/configuration) - Customize your application
- [Database Setup](orm/database-basics) - Connect to your database
- [Tutorials](tutorials-and-examples) - Step-by-step guides
