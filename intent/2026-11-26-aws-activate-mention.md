# Intent

## Problem

Zero State LLC is in the AWS Activate program, but the site says nothing about it. The homepage "Supported by" wall (`index.html`, section `.programs`) already lists ElevenLabs Grants, Databricks Startup Program, Neon Startup Program and NVIDIA Inception, so the AWS relationship has an obvious home and currently reads as an omission to anyone comparing program pages.

## Proposed outcome

A plain-text AWS Activate entry in the "Supported by" wall, and nothing else.

In scope: one list item naming the program in text, sized to sit with the existing badges, plus the third-party-notice line that explains why it is text and not a mark.

Out of scope: the AWS Activate logo itself, any "powered by AWS" claim, and any statement that AWS endorses or sponsors Zero State. Also out of scope: claiming Zero State runs its products on AWS, which is a separate factual question this change does not settle — the site sells compute on the client's own hardware.

## Affected users / systems

Site visitors on the homepage. `index.html` (one list item), `home.css` (`.program__wordmark` and the wrapped-row divider rule), `workers/ask/knowledge.md` (regenerated from homepage copy by `scripts/ask-knowledge.js`, so the ask endpoint learns the program too), `CHANGELOG.md`, `assets/THIRD_PARTY_NOTICES.md`.

## Constraints / non-goals

- **No AWS logo without written permission.** AWS's Trademark Guidelines grant logo licences to customers (Powered by AWS), APN partners (Partner Badges) and SCA signatories; there is no Activate licence. Anything outside those is covered by "Any use of the AWS Marks outside the scope of the foregoing licenses requires Licensor's prior written permission" (§3(d)), reinforced by §4 ("only in materials that have been approved in advance by AWS") and §9 (AWS supplies the images; do not alter them).
- **Text is fair use.** §13 allows the name in plain text, no logos, for true factual statements. That is exactly what ships here, and it is why the entry has no image.
- **No implied endorsement.** §5 forbids display implying sponsorship or endorsement, and forbids any AWS mark being more prominent than Zero State's own branding. The entry is set in the site's own type at badge height, not as a lockup.
- The existing marks stay as they are: Databricks, ElevenLabs and Neon are CC0 Simple Icons outlines; NVIDIA Inception is the program's own badge.
- Whether the program is still active is the owner's fact, not something this repo can verify.

## Open questions

- Has AWS already granted written permission in correspondence we have not filed in this repo? If so, the badge can replace the text and this item closes. **Owner (Aaron) to confirm, and to send the permission mail to his Activate contact.**
- Is the AWS relationship worth surfacing on `local-intelligence.html` too, given that page's rule against naming specific hardware? Deferred, not decided here.

## Verified / assumed claims

| Claim | Label | Basis |
|---|---|---|
| Zero State LLC participates in AWS Activate | `OWNER-STATED` | Aaron, in chat, 2026-11-26. Not verifiable from this repo or from AWS's public pages, which do not publish member lists |
| AWS requires written permission before the Activate logo may appear on our site | `OBSERVED` | aws.amazon.com/trademark-guidelines §3(d), §4, §9; AWS Activate FAQ: "you need to comply with our Activate logo guidelines and receive permission from AWS in order to feature the AWS Activate logo on your website" |
| Plain-text mention is permitted without that permission | `OBSERVED` | Same guidelines, §13 Fair Use: "should be in plain text only (no logos) and used to make true factual statements" |
| Zero State's products run on AWS | `NOT_COMPUTABLE` | Deliberately not claimed. The site's Local intelligence offer is compute on the client's own hardware |

## Author / date

- Author: z0D, at Aaron Godbout's instruction in chat
- Date: 2026-11-26
