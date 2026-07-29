// Lab4Wonder offline service worker.
// Precaches every page and shared asset so the whole site keeps working
// without a network connection. __BUILD_ID__ is replaced with the commit
// id by .github/workflows/pages.yml at deploy time.
const CACHE_NAME = "lab4wonder-__BUILD_ID__";

const PRECACHE_URLS = [
  "./",
  "2048.html",
  "abyss.html",
  "accelerator.html",
  "acid-base.html",
  "acorn-fermi.html",
  "airship-expedition.html",
  "ant-colony.html",
  "art-looking-gallery.html",
  "atom.html",
  "attractor.html",
  "balloon-gases.html",
  "balloon.html",
  "battery-lab.html",
  "boids.html",
  "breathing.html",
  "buoyancy-lab.html",
  "canyon-run.html",
  "capillary-porous.html",
  "cave.html",
  "cell-membrane.html",
  "chromatography-lab.html",
  "cipher-lab.html",
  "circulation.html",
  "combustion.html",
  "complex-plane.html",
  "constellation-guide.html",
  "crack-growth-paris.html",
  "cue-navigation.html",
  "derivative-lab.html",
  "digestion.html",
  "distribution-explorer.html",
  "divergence-angle.html",
  "dna-protein.html",
  "donut.html",
  "doppler-effect.html",
  "double-pendulum.html",
  "double-slit-diffraction.html",
  "drum-machine.html",
  "dungeon-gen.html",
  "eclipse-lab.html",
  "electric-circuit.html",
  "electromagnet-lab.html",
  "electromagnetic-spectrum.html",
  "element-sandbox.html",
  "engine-cycle.html",
  "enigma.html",
  "enzyme-inhibition.html",
  "enzyme-lab.html",
  "erosion.html",
  "explore.html",
  "fault-stick-slip.html",
  "field-guided-growth.html",
  "fireflies.html",
  "fishing-ecology.html",
  "flame-test.html",
  "flashlight-mechanism.html",
  "flight.html",
  "flow-field.html",
  "fluid.html",
  "food-chain.html",
  "fossil-formation.html",
  "fourier.html",
  "fourier_drawing.html",
  "friction-lab.html",
  "game-of-life.html",
  "gas-laws.html",
  "genetic-drift-selection.html",
  "glass-thermal-shock.html",
  "glucose-homeostasis.html",
  "gravity-lab.html",
  "gravity.html",
  "groundwater-plume.html",
  "growth-edge-patterns.html",
  "haiku-tanka.html",
  "hearing-balance.html",
  "heat-transfer.html",
  "hydraulic-elevator.html",
  "hypothesis-testing.html",
  "image-formation.html",
  "immune-memory.html",
  "impact-deformation.html",
  "index.html",
  "inertia-law.html",
  "inheritance-lab.html",
  "integral-lab.html",
  "ising.html",
  "jungle.html",
  "kaleidoscope.html",
  "kidney-nephron.html",
  "kids-index.html",
  "kite-lab.html",
  "l-system.html",
  "logic-circuit.html",
  "lumens-scenarios.html",
  "mandelbrot.html",
  "markdown-editor.html",
  "market-risk.html",
  "material-fatigue.html",
  "matrix-transform.html",
  "maze-3d.html",
  "maze.html",
  "measure-speed-light.html",
  "minesweeper.html",
  "mini-transformer.html",
  "mirage-lab.html",
  "mitosis.html",
  "molecule-builder.html",
  "momentum-collision.html",
  "monarch-migration.html",
  "moon-phases.html",
  "musculoskeletal.html",
  "music-visualizer.html",
  "natural-selection.html",
  "nback.html",
  "nervous-reflex.html",
  "newton-cart.html",
  "optics-lab.html",
  "oscillator-entrainment.html",
  "packing-optimization.html",
  "pandemic-control.html",
  "paper-plane.html",
  "particle-life.html",
  "petroleum-refinery.html",
  "photosynthesis-factory.html",
  "pillbug-maze.html",
  "plankton-world.html",
  "plate-earthquake.html",
  "pocket-money.html",
  "projectile-gravity.html",
  "quicksand-simulator.html",
  "raindrop-journey.html",
  "raymarch.html",
  "reaction-balance.html",
  "reaction-diffusion.html",
  "regex-tester.html",
  "resonance.html",
  "river.html",
  "rock-cycle.html",
  "roots.html",
  "rotation-torque.html",
  "route-optimization.html",
  "sand.html",
  "seasons-axis.html",
  "secret-note.html",
  "sediment-resuspension.html",
  "shop-manager.html",
  "simple-machines.html",
  "slime-mold.html",
  "snake.html",
  "snowflake.html",
  "soil-infiltration-runoff.html",
  "sokoban.html",
  "solubility.html",
  "sorting-visualizer.html",
  "sound-reflection.html",
  "spider-web.html",
  "structural-color.html",
  "succession.html",
  "sudoku.html",
  "supply-chain-manager.html",
  "tanker-control.html",
  "taxonomy-tree.html",
  "terrain-gen.html",
  "territory-control.html",
  "theremin.html",
  "thermal-convection.html",
  "thermohaline-circulation.html",
  "tidepool.html",
  "tides.html",
  "traffic-control.html",
  "transformer-attention.html",
  "tree-rings.html",
  "tuning.html",
  "typhoon-genesis.html",
  "vector-dot-product.html",
  "vision-lab.html",
  "volcano.html",
  "voronoi.html",
  "vortex-street.html",
  "water-cycle.html",
  "water-states.html",
  "wave-interference.html",
  "weather-fronts.html",
  "weathering-lab.html",
  "whirlpool-strait.html",
  "world-clock.html",
  "lab4wonder_v1_1.css",
  "lab4wonder_v1_1.js",
  "direct_play_patch.js",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon.png",
  "art-athens.jpg",
  "art-grande.jpg",
  "art-matthew.jpg",
  "art-starry.jpg",
  "art-sunrise.jpg",
  "art-wave.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request, { ignoreSearch: true });
    const refresh = fetch(request)
      .then((response) => {
        if (response && response.ok && response.type === "basic") {
          return cache.put(request, response.clone()).then(() => response);
        }
        return response;
      })
      .catch(() => null);
    if (cached) {
      event.waitUntil(refresh);
      return cached;
    }
    const fresh = await refresh;
    if (fresh) {
      return fresh;
    }
    if (request.mode === "navigate") {
      const fallback = await cache.match("index.html");
      if (fallback) {
        return fallback;
      }
    }
    return Response.error();
  })());
});
