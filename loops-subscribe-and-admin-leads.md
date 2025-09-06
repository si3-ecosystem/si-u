## Loops integration, newsletter subscribe API, and admin lead lists

This document summarizes the new/updated backend endpoints, expected payloads, env variables, and the admin filters your frontend can use.

### 1) Scholars waitlist submission (already wired)
- Route: `POST /api/email/scholars`
- Body shape:
```
{ "formData": { name, email, interests, details?, newsletter: "yes"|"no"|boolean } }
```
- Behavior:
  - Upserts into Mongo collection `scholars` (model: `ScholarsProgramModel`).
  - Adds contact to Loops Audience; subscribes to `LOOPS_LIST_SCHOLARS_WAITLIST`.
  - If `newsletter === 'yes'` (or `true`), also subscribes to `LOOPS_LIST_CURRENTSI_NEWSLETTER`.
  - Sends notification to `kara@si3.space` from `scholars@si3.space` and a confirmation to the applicant.

Env required:
- `LOOPS_API_KEY`
- `LOOPS_TRANSACTIONAL_ID_SCHOLARS`
- `LOOPS_LIST_SCHOLARS_WAITLIST`
- `LOOPS_LIST_CURRENTSI_NEWSLETTER` (optional, only when newsletter is yes)

---

### 2) Partner submission + Partner newsletter
- Route: `POST /api/email/partners`
- Body shape:
```
{ "formData": { name, email, companyName, interests, details?, newsletter: boolean|"yes"|"no" } }
```
- Behavior:
  - Saves to Mongo collection `partner` (model: `PartnerProgramModel`).
  - If `newsletter` is true/"yes", subscribes to Loops list `LOOPS_LIST_PARTNER_NEWSLETTER`.
  - Sends notification email to `kara@si3.space` from `partners@si3.space` and a confirmation to the applicant.
  - `digitalLink` is optional (passed as `N/A` to templates for safety).

Env required:
- `LOOPS_API_KEY`
- `LOOPS_TRANSACTIONAL_ID_PARTNER`
- `LOOPS_LIST_PARTNER_NEWSLETTER`

---

### 3) New generic subscribe endpoint (replace EtherMail footer)
- Route: `POST /api/email/subscribe`
- Headers: `Content-Type: application/json`
- Body (minimal):
```
{ "email": "user@example.com", "listKey": "website" }
```
- Optional body fields:
```
{ firstName?: string, listKey?: "website"|"publisher"|"currentsi", listId?: "lst_xxx", source?: string, userGroup?: string }
```
- Behavior:
  - Upserts contact in Loops Audience.
  - Subscribes to one mailing list determined by either `listKey` or explicit `listId`.
  - Returns: `{ status: "success", message: "Subscribed" }` on 200.

Env for `listKey` mapping (optional if you pass `listId`):
- `LOOPS_LIST_WEBSITE_NEWSLETTER`
- `LOOPS_LIST_PUBLISHER_NEWSLETTER`
- `LOOPS_LIST_CURRENTSI_NEWSLETTER`

Example frontend calls:
```js
// Website footer
await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/email/subscribe`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, listKey: 'website', source: 'Site Footer' })
});

// Publisher page footer
await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/email/subscribe`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, listKey: 'publisher', source: 'Publisher Footer' })
});
```

---

### 4) Admin endpoints to list leads (with newsletter filter)
New endpoints for the admin panel (Auth: Admin/Team):

- Scholars leads
  - `GET /api/admin/leads/scholars`
- Partner leads
  - `GET /api/admin/leads/partners`

Query parameters supported (both endpoints):
- `page` number (default 1)
- `limit` 1–100 (default 20)
- `search` matches name/email/company
- `newsletter` one of `true | false | all`
- `sortBy` one of `createdAt | name | email`
- `sortOrder` `asc | desc`

Response shape:
```
{
  status: "success",
  data: [
    { _id, name, email, companyName?, interests, details?, newsletter, createdAt }
  ],
  pagination: { currentPage, totalPages, total, limit }
}
```

Frontend can surface filters for newsletter subscribers and then bulk-add to Loops using the IDs you already manage.

---

### 5) Notes for frontend
- Base URL env: `NEXT_PUBLIC_BASE_URL` should point to this Express server.
- For badge visibility in Loops, be sure to pass `listKey` or `listId` when calling `/api/email/subscribe`.
- Wallet connect buttons (MetaMask/WalletConnect) are not needed for email subscription; keep only if you have a separate wallet flow.

---

### 6) Quick checklist
- Set envs: `LOOPS_API_KEY`, transactional IDs (`_SCHOLARS`, `_PARTNER`), and list IDs (`LOOPS_LIST_*`).
- Replace EtherMail footer with a POST to `/api/email/subscribe`.
- Use admin lead endpoints to view/filter who opted into Scholars/Partner newsletters.


