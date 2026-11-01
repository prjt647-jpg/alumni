# AlumniConnect - Alumni Networking & Engagement Portal

**Stack:** HTML/CSS + Bootstrap 5 + jQuery (front end) | Node.js + Express (back end) | JSON-file data store

## Modules
| Module | What it does |
|---|---|
| Alumni profiles | Edit own profile (headline, company, skills, bio, LinkedIn), profile-completion bar, view others |
| Directory | Search by name/company/skill/city, filter by department, batch year, "mentors only" |
| Networking | Send / accept / decline / cancel connection requests; email shown only after connecting |
| Events | Create events (alumni/admin), RSVP toggle, upcoming/past/going filters, delete own events |
| Mentoring | Alumni mark "open to mentor"; students send requests; mentor accepts/declines with reply, marks completed |
| Job posts | Alumni post jobs/internships; students apply with a note; poster sees applicants |
| Admin dashboard | Live statistics, department chart, mentoring status counts, suspend/activate/delete users |

## Run it (needs Node.js 18+)
```bash
cd alumni-portal
npm install
npm start
```
Open http://localhost:3000. Demo data is created automatically on first start.

| Role | Email | Password |
|---|---|---|
| Admin | admin@alumni.com | admin123 |
| Alumni | priya@alumni.com | alumni123 |
| Student | aarav@student.com | student123 |

To reset all data, stop the server and delete `data/db.json`.

## Host it online (5 marks) - Render.com, free
1. Create a GitHub account, make a new repository and upload this project (do **not** upload `node_modules`; `.gitignore` already skips it).
2. Sign up at https://render.com with GitHub -> **New +** -> **Web Service** -> pick your repository.
3. Settings: Runtime **Node**, Build command `npm install`, Start command `npm start`, Instance type **Free**.
4. Add environment variable `SESSION_SECRET` = any long random text.
5. Click **Create Web Service**. After 2-3 minutes you get a public link such as `https://alumni-portal.onrender.com`. Submit this link.

(`render.yaml` is included, so Render can also configure itself using **New + -> Blueprint**.)
Notes: the free plan sleeps after inactivity (first load takes ~30 s), and its disk resets on redeploy, so demo data is re-created - fine for a college project. Railway or Cyclic work the same way.

## Folder structure
```
server.js            app entry: sessions, routes, static files
db.js                tiny JSON-file database (insert/find/update/remove)
seed.js              demo data created on first run
middleware/auth.js   login check, role check, input cleaning
routes/              auth, alumni (profiles), connections, events, mentoring, jobs, admin
public/              HTML pages, css/style.css, js/app.js (shared jQuery helpers)
```

## Security features (good viva points)
- Passwords hashed with **bcrypt**; never sent to the browser.
- **Session cookies** (httpOnly) for login; every API route checks login and **role** (student / alumni / admin).
- All user text is escaped before display (prevents XSS); inputs trimmed and length-limited on the server.
- Users can only change their own data; admin-only routes return 403 for others; suspended users are logged out.

## Likely viva questions
1. **Why Node.js/Express?** Non-blocking JavaScript on both client and server; Express gives simple routing and middleware.
2. **Role of jQuery?** `$.ajax` calls the REST API and updates the page without reloading; DOM events and rendering.
3. **Role of Bootstrap?** Responsive grid, navbar, cards, modals, toasts, so the site works on mobile.
4. **How does login work?** `/api/auth/login` checks the bcrypt hash and stores `userId` in a server session; the browser keeps only the session cookie.
5. **How are roles enforced?** `requireAuth` and `requireRole('admin')` middleware on the server, plus hiding buttons in the UI.
6. **Why JSON file instead of MySQL/MongoDB?** Zero setup and easy hosting; `db.js` is the only file to change to switch to MongoDB/MySQL.
7. **REST API examples:** `GET /api/events`, `POST /api/jobs`, `PUT /api/mentoring/:id`, `DELETE /api/admin/users/:id`.
8. **Future work:** database (MongoDB), email notifications, chat, profile photos, event reminders.
