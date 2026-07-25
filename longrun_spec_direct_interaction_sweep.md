# Direct Interaction Sweep

## Goal

Improve the remaining high-value laboratory apps whose primary canvas does not
directly respond to touch. A child should be able to intervene on the main
diagram before exploring detailed parameters.

## In scope

### Direct placement or local disturbance

- `gravity.html`
- `fluid.html`
- `reaction-diffusion.html`
- `ising.html`
- `game-of-life.html`
- `particle-life.html`
- `terrain-gen.html`
- `circulation.html`
- `dna-protein.html`
- `photosynthesis-factory.html`
- `volcano.html`
- `water-states.html`
- `electromagnet-lab.html`
- `heat-transfer.html`
- `fault-stick-slip.html`
- `capillary-porous.html`
- `vortex-street.html`

### Direct dragging of model objects

- `complex-plane.html`
- `derivative-lab.html`
- `integral-lab.html`
- `vector-dot-product.html`
- `matrix-transform.html`
- `image-formation.html`
- `optics-lab.html`
- `vision-lab.html`
- `moon-phases.html`
- `eclipse-lab.html`
- `seasons-axis.html`
- `rotation-torque.html`
- `momentum-collision.html`
- `newton-cart.html`
- `projectile-gravity.html`
- `kite-lab.html`
- `flight.html`
- `balloon.html`

## Interaction requirements

- Touching or dragging the primary canvas must change the actual simulation
  state, not only add a visual overlay or message.
- The touched object, intervention, and resulting change must be identifiable
  at a glance through labels, arrows, legends, or a short status sentence.
- The first useful interaction must not require opening a secondary panel.
- Pointer input must work on iPad-sized touch screens and must not block page
  scrolling outside the canvas.
- Existing successful sand, water, fire, wood, paper-plane, and playground apps
  are out of scope.
- Preserve existing parameter controls and educational comparisons.

## Verification

- Run `node scripts/check_inline_js.js` across all HTML files.
- Run `git diff --check`.
- For every modified app, use a real browser to verify:
  - a direct touch changes a model variable or model collection;
  - the canvas changes visibly;
  - no runtime exception occurs;
  - no horizontal overflow occurs.
- Visually inspect representative pages from every interaction family.
- Commit logical changes using Conventional Commits.
- Prepare verified commits for `main`; the controlling session will create the
  `v1.4.0` tag, push commits and tag, and confirm GitHub Pages deployment after
  the final gate.

## Completion evidence

- A per-file audit table recording interaction, changed state, browser result,
  and any intentionally deferred page.
- Clean working tree after push.
