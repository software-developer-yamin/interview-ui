DATAPULSE VISUAL DESIGN SPECIFICATION
=====================================

OVERALL STYLE
- Dark, premium analytics SaaS interface.
- Midnight navy background with electric blue, cyan, violet, and magenta highlights.
- Soft glow, glassmorphism, thin luminous borders, and restrained gradients.
- Use high contrast for labels and inputs; avoid overusing glow on small text.

SUGGESTED COLOR TOKENS
- Page background: #020817
- Deep navy surface: #061329
- Elevated surface: #071A33
- Primary blue: #168BFF
- Cyan accent: #00C8FF
- Violet accent: #7B35FF
- Magenta accent: #C02CFF
- Main text: #F5F8FF
- Secondary text: #A9C4E8
- Muted text: #7895BA
- Border: #183A66
- Success/online: #00D7A0

TYPOGRAPHY
- Recommended family: Inter.
- Headline: bold/semi-bold, tight line-height.
- Body and form labels: regular/medium.
- Inputs: comfortable 14–16 px text size.
- Use a clear hierarchy; avoid tiny text on mobile.

LOGIN SCREEN
- Two-column desktop composition.
- Left panel: brand header, trust badge, large headline, short supporting paragraph, three feature rows, quote near bottom.
- Hero artwork sits behind/alongside the feature content; preserve enough dark space for readable text.
- Right panel: top-right create-account link and a rounded bordered login card.
- Card contents: logo, welcome heading, email field, password field with visibility toggle, remember-me checkbox, forgot-password link, primary gradient login button, divider, Google sign-in button, terms/privacy note.

SIGNUP SCREEN
- Two-column desktop composition.
- Left panel: brand header, navigation, join badge, two-line headline, supporting paragraph, three feature rows, large dashboard artwork.
- Right panel: top-right login link and a rounded bordered registration card.
- Card contents: logo, heading, full name, email, password, confirm password, remember-me checkbox if desired, forgot-password link only if product requirements support it, primary gradient register button, divider, Google sign-in, terms/privacy note.
- Keep all form labels and required-field indicators consistent.

COMPONENT DETAILS
- Inputs: dark translucent fill, 1 px blue border, 10–14 px corner radius, left-side icon, clear focus state.
- Cards: 18–24 px corner radius, subtle navy fill, thin blue/purple border.
- Primary buttons: blue-to-violet gradient, white text, 10–14 px radius, clear hover/disabled/loading states.
- Secondary buttons: transparent dark fill, blue border, visible focus state.
- Feature icons: consistent stroke weight, blue/cyan glow kept subtle.
- Spacing: use a consistent 4/8 px spacing rhythm.
- Layout: desktop reference is wide; on smaller screens stack the content and form vertically and reduce decorative artwork.

ACCESSIBILITY
- Maintain WCAG-conscious contrast.
- Every field needs a programmatic label and clear validation message.
- Provide keyboard focus indicators and keyboard-accessible password visibility controls.
- Do not communicate errors or success by color alone.
- Respect reduced-motion preferences for animated glows or transitions.

RESPONSIVE NOTES
- Desktop: two-column layout with a larger promotional panel and a narrower form panel.
- Tablet: reduce artwork scale and gaps; keep form comfortable to use.
- Mobile: single column; simplify or hide decorative art; place brand and form first; avoid fixed-height cards; ensure the primary button and inputs are full-width.
