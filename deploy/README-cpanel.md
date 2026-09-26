# Deploying on shared cPanel (no terminal needed)

## 1. PHP
MultiPHP Manager: set the domain to PHP 8.3 or newer.
Select PHP Extensions: enable pdo_mysql, mbstring, openssl, fileinfo, tokenizer, ctype, bcmath, gd.

## 2. Upload
File Manager: create `/home/USER/10mschool` (outside public_html), upload `10mschool-deploy.zip`
there and extract it.

## 3. Database
MySQL Databases: create a database and a user, grant the user ALL PRIVILEGES.

## 4. .env
In `/home/USER/10mschool`, copy `.env.example` to `.env` and edit:

    APP_ENV=production
    APP_DEBUG=false
    APP_URL=https://yourdomain.com
    APP_KEY=                     (leave empty, the installer fills it)
    SETUP_TOKEN=<long random text, e.g. 40 letters and digits>
    DB_CONNECTION=mysql
    DB_HOST=localhost
    DB_DATABASE=cpaneluser_10mschool
    DB_USERNAME=cpaneluser_dbuser
    DB_PASSWORD=<database password>
    CACHE_STORE=file
    QUEUE_CONNECTION=sync
    SESSION_DRIVER=database

## 5. Point the domain at the app
Option A (preferred): Domains -> your domain -> Document Root = `/home/USER/10mschool/public`.

Option B (if the document root cannot be changed): copy everything inside
`/home/USER/10mschool/public` into `public_html`, then replace `public_html/index.php`
with `deploy/public_html-index.php` (check the `$appDir` line inside it).

## 6. Run the installer once
Open `https://yourdomain.com/setup/<your SETUP_TOKEN>` in a browser. It generates the
app key, creates the tables, seeds the catalog and the admin user, and prints DONE.

Then edit `.env` again and DELETE the `SETUP_TOKEN` line.

## 7. Permissions
File Manager: `storage` and `bootstrap/cache` (and `public/uploads`, or `public_html/uploads`
for option B) must be writable: 755 on folders, 644 on files, or 775 if the host asks.

## 8. Sign in and change the password
`https://yourdomain.com/login` with admin@10mschool.test / password, then open
"পাসওয়ার্ড" in the admin menu and set a new password. Also replace every course's
affiliate link with your own link from affiliation.10minuteschool.com.

## 9. HTTPS
SSL/TLS Status -> Run AutoSSL. Keep `APP_URL` on https.

## Updating later
Re-upload the changed files (or the new zip) over the old ones. If JavaScript changed, the
new `public/build` folder must be uploaded too (built locally with `npm run build`).
Uploaded images live in `public/uploads`; keep that folder when replacing files.
