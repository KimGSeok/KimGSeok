# Avatar contract

Avatar represents a person or team with an optional HTTPS image and deterministic
two-grapheme fallback. Size is `sm | md | lg`. Accessibility is explicit: decorative
when adjacent text already names the entity, or labelled with a required concise image
label when the Avatar is the only identity cue. It is not an account button, presence
indicator, upload control, or arbitrary image component.

Both platforms render the fallback behind the image so loading and failure never leave
an empty circle. Web sends no referrer and treats the nested image as decorative because
the wrapper owns the single accessibility node. Native follows the same single-node rule.
Only valid HTTPS source strings without embedded credentials are accepted. HTTPS protects
transport; it does not make a third-party image request private because the host still sees
network metadata. Products must pass only approved, consented, proxied or cached media URLs
and own authenticated image fetching, caching, retry, and privacy policy.

| Source | Adopt | Reject |
| --- | --- | --- |
| TDS | compact identity hierarchy and Toss palette baseline | copied assets/API |
| SEED | deterministic fallback and explicit sizing | Daangn styling |
| Montage | clear person/team representation | Wanted styling |
| Loci | separate platform renderers | implicit accessibility and raw child overrides |

Evidence: fallback, load/error, sm/md/lg, decorative/labelled, Korean/Latin initials,
light/dark, Web accessibility tree, and iOS/Android VoiceOver/TalkBack. Native image
load, failure, and source replacement are release evidence only when the product supplies
an approved, controlled media endpoint; this specimen intentionally makes no third-party
profile-image request.
