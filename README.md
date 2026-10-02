# Fundraising E‑Raffle System

A non-orbit, mobile-friendly e-raffle ticket system for fundraising campaigns.

## Core features
- One buyer can buy multiple raffle tickets
- Unique raffle number and verification code per ticket
- Paid / Pending / Void ticket status
- Cash / GCash / Maya / Bank Transfer / Other payment methods
- Printable e-tickets
- Ticket verification
- Raffle draw restricted to paid active tickets
- Previous winners excluded from future draws
- Winner history
- Sales dashboard
- CSV export
- JSON backup and restore
- Campaign settings
- Offline-first PWA after the first successful page load

## Publish with GitHub Pages

1. Create a new GitHub repository, for example:
   `fundraising-e-raffle-system`

2. Upload these files to the ROOT of the repository:
   - `index.html`
   - `manifest.webmanifest`
   - `sw.js`
   - `.nojekyll`
   - `README.md`

3. Commit the files.

4. Open:
   **Repository → Settings → Pages**

5. Under **Build and deployment** choose:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/(root)**

6. Save.

Your public address will normally look like:

`https://YOUR-USERNAME.github.io/fundraising-e-raffle-system/`

## Storage note

This version stores sales/tickets in the browser using localStorage. Use **Backup JSON** regularly. Data entered on one device/browser does not automatically appear on another device.

## Legal note

Before running a public fundraising raffle, check the permits, fundraising, raffle, tax, privacy, and consumer-protection requirements that apply to your organizer and jurisdiction.