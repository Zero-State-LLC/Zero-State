# Custom domain: zer0state.com

Map the company domain to this GitHub Pages site so Apple Developer enrollment and App Store URLs use your brand domain.

## Target

| Host | Destination |
|------|-------------|
| `zer0state.com` | This repository (GitHub Pages) |
| `www.zer0state.com` | Same site (optional but recommended) |

## Critical order of operations

**Do not add a `CNAME` file or set the Pages custom domain until DNS for `zer0state.com` already points at GitHub.**

If the custom domain is configured first, `https://zero-state-llc.github.io/Zero-State/` redirects to `zer0state.com`, and visitors still see the Squarespace “Coming Soon” page.

1. Update DNS A/CNAME records (below)
2. Wait until `dig +short zer0state.com A` returns GitHub IPs
3. Then add `CNAME` with `zer0state.com` and enable the domain in Pages settings
4. Enforce HTTPS after certificate provisions

Keep **email MX on Hostinger** (or current mail provider). Do not delete MX/SPF records when changing web A/CNAME records.

## 1. Repo (done when `CNAME` is on `main`)

- File `CNAME` contains `zer0state.com`
- Repo Settings → Pages → Custom domain: `zer0state.com`
- Enforce HTTPS after DNS verifies

## 2. DNS at the registrar (where `zer0state.com` is managed)

Remove or replace Squarespace **web** records only. Leave mail alone.

### Apex (`zer0state.com`)

Type **A**, name `@` (or blank), values (GitHub Pages):

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Optional AAAA:

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

### www

Type **CNAME**, name `www`, value:

```
zero-state-llc.github.io
```

### Do not change (email)

- MX → Hostinger (or current provider)
- TXT SPF / DKIM / DMARC for mail

### Remove

- Squarespace A records (`198.49.23.x`, `198.185.159.x`)
- `www` CNAME to `ext-sq.squarespace.com`
- Parking / “Coming Soon” site association in Squarespace if required

## 3. Verify

```bash
dig +short zer0state.com A
dig +short www.zer0state.com CNAME
curl -sI https://zer0state.com | head -15
curl -sI https://zer0state.com/privacy.html | head -10
```

Expect GitHub A records, HTTPS 200, and real site content (not “Coming Soon”).

## 4. App Store Connect URLs (after cutover)

| Field | URL |
|-------|-----|
| Privacy Policy | `https://zer0state.com/privacy.html` |
| Support | `https://zer0state.com/contact.html` |
| Marketing | `https://zer0state.com/marketing.html` |

Until DNS is live, github.io URLs remain valid.

## 5. Apple Developer Program enrollment

After the domain serves this site:

1. Website: `https://zer0state.com`
2. Work email: `zer0state@zer0state.com` (must receive mail)
3. Legal entity: Zero State LLC (must match D-U-N-S)
4. D-U-N-S number on file for Zero State LLC
