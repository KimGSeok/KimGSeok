# Badge contract

Badge is a compact, non-interactive label for persistent metadata or status. It accepts
one non-blank label, semantic `neutral | positive | caution | negative | info` tone,
and `sm | md` density. It is not a button, filter, removable tag, live-region owner,
notification count, or sole carrier of meaning. Products provide adjacent context and
own announcements when status changes dynamically.

Web and Native consume the same status foreground/background/border recipes. Neutral
uses surface/secondary foreground tokens. Labels stay on one line, truncate within the
available width, retain their full accessibility text, and grow vertically with system
font metrics rather than using a fixed height. No icons are accepted in this first role.

| Source | Adopt | Reject |
| --- | --- | --- |
| TDS | compact status hierarchy and Toss palette baseline | copied API/assets |
| SEED | semantic status rather than raw colour | Daangn styling |
| Montage | concise metadata labelling | Wanted styling |
| Loci | platform renderer split | interactive or raw-style badge escape hatches |

Evidence: every tone in light/dark, sm/md, long Korean at 320px, token contrast, text
scaling, no interactivity, Web axe, and iOS/Android truncation/announcement behaviour.
