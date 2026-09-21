# ONI Food Calculator

A lightweight, static food-planning calculator for *Oxygen Not Included*. Select a food and set colony conditions to see the renewable inputs required per cycle.

## Run locally

Use Node 22 or newer, then run `node scripts/serve.mjs` and open http://127.0.0.1:5173. ES modules require an HTTP server; do not double-click index.html.

Tests: `node --test tests/calculator.test.mjs`. Static production build: `node scripts/build.mjs`.

## Deploy

The GitHub Actions workflow tests the calculator, copies only public site files and required images into `_site`, and deploys that directory to GitHub Pages. In repository Settings → Pages, choose **GitHub Actions** as the source. A VPS or backend is not required: all calculations run in the browser.

## Notes

Inspired by the archived ONI Assistant, with a wider black interface and a recursive, connected production tree. All 65 foods from the wiki overview are represented, including Frosty, Prehistoric and Aquatic foods. Selectable alternatives cover grain, meat ranches, cooked seafood, smoked fish, smoked vegetables and smoker fuel.

See [ASSETS.md](ASSETS.md) for every required image, exact filenames, download links, manual steps and attribution. `node scripts/assets.mjs --download` resumes known missing images with 6.5-second pacing and stops on access/rate-limit errors. `node scripts/assets.mjs` updates the local image inventory without downloading.

## Model boundaries

- Recipe amounts are normalized to output mass; kcal/kg is not confused with total critter drops or batch calories.
- Farms show ideal continuous-growth counts and raw upkeep. Wild plants, delayed harvest and Farmer's Touch are modeled with stated exceptions. Mature multi-branch plants assume their full branch count.
- Ranches show surplus harvests separately from adult breeder requirements. Surplus rate = 1 / egg interval − 1 / (lifespan − 5-cycle maturation). Tame, happy, fully fed breeders and surplus hatchling harvesting are assumed. Replacement baby feed, incubation housing, mortality drops and morph variation are not modeled.
- Whole build counts round up after combining branches. Resource totals use fractional minimum counts; use the surplus input for headroom. They are not a fully simulated feed budget for rounded ranches.
- Foraged foods are marked finite, not represented as renewable farms. Environmental requirements, pollinators, startup, spoilage, power, heat and labor need separate planning. Smoker fuel is included; Gas Range operating fuel is not.
- Industrial resource chains terminate at explicitly labeled external supplies. Byproduct reuse is not credited.
- Curried Beans has conflicting wiki values: the dedicated recipe and Nosh Bean page say 4 roots + 4 beans; the overview says 5 + 5. The calculator uses 4 + 4 and exposes this discrepancy.

## Data sources

Food/calorie/quality data: [Food (Resource)](https://oxygennotincluded.wiki.gg/wiki/Food_(Resource)). Farming and ranching values: each node links to its corresponding ONI wiki article, including [Glo Squid](https://oxygennotincluded.wiki.gg/wiki/Glo_Squid), [Tublia](https://oxygennotincluded.wiki.gg/wiki/Tublia), [Jawbo](https://oxygennotincluded.wiki.gg/wiki/Jawbo), [Mimika Bud](https://oxygennotincluded.wiki.gg/wiki/Mimika_Bud), [Tower Kelp](https://oxygennotincluded.wiki.gg/wiki/Tower_Kelp), [Smoker](https://oxygennotincluded.wiki.gg/wiki/Smoker), and [Curried Beans](https://oxygennotincluded.wiki.gg/wiki/Curried_Beans). Data audit: September 2026. Some wiki pages themselves flag version uncertainty; treat the planner as a steady-state estimate, not an exact game simulation.

This independent fan tool is not affiliated with ONI Assistant, Klei, or wiki.gg. Game artwork belongs to Klei Entertainment. Wiki text/data is CC BY-NC-SA 4.0 unless otherwise stated; individual image licences are on their file pages.
