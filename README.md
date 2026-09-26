# 10 Minute School Affiliation

An affiliate storefront for [10 Minute School](https://10minuteschool.com) courses. Visitors browse
academic batches (Class 1-12, SSC, HSC, admission) and skill courses, read about a course, then press
**Enroll on 10 Minute School**, which sends them through your affiliate link. Every outbound click is
recorded, and sales reported by the 10 Minute School affiliate dashboard can be logged next to them.

The public site and the admin panel are written in Bangla, following 10 Minute School's own conventions
(Bangla numerals, English kept for terms like HSC, SSC and IELTS). The font is Noto Sans Bengali from
Bunny Fonts. The site is light by default with a manual dark-mode toggle in the header.

Built with Laravel 13, Inertia 2, React 19, Tailwind CSS 4 and Motion.

## Shared hosting without a terminal

See [deploy/README-cpanel.md](deploy/README-cpanel.md). In short: upload the deploy zip, create
a MySQL database, fill in `.env` with a `SETUP_TOKEN`, open `/setup/<token>` once in the browser
(it generates the app key, runs migrations and seeds), then delete the token line. Uploaded images
are stored in `public/uploads`, so no symlink is needed. Change the admin password from the
"পাসওয়ার্ড" page in the admin menu.

## Run it locally

Requirements: PHP 8.3+, Node 20+, and either SQLite (default) or MySQL.

```bash
npm install
php artisan migrate --seed
npm run build
php artisan serve
```

Then open http://localhost:8000.

For development with hot reload, run `npm run dev` in a second terminal.

The seed creates 14 categories, 45 real 10 Minute School courses (with their public thumbnails) and one
admin account:



Change the password from the admin panel before deploying. Public registration is disabled; create
additional admins with `php artisan tinker` and set `is_admin` to true.

## Admin panel

Sign in at `/login` and you land on `/admin`. There is intentionally no admin link on the public site, so
bookmark `/login`.

- **Dashboard**: clicks for the last 7 days and all time, sales and commission for the last 30 days,
  a 30-day clicks chart, the top courses and the latest clicks.
- **Courses**: search, filter and sort; toggle published and featured inline; add or edit a course
  with title, instructor, badge, description, highlights, price, original price, image (upload or URL)
  and, most importantly, the **affiliate link**. Paste the tracked link you get from
  affiliation.10minuteschool.com. The public page sends visitors to `/go/{slug}`, which records the
  click and redirects to that link.
- **Banners**: the promo slideshow at the top of the landing page. Each banner has a title, subtitle,
  button label, link (a path like `/courses?group=skills` or a full URL), a 16:9 image (upload or URL),
  an accent color for the soft glow behind the image, an on/off switch and a sort order. With no active banner the landing page
  falls back to a plain hero.
- **Categories**: two groups, Academic and Skills. Academic categories with a class range appear in the
  Class 1-12 picker on the landing page and power the `?class=N` filter.
- **Sales**: 10 Minute School reports conversions in its own dashboard. Record them here (course,
  amount, commission, date) so they appear beside your click data. Commission defaults to 15% of the
  amount when left blank.

## How clicks are counted

`GoController` hashes the visitor IP with the app key, stores one row per click and increments the
course's `clicks_count`. The same visitor clicking the same course again within 30 minutes is not
counted twice. No cookies or personal data are stored.

## Switching to MySQL

Set `DB_CONNECTION=mysql` plus the `DB_*` values in `.env`, then run `php artisan migrate --seed`.

## Tests

```bash
php artisan test
```

Feature tests cover authentication and admin access, catalog pages, click tracking and de-duplication,
course creation with image upload, and sale recording.
