(() => {
  "use strict";

  const page = location.pathname.split("/").pop() || "";
  const explorationPages = new Set([
    "abyss.html",
    "cave.html",
    "constellation-guide.html",
    "fossil-formation.html",
    "jungle.html",
    "tidepool.html",
  ]);

  const legends = {
    "ant-colony.html": [
      ["#f6d36a", "黄：餌を運ぶアリ"],
      ["#ff9b74", "橙：巣を掘るアリ"],
      ["#9ee6b2", "緑：幼虫を世話するアリ"],
      ["#8fcdf7", "青：換気するアリ"],
      ["#68bde7", "水色の細い線：フェロモンの道"],
    ],
    "slime-mold.html": [
      ["#f6e77b", "小さな黄点：探索する先端"],
      ["#d9b44a", "細い金色：通った痕跡"],
      ["#fff1a0", "明るい線：よく使う管"],
      ["#74e1a8", "緑の円：餌"],
      ["#75879a", "灰色の円：障害物"],
    ],
    "food-chain.html": [
      ["#6ed36f", "緑：植物（生産者）"],
      ["#e6cf9a", "薄茶：草食動物"],
      ["#ed7d68", "赤：捕食者"],
      ["#ffd85a", "黄点：流れるエネルギー"],
      ["#6fcfff", "青点：土へ戻る栄養塩"],
    ],
    "pillbug-maze.html": [
      ["#8ea0aa", "灰色：ダンゴムシ"],
      ["#ffd166", "黄線：歩いた道"],
      ["#d9c9a3", "薄茶：描いた壁"],
      ["#6ed39a", "緑：出口"],
    ],
    "monarch-migration.html": [
      ["#f3a23a", "橙：オオカバマダラ"],
      ["#75c878", "緑：幼虫の食草"],
      ["#70b9e8", "青：渡りを助ける風"],
      ["#ef6f6c", "赤：危険や個体減少"],
    ],
    "tree-rings.html": [
      ["#d9b36c", "明るい年輪：成長が大きい年"],
      ["#6f4d2d", "細い年輪：乾燥した年"],
      ["#d76545", "赤い傷：火災の痕跡"],
      ["#72bde8", "青い印：雨の多い年"],
    ],
    "weathering-lab.html": [
      ["#b8a17d", "大きな形：まだ岩に残る部分"],
      ["#d8c39d", "小さな粒：その場でできた土砂"],
      ["#70b9e8", "青：流れる水"],
      ["#e5a75f", "橙：運び去られた粒"],
    ],
    "rock-cycle.html": [
      ["#ef6b55", "赤：マグマ・火成岩"],
      ["#d6b26d", "黄土：堆積物・堆積岩"],
      ["#9b78cf", "紫：変成岩"],
      ["#70b9e8", "青い矢印：水による移動"],
    ],
  };

  const touchHints = {
    "ant-colony.html": "地表をタップすると餌、地下をタップすると新しい巣室を作れます。",
    "slime-mold.html": "画面をタップして餌を置けます。「障害物」を選ぶと指で障害物を置けます。",
    "pillbug-maze.html": "指で壁を描き、ダンゴムシがどこを通るか観察できます。",
    "tree-rings.html": "年輪をタップして、その年に干ばつ・大雨・火災を起こせます。",
    "weathering-lab.html": "岩を直接こすったりタップしたりして、割れ方と運ばれ方を比べられます。",
    "food-chain.html": "植物・草食動物・捕食者をタップして、その集団へ直接介入できます。",
    "monarch-migration.html": "地図をタップして食草を植え、渡りの途中を助けられます。",
  };

  const vocabularies = {
    "ant-colony.html": [
      ["フェロモン", "アリが仲間へ残す、においの目印。この画面では水色の細い道です。"],
      ["巣室", "育児や食料保存などに使う、地下の部屋です。"],
      ["換気", "巣の中へ新しい空気を入れ、よどんだ空気を外へ出すことです。"],
    ],
    "slime-mold.html": [
      ["粘菌", "動物でも植物でもない、小さな生き物の仲間。餌を探して形を変えます。"],
      ["探索", "細い先端を広げ、餌がありそうな場所を探すことです。"],
      ["管", "見つけた餌へ物を運ぶ道。よく使う道ほど太く残ります。"],
    ],
    "food-chain.html": [
      ["生産者", "太陽の光などを使って、自分で栄養を作る植物です。"],
      ["被食者", "ほかの生き物に食べられる側。ここでは主に草食動物です。"],
      ["捕食者", "ほかの生き物をつかまえて食べる側です。"],
    ],
    "pillbug-maze.html": [
      ["壁沿い行動", "壁に触れると、その壁に沿って進みやすくなる動きです。"],
      ["軌跡", "ダンゴムシがこれまでに歩いた道のあとです。"],
      ["探索", "行き止まりを避けながら、出口へ続く道を試すことです。"],
    ],
    "monarch-migration.html": [
      ["渡り", "季節に合わせて、とても長い距離を移動することです。"],
      ["ミルクウィード", "幼虫が食べ、卵を産む場所にもなる大切な植物です。"],
      ["世代交代", "途中で子や孫の世代へ交代しながら旅をつなぐことです。"],
    ],
    "tree-rings.html": [
      ["年輪", "木が一年ごとに作る成長のしま。幅や傷にその年の環境が残ります。"],
      ["干ばつ", "雨が少ない状態が長く続き、水が足りなくなることです。"],
      ["形成層", "幹の内側で新しい木の細胞を作り、年輪を増やす部分です。"],
    ],
    "weathering-lab.html": [
      ["風化", "岩がその場所で、細かく割れたり成分が変わったりすることです。"],
      ["侵食", "水や風が、岩や土を削って別の場所へ運ぶことです。"],
      ["化学的風化", "水などとの反応で、岩を作る物質そのものが変わる風化です。"],
    ],
    "rock-cycle.html": [
      ["火成岩", "マグマが冷えて固まった岩石です。"],
      ["堆積岩", "砂や泥などが積み重なり、押し固められた岩石です。"],
      ["変成岩", "岩石が地下の熱や圧力で、別の性質へ変わったものです。"],
    ],
    "plankton-world.html": [
      ["植物プランクトン", "光を使って栄養を作る、水中の小さな生き物です。"],
      ["動物プランクトン", "植物プランクトンなどを食べる、水中の小さな生き物です。"],
      ["栄養塩", "生き物が育つ材料になる、窒素やリンなどの水中の成分です。"],
    ],
  };

  function cleanVersionLabel(value) {
    return value
      .replace(/(?:配布|内容版)\s*r\d+\b/gi, "")
      .replace(/\br\d+\s*[・:]\s*/gi, "")
      .replace(/\s*[/|]\s*(?=$)/g, "")
      .replace(/^\s*[・/|:-]+\s*|\s*[・/|:-]+\s*$/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function scrubVersions() {
    const selectors = [
      ".badge",
      ".footer",
      "footer",
      "#r59-globalbar",
      "[class*='version']",
      "[class*='revision']",
    ];
    document.querySelectorAll(selectors.join(",")).forEach((host) => {
      const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        node.nodeValue = cleanVersionLabel(node.nodeValue || "");
      });
      if (!host.textContent.trim() && !host.querySelector("a,button")) host.hidden = true;
    });
    document.querySelectorAll(".r63-package").forEach((node) => {
      node.hidden = true;
    });
    document.querySelectorAll("[id$='TickMetric'],[id$='SigMetric'],[id$='DomainStepMetric']").forEach((node) => {
      const metric = node.closest(".metric");
      if (metric) metric.hidden = true;
    });
  }

  const LIST_PAGES = ["kids-index.html", "explore.html"];

  // Which list the visitor arrived from. document.referrer is empty over file://
  // and on direct opens, so the list pages also record the choice, and that
  // record wins. Without this a child is always sent back to the adult portal.
  function preferredList() {
    let saved = "";
    try {
      saved = localStorage.getItem("lab4wonder_list") || "";
    } catch (error) {
      saved = "";
    }
    const referrer = (document.referrer || "").split("/").pop();
    if (LIST_PAGES.indexOf(referrer) >= 0) return referrer;
    if (LIST_PAGES.indexOf(saved) >= 0) return saved;
    return "";
  }

  function installNavigation() {
    if (document.querySelector("#r59-globalbar,.lw-globalbar")) return;
    const list = preferredList();
    const kids = list === "kids-index.html";
    const nav = document.createElement("nav");
    nav.className = "lw-globalbar";
    nav.setAttribute("aria-label", kids ? "いちらんに もどる" : "アプリ一覧へ戻る");
    nav.innerHTML = kids
      ? [
          '<a href="kids-index.html">← いちらん</a>',
          '<a href="explore.html">おとな一覧</a>',
        ].join("")
      : [
          '<a href="' + (list || "index.html") + '">← ' + (list ? "一覧" : "入口") + "</a>",
          '<a href="explore.html">すべての実験</a>',
          '<a href="kids-index.html">こども一覧</a>',
        ].join("");
    document.body.prepend(nav);
  }

  function findResetButton() {
    const candidates = [...document.querySelectorAll("button")];
    return candidates.find((button) => {
      if (button.closest("[role='dialog'],.sheetBack,.modalBack,#r66-coach")) return false;
      const id = (button.id || "").toLowerCase();
      const text = (button.textContent || "").trim();
      const idMatch = /^(reset|resetbtn|resettop|resetw|btnreset)$/.test(id);
      const textMatch = /^(?:↺|↻|リセット|初期化|最初から)/.test(text);
      return idMatch || textMatch;
    });
  }

  function installResetDock() {
    const reset = findResetButton();
    if (!reset || document.querySelector(".lw-reset-dock")) return;
    const dock = document.createElement("div");
    dock.className = "lw-reset-dock";
    if (document.querySelector(".trayOpen,#trayOpen")) {
      dock.classList.add("lw-reset-dock--with-tray");
    }
    dock.setAttribute("aria-label", "共通操作");
    reset.textContent = "↺ はじめから";
    reset.setAttribute("aria-label", "このアプリを最初の状態へ戻す");
    dock.appendChild(reset);
    document.body.appendChild(dock);
  }

  function createMeaning(items) {
    const section = document.createElement("section");
    section.className = "lw-meaning";
    section.setAttribute("aria-label", "色と記号の意味");
    const title = document.createElement("strong");
    title.className = "lw-meaning-title";
    title.textContent = "色・記号の意味";
    const list = document.createElement("div");
    list.className = "lw-meaning-items";
    items.forEach(([color, label]) => {
      const item = document.createElement("span");
      item.className = "lw-meaning-item";
      const swatch = document.createElement("i");
      swatch.className = "lw-meaning-swatch";
      swatch.style.setProperty("--lw-color", color);
      swatch.setAttribute("aria-hidden", "true");
      item.append(swatch, document.createTextNode(label));
      list.appendChild(item);
    });
    section.append(title, list);
    return section;
  }

  function enhanceExistingLegends() {
    document.querySelectorAll(".legend").forEach((legend) => {
      if (legend.closest(".lw-meaning") || legend.dataset.lwLabeled) return;
      legend.dataset.lwLabeled = "true";
      const title = document.createElement("strong");
      title.className = "lw-meaning-title";
      title.textContent = "色・記号の意味";
      legend.insertAdjacentElement("beforebegin", title);
    });
  }

  function installMeaning() {
    enhanceExistingLegends();
    const items = legends[page];
    if (!items || document.querySelector(".lw-meaning")) return;
    const stage = document.querySelector("[data-tour='stage'],.stage");
    if (stage) stage.insertAdjacentElement("afterend", createMeaning(items));
  }

  function installTouchHint() {
    const text = touchHints[page];
    if (!text || document.querySelector(".lw-touch-hint")) return;
    const stage = document.querySelector("[data-tour='stage'],.stage");
    if (!stage) return;
    const hint = document.createElement("div");
    hint.className = "lw-touch-hint";
    hint.textContent = `👆 ${text}`;
    stage.insertAdjacentElement("afterend", hint);
  }

  function installVocabulary() {
    const items = vocabularies[page];
    if (!items || document.querySelector(".lw-vocabulary")) return;
    const details = document.createElement("details");
    details.className = "lw-vocabulary";
    const summary = document.createElement("summary");
    summary.textContent = "📖 むずかしいことば";
    const list = document.createElement("dl");
    items.forEach(([term, meaning]) => {
      const title = document.createElement("dt");
      title.textContent = term;
      const description = document.createElement("dd");
      description.textContent = meaning;
      list.append(title, description);
    });
    details.append(summary, list);
    const hint = document.querySelector(".lw-touch-hint");
    const meaning = document.querySelector(".lw-meaning");
    (hint || meaning)?.insertAdjacentElement("afterend", details);
  }

  function toast(message) {
    let node = document.querySelector(".lw-toast");
    if (!node) {
      node = document.createElement("div");
      node.className = "lw-toast";
      node.setAttribute("role", "status");
      document.body.appendChild(node);
    }
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("show"), 1400);
  }

  function motionKindFor(encounter) {
    const icon = encounter?.icon || "";
    const group = encounter?.group || "";
    if (icon === "🪼" || /刺胞|有櫛/.test(group)) return "rise";
    if (/🐟|🦑|🦐/.test(icon) || /魚|頭足|甲殻/.test(group)) return "cross";
    if (page === "constellation-guide.html") return "glow";
    return "drift";
  }

  function moveMainTarget(target, stage, encounter) {
    const margin = 20;
    const width = target.offsetWidth || 74;
    const height = target.offsetHeight || 74;
    const maxX = Math.max(margin, stage.clientWidth - width - margin);
    const maxY = Math.max(82, stage.clientHeight - height - margin);
    const spanX = Math.max(1, maxX - margin);
    const spanY = Math.max(1, maxY - 82);
    const kind = motionKindFor(encounter);
    const duration = kind === "cross" ? 11000 : kind === "rise" ? 12500 : 9000;
    const start = { x: margin + spanX * 0.28, y: 82 + spanY * 0.62 };
    const end = { x: margin + spanX * 0.68, y: 82 + spanY * 0.38 };

    if (kind === "cross") {
      start.x = margin;
      end.x = maxX;
      start.y = end.y = 82 + spanY * (0.3 + Math.random() * 0.42);
    } else if (kind === "rise") {
      start.x = end.x = margin + spanX * (0.25 + Math.random() * 0.5);
      start.y = maxY;
      end.y = 82 + spanY * 0.08;
    } else if (kind === "glow") {
      start.x = end.x = margin + spanX * (0.2 + Math.random() * 0.6);
      start.y = end.y = 82 + spanY * (0.18 + Math.random() * 0.5);
    } else {
      start.x = margin + spanX * (0.2 + Math.random() * 0.25);
      start.y = 82 + spanY * (0.35 + Math.random() * 0.35);
      end.x = Math.min(maxX, start.x + Math.max(36, spanX * 0.22));
      end.y = Math.max(82, start.y - Math.max(18, spanY * 0.12));
    }

    target.dataset.motion = kind;
    target.style.setProperty("--lw-travel-ms", `${duration}ms`);
    target.style.transition = "none";
    target.style.left = `${start.x}px`;
    target.style.top = `${start.y}px`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        target.style.transition = "";
        target.style.left = `${end.x}px`;
        target.style.top = `${end.y}px`;
      });
    });
  }

  function installMainExploration(atlasRoot) {
    if (document.querySelector(".lw-main-exploration")) return;
    const nativeStatus = document.querySelector("#creatureStatus,#animalStatus,#organismStatus");
    if (nativeStatus) {
      const atlasOpen = document.querySelector("#r60-atlas-open,#r59-atlas-open");
      const atlasScan = atlasRoot.querySelector("#r60-atlas-scan,#r59-atlas-scan");
      const atlasRandom = atlasRoot.querySelector("#r60-atlas-random,#r59-atlas-random");
      if (atlasOpen) {
        atlasOpen.textContent = "📚 みつけた図鑑";
        atlasOpen.setAttribute("aria-label", "メイン画面で見つけたものの図鑑を開く");
      }
      if (atlasScan) atlasScan.hidden = true;
      if (atlasRandom) atlasRandom.hidden = true;
      const intro = atlasRoot.querySelector(".intro");
      if (intro && !intro.querySelector(".lw-atlas-viewer-note")) {
        const note = document.createElement("p");
        note.className = "lw-atlas-viewer-note";
        note.textContent = "発見は研究モードの主画面で行います。ここは見つけたカードを確かめる図鑑です。";
        intro.appendChild(note);
      }
      return;
    }
    const canvas = document.querySelector("#mainCv,#mainCanvas,#geo");
    const stage = canvas?.closest(".stage") || canvas?.parentElement;
    if (!canvas || !stage || !window.__lwAtlas) return;

    stage.classList.add("lw-main-hunt-stage");
    const target = document.createElement("button");
    target.type = "button";
    target.className = "lw-main-hunt-target";
    target.hidden = true;
    target.setAttribute("aria-label", "メイン画面に現れた発見対象");
    stage.appendChild(target);

    const panel = document.createElement("section");
    panel.className = "lw-main-exploration";
    panel.setAttribute("aria-label", "メイン画面で探索");
    panel.innerHTML = [
      '<div class="lw-main-exploration-copy">',
      '<b>🔎 この画面で探索</b>',
      '<span class="lw-main-exploration-status" aria-live="polite">環境の中に現れるものを見つけてタップしよう。</span>',
      "</div>",
      '<button type="button" class="lw-main-exploration-next">つぎを探す</button>',
      '<button type="button" class="lw-main-exploration-book">📚 みつけた図鑑</button>',
    ].join("");
    stage.insertAdjacentElement("afterend", panel);

    const status = panel.querySelector(".lw-main-exploration-status");
    const nextButton = panel.querySelector(".lw-main-exploration-next");
    const bookButton = panel.querySelector(".lw-main-exploration-book");
    const atlasOpen = document.querySelector("#r60-atlas-open,#r59-atlas-open");
    const atlasScan = atlasRoot.querySelector("#r60-atlas-scan,#r59-atlas-scan");
    const atlasRandom = atlasRoot.querySelector("#r60-atlas-random,#r59-atlas-random");
    let encounter = null;
    const mainInstruction = document.body.dataset.first || "主画面に現れるものをタップして発見しよう。";
    const syncCoachInstruction = () => {
      const coach = document.querySelector("#r66-coach");
      if (!coach || coach.dataset.stage !== "0") return;
      const compactText = coach.querySelector(".r66-compact-text span");
      const missionText = coach.querySelector(".r66-mission");
      if (compactText) compactText.textContent = mainInstruction;
      if (missionText) missionText.textContent = mainInstruction;
    };
    document.querySelectorAll("#r66-coach .r66-tab").forEach((button) => {
      button.addEventListener("click", () => requestAnimationFrame(syncCoachInstruction));
    });
    syncCoachInstruction();

    if (atlasOpen) {
      atlasOpen.textContent = "📚 みつけた図鑑";
      atlasOpen.setAttribute("aria-label", "メイン画面で見つけたものの図鑑を開く");
    }
    if (atlasScan) atlasScan.hidden = true;
    if (atlasRandom) atlasRandom.hidden = true;
    const intro = atlasRoot.querySelector(".intro");
    if (intro && !intro.querySelector(".lw-atlas-viewer-note")) {
      const note = document.createElement("p");
      note.className = "lw-atlas-viewer-note";
      note.textContent = "発見は研究モードのメイン画面で行います。ここは見つけたカードを確かめる図鑑です。";
      intro.appendChild(note);
    }

    const stopMovement = () => {
      target.style.transition = "none";
    };
    const startMovement = () => {
      stopMovement();
      moveMainTarget(target, stage, encounter);
    };
    const startEncounter = () => {
      encounter = window.__lwAtlas?.getEncounter?.() || null;
      if (!encounter) {
        target.hidden = true;
        stopMovement();
        status.textContent = "この環境で見つけられるものは集めました。図鑑を見てみよう。";
        return;
      }
      target.hidden = false;
      target.textContent = encounter.icon || "？";
      target.dataset.name = encounter.name || "";
      target.dataset.rarity = String(encounter.rarity || 1);
      target.setAttribute("aria-label", `メイン画面に現れた${encounter.group || "発見対象"}`);
      const movement = motionKindFor(encounter) === "rise"
        ? "下からゆっくり浮かんでくる"
        : motionKindFor(encounter) === "cross"
          ? "画面をゆっくり横切る"
          : "景色の中をゆっくり動く";
      status.textContent = `${encounter.zone || "この環境"}に何か現れた。${movement}姿をタップしよう。`;
      requestAnimationFrame(() => {
        startMovement();
      });
    };

    nextButton.addEventListener("click", startEncounter);
    bookButton.addEventListener("click", () => atlasOpen?.click());
    nextButton.hidden = true;
    target.addEventListener("pointerdown", (event) => event.stopPropagation());
    target.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!encounter) return;
      const found = encounter;
      const collected = window.__lwAtlas?.collect?.(found.name, false);
      stopMovement();
      target.hidden = true;
      target.dataset.name = "";
      encounter = null;
      if (collected) {
        status.textContent = `発見！ ${found.icon || ""} ${found.name} — ${found.fact || "図鑑に記録しました。"}`;
        toast(`${found.name}を図鑑に記録`);
      }
    });

    // Wait for the visitor to start the app. This layer used to spawn its
    // creature 650ms after load, so something drifted across a cave or a reef
    // that had not been played yet, which is exactly what the apps themselves
    // were changed to stop doing.
    status.textContent = "▶ 再生を押すと、この景色の中に何か現れます。";
    const play = document.querySelector("#playPause,#playBtn,#play");
    if (!play) {
      // Nothing to wait for: this app runs continuously.
      nextButton.hidden = false;
      window.setTimeout(startEncounter, 650);
      return;
    }
    const begin = () => {
      nextButton.hidden = false;
      startEncounter();
    };
    play.addEventListener("click", function once() {
      play.removeEventListener("click", once);
      window.setTimeout(begin, 650);
    });
  }

  function watchExplorationAtlas() {
    if (!explorationPages.has(page)) return;
    const install = () => {
      const atlas = document.querySelector("#r60-atlas,#r59-atlas");
      if (atlas) installMainExploration(atlas);
      return Boolean(atlas);
    };
    if (install()) return;
    const observer = new MutationObserver(() => {
      if (install()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function installSlimeTouch() {
    if (page !== "slime-mold.html") return;
    if (document.querySelector("#biology-interaction-v1")) return;
    const canvas = document.querySelector("#mainCv");
    const blockButton = document.querySelector("#blockBtn");
    if (!canvas || !blockButton) return;
    let blockMode = false;
    blockButton.textContent = "障害物モード";
    blockButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      blockMode = !blockMode;
      blockButton.classList.toggle("on", blockMode);
      toast(blockMode ? "障害物を置く場所をタップ" : "餌を置く場所をタップ");
    }, true);
    canvas.addEventListener("pointerdown", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width * canvas.width;
      const y = (event.clientY - rect.top) / rect.height * canvas.height;
      try {
        if (blockMode) {
          blocks.push({ x, y, r: 36 });
          toast("障害物を置きました");
        } else {
          foods.push({ x, y, n: 1 });
          toast("餌を置きました");
        }
        draw();
      } catch (error) {
        console.error("Lab4Wonder slime touch failed", error);
      }
    });
  }

  function installAntTouch() {
    if (page !== "ant-colony.html") return;
    const canvas = document.querySelector("#mainCv");
    if (!canvas) return;
    let nextRoomType = 0;
    const roomTypes = ["育児室", "食料庫", "休息室", "換気室"];

    document.addEventListener("pointerdown", (event) => {
      if (event.target !== canvas || canvas.classList.contains("zoomOn")) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width * canvas.width;
      const y = (event.clientY - rect.top) / rect.height * canvas.height;
      try {
        if (y < 245) {
          foods.push({ x: Math.max(45, Math.min(855, x)), y: Math.max(65, y), n: 65 });
          toast("ここに餌を置きました");
        } else {
          addAntRoom(x, y, roomTypes[nextRoomType % roomTypes.length]);
          nextRoomType += 1;
          toast("地下に新しい巣室を掘りました");
        }
        draw();
      } catch (error) {
        console.error("Lab4Wonder ant touch failed", error);
      }
    }, true);

    try {
      const originalStep = step;
      step = (delta) => {
        originalStep(delta);
        growAntNest(delta);
      };
      const originalDraw = draw;
      draw = () => {
        originalDraw();
        drawAntRoomLinks();
      };
    } catch (error) {
      console.error("Lab4Wonder ant growth patch failed", error);
    }
  }

  function addAntRoom(x, y, type) {
    const safeX = Math.max(70, Math.min(830, x));
    const safeY = Math.max(290, Math.min(545, y));
    const duplicate = rooms.some((room) => Math.hypot(room.x - safeX, room.y - safeY) < 62);
    if (duplicate) {
      toast("別の場所をタップすると巣室を増やせます");
      return;
    }
    const parent = rooms.reduce((best, room) => {
      const distance = Math.hypot(room.x - safeX, room.y - safeY);
      return !best || distance < best.distance ? { room, distance } : best;
    }, null)?.room;
    rooms.push({ x: safeX, y: safeY, r: 27, type, parent });
    nest = Math.min(1, nest + 0.07);
  }

  function growAntNest(delta) {
    const digging = ants.filter((ant) => ant.state === "dig").length;
    if (!digging || rooms.length >= 9) return;
    nest = Math.min(1, nest + delta * digging / Math.max(1, ants.length) * 0.018);
    const targetCount = 3 + Math.floor(nest * 7);
    if (rooms.length >= targetCount) return;
    const angle = rooms.length * 2.18;
    const radius = 95 + rooms.length * 17;
    addAntRoom(
      entrance.x + Math.cos(angle) * radius,
      365 + Math.sin(angle) * Math.min(145, radius),
      ["育児室", "食料庫", "換気室", "休息室"][rooms.length % 4],
    );
  }

  function drawAntRoomLinks() {
    c.save();
    c.strokeStyle = "rgba(31,24,18,.72)";
    c.lineWidth = 7;
    c.lineCap = "round";
    rooms.forEach((room) => {
      if (!room.parent) return;
      c.beginPath();
      c.moveTo(room.parent.x, room.parent.y);
      c.lineTo(room.x, room.y);
      c.stroke();
    });
    c.restore();
  }

  function createDirectTools(stage, definitions, initial) {
    const row = document.createElement("div");
    row.className = "lw-direct-tools";
    let selected = initial;
    definitions.forEach(([value, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.classList.toggle("on", value === selected);
      button.addEventListener("click", () => {
        selected = value;
        row.querySelectorAll("button").forEach((item) => item.classList.remove("on"));
        button.classList.add("on");
      });
      row.appendChild(button);
    });
    stage.insertAdjacentElement("afterend", row);
    return () => selected;
  }

  function installFoodChainTouch() {
    if (page !== "food-chain.html") return;
    const canvas = document.querySelector("#mainCv");
    if (!canvas) return;
    canvas.addEventListener("pointerdown", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width * canvas.width;
      const y = (event.clientY - rect.top) / rect.height * canvas.height;
      try {
        const nearest = animals.reduce((best, animal) => {
          const distance = Math.hypot(animal.x - x, animal.y - y);
          return !best || distance < best.distance ? { animal, distance } : best;
        }, null);
        if (nearest && nearest.distance < 42) {
          if (nearest.animal.kind === "H") {
            H = Math.min(55, H + 3);
            toast("草食動物に餌を与えました");
          } else {
            R = Math.min(22, R + 1);
            toast("捕食者を1匹加えました");
          }
        } else {
          P = Math.min(115, P + 9);
          toast("ここに植物を増やしました");
        }
        draw();
      } catch (error) {
        console.error("Lab4Wonder food-chain touch failed", error);
      }
    });
  }

  function installMonarchTouch() {
    if (page !== "monarch-migration.html") return;
    const canvas = document.querySelector("#mainCv");
    if (!canvas) return;
    const planted = [];
    try {
      const originalDrawAll = drawAll;
      drawAll = () => {
        originalDrawAll();
        drawMilkweedPatches(planted);
      };
    } catch (error) {
      console.error("Lab4Wonder monarch draw patch failed", error);
    }
    canvas.addEventListener("pointerdown", (event) => {
      const rect = canvas.getBoundingClientRect();
      const point = {
        x: (event.clientX - rect.left) / rect.width * canvas.width,
        y: (event.clientY - rect.top) / rect.height * canvas.height,
      };
      if (point.x < 180 || point.x > 700 || point.y < 35 || point.y > 465) return;
      planted.push(point);
      const milkweed = document.querySelector("#c2");
      milkweed.value = Math.min(Number(milkweed.max), Number(milkweed.value) + 5);
      milkweed.dispatchEvent(new Event("input", { bubbles: true }));
      toast("渡り道にミルクウィードを植えました");
    });
  }

  function drawMilkweedPatches(points) {
    const canvas = document.querySelector("#mainCv");
    const context = canvas.getContext("2d");
    points.forEach((point) => {
      context.strokeStyle = "#3f8f52";
      context.fillStyle = "#76cb7f";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(point.x, point.y + 13);
      context.lineTo(point.x, point.y - 12);
      context.stroke();
      context.beginPath();
      context.ellipse(point.x - 6, point.y - 4, 8, 4, -0.5, 0, Math.PI * 2);
      context.ellipse(point.x + 6, point.y + 2, 8, 4, 0.5, 0, Math.PI * 2);
      context.fill();
    });
  }

  function installTreeRingTouch() {
    if (page !== "tree-rings.html") return;
    const canvas = document.querySelector("#mainCv");
    const getMode = createDirectTools(
      canvas.closest(".stage"),
      [["drought", "☀️ 干ばつ"], ["wet", "💧 大雨"], ["fire", "🔥 火災"]],
      "drought",
    );
    try {
      const originalTreeDraw = draw;
      draw = () => {
        originalTreeDraw();
        drawWetRingMarks();
      };
    } catch (error) {
      console.error("Lab4Wonder tree-ring draw patch failed", error);
    }
    canvas.addEventListener("pointerdown", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width * canvas.width;
      const y = (event.clientY - rect.top) / rect.height * canvas.height;
      const radius = Math.hypot(x - 650, y - 310);
      const index = ringIndexAtRadius(radius);
      if (index < 0) return;
      const ring = rings[index];
      ring.drought = false;
      ring.fire = false;
      ring.wet = false;
      if (getMode() === "drought") {
        ring.drought = true;
        ring.w *= 0.48;
        toast(`${index + 1}年目を干ばつ年にしました`);
      } else if (getMode() === "wet") {
        ring.wet = true;
        ring.w *= 1.45;
        toast(`${index + 1}年目を雨の多い年にしました`);
      } else {
        ring.fire = true;
        toast(`${index + 1}年目に火災の傷を残しました`);
      }
      draw();
    });
  }

  function drawWetRingMarks() {
    let radius = 20;
    c.save();
    c.strokeStyle = "#72bde8";
    c.lineWidth = 4;
    rings.forEach((ring) => {
      radius += ring.w * 2.7;
      if (!ring.wet) return;
      c.beginPath();
      c.arc(650, 310, radius, 0.75, 1.15);
      c.stroke();
    });
    c.restore();
  }

  function ringIndexAtRadius(radius) {
    let outer = 20;
    for (let index = 0; index < rings.length; index += 1) {
      outer += rings[index].w * 2.7;
      if (Math.abs(radius - outer) < Math.max(8, rings[index].w * 2.7)) return index;
    }
    return -1;
  }

  function installWeatheringTouch() {
    if (page !== "weathering-lab.html") return;
    const canvas = document.querySelector("#weatherCanvas");
    if (!canvas) return;
    canvas.addEventListener("pointerdown", (event) => {
      if (canvas.classList.contains("zoomOn")) return;
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width * canvas.width;
      const y = (event.clientY - rect.top) / rect.height * canvas.height;
      if (x < 85 || x > 445 || y < 150 || y > 420) return;
      cracks = Math.min(1, cracks + 0.055);
      const chip = Math.min(integrity - 0.04, 0.012);
      integrity = Math.max(0.04, integrity - chip);
      soil = Math.min(1, soil + chip);
      age += 25;
      recordW();
      drawW();
      toast("岩をこすって粒をはがしました");
    });
  }

  function installPlanktonTouch() {
    if (page !== "plankton-world.html") return;
    const canvas = document.querySelector("#micro");
    if (!canvas) return;
    const getMode = createDirectTools(
      canvas.closest(".stage"),
      [["nutrient", "💧 栄養を落とす"], ["phy", "🟢 植物を加える"], ["zoo", "🩷 動物を加える"]],
      "nutrient",
    );
    canvas.addEventListener("pointerdown", () => {
      try {
        const mode = getMode();
        if (mode === "nutrient") nut = Math.min(220, nut + 24);
        if (mode === "phy") phy = Math.min(260, phy + 24);
        if (mode === "zoo") zoo = Math.min(180, zoo + 12);
        toast(mode === "nutrient" ? "栄養のしずくを加えました" : mode === "phy" ? "植物プランクトンを加えました" : "動物プランクトンを加えました");
        draw();
      } catch (error) {
        console.error("Lab4Wonder plankton touch failed", error);
      }
    });
  }

  // --- furigana for the kids entrance -------------------------------------
  // The kids list shows ruby on every card, but until now the apps themselves
  // were adult kanji, so the reading support ended at the front door. This
  // attaches readings to the app's own interface, and only for a visitor who
  // came in through the kids entrance.
  //
  // FURIGANA is generated from the vocabulary actually used across the apps.
  // Keys are pure kanji runs. A string value is the reading. An object value
  // selects the reading by the kana that follows, with "" as the default, which
  // is how 変 reads か in 変える but へん on its own.
  const FURIGANA = {"一":{"":"いち","つ":"ひと"},"一光子":"いっこうし","一列":"いちれつ","一匹":"いっぴき","一反応":"いちはんのう","一周":"いっしゅう","一周期当":"いっしゅうきあ","一回":"いっかい","一回拍出量":"いっかいはくしゅつりょう","一回採":{"り":"いっかいと"},"一回換気量":"いっかいかんきりょう","一定":"いってい","一定温度":"いっていおんど","一定範囲":"いっていはんい","一定速度":"いっていそくど","一定量":"いっていりょう","一室":"いっしつ","一小節":"いちしょうせつ","一年":"いちねん","一年周期":"いちねんしゅうき","一度":"いちど","一度入":"いちどい","一度描":"いちどえが","一度複製":"いちどふくせい","一意":"いちい","一意性証明":"いちいせいしょうめい","一拍":"いっぱく","一文":"いちぶん","一文字":"ひともじ","一斉発光":"いっせいはっこう","一方":"いっぽう","一方向":"いちほうこう","一方向流":"いちほうこうりゅう","一時停止":"いちじていし","一時停止中":"いちじていしちゅう","一時的":"いちじてき","一本":"いっぽん","一本道":"いっぽんみち","一枚":"いちまい","一枚開":"いちまいひら","一様":"いちよう","一様圧力":"いちようあつりょく","一様密度層":"いちようみつどそう","一様流":"いちようりゅう","一次元":"いちじげん","一次元模型":"いちじげんもけい","一次元熱拡散":"いちじげんねつかくさん","一次元運動":"いちじげんうんどう","一次元運動模型":"いちじげんうんどうもけい","一次応答":"いちじおうとう","一次電池":"いちじでんち","一歩":"いっぽ","一歩進":"いっぽすす","一段":"いちだん","一段育":"いちだんそだ","一段送":"いちだんおく","一段進":"いちだんすす","一点":"いってん","一点近":"いってんちか","一点透視":"いってんとうし","一直線":"いっちょくせん","一直線状":"いっちょくせんじょう","一瞬":"いっしゅん","一粒":"ひとつぶ","一続":"ひとつづ","一群":"いちぐん","一羽":"いちわ","一致":"いっち","一致度":"いっちど","一致指数":"いっちしすう","一致数":"いっちすう","一致率":"いっちりつ","一般化":"いっぱんか","一覧":"いちらん","一言":"ひとこと","一語":"いちご","一貫性":"いっかんせい","一部":"いちぶ","一項目":"いちこうもく","七":"なな","七夕":"たなばた","万年":"まんねん","万能指示薬":"ばんのうしじやく","万華鏡":"まんげきょう","丈夫":"じょうぶ","三":{"":"さん","つ":"みっ"},"三分割":"さんぶんかつ","三態":"さんたい","三手掛":"さんてがか","三条件":"さんじょうけん","三枚":"さんまい","三次元":"さんじげん","三次元形状":"さんじげんけいじょう","三次元放射":"さんじげんほうしゃ","三次元構造":"さんじげんこうぞう","三次元流":"さんじげんなが","三次元渦":"さんじげんうず","三次元点":"さんじげんてん","三次元的":"さんじげんてき","三次元結晶面":"さんじげんけっしょうめん","三次元茎構造":"さんじげんくきこうぞう","三次元表示":"さんじげんひょうじ","三次元運動":"さんじげんうんどう","三次関数":"さんじかんすう","三種類":"さんしゅるい","三角":"さんかく","三角形":"さんかくけい","上":{"":"うえ","が":"あ","げ":"あ"},"上下":"じょうげ","上下二領域":"じょうげにりょういき","上下位置":"じょうげいち","上下推進":"じょうげすいしん","上下流体密度":"じょうげりゅうたいみつど","上下温度差":"じょうげおんどさ","上位候補":"じょういこうほ","上位候補確率":"じょういこうほかくりつ","上位蜃気楼":"じょういしんきろう","上向":{"き":"うわむ"},"上回":"うわまわ","上層":"じょうそう","上層密度":"じょうそうみつど","上層流出":"じょうそうりゅうしゅつ","上弦":"じょうげん","上方":"じょうほう","上昇":"じょうしょう","上昇性能":"じょうしょうせいのう","上昇流":"じょうしょうりゅう","上昇率":"じょうしょうりつ","上昇距離":"じょうしょうきょり","上昇高":"じょうしょうたか","上流":"じょうりゅう","上空":"じょうくう","上空側":"じょうくうがわ","上部":"じょうぶ","上部帯":"じょうぶたい","上限":"じょうげん","上限到達":"じょうげんとうたつ","下":{"":"した","が":"さ","げ":"さ"},"下位":"かい","下位蜃気楼":"かいしんきろう","下向":"したむ","下回":"したまわ","下図":"したず","下層":"かそう","下層密度":"かそうみつど","下層湿度":"かそうしつど","下弦":"かげん","下流":"かりゅう","下流到達":"かりゅうとうたつ","下流堆積":"かりゅうたいせき","下等":"かとう","下降":"かこう","下降中":"かこうちゅう","下降弁":"かこうべん","不一致累積":"ふいっちるいせき","不利":"ふり","不均一":"ふきんいつ","不均衡":"ふきんこう","不安定":"ふあんてい","不完全優性":"ふかんぜんゆうせい","不完全性":"ふかんぜんせい","不完全燃焼":"ふかんぜんねんしょう","不整脈":"ふせいみゃく","不明瞭":"ふめいりょう","不正確":"ふせいかく","不燃":"ふねん","不確":"ふたし","不確実":"ふかくじつ","不確実性":"ふかくじつせい","不要":"ふよう","不規則":"ふきそく","不足":"ふそく","不連続点":"ふれんぞくてん","与":"あた","世代":"せだい","世代交代":"せだいこうたい","世代数":"せだいすう","世代番号":"せだいばんごう","世代進":"せだいすす","世代非重複":"せだいひじゅうふく","世代頻度":"せだいひんど","世界":"せかい","世話":"せわ","丘陵流域":"きゅうりょうりゅういき","両方":"りょうほう","両極":"りょうきょく","両生類":"りょうせいるい","両立":"りょうりつ","両者":"りょうしゃ","並":"なら","並列":"へいれつ","並走":"へいそう","中":"なか","中初期位置":"なかしょきいち","中和":"ちゅうわ","中和当量":"ちゅうわとうりょう","中和後":"ちゅうわご","中央":"ちゅうおう","中央値":"ちゅうおうち","中央制御":"ちゅうおうせいぎょ","中央包絡幅":"ちゅうおうほうらくはば","中央寄":{"り":"ちゅうおうよ"},"中央消失点":"ちゅうおうしょうしつてん","中央渦":"ちゅうおううず","中央直線":"ちゅうおうちょくせん","中央線":"ちゅうおうせん","中心":"ちゅうしん","中心位置":"ちゅうしんいち","中心固定":"ちゅうしんこてい","中心模型":"ちゅうしんもけい","中心模様":"ちゅうしんもよう","中心機構":"ちゅうしんきこう","中心気圧":"ちゅうしんきあつ","中心温度":"ちゅうしんおんど","中心質量":"ちゅうしんしつりょう","中心近":"ちゅうしんちか","中心部":"ちゅうしんぶ","中性":"ちゅうせい","中性原子":"ちゅうせいげんし","中性子":"ちゅうせいし","中性子数":"ちゅうせいしすう","中期停止":"ちゅうきていし","中止":"ちゅうし","中深層":"ちゅうしんそう","中深層魚":"ちゅうしんそうぎょ","中程度":"ちゅうていど","中空":"ちゅうくう","中立浮力":"ちゅうりつふりょく","中間":"ちゅうかん","中間留分":"ちゅうかんりゅうぶん","中間領域":"ちゅうかんりょういき","丸":"まる","主":"おも","主光線":"しゅこうせん","主半径":"しゅはんけい","主因":"しゅいん","主図":"しゅず","主役":"しゅやく","主役配置":"しゅやくはいち","主成分":"しゅせいぶん","主機":"しゅき","主画面":"しゅがめん","主要光線":"しゅようこうせん","主要地点":"しゅようちてん","主要留分":"しゅようりゅうぶん","主題":"しゅだい","乗":"じょう","乗法":"じょうほう","乱":"みだ","乱数":"らんすう","乱数分布":"らんすうぶんぷ","乱数種":"らんすうしゅ","乱流":"らんりゅう","乱雑":"らんざつ","乾":"かわ","乾燥":"かんそう","乾燥砂山":"かんそうすなやま","乾燥負荷":"かんそうふか","亀裂":"きれつ","亀裂先端":"きれつせんたん","亀裂進展":"きれつしんてん","亀裂進展速度":"きれつしんてんそくど","亀裂長":"きれつちょう","亀裂長別":"きれつちょうべつ","亀裂開始":"きれつかいし","予備費":"よびひ","予備量":"よびりょう","予報":"よほう","予定外出費":"よていがいしゅっぴ","予想":"よそう","予測":"よそく","予測停止点":"よそくていしてん","予測制御":"よそくせいぎょ","予測可能性":"よそくかのうせい","予測可能時間":"よそくかのうじかん","予測能力":"よそくのうりょく","予測誤差":"よそくごさ","予測限界":"よそくげんかい","予知":"よち","予算":"よさん","事前免疫":"じぜんめんえき","事情":"じじょう","事業計画":"じぎょうけいかく","二":{"":"に","つ":"ふた"},"二倍体":"にばいたい","二匹":"にひき","二台":"にだい","二台全体":"にだいぜんたい","二対立遺伝子":"にたいりついでんし","二尺度":"にしゃくど","二層流体":"にそうりゅうたい","二層流体中":"にそうりゅうたいちゅう","二峰性混合":"にほうせいこんごう","二成分":"にせいぶん","二手":"ふたて","二方向":"にほうこう","二条件":"にじょうけん","二枚貝":"にまいがい","二案":"にあん","二次元":"にじげん","二次元帯水層":"にじげんたいすいそう","二次元平衡模型":"にじげんへいこうもけい","二次元投影":"にじげんとうえい","二次元断面":"にじげんだんめん","二次元模型":"にじげんもけい","二次元流":"にじげんなが","二次元複製":"にじげんふくせい","二次元質点模型":"にじげんしつてんもけい","二次元運動":"にじげんうんどう","二次元配置模型":"にじげんはいちもけい","二次関数":"にじかんすう","二段階":"にだんかい","二波源":"にはげん","二点":"にてん","二物体":"にぶったい","二種":"にしゅ","二種類":"にしゅるい","二肺胞":"にはいほう","二試行":"にしこう","二酸化炭素":"にさんかたんそ","二重":"にじゅう","二重振":"にじゅうふ","二重段進":"にじゅうだんしん","二重結合":"にじゅうけつごう","五回":"ごかい","五角形":"ごかくけい","交":"まじ","交互":"こうご","交差":"こうさ","交差位置":"こうさいち","交差点":"こうさてん","交差点交通制御":"こうさてんこうつうせいぎょ","交換":"こうかん","交換回数":"こうかんかいすう","交換対":"こうかんつい","交換条件":"こうかんじょうけん","交換盤":"こうかんばん","交換関係":"こうかんかんけい","交流":"こうりゅう","交渉":"こうしょう","交点":"こうてん","交点位置":"こうてんいち","人":"ひと","人体":"じんたい","人体安全":"じんたいあんぜん","人員":"じんいん","人工呼吸器設定":"じんこうこきゅうきせってい","人工配列":"じんこうはいれつ","人数":"にんずう","人物":"じんぶつ","人物群":"じんぶつぐん","人物配置":"じんぶつはいち","人間":"にんげん","人間活動":"にんげんかつどう","人間的":"にんげんてき","今":"いま","今使":{"う":"いまつか","え":"いまつか"},"今回":"こんかい","今押":{"せ":"いまお"},"今日":"きょう","介入":"かいにゅう","介入時期":"かいにゅうじき","介入開始":"かいにゅうかいし","介入開始日":"かいにゅうかいしび","介在":"かいざい","仕事":"しごと","仕事配分":"しごとはいぶん","仕入":"しい","仕入費":"しいれひ","仕組":"しく","他":"ほか","付":"つ","付加質量":"ふかしつりょう","付着":"ふちゃく","付着器":"ふちゃくき","付着生物":"ふちゃくせいぶつ","付着距離":"ふちゃくきょり","付近":"ふきん","代":{"わ":"か"},"代償":"だいしょう","代入":"だいにゅう","代替":"だいたい","代替供給先":"だいたいきょうきゅうさき","代替経路":"だいたいけいろ","代表":"だいひょう","代表個体":"だいひょうこたい","代表光線":"だいひょうこうせん","代表点":"だいひょうてん","代表的":"だいひょうてき","代表粒径":"だいひょうりゅうけい","代表細孔半径":"だいひょうさいこうはんけい","代表関数":"だいひょうかんすう","代謝":"たいしゃ","代謝需要":"たいしゃじゅよう","以上":"いじょう","以上加":"いじょうくわ","以下":"いか","以深":"いしん","仮定":"かてい","仲間":"なかま","件":"けん","任意":"にんい","任意支出":"にんいししゅつ","任意支出上限":"にんいししゅつじょうげん","任意購入":"にんいこうにゅう","伏":"ふ","伐採":"ばっさい","休":"やす","休息場所":"きゅうそくばしょ","休息室":"きゅうそくしつ","休憩":"きゅうけい","伝":"つた","伝導":"でんどう","伝導熱流":"でんどうねつりゅう","伝導率":"でんどうりつ","伝導速度":"でんどうそくど","伝搬時間":"でんぱんじかん","伝播":"でんぱ","伝播中":"でんぱちゅう","伝播回数":"でんぱかいすう","伝達":"でんたつ","伝達方式":"でんたつほうしき","伴":{"う":"ともな","っ":"ともな"},"伸":"の","伸筋":"しんきん","伸縮性":"しんしゅくせい","伸長":"しんちょう","似":"に","似方":"にかた","位相":"いそう","位相分布":"いそうぶんぷ","位相図":"いそうず","位相差":"いそうさ","位相応答":"いそうおうとう","位相応答曲線":"いそうおうとうきょくせん","位相空間":"いそうくうかん","位相空間投影":"いそうくうかんとうえい","位相軌道":"いそうきどう","位相関係":"いそうかんけい","位置":"いち","位置変化":"いちへんか","位置関係":"いちかんけい","低":"ひく","低下":"ていか","低予算":"ていよさん","低供給":"ていきょうきゅう","低圧":"ていあつ","低圧膨張":"ていあつぼうちょう","低域成分":"ていいきせいぶん","低容量化":"ていようりょうか","低密度層":"ていみつどそう","低密度気体":"ていみつどきたい","低屈折率":"ていくっせつりつ","低層":"ていそう","低所":"ていしょ","低木":"ていぼく","低木層":"ていぼくそう","低木文法":"ていぼくぶんぽう","低標本":"ていひょうほん","低次元方程式":"ていじげんほうていしき","低歩数":"ていほすう","低気圧":"ていきあつ","低温":"ていおん","低温側":"ていおんがわ","低濃度領域":"ていのうどりょういき","低緯度":"ていいど","低緯度塩分差":"ていいどえんぶんさ","低血糖":"ていけっとう","低解像度":"ていかいぞうど","低解像度格子":"ていかいぞうどこうし","低速":"ていそく","低酸素":"ていさんそ","低酸素環境":"ていさんそかんきょう","低音":"ていおん","住":{"み":"す"},"住居痕":"じゅうきょこん","住民":"じゅうみん","体":"からだ","体内":"たいない","体化石":"たいかせき","体循環":"たいじゅんかん","体液調節":"たいえきちょうせつ","体積":"たいせき","体積保存":"たいせきほぞん","体色":"たいしょく","体表":"たいひょう","何":{"":"なに","が":"なに","で":"なん","と":"なん","の":"なん","を":"なに"},"何度":"なんど","何本":"なんぼん","余力":"よりょく","余地":"よち","余弦":"よげん","余裕":"よゆう","余震":"よしん","余韻":"よいん","作":"つく","作品":"さくひん","作品情報":"さくひんじょうほう","作業点":"さぎょうてん","作業点照度":"さぎょうてんしょうど","作業記憶":"さぎょうきおく","作業面照度":"さぎょうめんしょうど","作用":"さよう","作用点距離":"さようてんきょり","使":"つか","使用":"しよう","使用回数":"しようかいすう","使用容積":"しようようせき","使用文脈":"しようぶんみゃく","使用時":"しようじ","使用頻度":"しようひんど","例":"れい","供給":"きょうきゅう","供給制約":"きょうきゅうせいやく","供給率":"きょうきゅうりつ","供給網":"きょうきゅうもう","供給速度":"きょうきゅうそくど","依存":"いぞん","価値":"かち","価数":"かすう","価格":"かかく","価格交渉":"かかくこうしょう","価格経路":"かかくけいろ","価電子":"かでんし","侵入":"しんにゅう","侵入量":"しんにゅうりょう","侵食":"しんしょく","侵食回数":"しんしょくかいすう","侵食率":"しんしょくりつ","侵食量":"しんしょくりょう","係数":"けいすう","係数二乗和":"けいすうにじょうわ","係数倍率":"けいすうばいりつ","係数分":"けいすうぶん","係数変更":"けいすうへんこう","促":"うなが","促音":"そくおん","保":"たも","保全判断":"ほぜんはんだん","保全状態":"ほぜんじょうたい","保存":"ほぞん","保存度":"ほぞんど","保存量":"ほぞんりょう","保守判断":"ほしゅはんだん","保持":"ほじ","保持差":"ほじさ","保持時間":"ほじじかん","保持時間差":"ほじじかんさ","保管費":"ほかんひ","保証":"ほしょう","保護":"ほご","保護具":"ほごぐ","保護区":"ほごく","保護回路":"ほごかいろ","保護域":"ほごいき","信号":"しんごう","信号制御":"しんごうせいぎょ","信号設定":"しんごうせってい","信頼区間":"しんらいくかん","信頼度":"しんらいど","信頼度学習":"しんらいどがくしゅう","信頼度更新":"しんらいどこうしん","信頼性":"しんらいせい","信頼性学習":"しんらいせいがくしゅう","信頼水準":"しんらいすいじゅん","修復":"しゅうふく","修正":"しゅうせい","修理":"しゅうり","修飾":"しゅうしょく","俳句":"はいく","倉庫番":"そうこばん","個":"こ","個不足":"こふそく","個人":"こじん","個人差":"こじんさ","個体":"こたい","個体差":"こたいさ","個体数":"こたいすう","個体群":"こたいぐん","個体間結合":"こたいかんけつごう","個前":"こまえ","個外":"こはず","倍":"ばい","倍早":{"く":"ばいはや"},"倍率":"ばいりつ","倍音":"ばいおん","倍音数":"ばいおんすう","倒木":"とうぼく","倒立":"とうりつ","倒立像":"とうりつぞう","候補":"こうほ","候補分岐":"こうほぶんき","候補分布":"こうほぶんぷ","候補確率":"こうほかくりつ","候補総数":"こうほそうすう","候補集合":"こうほしゅうごう","候補順":"こうほじゅん","候補順序":"こうほじゅんじょ","値":"あたい","値率":"ちりつ","値間隔":"ちかんかく","倫理":"りんり","倫理上":"りんりじょう","偏":"かたよ","偏光":"へんこう","偏向":"へんこう","偏角":"へんかく","停止":"ていし","停止余裕":"ていしよゆう","停止危険":"ていしきけん","停止可能性":"ていしかのうせい","停止後":"ていしご","停止深":{"さ":"ていしふか"},"停止距離":"ていしきょり","停滞":"ていたい","健全":"けんぜん","健康":"けんこう","健康度":"けんこうど","側":"がわ","側方抑制":"そくほうよくせい","側線感覚":"そくせんかんかく","偶数":"ぐうすう","偶然":"ぐうぜん","偶然誤差":"ぐうぜんごさ","偽":"ぎ","傘":"かさ","備":"そな","傷":"きず","傷害後":"しょうがいご","傾":"かたむ","傾向":"けいこう","働":"はたら","像":"ぞう","像形成":"ぞうけいせい","像距離":"ぞうきょり","像面":"ぞうめん","優位":"ゆうい","優先":"ゆうせん","優勢":"ゆうせい","優性":"ゆうせい","優性形質":"ゆうせいけいしつ","元":"もと","元素":"げんそ","元素名":"げんそめい","元素線":"げんそせん","充填":"じゅうてん","充填効率":"じゅうてんこうりつ","充填率":"じゅうてんりつ","充填量":"じゅうてんりょう","充放電":"じゅうほうでん","充放電設定":"じゅうほうでんせってい","充満":"じゅうまん","充足率":"じゅうそくりつ","充電":"じゅうでん","充電不可":"じゅうでんふか","充電中":"じゅうでんちゅう","充電制御":"じゅうでんせいぎょ","充電可能":"じゅうでんかのう","充電器制御":"じゅうでんきせいぎょ","充電率":"じゅうでんりつ","先":"さき","先出":"さきだ","先天性心疾患":"せんてんせいしんしっかん","先端":"せんたん","先端距離":"せんたんきょり","先読":"さきよ","先駆樹":"せんくじゅ","光":"ひかり","光出力":"ひかりしゅつりょく","光化学系":"こうかがくけい","光反応":"こうはんのう","光合成":"こうごうせい","光合成速度":"こうごうせいそくど","光子":"こうし","光子放出":"こうしほうしゅつ","光子検出数":"こうしけんしゅつすう","光学":"こうがく","光学系":"こうがくけい","光学設計":"こうがくせっけい","光束":"こうそく","光源":"こうげん","光線":"こうせん","光線図":"こうせんず","光線経路":"こうせんけいろ","光路":"こうろ","光速":"こうそく","光量指標":"こうりょうしひょう","免疫":"めんえき","免疫応答":"めんえきおうとう","免疫記憶":"めんえききおく","免疫防御":"めんえきぼうぎょ","入":{"っ":"はい","る":"はい","れ":"い"},"入力":"にゅうりょく","入力上限":"にゅうりょくじょうげん","入力値":"にゅうりょくち","入力分布":"にゅうりょくぶんぷ","入力力":"にゅうりょくりょく","入力半径":"にゅうりょくはんけい","入力差":"にゅうりょくさ","入力文字":"にゅうりょくもじ","入力条件":"にゅうりょくじょうけん","入力点":"にゅうりょくてん","入力軌跡":"にゅうりょくきせき","入力選択器":"にゅうりょくせんたくき","入力長":"にゅうりょくちょう","入口":"いりぐち","入口速度":"いりぐちそくど","入射":"にゅうしゃ","入射角":"にゅうしゃかく","入替":"いれかえ","全":"すべ","全体":"ぜんたい","全体像":"ぜんたいぞう","全体同期":"ぜんたいどうき","全体地図":"ぜんたいちず","全体模様":"ぜんたいもよう","全作業":"ぜんさぎょう","全天":"ぜんてん","全室到達":"ぜんしつとうたつ","全局面評価":"ぜんきょくめんひょうか","全引力":"ぜんいんりょく","全情報":"ぜんじょうほう","全消去":"ぜんしょうきょ","全点":"ぜんてん","全熱流":"ぜんねつりゅう","全特性":"ぜんとくせい","全記号":"ぜんきごう","全身":"ぜんしん","全身循環":"ぜんしんじゅんかん","全運動量":"ぜんうんどうりょう","全部":"ぜんぶ","全部消":"ぜんぶけ","全電流":"ぜんでんりゅう","八回回転":"はちかいかいてん","公園風景":"こうえんふうけい","公式":"こうしき","公式情報":"こうしきじょうほう","公称電圧":"こうしょうでんあつ","公衆衛生判断":"こうしゅうえいせいはんだん","公転":"こうてん","公転中":"こうてんちゅう","公転位置":"こうてんいち","六回対称性":"ろっかいたいしょうせい","六回異方性":"ろっかいいほうせい","六回鏡映":"ろっかいきょうえい","六方向":"ろくほうこう","六角格子":"ろっかくこうし","六角格子上":"ろっかくこうしじょう","六角格子成長":"ろっかくこうしせいちょう","共振":"きょうしん","共振曲線":"きょうしんきょくせん","共振条件":"きょうしんじょうけん","共有":"きょうゆう","共生":"きょうせい","共生微生物":"きょうせいびせいぶつ","共生細菌":"きょうせいさいきん","共生細菌経由":"きょうせいさいきんけいゆ","共輸送":"きょうゆそう","共通":"きょうつう","共通祖先":"きょうつうそせん","共通祖先関係":"きょうつうそせんかんけい","共鳴":"きょうめい","兵力":"へいりょく","具体化":"ぐたいか","具合":"ぐあい","内側":"うちがわ","内容":"ないよう","内容改訂":"ないようかいてい","内容版":"ないようばん","内岸":"ないがん","内岸堆積":"ないがんたいせき","内積":"ないせき","内耳":"ないじ","内記録":"ないきろく","内訳":"うちわけ","内部":"ないぶ","内部抵抗":"ないぶていこう","内部損失":"ないぶそんしつ","内部構造":"ないぶこうぞう","内部温度差":"ないぶおんどさ","内部状態":"ないぶじょうたい","内部発熱":"ないぶはつねつ","内部表現":"ないぶひょうげん","内部計算":"ないぶけいさん","円":"えん","円柱":"えんちゅう","円盤":"えんばん","円軌道":"えんきどう","再":{"び":"ふたた"},"再処理":"さいしょり","再利用":"さいりよう","再同調":"さいどうちょう","再吸収":"さいきゅうしゅう","再堆積":"さいたいせき","再感染":"さいかんせん","再感染時":"さいかんせんじ","再懸濁":"さいけんだく","再懸濁余裕":"さいけんだくよゆう","再挑戦":"さいちょうせん","再曝露":"さいばくろ","再検査":"さいけんさ","再構成":"さいこうせい","再注入":"さいちゅうにゅう","再浸水":"さいしんすい","再現":"さいげん","再生":"さいせい","再生中":"さいせいちゅう","再生速度":"さいせいそくど","再確認":"さいかくにん","再結合":"さいけつごう","再計画":"さいけいかく","再計算":"さいけいさん","再訪":"さいほう","再訪率":"さいほうりつ","再試行":"さいしこう","再配分":"さいはいぶん","再配分頻度":"さいはいぶんひんど","再配線":"さいはいせん","再開":"さいかい","冗長性":"じょうちょうせい","冗長経路":"じょうちょうけいろ","冗長負荷":"じょうちょうふか","写":"うつ","写像":"しゃぞう","冬":"ふゆ","冷":{"え":"ひ","た":"つめ","や":"ひ"},"冷却":"れいきゃく","冷却中":"れいきゃくちゅう","冷却温度":"れいきゃくおんど","冷却速度":"れいきゃくそくど","冷水":"れいすい","冷湧水":"れいゆうすい","冷湧水域":"れいゆうすいいき","凍結":"とうけつ","凍結融解":"とうけつゆうかい","凍結量":"とうけつりょう","凍結面":"とうけつめん","凝結":"ぎょうけつ","凝縮":"ぎょうしゅく","凝縮位置":"ぎょうしゅくいち","凝集":"ぎょうしゅう","処理":"しょり","処理中":"しょりちゅう","処理文字":"しょりもじ","処理能力":"しょりのうりょく","処理量":"しょりりょう","凧":"たこ","凸":"とつ","凹":"おう","凹凸":"おうとつ","凹面鏡":"おうめんきょう","出":{"し":"だ","す":"だ","た":"で","て":"で","る":"で"},"出会":{"い":"であ"},"出入":"でい","出力":"しゅつりょく","出力候補":"しゅつりょくこうほ","出力力":"しゅつりょくりょく","出力多様性":"しゅつりょくたようせい","出力文字頻度":"しゅつりょくもじひんど","出力遷移":"しゅつりょくせんい","出口":"でぐち","出口弁":"でぐちべん","出時刻":"でじこく","出現":"しゅつげん","出現列":"しゅつげんれつ","出現率":"しゅつげんりつ","出現確率":"しゅつげんかくりつ","出発":"しゅっぱつ","出発時刻":"しゅっぱつじこく","出発点":"しゅっぱつてん","出費":"しゅっぴ","分":{"か":"わ","け":"わ"},"分光分解能":"ぶんこうぶんかいのう","分光同定":"ぶんこうどうてい","分割":"ぶんかつ","分割数":"ぶんかつすう","分化":"ぶんか","分圧差":"ぶんあつさ","分子":"ぶんし","分子全体":"ぶんしぜんたい","分子形成":"ぶんしけいせい","分子数":"ぶんしすう","分子種":"ぶんししゅ","分子衝突":"ぶんししょうとつ","分子速度":"ぶんしそくど","分子運動":"ぶんしうんどう","分子間":"ぶんしかん","分子間力":"ぶんしかんりょく","分岐":"ぶんき","分岐数":"ぶんきすう","分岐条件":"ぶんきじょうけん","分岐深":"ぶんきふか","分岐率":"ぶんきりつ","分岐確率":"ぶんきかくりつ","分岐角":"ぶんきかく","分布":"ぶんぷ","分布仮定":"ぶんぷかてい","分布幅":"ぶんぷはば","分布形":"ぶんぷけい","分散":"ぶんさん","分散係数":"ぶんさんけいすう","分散度":"ぶんさんど","分散探索":"ぶんさんたんさく","分析":"ぶんせき","分析時間":"ぶんせきじかん","分極":"ぶんきょく","分母":"ぶんぼ","分泌":"ぶんぴつ","分留":"ぶんりゅう","分留塔":"ぶんりゅうとう","分節":"ぶんせつ","分裂":"ぶんれつ","分裂後":"ぶんれつご","分裂時間":"ぶんれつじかん","分裂課題":"ぶんれつかだい","分解":"ぶんかい","分解度":"ぶんかいど","分解方法":"ぶんかいほうほう","分解率":"ぶんかいりつ","分解者":"ぶんかいしゃ","分解者活性":"ぶんかいしゃかっせい","分解速度":"ぶんかいそくど","分配":"ぶんぱい","分配誤差":"ぶんぱいごさ","分野":"ぶんや","分離":"ぶんり","分離判定":"ぶんりはんてい","分離制約":"ぶんりせいやく","分離度":"ぶんりど","分離距離":"ぶんりきょり","分類":"ぶんるい","分類探検":"ぶんるいたんけん","分類根拠":"ぶんるいこんきょ","分類樹":"ぶんるいじゅ","切":"き","切断":"せつだん","切替":"きりかえ","刈":{"り":"か"},"列":"れつ","初":{"め":"はじ"},"初動閾値":"しょどうしきいち","初回感染":"しょかいかんせん","初回曝露":"しょかいばくろ","初期":"しょき","初期亀裂":"しょききれつ","初期亀裂長":"しょききれつちょう","初期位置":"しょきいち","初期値":"しょきち","初期値差":"しょきちさ","初期値感度":"しょきちかんど","初期充填":"しょきじゅうてん","初期化":"しょきか","初期含水率":"しょきがんすいりつ","初期吸引":"しょききゅういん","初期土壌":"しょきどじょう","初期地形":"しょきちけい","初期密度":"しょきみつど","初期差":"しょきさ","初期差分":"しょきさぶん","初期摂動":"しょきせつどう","初期擾乱":"しょきじょうらん","初期条件":"しょきじょうけん","初期核":"しょきかく","初期浮力":"しょきふりょく","初期浸透速度":"しょきしんとうそくど","初期温度":"しょきおんど","初期状態":"しょきじょうたい","初期画面":"しょきがめん","初期角":"しょきかく","初期角度":"しょきかくど","初期角度差":"しょきかくどさ","初期速度":"しょきそくど","初期配置":"しょきはいち","初期頻度":"しょきひんど","初速":"しょそく","初速係数":"しょそくけいすう","初速度":"しょそくど","初速範囲":"しょそくはんい","判定":"はんてい","判断":"はんだん","判断閾値":"はんだんいきち","別":"べつ","別個体":"べつこたい","別問題":"べつもんだい","別染色体":"べつせんしょくたい","別物":"べつもの","利用":"りよう","利用可能":"りようかのう","利用可能栄養塩":"りようかのうえいようえん","利用可能電力":"りようかのうでんりょく","利益":"りえき","到着":"とうちゃく","到着判定":"とうちゃくはんてい","到着前":"とうちゃくまえ","到着失敗":"とうちゃくしっぱい","到着差":"とうちゃくさ","到着時刻":"とうちゃくじこく","到着時間":"とうちゃくじかん","到着点":"とうちゃくてん","到着率":"とうちゃくりつ","到着間隔":"とうちゃくかんかく","到達":"とうたつ","到達値":"とうたつち","到達判定":"とうたつはんてい","到達可能性":"とうたつかのうせい","到達性":"とうたつせい","到達時間":"とうたつじかん","到達状態":"とうたつじょうたい","到達率":"とうたつりつ","到達範囲":"とうたつはんい","到達距離":"とうたつきょり","到達速度":"とうたつそくど","制作年":"せいさくねん","制動":"せいどう","制動性能":"せいどうせいのう","制動距離":"せいどうきょり","制度":"せいど","制御":"せいぎょ","制御回路":"せいぎょかいろ","制御性":"せいぎょせい","制御遅":"せいぎょおく","制約":"せいやく","制約伝播":"せいやくでんぱ","制約解消":"せいやくかいしょう","制限":"せいげん","制限反応物":"せいげんはんのうぶつ","制限要因":"せいげんよういん","刺激":"しげき","刺激列":"しげきれつ","刺激割合":"しげきわりあい","刺激強度":"しげききょうど","刺胞動物":"しほうどうぶつ","刻":{"ま":"きざ","み":"きざ","む":"きざ"},"則":"そく","削":"けず","削除":"さくじょ","前":"まえ","前後":"ぜんご","前方":"ぜんぽう","前方波長":"ぜんぽうはちょう","前景":"ぜんけい","前線":"ぜんせん","前線構造":"ぜんせんこうぞう","前線速度":"ぜんせんそくど","前線面":"ぜんせんめん","前線高":{"さ":"ぜんせんたか"},"前負荷":"ぜんふか","前進":"ぜんしん","剛体":"ごうたい","剛体棒":"ごうたいぼう","割":"わ","割合":"わりあい","割線":"かっせん","創作":"そうさく","劇場化":"げきじょうか","劇場性":"げきじょうせい","劇場的":"げきじょうてき","劇的":"げきてき","力":"ちから","力学":"りきがく","力学的":"りきがくてき","力点":"りきてん","力矢印":"ちからやじるし","加":"くわ","加入":"かにゅう","加工":"かこう","加工能力":"かこうのうりょく","加法":"かほう","加熱":"かねつ","加熱中":"かねつちゅう","加熱源":"かねつげん","加熱炉温度":"かねつろおんど","加熱空気":"かねつくうき","加熱装置":"かねつそうち","加算":"かさん","加速":"かそく","加速器":"かそくき","加速器内":"かそくきない","加速度":"かそくど","加速設定":"かそくせってい","劣化":"れっか","劣化膜":"れっかまく","劣化電池高出力":"れっかでんちこうしゅつりょく","劣性":"れっせい","助":"たす","励起":"れいき","励起電子":"れいきでんし","効":"き","効果":"こうか","効果量":"こうかりょう","効率":"こうりつ","効率的":"こうりつてき","動":"うご","動作":"どうさ","動摩擦":"どうまさつ","動摩擦係数":"どうまさつけいすう","動摩擦滑":"どうまさつすべ","動水勾配":"どうすいこうばい","動物":"どうぶつ","動物界":"どうぶつかい","動的平衡":"どうてきへいこう","動的探究強化版":"どうてきたんきゅうきょうかばん","動的探究版":"どうてきたんきゅうばん","動的系":"どうてきけい","動的配送":"どうてきはいそう","動的配送模型":"どうてきはいそうもけい","動的障害物":"どうてきしょうがいぶつ","動線":"どうせん","動脈":"どうみゃく","動脈圧":"どうみゃくあつ","動脈抵抗":"どうみゃくていこう","勢":{"い":"いきお"},"勾配":"こうばい","勾配維持":"こうばいいじ","包":{"み":"つつ","む":"つつ"},"包囲":"ほうい","包絡":"ほうらく","包絡幅":"ほうらくはば","包絡平滑化":"ほうらくへいかつか","化":"か","化学":"かがく","化学伝達":"かがくでんたつ","化学分解":"かがくぶんかい","化学反応":"かがくはんのう","化学合成微生物":"かがくごうせいびせいぶつ","化学合成細菌":"かがくごうせいさいきん","化学安全":"かがくあんぜん","化学物質":"かがくぶっしつ","化学的分解":"かがくてきぶんかい","化学的風化":"かがくてきふうか","化学種":"かがくしゅ","化学系":"かがくけい","化石":"かせき","化石図鑑":"かせきずかん","化石形成":"かせきけいせい","化石記録":"かせききろく","化石課題":"かせきかだい","北":"きた","北上":"ほくじょう","北上期":"ほくじょうき","北上距離":"ほくじょうきょり","北半球":"きたはんきゅう","北斗七星":"ほくとしちせい","北米":"ほくべい","区別":"くべつ","区画":"くかく","区間":"くかん","区間全体":"くかんぜんたい","区間幅":"くかんはば","医学的視機能評価":"いがくてきしきのうひょうか","医療":"いりょう","医療判断":"いりょうはんだん","医療材料":"いりょうざいりょう","医療者":"いりょうしゃ","医療資源":"いりょうしげん","医薬品":"いやくひん","十二回密模様":"じゅうにかいみつもよう","十分":"じゅうぶん","十分大":"じゅうぶんおお","十分近":"じゅうぶんちか","十分速":{"く":"じゅうぶんはや"},"十字":"じゅうじ","十字形":"じゅうじけい","午後":"ごご","半円":"はんえん","半分":"はんぶん","半加算器":"はんかさんき","半径":"はんけい","半径成長":"はんけいせいちょう","半径方向":"はんけいほうこう","半月":"はんげつ","半索動物":"はんさくどうぶつ","半規管":"はんきかん","半透明":"はんとうめい","協力":"きょうりょく","協和度":"きょうわど","南":"みなみ","南中高度":"なんちゅうこうど","南北":"なんぼく","南北半球":"なんぼくはんきゅう","南半球":"みなみはんきゅう","南斗六星":"なんとろくせい","単":{"な":"たん","に":"たん"},"単一":"たんいつ","単一候補":"たんいつこうほ","単一候補優先":"たんいつこうほゆうせん","単一基質":"たんいつきしつ","単一形質":"たんいつけいしつ","単一波長":"たんいつはちょう","単一閾値":"たんいつしきいち","単位":"たんい","単位換算":"たんいかんさん","単位時間":"たんいじかん","単価":"たんか","単純":"たんじゅん","単純一致":"たんじゅんいっち","単純加算":"たんじゅんかさん","単純化":"たんじゅんか","単純式":"たんじゅんしき","単純形状":"たんじゅんけいじょう","単純形状係数":"たんじゅんけいじょうけいすう","単純拡散":"たんじゅんかくさん","単純模型":"たんじゅんもけい","単純積分":"たんじゅんせきぶん","単純置換":"たんじゅんちかん","単純記事":"たんじゅんきじ","単純透視投影模型":"たんじゅんとうしとうえいもけい","単細胞生物":"たんさいぼうせいぶつ","単結合":"たんけつごう","単色":"たんしょく","単語":"たんご","単調":"たんちょう","単調性":"たんちょうせい","占":{"め":"し"},"占有":"せんゆう","印":"しるし","印象":"いんしょう","印象派":"いんしょうは","危険":"きけん","危険域":"きけんいき","危険時":"きけんじ","危険時間":"きけんじかん","危険箱":"きけんばこ","即座":"そくざ","卵":"たまご","厚":"あつ","原作":"げんさく","原因":"げんいん","原因候補":"げんいんこうほ","原因変数":"げんいんへんすう","原子":"げんし","原子再配置":"げんしさいはいち","原子同士":"げんしどうし","原子在庫":"げんしざいこ","原子数":"げんしすう","原子核":"げんしかく","原子濃度":"げんしのうど","原子物理":"げんしぶつり","原子課題":"げんしかだい","原子配置":"げんしはいち","原尿":"げんにょう","原料":"げんりょう","原油":"げんゆ","原油在庫":"げんゆざいこ","原油流量":"げんゆりゅうりょう","原点":"げんてん","原理":"げんり","原生生物":"げんせいせいぶつ","原生生物化石":"げんせいせいぶつかせき","厳":{"し":"きび"},"厳密":"げんみつ","厳密保存":"げんみつほぞん","厳密境界":"げんみつきょうかい","厳密解":"げんみつかい","厳密計算":"げんみつけいさん","去":{"っ":"さ","ら":"さ","る":"さ"},"参照":"さんしょう","双方向":"そうほうこう","反対側":"はんたいがわ","反対向":{"き":"はんたいむ"},"反対方向":"はんたいほうこう","反射":"はんしゃ","反射到達時間":"はんしゃとうたつじかん","反射回路":"はんしゃかいろ","反射境界":"はんしゃきょうかい","反射対称":"はんしゃたいしょう","反射屈折":"はんしゃくっせつ","反射弓":"はんしゃきゅう","反射成分":"はんしゃせいぶん","反射板":"はんしゃばん","反射率":"はんしゃりつ","反復":"はんぷく","反復上限":"はんぷくじょうげん","反復収束":"はんぷくしゅうそく","反復回数":"はんぷくかいすう","反復描画模型":"はんぷくびょうがもけい","反復標本":"はんぷくひょうほん","反復模型":"はんぷくもけい","反復率":"はんぷくりつ","反復罰":"はんぷくばつ","反復規則":"はんぷくきそく","反復間分散":"はんぷくかんぶんさん","反復間標準偏差":"はんぷくかんひょうじゅんへんさ","反復集団":"はんぷくしゅうだん","反応":"はんのう","反応係数":"はんのうけいすう","反応偏":{"り":"はんのうかたよ"},"反応前後":"はんのうぜんご","反応単位":"はんのうたんい","反応回数":"はんのうかいすう","反応帯":"はんのうたい","反応式":"はんのうしき","反応強度":"はんのうきょうど","反応拡散":"はんのうかくさん","反応時間":"はんのうじかん","反応条件":"はんのうじょうけん","反応機構":"はんのうきこう","反応物":"はんのうぶつ","反応課題":"はんのうかだい","反応速度":"はんのうそくど","反応速度曲線":"はんのうそくどきょくせん","反応遅":"はんのうおく","反応部":"はんのうぶ","反応量":"はんのうりょう","反映":"はんえい","反比例":"はんぴれい","反発":"はんぱつ","反発係数":"はんぱつけいすう","反転":"はんてん","反転像":"はんてんぞう","反響":"はんきょう","反響定位":"はんきょうていい","収":"おさ","収入":"しゅうにゅう","収容範囲":"しゅうようはんい","収支":"しゅうし","収支誤差":"しゅうしごさ","収斂":"しゅうれん","収束":"しゅうそく","収束段階":"しゅうそくだんかい","収率":"しゅうりつ","収穫":"しゅうかく","収縮力":"しゅうしゅくりょく","取":"と","取出":{"し":"とりだ"},"取込":"とりこ","受":"う","受信振幅":"じゅしんしんぷく","受信波形":"じゅしんはけい","受信波面":"じゅしんはめん","受動拡散":"じゅどうかくさん","受動流入":"じゅどうりゅうにゅう","受動流束":"じゅどうりゅうそく","受動移動":"じゅどういどう","受動輸送":"じゅどうゆそう","受容体":"じゅようたい","受理率":"じゅりりつ","受精":"じゅせい","口":"くち","古":{"い":"ふる"},"古典":"こてん","古典暗号":"こてんあんごう","古生代":"こせいだい","句":"く","召命":"しょうめい","可動点":"かどうてん","可動鉄片":"かどうてっぺん","可燃":"かねん","可燃性":"かねんせい","可能":"かのう","可能性":"かのうせい","可視化":"かしか","可視点":"かしてん","可視発光":"かしはっこう","可読性":"かどくせい","可逆性":"かぎゃくせい","台形法":"だいけいほう","台形状":"だいけいじょう","台車":"だいしゃ","台風":"たいふう","台風発生":"たいふうはっせい","台風相当":"たいふうそうとう","台風進路":"たいふうしんろ","右":"みぎ","右上":"みぎうえ","右下":"みぎした","右側":"みぎがわ","右初期位置":"みぎしょきいち","右向":"みぎむ","右左折":"うさせつ","右手":"みぎて","右端":"みぎはし","右肺胞":"みぎはいほう","司令塔":"しれいとう","各":"かく","各位置":"かくいち","各作品":"かくさくひん","各個体":"かくこたい","各元素":"かくげんそ","各元素数":"かくげんそすう","各光線":"かくこうせん","各回":"かくかい","各場所":"かくばしょ","各天体":"かくてんたい","各手掛":"かくてが","各抵抗":"かくていこう","各文字":"かくもじ","各方向":"かくほうこう","各枝":"かくえだ","各点":"かくてん","各留分":"かくりゅうぶん","各経路":"かくけいろ","各要素":"かくようそ","各言語":"かくげんご","各部品":"かくぶひん","合":"あ","合体":"がったい","合力":"ごうりょく","合成":"ごうせい","合成信号":"ごうせいしんごう","合成信号模型":"ごうせいしんごうもけい","合成抵抗":"ごうせいていこう","合流":"ごうりゅう","合流中":"ごうりゅうちゅう","合流余地":"ごうりゅうよち","合流偏重":"ごうりゅうへんちょう","合流優先":"ごうりゅうゆうせん","合流得点":"ごうりゅうとくてん","合流数":"ごうりゅうすう","合焦":"ごうしょう","合計":"ごうけい","合議":"ごうぎ","合議結果":"ごうぎけっか","同":{"":"どう","じ":"おな"},"同一初期条件":"どういつしょきじょうけん","同一初期条件比較":"どういつしょきじょうけんひかく","同一初期渦":"どういつしょきうず","同一条件":"どういつじょうけん","同位体":"どういたい","同位体安定性":"どういたいあんていせい","同値":"どうち","同値合流":"どうちごうりゅう","同値要素":"どうちようそ","同定":"どうてい","同方向":"どうほうこう","同方向成分":"どうほうこうせいぶん","同時":"どうじ","同時下落":"どうじげらく","同時発光率":"どうじはっこうりつ","同期":"どうき","同期定量":"どうきていりょう","同期度":"どうきど","同期度履歴":"どうきどりれき","同期率":"どうきりつ","同期第二":"どうきだいに","同期群":"どうきぐん","同期表示":"どうきひょうじ","同期計器":"どうきけいき","同梱":"どうこん","同程度以上":"どうていどいじょう","同種":"どうしゅ","同義":"どうぎ","同調":"どうちょう","同質":"どうしつ","名前":"なまえ","名画":"めいが","名画実画像":"めいがじつがぞう","名画観察":"めいがかんさつ","吐":"は","向":"む","向地性":"こうちせい","含":"ふく","含水率":"がんすいりつ","吸":"す","吸収":"きゅうしゅう","吸収効率":"きゅうしゅうこうりつ","吸収可能":"きゅうしゅうかのう","吸収可能成分":"きゅうしゅうかのうせいぶん","吸収範囲":"きゅうしゅうはんい","吸収経路":"きゅうしゅうけいろ","吸収量":"きゅうしゅうりょう","吸引域":"きゅういんいき","吸気":"きゅうき","吸気粒子":"きゅうきりゅうし","吸気酸素":"きゅうきさんそ","吸水性":"きゅうすいせい","吸着":"きゅうちゃく","吸込":{"み":"すいこ"},"周囲":"しゅうい","周囲温度":"しゅういおんど","周囲空気":"しゅういくうき","周期":"しゅうき","周期候補":"しゅうきこうほ","周期境界":"しゅうききょうかい","周期外力":"しゅうきがいりょく","周期寄":{"り":"しゅうきよ"},"周期成分":"しゅうきせいぶん","周期的":"しゅうきてき","周期表":"しゅうきひょう","周期軌道":"しゅうききどう","周波数":"しゅうはすう","周波数分布":"しゅうはすうぶんぷ","周波数分解":"しゅうはすうぶんかい","周波数変化":"しゅうはすうへんか","周波数差":"しゅうはすうさ","周波数帯":"しゅうはすうたい","周波数成分":"しゅうはすうせいぶん","周波数比":"しゅうはすうひ","周波数範囲":"しゅうはすうはんい","周波数表示":"しゅうはすうひょうじ","周波数重心":"しゅうはすうじゅうしん","周辺有機物":"しゅうへんゆうきぶつ","周長":"しゅうちょう","呼":"よ","呼吸":"こきゅう","呼吸数":"こきゅうすう","呼気":"こき","呼気時間":"こきじかん","呼気曲線":"こききょくせん","呼気流量":"こきりゅうりょう","命中":"めいちゅう","命中率":"めいちゅうりつ","命中許容差":"めいちゅうきょようさ","咀嚼":"そしゃく","和":{"":"わ","ら":"やわ"},"品":"しな","品物":"しなもの","品目":"ひんもく","品質":"ひんしつ","品質管理判断":"ひんしつかんりはんだん","哺乳類":"ほにゅうるい","商品":"しょうひん","問":"と","問題":"もんだい","善悪":"ぜんあく","喘息状態":"ぜんそくじょうたい","喪失":"そうしつ","器":"うつわ","器官":"きかん","器官形状":"きかんけいじょう","噴出孔周辺":"ふんしゅつこうしゅうへん","噴火様式":"ふんかようしき","噴煙":"ふんえん","噴煙高度":"ふんえんこうど","四":{"":"よん","つ":"よっ"},"四段階一品目":"よんだんかいいちひんもく","四種類":"よんしゅるい","四角形":"しかくけい","四辺形":"しへんけい","四隅":"よすみ","回":{"":"かい","り":"まわ","る":"まわ"},"回反復":"かいはんぷく","回呼吸":"かいこきゅう","回復":"かいふく","回復力":"かいふくりょく","回復曲線":"かいふくきょくせん","回復速度":"かいふくそくど","回折":"かいせつ","回折包絡":"かいせつほうらく","回数":"かいすう","回目":"かいめ","回路":"かいろ","回路構造":"かいろこうぞう","回路設計検証":"かいろせっけいけんしょう","回転":"かいてん","回転位相":"かいてんいそう","回転入力":"かいてんにゅうりょく","回転効果":"かいてんこうか","回転子":"かいてんし","回転履歴":"かいてんりれき","回転数":"かいてんすう","回転歯車":"かいてんはぐるま","回転速度":"かいてんそくど","回避":"かいひ","回避後":"かいひご","因子":"いんし","因果":"いんが","因果操作":"いんがそうさ","因果方向":"いんがほうこう","図":"ず","図形":"ずけい","図形全体":"ずけいぜんたい","図鑑":"ずかん","図鑑探索":"ずかんたんさく","図鑑検索":"ずかんけんさく","固体":"こたい","固定":"こてい","固定形":"こていけい","固定格子迷路":"こていこうしめいろ","固定盤面":"こていばんめん","固定相":"こていそう","固定相親和性":"こていそうしんわせい","固定色":"こていしょく","固定軌道":"こていきどう","固定迷路":"こていめいろ","固定集団数":"こていしゅうだんすう","固有名詞":"こゆうめいし","固有周期":"こゆうしゅうき","固有周波数":"こゆうしゅうはすう","固有振動":"こゆうしんどう","固有振動数":"こゆうしんどうすう","固着":"こちゃく","固着中":"こちゃくちゅう","固着域":"こちゃくいき","固結":"こけつ","国":"くに","土":"つち","土地":"とち","土壌":"どじょう","土壌侵食":"どじょうしんしょく","土壌形成":"どじょうけいせい","土壌微生物":"どじょうびせいぶつ","土壌損失":"どじょうそんしつ","土壌条件":"どじょうじょうけん","土壌水":"どじょうすい","土壌水分":"どじょうすいぶん","土壌浸透":"どじょうしんとう","土壌養分":"どじょうようぶん","土石流":"どせきりゅう","土砂":"どしゃ","土砂収支":"どしゃしゅうし","土砂流出":"どしゃりゅうしゅつ","土砂流量":"どしゃりゅうりょう","土砂流量履歴":"どしゃりゅうりょうりれき","土砂災害":"どしゃさいがい","土砂移動":"どしゃいどう","土砂輸送":"どしゃゆそう","圧":"あつ","圧力":"あつりょく","圧力伝播":"あつりょくでんぱ","圧力容器":"あつりょくようき","圧力差":"あつりょくさ","圧力損失":"あつりょくそんしつ","圧力断面":"あつりょくだんめん","圧力蓄積":"あつりょくちくせき","圧容積":"あつようせき","圧差":"あつさ","圧縮":"あっしゅく","圧縮性":"あっしゅくせい","在庫":"ざいこ","在庫管理":"ざいこかんり","地上":"ちじょう","地上到達":"ちじょうとうたつ","地下":"ちか","地下水":"ちかすい","地下水中":"ちかすいちゅう","地下水位":"ちかすいい","地下水原生生物":"ちかすいげんせいせいぶつ","地下水底":"ちかすいてい","地下水性":"ちかすいせい","地下水性巻貝":"ちかすいせいまきがい","地下水性等脚類":"ちかすいせいとうきゃくるい","地下水流":"ちかすいりゅう","地下水流路":"ちかすいりゅうろ","地下水生物":"ちかすいせいぶつ","地下水線虫":"ちかすいせんちゅう","地下水補給":"ちかすいほきゅう","地下水輪形動物":"ちかすいりんけいどうぶつ","地下水食物網":"ちかすいしょくもつもう","地図":"ちず","地図上":"ちずじょう","地図生成":"ちずせいせい","地域":"ちいき","地域影響評価":"ちいきえいきょうひょうか","地学":"ちがく","地層":"ちそう","地平線":"ちへいせん","地平線上":"ちへいせんじょう","地平線下":"ちへいせんか","地形":"ちけい","地形回避":"ちけいかいひ","地形断面":"ちけいだんめん","地形生成":"ちけいせいせい","地形障害":"ちけいしょうがい","地方時":"ちほうじ","地殻":"ちかく","地殻運動":"ちかくうんどう","地点":"ちてん","地球":"ちきゅう","地球上":"ちきゅうじょう","地球化学":"ちきゅうかがく","地球曲率":"ちきゅうきょくりつ","地球自転位相":"ちきゅうじてんいそう","地盤":"じばん","地盤増幅":"じばんぞうふく","地磁気":"ちじき","地衣類":"ちいるい","地表":"ちひょう","地表付近":"ちひょうふきん","地表低温":"ちひょうていおん","地表側":"ちひょうがわ","地表温度":"ちひょうおんど","地表高温":"ちひょうこうおん","地質":"ちしつ","地質年代":"ちしつねんだい","地質時間":"ちしつじかん","地軸":"ちじく","地軸傾":{"き":"ちじくかたむ"},"地軸傾斜":"ちじくけいしゃ","地雷":"じらい","地震":"じしん","地震回数":"じしんかいすう","地震波":"じしんは","地震発生":"じしんはっせい","地震計波形":"じしんけいはけい","地面":"じめん","地面側":"じめんがわ","均一":"きんいつ","均一円管":"きんいつえんかん","均一土層":"きんいつどそう","均一流":"きんいつりゅう","均斉度":"きんせいど","均等性":"きんとうせい","均等配置":"きんとうはいち","均衡":"きんこう","均衡方策":"きんこうほうさく","均質":"きんしつ","坑道":"こうどう","型模型":"がたもけい","型近似":"がたきんじ","型連立微分方程式":"がたれんりつびぶんほうていしき","埋":"う","埋没":"まいぼつ","埋没速度":"まいぼつそくど","埋込":{"み":"うめこ"},"培地":"ばいち","基":"もと","基地":"きち","基地帰還":"きちきかん","基底":"きてい","基本":"きほん","基本波":"きほんは","基準":"きじゅん","基準周波数":"きじゅんしゅうはすう","基準密度":"きじゅんみつど","基準差":"きじゅんさ","基準星":"きじゅんせい","基準積分値":"きじゅんせきぶんち","基準音":"きじゅんおん","基礎":"きそ","基質":"きしつ","基質濃度":"きしつのうど","基質追加":"きしつついか","基質量":"きしつりょう","堆積":"たいせき","堆積位置":"たいせきいち","堆積割合":"たいせきわりあい","堆積土砂":"たいせきどしゃ","堆積岩":"たいせきがん","堆積構造":"たいせきこうぞう","堆積物":"たいせきぶつ","堆積物上":"たいせきぶつじょう","堆積物中":"たいせきぶつちゅう","堆積物内":"たいせきぶつない","堆積率":"たいせきりつ","堆積環境":"たいせきかんきょう","堆積粒子":"たいせきりゅうし","堆積量":"たいせきりょう","堆積面":"たいせきめん","報告":"ほうこく","場":"ば","場合":"ばあい","場所":"ばしょ","場面":"ばめん","場面別照明設計":"ばめんべつしょうめいせっけい","塊":"かたまり","塊状":"かいじょう","塑性変形":"そせいへんけい","塔内温度分布":"とうないおんどぶんぷ","塗":"ぬ","塩":"えん","塩分":"えんぶん","塩分差":"えんぶんさ","塩分成層":"えんぶんせいそう","塩分濃縮":"えんぶんのうしゅく","塩化水素":"えんかすいそ","塩化物":"えんかぶつ","塩基":"えんき","塩基収支":"えんきしゅうし","塩基型":"えんきがた","塩基性":"えんきせい","塩基等量":"えんきとうりょう","塩基量":"えんきりょう","塩素":"えんそ","境界":"きょうかい","境界付近":"きょうかいふきん","境界位置":"きょうかいいち","境界候補":"きょうかいこうほ","境界判別":"きょうかいはんべつ","境界判定":"きょうかいはんてい","境界型":"きょうかいがた","境界変化":"きょうかいへんか","境界条件":"きょうかいじょうけん","境界量":"きょうかいりょう","境界長":"きょうかいちょう","境界長履歴":"きょうかいちょうりれき","境目":"さかいめ","増":"ふ","増加":"ぞうか","増幅":"ぞうふく","増殖":"ぞうしょく","増殖速度":"ぞうしょくそくど","増減":"ぞうげん","壁":"かべ","壁沿":"かべぞ","壁面":"へきめん","壊":"こわ","声":"こえ","売上":"うりあげ","変":{"":"へん","え":"か","わ":"か"},"変位":"へんい","変動":"へんどう","変動性":"へんどうせい","変化":"へんか","変化率":"へんかりつ","変化量":"へんかりょう","変形":"へんけい","変性":"へんせい","変成":"へんせい","変成岩":"へんせいがん","変換":"へんかん","変換段階":"へんかんだんかい","変更":"へんこう","変更入力":"へんこうにゅうりょく","変異":"へんい","変異位置":"へんいいち","変調":"へんちょう","変調深":"へんちょうふか","夏":"なつ","夏時間":"なつじかん","外":{"":"そと","す":"はず","れ":"はず"},"外側":"そとがわ","外力":"がいりょく","外圧":"がいあつ","外場":"がいば","外岸":"がいがん","外岸侵食":"がいがんしんしょく","外挿":"がいそう","外枠":"そとわく","外洋":"がいよう","外洋性捕食魚":"がいようせいほしょくぎょ","外洋深部":"がいようしんぶ","外浸透圧":"がいしんとうあつ","外液":"がいえき","外液浸透圧":"がいえきしんとうあつ","外液濃度":"がいえきのうど","外皮上限":"がいひじょうげん","外皮余裕":"がいひよゆう","外皮応力":"がいひおうりょく","外皮応力比":"がいひおうりょくひ","外皮材料":"がいひざいりょう","外皮限界":"がいひげんかい","外耳":"がいじ","外部":"がいぶ","外部周期":"がいぶしゅうき","外部回路":"がいぶかいろ","外部時刻":"がいぶじこく","外部荷重":"がいぶかじゅう","外部送信":"がいぶそうしん","外部通信":"がいぶつうしん","外鰓":"がいさい","多":"おお","多体系":"たたいけい","多体系重力":"たたいけいじゅうりょく","多価関数":"たかかんすう","多分岐":"たぶんき","多変数微分":"たへんすうびぶん","多孔質":"たこうしつ","多孔質媒体":"たこうしつばいたい","多層干渉":"たそうかんしょう","多成分混合物":"たせいぶんこんごうぶつ","多数":"たすう","多数回":"たすうかい","多数粒子":"たすうりゅうし","多様":"たよう","多様性":"たようせい","多段障害物":"ただんしょうがいぶつ","多遺伝子形質":"たいでんしけいしつ","多重反射":"たじゅうはんしゃ","多頭注意":"たとうちゅうい","夜":"よる","夜景":"やけい","夜空":"よぞら","夜間採取":"やかんさいしゅ","大":"おお","大三角":"だいさんかく","大人":"おとな","大人向":"おとなむけ","大地":"だいち","大地課題":"だいちかだい","大型":"おおがた","大型端脚類":"おおがたたんきゃくるい","大型船":"おおがたせん","大小":"だいしょう","大小二":"だいしょうふた","大幅":"おおはば","大曲線":"だいきょくせん","大気":"たいき","大気中":"たいきちゅう","大気屈折":"たいきくっせつ","大気差":"たいきさ","大気循環":"たいきじゅんかん","大気遠近":"たいきえんきん","大波":"おおなみ","大潮":"おおしお","大粒":"おおつぶ","大群":"たいぐん","大胆":"だいたん","大腸":"だいちょう","大腸到達":"だいちょうとうたつ","大規模入力":"だいきぼにゅうりょく","大質量":"だいしつりょう","大部分":"だいぶぶん","大量":"たいりょう","大銀河":"だいぎんが","大集団":"だいしゅうだん","大電力":"だいでんりょく","大電流":"だいでんりゅう","大面積":"だいめんせき","大鳥":"おおとり","天":{"の":"あま"},"天井":"てんじょう","天井崩落":"てんじょうほうらく","天体":"てんたい","天体予測":"てんたいよそく","天体力学":"てんたいりきがく","天体数":"てんたいすう","天候":"てんこう","天文":"てんもん","天気":"てんき","天気予報":"てんきよほう","太":"ふと","太陽":"たいよう","太陽信頼度":"たいようしんらいど","太陽光":"たいようこう","太陽成分":"たいようせいぶん","太陽潮汐":"たいようちょうせき","太陽高度":"たいようこうど","失":"うしな","失敗":"しっぱい","失活":"しっかつ","失速":"しっそく","失速余裕":"しっそくよゆう","失速接近":"しっそくせっきん","失速超過":"しっそくちょうか","奇数":"きすう","契約":"けいやく","奥":"おく","奥行":"おくゆ","奪":"うば","女王":"じょおう","好":"す","妥当性":"だとうせい","姉妹染色分体":"しまいせんしょくぶんたい","始":"はじ","始動":"しどう","姿":"すがた","姿勢":"しせい","姿勢安定":"しせいあんてい","姿勢振動":"しせいしんどう","媒質":"ばいしつ","媒質中":"ばいしつちゅう","媒質境界":"ばいしつきょうかい","媒質差":"ばいしつさ","子":"こ","子世代":"しせだい","子深":"こふか","孔":"あな","字":"じ","字形":"じけい","存在":"そんざい","存在感":"そんざいかん","季節":"きせつ","季節区分":"きせつくぶん","季節図鑑":"きせつずかん","季節性":"きせつせい","季節感":"きせつかん","季節条件":"きせつじょうけん","季節生存率":"きせつせいぞんりつ","季節語":"きせつご","季節語重":"きせつごおも","季語":"きご","孤立":"こりつ","孤立区画":"こりつくかく","孤立数":"こりつすう","孤立系":"こりつけい","学":"まな","学堂":"がくどう","学習":"がくしゅう","学習信頼度":"がくしゅうしんらいど","学習効果":"がくしゅうこうか","学習済":"がくしゅうず","学習用":"がくしゅうよう","宇宙":"うちゅう","宇宙航法":"うちゅうこうほう","守":"まも","安":{"い":"やす"},"安全":"あんぜん","安全余裕":"あんぜんよゆう","安全分類":"あんぜんぶんるい","安全判定":"あんぜんはんてい","安全判断":"あんぜんはんだん","安全制約":"あんぜんせいやく","安全在庫":"あんぜんざいこ","安全基準":"あんぜんきじゅん","安全性":"あんぜんせい","安全率":"あんぜんりつ","安全規格":"あんぜんきかく","安全評価":"あんぜんひょうか","安全限界":"あんぜんげんかい","安定":"あんてい","安定同位体":"あんていどういたい","安定域":"あんていいき","安定寄":{"り":"あんていよ"},"安定度":"あんていど","安定性":"あんていせい","安定成長模型":"あんていせいちょうもけい","安定滑空":"あんていかっくう","安定軌道群":"あんていきどうぐん","安定風":"あんていふう","安定飛行":"あんていひこう","安息角":"あんそくかく","安静時":"あんせいじ","完了":"かんりょう","完全":"かんぜん","完全五度":"かんぜんごど","完全優性":"かんぜんゆうせい","完全再現":"かんぜんさいげん","完全判定":"かんぜんはんてい","完全四度":"かんぜんよんど","完全性検証":"かんぜんせいけんしょう","完全探索":"かんぜんたんさく","完全燃焼":"かんぜんねんしょう","完成":"かんせい","完成分子":"かんせいぶんし","完成度":"かんせいど","完成形":"かんせいけい","完成盤面":"かんせいばんめん","完結":"かんけつ","定圧":"ていあつ","定型":"ていけい","定容":"ていよう","定常":"ていじょう","定常状態":"ていじょうじょうたい","定数":"ていすう","定着":"ていちゃく","定積":"ていせき","定義":"ていぎ","定量":"ていりょう","定量予測":"ていりょうよそく","定量値":"ていりょうち","定量化":"ていりょうか","定量的":"ていりょうてき","定量表示":"ていりょうひょうじ","宝物偏":"たからものかたよ","宝箱":"たからばこ","実":"み","実像":"じつぞう","実分析条件":"じつぶんせきじょうけん","実効値":"じっこうち","実効速度":"じっこうそくど","実務":"じつむ","実単位":"じつたんい","実土壌":"じつどじょう","実在":"じつざい","実在企業":"じつざいきぎょう","実在気体補正":"じつざいきたいほせい","実在磁性体":"じつざいじせいたい","実在設備":"じつざいせつび","実在魚種":"じつざいぎょしゅ","実寸":"じっすん","実寸法":"じっすんぽう","実時間":"じつじかん","実植物":"じっしょくぶつ","実機":"じっき","実機形状":"じっきけいじょう","実機性能表":"じっきせいのうひょう","実河川":"じつかせん","実測器":"じっそくき","実物":"じつぶつ","実物実験":"じつぶつじっけん","実用暗号":"じつようあんごう","実用暗号強度":"じつようあんごうきょうど","実画像":"じつがぞう","実薬品":"じつやくひん","実行":"じっこう","実行時間":"じっこうじかん","実装":"じっそう","実観測":"じつかんそく","実調査":"じっちょうさ","実車":"じっしゃ","実軸":"じつじく","実部":"じつぶ","実部中心":"じつぶちゅうしん","実配管設計":"じつはいかんせっけい","実配線":"じつはいせん","実際":"じっさい","実集団":"じつしゅうだん","実電池":"じつでんち","実音声":"じつおんせい","実飛行":"じつひこう","実験":"じっけん","実験場":"じっけんじょう","実験手順":"じっけんてじゅん","実験条件決定":"じっけんじょうけんけってい","実験法":"じっけんほう","実験的短歌":"じっけんてきたんか","実験装置":"じっけんそうち","客":"きゃく","室内":"しつない","室内環境":"しつないかんきょう","室温":"しつおん","家":"いえ","家庭":"かてい","容器":"ようき","容器圧力":"ようきあつりょく","容器強度":"ようききょうど","容器形状":"ようきけいじょう","容積":"ようせき","容積変化":"ようせきへんか","容量":"ようりょう","寄":"よ","寄与":"きよ","寄与率":"きよりつ","寄生率":"きせいりつ","密":{"な":"みつ"},"密度":"みつど","密度層":"みつどそう","密度差":"みつどさ","密度条件":"みつどじょうけん","密着":"みっちゃく","密集":"みっしゅう","富士":"ふじ","富士山":"ふじさん","寒冷前線":"かんれいぜんせん","寒気":"かんき","寒色":"かんしょく","寒色寄":{"り":"かんしょくよ"},"対":"たい","対合":"ついごう","対応":"たいおう","対数":"たいすう","対数的":"たいすうてき","対数関係":"たいすうかんけい","対比":"たいひ","対水速度":"たいすいそくど","対流":"たいりゅう","対流熱流":"たいりゅうねつりゅう","対流状態":"たいりゅうじょうたい","対称":"たいしょう","対称性":"たいしょうせい","対称数":"たいしょうすう","対称模様":"たいしょうもよう","対称誤差":"たいしょうごさ","対立分布":"たいりつぶんぷ","対立遺伝子":"たいりついでんし","対立遺伝子頻度":"たいりついでんしひんど","対策":"たいさく","対策強度":"たいさくきょうど","対角線":"たいかくせん","対話":"たいわ","対象":"たいしょう","対象方位":"たいしょうほうい","対象星座":"たいしょうせいざ","対象高度":"たいしょうこうど","寿命":"じゅみょう","寿命評価":"じゅみょうひょうか","専門家":"せんもんか","専門的管理":"せんもんてきかんり","射影":"しゃえい","射影長":"しゃえいちょう","将来":"しょうらい","将来予測":"しょうらいよそく","導":{"く":"みちび"},"導線":"どうせん","導線抵抗":"どうせんていこう","導線発熱":"どうせんはつねつ","導関数":"どうかんすう","小":"ちい","小動物":"しょうどうぶつ","小型":"こがた","小型動物":"こがたどうぶつ","小型魚":"こがたぎょ","小天体":"しょうてんたい","小昆虫":"しょうこんちゅう","小次元":"しょうじげん","小潮":"こしお","小球":"しょうきゅう","小粒":"こつぶ","小腸":"しょうちょう","小舟":"こぶね","小語彙":"しょうごい","小遣":"こづか","小集団":"しょうしゅうだん","小面積":"しょうめんせき","小魚":"こざかな","小鳥":"ことり","少":{"し":"すこ","な":"すく"},"少人数":"しょうにんずう","少数":"しょうすう","少数値":"しょうすうち","少量":"しょうりょう","少量追加":"しょうりょうついか","尺度":"しゃくど","尽":{"き":"つ"},"尾":"お","尾根":"おね","尾索動物":"びさくどうぶつ","尿":"にょう","尿浸透圧":"にょうしんとうあつ","尿糖":"にょうとう","尿細管":"にょうさいかん","尿量":"にょうりょう","局所":"きょくしょ","局所反応":"きょくしょはんのう","局所変化率":"きょくしょへんかりつ","局所崩壊":"きょくしょほうかい","局所差分":"きょくしょさぶん","局所得点":"きょくしょとくてん","局所手掛":{"か":"きょくしょてが"},"局所探索":"きょくしょたんさく","局所栄養":"きょくしょえいよう","局所構造":"きょくしょこうぞう","局所流下則":"きょくしょりゅうかそく","局所流速":"きょくしょりゅうそく","局所濃度":"きょくしょのうど","局所的":"きょくしょてき","局所相互作用":"きょくしょそうごさよう","局所規則":"きょくしょきそく","局所視野":"きょくしょしや","屈折":"くっせつ","屈折力":"くっせつりょく","屈折率":"くっせつりつ","屈折率勾配":"くっせつりつこうばい","屈折率差":"くっせつりつさ","屈筋":"くっきん","屈筋活動":"くっきんかつどう","届":"とど","屋根":"やね","展開":"てんかい","層":"そう","層付近":"そうふきん","層厚":"そうこう","層数":"そうすう","層更新":"そうこうしん","層状":"そうじょう","層間隔":"そうかんかく","履歴":"りれき","山":"やま","岩":"いわ","岩場":"いわば","岩壁":"がんぺき","岩盤":"がんばん","岩石":"がんせき","岩石割合":"がんせきわりあい","岩石循環":"がんせきじゅんかん","岩石材料":"がんせきざいりょう","岩礁洞窟周辺":"がんしょうどうくつしゅうへん","岩質":"がんしつ","岩陰":"いわかげ","岩面":"がんめん","岸":"きし","峡谷":"きょうこく","峡谷曲率":"きょうこくきょくりつ","峡谷走行":"きょうこくそうこう","崩":"くず","崩壊":"ほうかい","崩落":"ほうらく","崩落頻度":"ほうらくひんど","嵐":"あらし","川":"かわ","川筋":"かわすじ","川銀河":"がわぎんが","巣":"す","巣内酸素":"すないさんそ","巣完成":"すかんせい","巣完成度":"すかんせいど","巣容量":"すようりょう","巣成長":"すせいちょう","巣構造":"すこうぞう","巣穴":"すあな","工業粉体":"こうぎょうふんたい","左":"ひだり","左下":"ひだりした","左側":"ひだりがわ","左初期位置":"ひだりしょきいち","左右":"さゆう","左右心":"さゆうしん","左右心室差":"さゆうしんしつさ","左右斜面角":"さゆうしゃめんかく","左右肺胞":"さゆうはいほう","左右血流配分":"さゆうけつりゅうはいぶん","左右集団":"さゆうしゅうだん","左心室":"さしんしつ","左折率":"させつりつ","左端":"ひだりはし","左端法":"ひだりはしほう","左肺":"さはい","左肺胞":"ひだりはいほう","左肺血流":"ひだりはいけつりゅう","巧":{"さ":"うま"},"巨大":"きょだい","差":"さ","差分":"さぶん","差分商":"さぶんしょう","差分幅":"さぶんはば","差周波数":"さしゅうはすう","巻":{"い":"ま","き":"ま"},"巻数":"まきすう","巻貝":"まきがい","市場":"しじょう","帯":"おび","帯域":"たいいき","帯域幅":"たいいきはば","帰":"かえ","帰無仮説":"きむかせつ","帰無仮説下":"きむかせつか","帰無分布":"きむぶんぷ","帰還":"きかん","帰還余裕":"きかんよゆう","帰還成功率":"きかんせいこうりつ","帰還時":"きかんじ","帰還期":"きかんき","帰還資源":"きかんしげん","常":"つね","常時計器":"じょうじけいき","幅":"はば","幅優先探索":"はばゆうせんたんさく","干":"かん","干出時間帯":"かんしゅつじかんたい","干渉":"かんしょう","干渉縞":"かんしょうじま","干渉縞全体":"かんしょうじまぜんたい","干潮":"かんちょう","平":{"ら":"たい"},"平原":"へいげん","平地":"へいち","平均":"へいきん","平均位相":"へいきんいそう","平均値":"へいきんち","平均傾斜":"へいきんけいしゃ","平均動脈圧":"へいきんどうみゃくあつ","平均勾配":"へいきんこうばい","平均化":"へいきんか","平均反復":"へいきんはんぷく","平均土壌":"へいきんどじょう","平均圧":"へいきんあつ","平均在庫":"へいきんざいこ","平均変化":"へいきんへんか","平均変化率":"へいきんへんかりつ","平均密度":"へいきんみつど","平均形質":"へいきんけいしつ","平均待":"へいきんま","平均律":"へいきんりつ","平均斜面":"へいきんしゃめん","平均歩数":"へいきんほすう","平均注意":"へいきんちゅうい","平均温度":"へいきんおんど","平均濃度":"へいきんのうど","平均的":"へいきんてき","平均移動":"へいきんいどう","平均経路":"へいきんけいろ","平均緯度":"へいきんいど","平均輝度":"へいきんきど","平均速":"へいきんはや","平常需要":"へいじょうじゅよう","平文":"ひらぶん","平滑化":"へいかつか","平行":"へいこう","平行移動":"へいこういどう","平衡":"へいこう","平衡感覚":"へいこうかんかく","平衡潮汐":"へいこうちょうせき","平衡高":"へいこうたか","平面":"へいめん","平面上":"へいめんじょう","平面性":"へいめんせい","平面的":"へいめんてき","平面軌跡":"へいめんきせき","平面配置":"へいめんはいち","年":"とし","年代":"ねんだい","年代対比":"ねんだいたいひ","年代推定":"ねんだいすいてい","年刻":"ねんきざ","年変動":"ねんへんどう","年数":"ねんすう","年次系列":"ねんじけいれつ","年輪":"ねんりん","年輪幅":"ねんりんはば","年輪系列":"ねんりんけいれつ","年進":{"め":"ねんすす"},"年齢":"ねんれい","幹":"みき","幼体":"ようたい","幼虫":"ようちゅう","幼虫健康":"ようちゅうけんこう","幼虫需要":"ようちゅうじゅよう","幼魚":"ようぎょ","幾何":"きか","幾何光学":"きかこうがく","広":"ひろ","広帯域":"こうたいいき","広視野低速":"こうしやていそく","床":"ゆか","床面移動":"ゆかめんいどう","床面積":"ゆかめんせき","底":"そこ","底泥":"ていでい","底面":"ていめん","店":"みせ","店内":"てんない","座":"ざ","座標":"ざひょう","座標変換":"ざひょうへんかん","廃棄":"はいき","延":{"ば":"の"},"延長線":"えんちょうせん","建材":"けんざい","建材寿命":"けんざいじゅみょう","建物":"たてもの","建物被害":"たてものひがい","建築":"けんちく","建築空間":"けんちくくうかん","建築遠近法":"けんちくえんきんほう","建設":"けんせつ","建設工程":"けんせつこうてい","弁":"べん","弁疾患":"べんしっかん","弁膜症":"べんまくしょう","弁開閉":"べんかいへい","式":"しき","引":"ひ","引力":"いんりょく","弧":"こ","弱":"よわ","弱塩基":"じゃくえんき","弱酸":"じゃくさん","弱酸弱塩基":"じゃくさんじゃくえんき","張":"は","張力":"ちょうりょく","張力余裕":"ちょうりょくよゆう","強":"つよ","強化":"きょうか","強塩基型":"きょうえんきがた","強度":"きょうど","強度予報":"きょうどよほう","強度分布":"きょうどぶんぷ","強磁場選別":"きょうじばせんべつ","強調":"きょうちょう","強調密度":"きょうちょうみつど","強酸型":"きょうさんがた","強酸試料":"きょうさんしりょう","強風":"きょうふう","弾性":"だんせい","弾性変形":"だんせいへんけい","弾性応力":"だんせいおうりょく","弾性的":"だんせいてき","当":{"て":"あ"},"当量":"とうりょう","当量点":"とうりょうてん","当量点付近":"とうりょうてんふきん","当量点進行":"とうりょうてんしんこう","形":"かたち","形式":"けいしき","形式文法模型":"けいしきぶんぽうもけい","形式言語":"けいしきげんご","形態":"けいたい","形態形成因子":"けいたいけいせいいんし","形成":"けいせい","形成中":"けいせいちゅう","形成層":"けいせいそう","形成段階":"けいせいだんかい","形状":"けいじょう","形状半径":"けいじょうはんけい","形状変化":"けいじょうへんか","形状抵抗":"けいじょうていこう","形状混合":"けいじょうこんごう","形質":"けいしつ","形質分布":"けいしつぶんぷ","形質喪失":"けいしつそうしつ","形質変化":"けいしつへんか","形質差":"けいしつさ","形質行列":"けいしつぎょうれつ","形質進化":"けいしつしんか","彦星":"ひこぼし","影":"かげ","影強度":"かげきょうど","影響":"えいきょう","役割":"やくわり","役割分担":"やくわりぶんたん","役割別個体":"やくわりべつこたい","役割配分":"やくわりはいぶん","往復":"おうふく","往復一致":"おうふくいっち","往復時間":"おうふくじかん","往復輸送":"おうふくゆそう","往路":"おうろ","待":"ま","律速":"りっそく","後戻":"あともど","後方":"こうほう","後方波長":"こうほうはちょう","後期":"こうき","後期印象派":"こうきいんしょうは","後流":"こうりゅう","後負荷":"こうふか","後退":"こうたい","従":"したが","得":"え","得点":"とくてん","復元":"ふくげん","復元可能性":"ふくげんかのうせい","復元率":"ふくげんりつ","復元率履歴":"ふくげんりつりれき","復元限界":"ふくげんげんかい","復号":"ふくごう","復号結果":"ふくごうけっか","復路":"ふくろ","循環":"じゅんかん","循環強度":"じゅんかんきょうど","循環応答":"じゅんかんおうとう","循環条件":"じゅんかんじょうけん","循環状態":"じゅんかんじょうたい","循環課題":"じゅんかんかだい","循環追跡":"じゅんかんついせき","微分":"びぶん","微分係数":"びぶんけいすう","微化石":"びかせき","微小":"びしょう","微小初期差":"びしょうしょきさ","微小動物":"びしょうどうぶつ","微小変調":"びしょうへんちょう","微小差":"びしょうさ","微小時間":"びしょうじかん","微小有機物":"びしょうゆうきぶつ","微小生物":"びしょうせいぶつ","微小粒子":"びしょうりゅうし","微生物":"びせいぶつ","微生物膜":"びせいぶつまく","微粒子":"びりゅうし","微細構造":"びさいこうぞう","微細藻類化石":"びさいそうるいかせき","微調整":"びちょうせい","心室":"しんしつ","心室充満":"しんしつじゅうまん","心室容積":"しんしつようせき","心拍":"しんぱく","心拍出量":"しんはくしゅつりょう","心拍数":"しんぱくすう","心理的":"しんりてき","心臓":"しんぞう","必":"かなら","必要":"ひつよう","必要性":"ひつようせい","必須":"ひっす","応":"おう","応力":"おうりょく","応力差":"おうりょくさ","応力拡大係数":"おうりょくかくだいけいすう","応力指標":"おうりょくしひょう","応力比":"おうりょくひ","応力範囲":"おうりょくはんい","応力蓄積":"おうりょくちくせき","応力集中":"おうりょくしゅうちゅう","応答":"おうとう","応答遅":"おうとうおく","応答閾値":"おうとうしきいち","忠実":"ちゅうじつ","思":"おも","思考理由":"しこうりゆう","急":"きゅう","急上昇":"きゅうじょうしょう","急冷":"きゅうれい","急制動":"きゅうせいどう","急制動後":"きゅうせいどうご","急増":"きゅうぞう","急変":"きゅうへん","急曲線":"きゅうきょくせん","急激":"きゅうげき","急速":"きゅうそく","性":"せい","性能":"せいのう","性能予測":"せいのうよそく","性質":"せいしつ","性選択":"せいせんたく","恐竜":"きょうりゅう","恒星":"こうせい","恒星図鑑":"こうせいずかん","恒星時角":"こうせいじかく","息":"いき","悪":{"く":"わる"},"悪化":"あっか","情報":"じょうほう","情報共有":"じょうほうきょうゆう","情報経路":"じょうほうけいろ","情報統合":"じょうほうとうごう","惑星":"わくせい","惑星軌道":"わくせいきどう","想像":"そうぞう","意味":"いみ","意味理解":"いみりかい","意思決定":"いしけってい","意識的":"いしきてき","感":{"じ":"かん"},"感受性":"かんじゅせい","感度":"かんど","感応制御":"かんのうせいぎょ","感情":"かんじょう","感情的筆触":"かんじょうてきひっしょく","感染":"かんせん","感染拡大":"かんせんかくだい","感染症":"かんせんしょう","感染経路":"かんせんけいろ","感染者数":"かんせんしゃすう","感染連鎖":"かんせんれんさ","感知距離":"かんちきょり","感覚":"かんかく","感覚器":"かんかくき","感覚神経":"かんかくしんけい","感覚雑音":"かんかくざつおん","慣性":"かんせい","懐中電灯":"かいちゅうでんとう","懸濁物食者":"けんだくぶつしょくしゃ","成分":"せいぶん","成分数":"せいぶんすう","成功":"せいこう","成功率":"せいこうりつ","成層圏気球":"せいそうけんききゅう","成熟":"せいじゅく","成熟度":"せいじゅくど","成熟樹":"せいじゅくじゅ","成績":"せいせき","成育場":"せいいくじょう","成虫化率":"せいちゅうかりつ","成長":"せいちょう","成長中":"せいちょうちゅう","成長信号":"せいちょうしんごう","成長前線":"せいちょうぜんせん","成長半径":"せいちょうはんけい","成長場":"せいちょうば","成長履歴":"せいちょうりれき","成長条件":"せいちょうじょうけん","成長模型":"せいちょうもけい","成長点":"せいちょうてん","成長率":"せいちょうりつ","成長端":"せいちょうたん","成長途中":"せいちょうとちゅう","成長速度":"せいちょうそくど","戻":"もど","所要":"しょよう","所要時間":"しょようじかん","扁形動物":"へんけいどうぶつ","手":"て","手回":"てまわ","手掛":"てが","手描":"てが","手本":"てほん","手続":"てつづ","手足":"てあし","打":"う","払":{"い":"はら","え":"はら"},"扱":"あつか","技術":"ぎじゅつ","抑":"おさ","投":"な","投下":"とうか","投入":"とうにゅう","投入率":"とうにゅうりつ","投入速度":"とうにゅうそくど","投射":"とうしゃ","投射角":"とうしゃかく","投射運動":"とうしゃうんどう","投影":"とうえい","投影中":"とうえいちゅう","投影距離":"とうえいきょり","投擲":"とうてき","投資":"とうし","投資推奨":"とうしすいしょう","抗体":"こうたい","抗体反応":"こうたいはんのう","抗体立":"こうたいた","抗力":"こうりょく","抗力係数":"こうりょくけいすう","抗力係数指標":"こうりょくけいすうしひょう","折":{"り":"お","れ":"お"},"折返":"おりかえ","抜":"ぬ","抵抗":"ていこう","押":"お","抽象化":"ちゅうしょうか","抽象模型":"ちゅうしょうもけい","抽象的":"ちゅうしょうてき","抽象粒子模型":"ちゅうしょうりゅうしもけい","担":{"い":"にな","う":"にな"},"担当区域":"たんとうくいき","拍":"はく","拍位相":"はくいそう","拍出":"はくしゅつ","拍出器":"はくしゅつき","拍検出":"はくけんしゅつ","拗音":"ようおん","拘束":"こうそく","拘束条件":"こうそくじょうけん","拠点":"きょてん","拡大":"かくだい","拡大率":"かくだいりつ","拡大表示":"かくだいひょうじ","拡張":"かくちょう","拡散":"かくさん","拡散中心":"かくさんちゅうしん","拡散余力":"かくさんよりょく","拡散平滑化":"かくさんへいかつか","拡散比":"かくさんひ","拡散率":"かくさんりつ","拡散速度":"かくさんそくど","拡散速度差":"かくさんそくどさ","拮抗筋":"きっこうきん","拾":"ひろ","持":"も","持続可能":"じぞくかのう","持続時間":"じぞくじかん","指":"ゆび","指令":"しれい","指定":"してい","指揮":"しき","指揮者":"しきしゃ","指数":"しすう","指数的":"しすうてき","指数関数":"しすうかんすう","指標":"しひょう","指状":"しじょう","指示":"しじ","指示点":"しじてん","指示線":"しじせん","指示薬":"しじやく","指示進路":"しじしんろ","挑戦":"ちょうせん","挑戦中":"ちょうせんちゅう","挑戦問題":"ちょうせんもんだい","挑戦回数":"ちょうせんかいすう","挙動":"きょどう","振":"ふ","振動":"しんどう","振動伝達":"しんどうでんたつ","振動体":"しんどうたい","振動子":"しんどうし","振動数":"しんどうすう","振動流動":"しんどうりゅうどう","振幅":"しんぷく","振幅履歴":"しんぷくりれき","挿入法":"そうにゅうほう","捉":{"え":"とら"},"捕":{"ま":"つか","ら":"と"},"捕捉":"ほそく","捕獲":"ほかく","捕獲性能":"ほかくせいのう","捕獲確率":"ほかくかくりつ","捕獲面":"ほかくめん","捕食":"ほしょく","捕食圧":"ほしょくあつ","捕食数":"ほしょくすう","捕食者":"ほしょくしゃ","捕食者回避":"ほしょくしゃかいひ","掃引":"そういん","掃除屋":"そうじや","排出":"はいしゅつ","排出計算":"はいしゅつけいさん","排気":"はいき","排気率":"はいきりつ","排泄":"はいせつ","排除":"はいじょ","排除体積":"はいじょたいせき","掘":{"っ":"ほ","り":"ほ"},"掘削":"くっさく","掘削優先度":"くっさくゆうせんど","掘削速度":"くっさくそくど","掛":"か","採":"と","採取":"さいしゅ","採取負荷":"さいしゅふか","採点":"さいてん","採餌":"さいじ","採餌個体":"さいじこたい","採餌経路":"さいじけいろ","採餌配分":"さいじはいぶん","探":"さが","探査":"たんさ","探検":"たんけん","探究":"たんきゅう","探索":"たんさく","探索個体":"たんさくこたい","探索効率":"たんさくこうりつ","探索区画":"たんさくくかく","探索方策":"たんさくほうさく","探索枝":"たんさくえだ","探索的":"たんさくてき","探索範囲":"たんさくはんい","探索経路":"たんさくけいろ","探索重視":"たんさくじゅうし","探索量":"たんさくりょう","接合度":"せつごうど","接地面積":"せっちめんせき","接続":"せつぞく","接続性":"せつぞくせい","接続枠":"せつぞくわく","接続率":"せつぞくりつ","接線":"せっせん","接線角度":"せっせんかくど","接線近似":"せっせんきんじ","接触":"せっしょく","接触低減":"せっしょくていげん","接触力":"せっしょくりょく","接触角":"せっしょくかく","接近":"せっきん","接近中":"せっきんちゅう","推力":"すいりょく","推定":"すいてい","推定値":"すいていち","推定区間":"すいていくかん","推定収束":"すいていしゅうそく","推定吸収余裕":"すいていきゅうしゅうよゆう","推定幅":"すいていはば","推定成虫数":"すいていせいちゅうすう","推定残存周期":"すいていざんぞんしゅうき","推定残距離":"すいていざんきょり","推定法":"すいていほう","推定線":"すいていせん","推定誤差":"すいていごさ","推定距離":"すいていきょり","推定量":"すいていりょう","推敲":"すいこう","推敲数":"すいこうすう","推敲温度":"すいこうおんど","推移":"すいい","推論":"すいろん","推論模型":"すいろんもけい","推進":"すいしん","描":"えが","描画":"びょうが","提示":"ていじ","揚力":"ようりょく","揚力係数":"ようりょくけいすう","揚力係数時系列":"ようりょくけいすうじけいれつ","揚力変動":"ようりょくへんどう","揚力設定":"ようりょくせってい","揚抗比":"ようこうひ","換":{"え":"か"},"換気":"かんき","換気不足":"かんきぶそく","換気室":"かんきしつ","換気量":"かんきりょう","換算":"かんさん","揺":"ゆ","損傷":"そんしょう","損傷蓄積":"そんしょうちくせき","損失":"そんしつ","損失許容線":"そんしつきょようせん","損耗":"そんもう","搭載重量":"とうさいじゅうりょう","搭載量":"とうさいりょう","摂動":"せつどう","摂食":"せっしょく","摂食痕":"せっしょくこん","摩擦":"まさつ","摩擦力":"まさつりょく","摩擦差":"まさつさ","摩擦表示":"まさつひょうじ","摩耗":"まもう","撹乱":"かくらん","撹乱頻度":"かくらんひんど","操作":"そうさ","操作中":"そうさちゅう","操作値":"そうさち","操作数":"そうさすう","操作条件":"そうさじょうけん","操作量":"そうさりょう","操縦規則":"そうじゅうきそく","操縦訓練":"そうじゅうくんれん","操縦遅":"そうじゅうおく","操舵":"そうだ","操船":"そうせん","擾乱":"じょうらん","攪乱":"かくらん","攪乱回復":"かくらんかいふく","攪乱強度":"かくらんきょうど","攪乱後":"かくらんご","攪拌":"かくはん","支":"ささ","支持":"しじ","支持不足":"しじぶそく","支持率":"しじりつ","支持部摩擦":"しじぶまさつ","支援":"しえん","支援技術":"しえんぎじゅつ","支点":"してん","支配":"しはい","支配的":"しはいてき","改善":"かいぜん","改善候補":"かいぜんこうほ","攻勢":"こうせい","攻撃":"こうげき","攻撃予算":"こうげきよさん","放":"はな","放出":"ほうしゅつ","放出光子":"ほうしゅつこうし","放出周波数":"ほうしゅつしゅうはすう","放射":"ほうしゃ","放射熱流":"ほうしゃねつりゅう","放射率":"ほうしゃりつ","放射線安全":"ほうしゃせんあんぜん","放射線安全評価":"ほうしゃせんあんぜんひょうか","放熱":"ほうねつ","放電":"ほうでん","放電中":"ほうでんちゅう","放電切替":"ほうでんきりかえ","政治的":"せいじてき","政策":"せいさく","故障":"こしょう","救助":"きゅうじょ","救命":"きゅうめい","救急車音源":"きゅうきゅうしゃおんげん","教育":"きょういく","教育尺度":"きょういくしゃくど","教育模型":"きょういくもけい","教育用":"きょういくよう","教育用相対値":"きょういくようそうたいち","教育用近似":"きょういくようきんじ","散":{"ら":"ち"},"散乱":"さんらん","散在資源":"さんざいしげん","散逸":"さんいつ","散開星団":"さんかいせいだん","数":"かず","数世代後":"すうせだいご","数世代進":"すうせだいすす","数値":"すうち","数値入力":"すうちにゅうりょく","数値刻":{"み":"すうちきざ"},"数値安定性":"すうちあんていせい","数値微分":"すうちびぶん","数値模型":"すうちもけい","数値流体解析":"すうちりゅうたいかいせき","数値積分":"すうちせきぶん","数値積分誤差":"すうちせきぶんごさ","数値誤差":"すうちごさ","数値誤差評価":"すうちごさひょうか","数値近似":"すうちきんじ","数字":"すうじ","数字当":"すうじあ","数学":"すうがく","数独":"すうどく","数独手筋":"すうどくてすじ","数領域":"すうりょういき","整":"ととの","整列":"せいれつ","整列初期":"せいれつしょき","整列法":"せいれつほう","整列済":{"み":"せいれつず"},"整数":"せいすう","整数比":"せいすうひ","整数比指標":"せいすうひしひょう","整流":"せいりゅう","整然":"せいぜん","整理":"せいり","敵配置":"てきはいち","文化":"ぶんか","文化的評価":"ぶんかてきひょうか","文字":"もじ","文字列":"もじれつ","文字列上":"もじれつじょう","文字数":"もじすう","文字置換":"もじちかん","文字頻度":"もじひんど","文書構造":"ぶんしょこうぞう","文脈":"ぶんみゃく","文脈利用率":"ぶんみゃくりようりつ","文脈表現":"ぶんみゃくひょうげん","文脈長":"ぶんみゃくちょう","文語":"ぶんご","文長":"ぶんちょう","斑点":"はんてん","斑点状":"はんてんじょう","斜":{"め":"なな"},"斜面":"しゃめん","斜面災害":"しゃめんさいがい","斜面角":"しゃめんかく","斥力":"せきりょく","断":"だん","断定":"だんてい","断層":"だんそう","断層状態":"だんそうじょうたい","断層網":"だんそうもう","断層面":"だんそうめん","断応力":"だんおうりょく","断熱":"だんねつ","断熱圧縮":"だんねつあっしゅく","断熱設計":"だんねつせっけい","断片":"だんぺん","断面":"だんめん","断面積":"だんめんせき","新":"あたら","新月":"しんげつ","新規":"しんき","新記録":"しんきろく","方位":"ほうい","方向":"ほうこう","方向一致":"ほうこういっち","方向情報":"ほうこうじょうほう","方向成分":"ほうこうせいぶん","方向手掛":"ほうこうてが","方形波":"ほうけいは","方法":"ほうほう","方程式":"ほうていしき","方策":"ほうさく","方解石":"ほうかいせき","方解石沈殿":"ほうかいせきちんでん","方解石結晶":"ほうかいせきけっしょう","方言":"ほうげん","方針":"ほうしん","旅":"たび","旅行計画":"りょこうけいかく","旋回":"せんかい","旋回中":"せんかいちゅう","旋回半径":"せんかいはんけい","旋回開始":"せんかいかいし","旗":"はた","既存":"きそん","既知":"きち","既知平文":"きちへいぶん","既知平文率":"きちへいぶんりつ","日":{"の":"ひ","を":"ひ"},"日付":"ひづけ","日付変更線":"ひづけへんこうせん","日付線":"ひづけせん","日付線横断":"ひづけせんおうだん","日付補正":"ひづけほせい","日周鉛直移動":"にっしゅうえんちょくいどう","日変化":"にちへんか","日射":"にっしゃ","日射角":"にっしゃかく","日差":"ひざ","日常距離":"にちじょうきょり","日干":{"ば":"にちかん"},"日後":"にちご","日数":"にっすう","日曜日":"にちようび","日本付近":"にほんふきん","日本語":"にほんご","日没":"にちぼつ","日目":"にちめ","日進":"にちすす","日長":"にっちょう","日食":"にっしょく","早":"はや","早材":"そうざい","早送":"はやおく","昆虫":"こんちゅう","昇":"のぼ","昇降速度":"しょうこうそくど","明":"あか","明度":"めいど","明日":"あした","明暗":"めいあん","明暗差":"めいあんさ","明暗表示":"めいあんひょうじ","明確":"めいかく","明線本数":"めいせんほんすう","星":"ほし","星団":"せいだん","星座":"せいざ","星座恒星図鑑":"せいざこうせいずかん","星座探":"せいざさが","星月夜":"ほしづきよ","星空":"ほしぞら","星空模型":"ほしぞらもけい","星表":"せいひょう","映像":"えいぞう","春":"はる","春分付近":"しゅんぶんふきん","春雨":"はるさめ","昼":"ひる","昼光":"ちゅうこう","昼夜":"ちゅうや","昼夜境界":"ちゅうやきょうかい","昼間":"ひるま","時刻":"じこく","時刻制度":"じこくせいど","時刻計算":"じこくけいさん","時差":"じさ","時期":"じき","時点":"じてん","時系列":"じけいれつ","時系列化":"じけいれつか","時計":"とけい","時間":"じかん","時間分割":"じかんぶんかつ","時間分解能":"じかんぶんかいのう","時間刻":"じかんきざ","時間単位":"じかんたんい","時間変化":"じかんへんか","時間尺度":"じかんしゃくど","時間履歴":"じかんりれき","時間差":"じかんさ","時間帯":"じかんたい","時間当":"じかんあ","時間後":"じかんご","時間曲線":"じかんきょくせん","時間波形":"じかんはけい","時間発展":"じかんはってん","時間軸":"じかんじく","時間進":{"め":"じかんすす"},"時間遅":"じかんおく","時間過程":"じかんかてい","時間順":"じかんじゅん","時間領域":"じかんりょういき","晩材":"ばんざい","景色":"けしき","景観":"けいかん","暑":"あつ","暑熱":"しょねつ","暖":{"か":"あたた"},"暖気":"だんき","暖気核":"だんきかく","暖色":"だんしょく","暖色寄":{"り":"だんしょくよ"},"暖色比":"だんしょくひ","暗":"くら","暗号":"あんごう","暗号化":"あんごうか","暗号変換":"あんごうへんかん","暗号強度":"あんごうきょうど","暗号文":"あんごうぶん","暗号文字頻度":"あんごうもじひんど","暗号解析":"あんごうかいせき","暗号解析史":"あんごうかいせきし","暗夜時間":"あんやじかん","暗所":"あんしょ","暗部":"あんぶ","暗闇":"くらやみ","暦":"こよみ","暦日":"れきじつ","暮":{"ら":"く"},"曇天":"どんてん","曖昧":"あいまい","曖昧度":"あいまいど","曲":"ま","曲率":"きょくりつ","曲率半径指標":"きょくりつはんけいしひょう","曲線":"きょくせん","曲線上":"きょくせんじょう","更新":"こうしん","更新位相":"こうしんいそう","更新回数":"こうしんかいすう","更新回数一致":"こうしんかいすういっち","更新回数後":"こうしんかいすうご","更新量":"こうしんりょう","書":"か","書換":"かきか","書込":{"み":"かきこ"},"替":"か","最":"もっと","最初":"さいしょ","最善":"さいぜん","最多":"さいた","最多残燃料":"さいたざんねんりょう","最大":"さいだい","最大値":"さいだいち","最大分割数":"さいだいぶんかつすう","最大列":"さいだいれつ","最大化":"さいだいか","最大反応":"さいだいはんのう","最大呼気流量":"さいだいこきりゅうりょう","最大差":"さいだいさ","最大帰還余裕":"さいだいきかんよゆう","最大張力":"さいだいちょうりょく","最大応答位置":"さいだいおうとういち","最大曲":"さいだいま","最大歩数":"さいだいほすう","最大流速":"さいだいりゅうそく","最大流量":"さいだいりゅうりょう","最大浮力":"さいだいふりょく","最大誤差":"さいだいごさ","最大距離":"さいだいきょり","最大風速":"さいだいふうそく","最小":"さいしょう","最小余裕":"さいしょうよゆう","最小危険距離":"さいしょうきけんきょり","最小支持":"さいしょうしじ","最小通路数":"さいしょうつうろすう","最小領域":"さいしょうりょういき","最少気象":"さいしょうきしょう","最少燃料":"さいしょうねんりょう","最強線":"さいきょうせん","最後":"さいご","最新":"さいしん","最新放出":"さいしんほうしゅつ","最有力候補":"さいゆうりょくこうほ","最短":"さいたん","最短時間":"さいたんじかん","最短経路":"さいたんけいろ","最短解":"さいたんかい","最短距離":"さいたんきょり","最終位置":"さいしゅういち","最終模様":"さいしゅうもよう","最終溶解量":"さいしゅうようかいりょう","最終資産":"さいしゅうしさん","最良":"さいりょう","最近":"さいきん","最近傍":"さいきんぼう","最近傍距離":"さいきんぼうきょり","最近傍距離分布":"さいきんぼうきょりぶんぷ","最近傍領域":"さいきんぼうりょういき","最速":"さいそく","最適":"さいてき","最適化":"さいてきか","最適形質":"さいてきけいしつ","最長":"さいちょう","最高":"さいこう","最高安定度":"さいこうあんていど","最高高度":"さいこうこうど","月":"つき","月明":"つきあ","月相":"げっそう","月食":"げっしょく","月齢":"げつれい","有利":"ゆうり","有効":"ゆうこう","有効応力":"ゆうこうおうりょく","有効衝突":"ゆうこうしょうとつ","有効衝突指数":"ゆうこうしょうとつしすう","有機物":"ゆうきぶつ","有機物表面":"ゆうきぶつひょうめん","有機粒子":"ゆうきりゅうし","有櫛動物":"ゆうしつどうぶつ","有界":"ゆうかい","有限":"ゆうげん","有限個":"ゆうげんこ","有限刻":{"み":"ゆうげんきざ"},"有限半径":"ゆうげんはんけい","有限反射回数":"ゆうげんはんしゃかいすう","有限反復":"ゆうげんはんぷく","有限回":"ゆうげんかい","有限幅":"ゆうげんはば","有限時間":"ゆうげんじかん","有限時間指標":"ゆうげんじかんしひょう","有限格子":"ゆうげんこうし","有限標本":"ゆうげんひょうほん","有限集団":"ゆうげんしゅうだん","朝":"あさ","期待値":"きたいち","期待変化":"きたいへんか","期待比":"きたいひ","期限":"きげん","期限優先":"きげんゆうせん","期限超過":"きげんちょうか","木":"き","木部":"もくぶ","未分解":"みぶんかい","未分解栄養":"みぶんかいえいよう","未吸収":"みきゅうしゅう","未吸収物":"みきゅうしゅうぶつ","未実験":"みじっけん","未払":"みはら","未満":"みまん","未溶解固体":"みようかいこたい","未発見":"みはっけん","未登録元素":"みとうろくげんそ","未知試料":"みちしりょう","未記録":"みきろく","未隔離":"みかくり","末梢抵抗":"まっしょうていこう","本数":"ほんすう","本模型":"ほんもけい","材料":"ざいりょう","材料固有":"ざいりょうこゆう","材料定数":"ざいりょうていすう","材料強度":"ざいりょうきょうど","材料適合":"ざいりょうてきごう","材料配分":"ざいりょうはいぶん","材質":"ざいしつ","束":"たば","束縛数":"そくばくすう","束縛軌道":"そくばくきどう","条件":"じょうけん","条件比較":"じょうけんひかく","条件署名":"じょうけんしょめい","来":{"す":"き","た":"き","る":"く"},"来客":"らいきゃく","東":"ひがし","東京":"とうきょう","東京時":"とうきょうじ","東回":{"り":"ひがしまわ"},"東西":"とうざい","板":"いた","板状":"ばんじょう","板状成長":"ばんじょうせいちょう","析出":"せきしゅつ","析出開始":"せきしゅつかいし","林":"はやし","林内":"りんない","林冠":"りんかん","林床":"りんしょう","林床光":"りんしょうこう","枚":"まい","果実":"かじつ","枝":"えだ","枝先":"えださき","枝先数":"えださきすう","枝先選択":"えださきせんたく","枝分":"えだわ","枝密度":"えだみつど","枝数":"えだすう","枝構造":"えだこうぞう","枝状":"しじょう","枠":"わく","枠糸":"わくいと","架空感染症":"かくうかんせんしょう","架空資産":"かくうしさん","柄":"え","染色体":"せんしょくたい","染色体分配":"せんしょくたいぶんぱい","染色体収支":"せんしょくたいしゅうし","染色体数":"せんしょくたいすう","染色体表示":"せんしょくたいひょうじ","柔":"やわ","柱":"はしら","栄養":"えいよう","栄養吸収":"えいようきゅうしゅう","栄養塩":"えいようえん","栄養拡散":"えいようかくさん","栄養枯渇":"えいようこかつ","栄養状態":"えいようじょうたい","栄養粒子":"えいようりゅうし","栄養素":"えいようそ","栄養素別":"えいようそべつ","栄養素別収支":"えいようそべつしゅうし","栄養素粒子":"えいようそりゅうし","校正":"こうせい","株式比率":"かぶしきひりつ","核":"かく","核力":"かくりょく","核心":"かくしん","核生成":"かくせいせい","核表面":"かくひょうめん","根":"ね","根先端":"ねせんたん","根拠":"こんきょ","根源岩":"こんげんがん","根系":"こんけい","根系成長":"こんけいせいちょう","格子":"こうし","格子上":"こうしじょう","格子幅":"こうしはば","格子模型":"こうしもけい","桁":"けた","桁上":"けたあ","桃":"もも","桃色":"ももいろ","桿体":"かんたい","棄却":"ききゃく","棄却域":"ききゃくいき","棄却率":"ききゃくりつ","棒":"ぼう","棘皮動物":"きょくひどうぶつ","棚在庫":"たなざいこ","森":"もり","森林":"しんりん","森林化":"しんりんか","森林階層":"しんりんかいそう","植":"う","植物":"しょくぶつ","植物化石":"しょくぶつかせき","植物微化石":"しょくぶつびかせき","植物文法":"しょくぶつぶんぽう","植物状構造":"しょくぶつじょうこうぞう","植物由来物質":"しょくぶつゆらいぶっしつ","植物界":"しょくぶつかい","植物量":"しょくぶつりょう","植生":"しょくせい","植生段階":"しょくせいだんかい","植生被覆":"しょくせいひふく","植生遷移":"しょくせいせんい","検出":"けんしゅつ","検出力":"けんしゅつりょく","検出効率":"けんしゅつこうりつ","検出器":"けんしゅつき","検出数":"けんしゅつすう","検出漏":{"れ":"けんしゅつも"},"検定":"けんてい","検査":"けんさ","検査容量":"けんさようりょう","検査精度":"けんさせいど","検査間隔":"けんさかんかく","検索":"けんさく","検討":"けんとう","楕円軌道":"だえんきどう","極":"きょく","極小領域":"きょくしょうりょういき","極性":"きょくせい","極性分子":"きょくせいぶんし","極性結合":"きょくせいけつごう","極端":"きょくたん","極限":"きょくげん","楽":{"し":"たの"},"楽器":"がっき","概念指標":"がいねんしひょう","概念模型":"がいねんもけい","概念理解用":"がいねんりかいよう","概念的":"がいねんてき","概念的方策模型":"がいねんてきほうさくもけい","概算":"がいさん","構図":"こうず","構図秩序":"こうずちつじょ","構図線":"こうずせん","構成":"こうせい","構文":"こうぶん","構文差":"こうぶんさ","構文解析":"こうぶんかいせき","構造":"こうぞう","構造乱":"こうぞうみだ","構造変形":"こうぞうへんけい","構造強度":"こうぞうきょうど","構造漏":"こうぞうも","構造物":"こうぞうぶつ","構造色":"こうぞうしょく","構造設計":"こうぞうせっけい","様子":"ようす","様式":"ようしき","標本":"ひょうほん","標本不足":"ひょうほんぶそく","標本偏":"ひょうほんかたよ","標本分布":"ひょうほんぶんぷ","標本化":"ひょうほんか","標本化不足":"ひょうほんかぶそく","標本区画":"ひょうほんくかく","標本回数":"ひょうほんかいすう","標本密度":"ひょうほんみつど","標本平均":"ひょうほんへいきん","標本抽出":"ひょうほんちゅうしゅつ","標本採取":"ひょうほんさいしゅ","標本数":"ひょうほんすう","標本比較":"ひょうほんひかく","標本率":"ひょうほんりつ","標準":"ひょうじゅん","標準倉庫":"ひょうじゅんそうこ","標準問題":"ひょうじゅんもんだい","標準大気":"ひょうじゅんたいき","標準時":"ひょうじゅんじ","標準時帯":"ひょうじゅんじたい","標準演奏":"ひょうじゅんえんそう","標準観測":"ひょうじゅんかんそく","標準誤差":"ひょうじゅんごさ","標準迷宮":"ひょうじゅんめいきゅう","標準迷路":"ひょうじゅんめいろ","標準通信":"ひょうじゅんつうしん","標準配送":"ひょうじゅんはいそう","標高":"ひょうこう","標高断面":"ひょうこうだんめん","模":{"し":"も"},"模型":"もけい","模型上":"もけいじょう","模型値":"もけいち","模型内":"もけいない","模型状態":"もけいじょうたい","模型範囲":"もけいはんい","模型進行":"もけいしんこう","模式":"もしき","模式判定":"もしきはんてい","模式化":"もしきか","模式図":"もしきず","模式条件":"もしきじょうけん","模式模型":"もしきもけい","模式画":"もしきが","模式的":"もしきてき","模式粒子":"もしきりゅうし","模式表現":"もしきひょうげん","模様":"もよう","模様境界量":"もようきょうかいりょう","横":"よこ","横位置":"よこいち","横余裕":"よこよゆう","横切":{"っ":"よこぎ","ら":"よこぎ"},"横向":"よこむ","横方向":"よこほうこう","横方向幅":"よこほうこうはば","横歩":{"き":"よこある"},"横流":"よこなが","横軸":"よこじく","横速度":"よこそくど","横風":"よこかぜ","横風旋回":"よこかぜせんかい","樹上":"じゅじょう","樹冠":"じゅかん","樹冠下":"じゅかんか","樹林":"じゅりん","樹林率":"じゅりんりつ","樹枝状":"じゅしじょう","樹洞":"じゅどう","樹種":"じゅしゅ","樹脂":"じゅし","樹齢":"じゅれい","橋":"はし","橋梁":"きょうりょう","橙":"だいだい","橙色":"だいだいいろ","機会損失":"きかいそんしつ","機体":"きたい","機体構造":"きたいこうぞう","機体質量":"きたいしつりょう","機体重量":"きたいじゅうりょう","機械":"きかい","機械出力":"きかいしゅつりょく","機械状態":"きかいじょうたい","機械的":"きかいてき","機械的細分化":"きかいてきさいぶんか","機構":"きこう","機能":"きのう","機首":"きしゅ","櫛板":"くしいた","欄":"らん","欠":{"け":"か"},"欠品":"けっぴん","欠品待":"けっぴんま","欠品率":"けっぴんりつ","欠測":"けっそく","欠測情報":"けっそくじょうほう","欠落":"けつらく","欠落率":"けつらくりつ","欠陥":"けっかん","次":"つぎ","次世代":"じせだい","次世代見通":"じせだいみとお","次候補確率":"じこうほかくりつ","止":"と","正":{"か":"せい","し":"ただ","に":"せい","の":"せい"},"正体":"しょうたい","正味":"しょうみ","正味流束":"しょうみりゅうそく","正味浮力":"しょうみふりょく","正常":"せいじょう","正常時":"せいじょうじ","正弦波":"せいげんは","正方形":"せいほうけい","正極":"せいきょく","正確":"せいかく","正立":"せいりつ","正答率":"せいとうりつ","正規分布":"せいきぶんぷ","正規化":"せいきか","正規表現":"せいきひょうげん","正規近似":"せいききんじ","正解":"せいかい","正負":"せいふ","正面":"しょうめん","正面衝突":"しょうめんしょうとつ","歩":"ある","歩幅":"ほはば","歩数":"ほすう","歩数上限":"ほすうじょうげん","歩数不足":"ほすうぶそく","歩数分布":"ほすうぶんぷ","歩行者":"ほこうしゃ","歩行者位相":"ほこうしゃいそう","歩行者待":{"ち":"ほこうしゃま"},"歯":"は","歯板":"しばん","歳差":"さいさ","歴史的機械":"れきしてききかい","死":"し","死亡":"しぼう","死腔":"しくう","死骸":"しがい","残":"のこ","残像":"ざんぞう","残像長":"ざんぞうちょう","残存":"ざんそん","残存天体":"ざんそんてんたい","残存数":"ざんぞんすう","残存栄養":"ざんぞんえいよう","残存浮力":"ざんぞんふりょく","残存種":"ざんそんしゅ","残存質量":"ざんぞんしつりょう","残差寄与":"ざんさきよ","残差結合":"ざんさけつごう","残油":"ざんゆ","残燃料":"ざんねんりょう","残留応力":"ざんりゅうおうりょく","残留気体":"ざんりゅうきたい","残量":"ざんりょう","残量低下":"ざんりょうていか","残額":"ざんがく","段":"だん","段差状":"だんさじょう","段数":"だんすう","段送":"だんおく","段進":"だんすす","段進乱":"だんしんみだ","段進異常":"だんしんいじょう","段進規則":"だんしんきそく","段階":"だんかい","段階的":"だんかいてき","殻":"から","殻模型":"かくもけい","母":{"の":"はは"},"母平均":"ぼへいきん","母点":"ぼてん","母点数":"ぼてんすう","母点運動":"ぼてんうんどう","母点配置":"ぼてんはいち","母点間":"ぼてんかん","母集団":"ぼしゅうだん","毎":"まい","毎回":"まいかい","毎回揺":"まいかいゆ","毎日":"まいにち","毎日同":{"じ":"まいにちおな"},"比":"くら","比例":"ひれい","比率":"ひりつ","比較":"ひかく","比較回数":"ひかくかいすう","比較数":"ひかくすう","比較条件":"ひかくじょうけん","比較用":"ひかくよう","比較的均一":"ひかくてききんいつ","毛":"け","毛細管上昇":"もうさいかんじょうしょう","毛細管圧":"もうさいかんあつ","毛細管現象":"もうさいかんげんしょう","毛細血管血球":"もうさいけっかんけっきゅう","毛顎動物":"もうがくどうぶつ","気":"き","気体":"きたい","気体体積":"きたいたいせき","気体分子":"きたいぶんし","気体型":"きたいがた","気体密度":"きたいみつど","気体損失":"きたいそんしつ","気体法則":"きたいほうそく","気体温度":"きたいおんど","気体状態":"きたいじょうたい","気体状態方程式":"きたいじょうたいほうていしき","気体膨張":"きたいぼうちょう","気体量":"きたいりょう","気候":"きこう","気候予測":"きこうよそく","気候変動":"きこうへんどう","気候記録":"きこうきろく","気分":"きぶん","気団":"きだん","気圧":"きあつ","気圧低下":"きあつていか","気圧配置":"きあつはいち","気孔":"きこう","気泡":"きほう","気温":"きおん","気球":"ききゅう","気球運航":"ききゅううんこう","気象":"きしょう","気象判断":"きしょうはんだん","気道":"きどう","気道内径":"きどうないけい","気道抵抗":"きどうていこう","気道狭窄":"きどうきょうさく","水":"みず","水不足":"みずぶそく","水中":"すいちゅう","水分":"すいぶん","水分回収":"すいぶんかいしゅう","水分回収後":"すいぶんかいしゅうご","水分子":"みずぶんし","水収支":"すいしゅうし","水収支誤差":"みずしゅうしごさ","水域":"すいいき","水平巡航":"すいへいじゅんこう","水平帯":"すいへいたい","水平流":"すいへいりゅう","水平線":"すいへいせん","水平速度":"すいへいそくど","水平運動":"すいへいうんどう","水晶体":"すいしょうたい","水晶体屈折力":"すいしょうたいくっせつりょく","水晶体調節":"すいしょうたいちょうせつ","水槽":"すいそう","水流":"すいりゅう","水温":"すいおん","水滴":"すいてき","水移動":"みずいどう","水粒子":"すいりゅうし","水素":"すいそ","水素比較":"すいそひかく","水色":"みずいろ","水色円":"みずいろえん","水色矢印":"みずいろやじるし","水色粒":"みずいろつぶ","水色線":"みずいろせん","水蒸気":"すいじょうき","水蒸気供給":"すいじょうききょうきゅう","水質":"すいしつ","水路":"すいろ","水路面積":"すいろめんせき","水辺":"みずべ","水量":"すいりょう","水際":"みずぎわ","水面":"すいめん","水面下":"すいめんか","水面反射":"すいめんはんしゃ","氷":"こおり","氷晶過程":"ひょうしょうかてい","氾濫原":"はんらんげん","氾濫率":"はんらんりつ","求":"もと","汚染":"おせん","汚染物質":"おせんぶっしつ","汚染調査":"おせんちょうさ","池":"いけ","決":"き","決定論":"けっていろん","決定論的":"けっていろんてき","決定論的方程式":"けっていろんてきほうていしき","沈":"しず","沈殿":"ちんでん","沈殿速度":"ちんでんそくど","沈殿量":"ちんでんりょう","沈降":"ちんこう","沈降指数":"ちんこうしすう","沈降有機物":"ちんこうゆうきぶつ","沈降条件":"ちんこうじょうけん","沈降粒子":"ちんこうりゅうし","沈降速度":"ちんこうそくど","河岸":"かがん","河川":"かせん","河川流量":"かせんりゅうりょう","河道":"かどう","河道形成":"かどうけいせい","沸点":"ふってん","沸点範囲":"ふってんはんい","油圧":"ゆあつ","油圧条件":"ゆあつじょうけん","治療判断":"ちりょうはんだん","沼":"ぬま","沼密度":"ぬまみつど","沿":{"う":"そ","っ":"そ"},"沿岸調査":"えんがんちょうさ","法":"ほう","法令":"ほうれい","法則":"ほうそく","法線":"ほうせん","法線照明":"ほうせんしょうめい","波":"なみ","波動":"はどう","波形":"はけい","波源":"はげん","波源間隔":"はげんかんかく","波速":"はそく","波長":"はちょう","波面":"はめん","波面数":"はめんすう","波面間隔":"はめんかんかく","波頭":"なみがしら","泥":"どろ","泥炭":"でいたん","注入":"ちゅうにゅう","注入口":"ちゅうにゅうこう","注意":"ちゅうい","注意分布":"ちゅういぶんぷ","注意機構":"ちゅういきこう","注意重":{"み":"ちゅういおも"},"注文":"ちゅうもん","注目":"ちゅうもく","注目点":"ちゅうもくてん","泳":"およ","泳膜":"えいまく","洞内":"どうない","洞内換気":"どうないかんき","洞口":"どうこう","洞口性":"どうこうせい","洞穴専性生物":"どうけつせんせいせいぶつ","洞窟":"どうくつ","洞窟区画":"どうくつくかく","洞窟形成":"どうくつけいせい","洞窟性":"どうくつせい","洞窟性甲虫":"どうくつせいこうちゅう","洞窟成長":"どうくつせいちょう","洞窟探査図鑑":"どうくつたんさずかん","洞窟放線菌":"どうくつほうせんきん","洞窟河川":"どうくつかせん","洞窟真珠":"どうくつしんじゅ","洞窟空洞":"どうくつくうどう","津波":"つなみ","洪水":"こうずい","洪水予測":"こうずいよそく","活動":"かつどう","活動度":"かつどうど","活動性":"かつどうせい","活動性感染":"かつどうせいかんせん","活動量":"かつどうりょう","活動電位":"かつどうでんい","活性":"かっせい","活性部位":"かっせいぶい","活量":"かつりょう","流":"なが","流下方向":"りゅうかほうこう","流体":"りゅうたい","流体内":"りゅうたいない","流体密度":"りゅうたいみつど","流体循環":"りゅうたいじゅんかん","流入":"りゅうにゅう","流出":"りゅうしゅつ","流出土砂":"りゅうしゅつどしゃ","流出境界":"りゅうしゅつきょうかい","流出粒子":"りゅうしゅつりゅうし","流出開始時刻":"りゅうしゅつかいしじこく","流出開始時間":"りゅうしゅつかいしじかん","流動":"りゅうどう","流域":"りゅういき","流域応答":"りゅういきおうとう","流砂":"りゅうさ","流線":"りゅうせん","流路":"りゅうろ","流路変化":"りゅうろへんか","流路拘束":"りゅうろこうそく","流通":"りゅうつう","流速":"りゅうそく","流量":"りゅうりょう","流量係数":"りゅうりょうけいすう","浄化設計":"じょうかせっけい","浅":"あさ","浅場":"あさば","浅瀬":"あさせ","浮":"う","浮上":"ふじょう","浮上側":"ふじょうがわ","浮上沈降":"ふじょうちんこう","浮世絵":"うきよえ","浮力":"ふりょく","浮力不足":"ふりょくぶそく","浮力材圧縮":"ふりょくざいあっしゅく","浮力条件":"ふりょくじょうけん","浮力自体":"ふりょくじたい","浮力計器":"ふりょくけいき","浮力課題":"ふりょくかだい","浮動":"ふどう","浮動小数点":"ふどうしょうすうてん","浮動小数点限界":"ふどうしょうすうてんげんかい","浮標":"ふひょう","浮遊":"ふゆう","浮遊割合":"ふゆうわりあい","浮遊量":"ふゆうりょう","海":"うみ","海域":"かいいき","海山":"かいざん","海岸":"かいがん","海岸地衣類":"かいがんちいるい","海岸増幅":"かいがんぞうふく","海岸形状":"かいがんけいじょう","海峡":"かいきょう","海峡航行":"かいきょうこうこう","海底":"かいてい","海底上":"かいていじょう","海底地形":"かいていちけい","海底捕食者":"かいていほしょくしゃ","海底泥":"かいていでい","海底表面":"かいていひょうめん","海底近":"かいていちか","海底面":"かいていめん","海水":"かいすい","海洋":"かいよう","海洋予測":"かいようよそく","海洋深層循環":"かいようしんそうじゅんかん","海洋混合":"かいようこんごう","海洋熱":"かいようねつ","海洋熱供給":"かいようねつきょうきゅう","海流":"かいりゅう","海溝":"かいこう","海溝壁":"かいこうへき","海溝底":"かいこうてい","海溝微生物":"かいこうびせいぶつ","海溝斜面":"かいこうしゃめん","海綿":"かいめん","海綿動物":"かいめんどうぶつ","海藻":"かいそう","海面":"かいめん","海面水温":"かいめんすいおん","海馬":"かいば","浸透":"しんとう","浸透圧":"しんとうあつ","浸透性":"しんとうせい","浸透能":"しんとうのう","浸透能力":"しんとうのうりょく","浸透近似":"しんとうきんじ","浸透速度":"しんとうそくど","浸透量":"しんとうりょう","消":{"え":"き","し":"け","す":"け"},"消化":"しょうか","消化条件":"しょうかじょうけん","消化管":"しょうかかん","消化課題":"しょうかかだい","消去":"しょうきょ","消失":"しょうしつ","消失点":"しょうしつてん","消失集団数":"しょうしつしゅうだんすう","消滅":"しょうめつ","消火":"しょうか","消費":"しょうひ","消費電力":"しょうひでんりょく","液体":"えきたい","液体密度":"えきたいみつど","液柱慣性":"えきちゅうかんせい","液状化":"えきじょうか","淡":"あわ","淡水":"たんすい","淡水流入":"たんすいりゅうにゅう","深":"ふか","深層":"しんそう","深層水形成":"しんそうすいけいせい","深層流":"しんそうりゅう","深度":"しんど","深海":"しんかい","深海平原":"しんかいへいげん","深海性":"しんかいせい","深海探査":"しんかいたんさ","深海探査図鑑":"しんかいたんさずかん","深海探査艇":"しんかいたんさてい","深海等脚類":"しんかいとうきゃくるい","深海食物網":"しんかいしょくもつもう","混":"ま","混合":"こんごう","混合分布":"こんごうぶんぷ","混合度":"こんごうど","混合成分":"こんごうせいぶん","混合熱":"こんごうねつ","混合間隔":"こんごうかんかく","混同":"こんどう","混色":"こんしょく","混雑":"こんざつ","混雑色":"こんざつしょく","渋滞":"じゅうたい","減":"へ","減少":"げんしょう","減数分裂":"げんすうぶんれつ","減衰":"げんすい","減衰力":"げんすいりょく","減速":"げんそく","減速中":"げんそくちゅう","渡":"わた","渦":"うず","渦中心":"うずちゅうしん","渦巻":"うずま","渦度":"うずど","渦度指標":"うずどしひょう","渦形成":"うずけいせい","渦放出":"うずほうしゅつ","渦放出周波数":"うずほうしゅつしゅうはすう","渦潮":"うずしお","渦潮海峡航行":"うずしおかいきょうこうこう","渦間隔":"うずかんかく","渦電流":"うずでんりゅう","温":"あたた","温度":"おんど","温度一定":"おんどいってい","温度上昇":"おんどじょうしょう","温度依存":"おんどいぞん","温度依存物性":"おんどいぞんぶっせい","温度制限":"おんどせいげん","温度勾配":"おんどこうばい","温度場":"おんどば","温度変化":"おんどへんか","温度差":"おんどさ","温度曲線":"おんどきょくせん","温度湿度図":"おんどしつどず","温度計":"おんどけい","温暖前線":"おんだんぜんせん","温水":"おんすい","測":"はか","測定":"そくてい","測定値":"そくていち","測定法":"そくていほう","測定経路長":"そくていけいろちょう","港":"みなと","湧昇":"ゆうしょう","湧水":"ゆうすい","湧水域":"ゆうすいいき","湾":"わん","湿":"しめ","湿地":"しっち","湿度":"しつど","満":"み","満月":"まんげつ","満潮":"まんちょう","満足度":"まんぞくど","源":"げん","源近傍":"げんきんぼう","準備":"じゅんび","溶":"と","溶出":"ようしゅつ","溶媒":"ようばい","溶岩":"ようがん","溶岩到達距離":"ようがんとうたつきょり","溶岩流":"ようがんりゅう","溶液":"ようえき","溶解":"ようかい","溶解度":"ようかいど","溶解度曲線":"ようかいどきょくせん","溶解成分":"ようかいせいぶん","溶解課題":"ようかいかだい","溶解速度":"ようかいそくど","溶解量":"ようかいりょう","溶質":"ようしつ","溶質種":"ようしつしゅ","溶質粒子":"ようしつりゅうし","滑":{"ら":"なめ","り":"すべ","る":"すべ"},"滑空比":"かっくうひ","滑走距離":"かっそうきょり","滑車":"かっしゃ","滞留":"たいりゅう","滞留時間":"たいりゅうじかん","滞空":"たいくう","滞空時間":"たいくうじかん","滴下":"てきか","滴下水":"てきかすい","滴下沈殿":"てきかちんでん","滴下点":"てきかてん","滴下速度":"てきかそくど","滴下量":"てきかりょう","滴定":"てきてい","滴定曲線":"てきていきょくせん","滴定液":"てきていえき","滴定液体積":"てきていえきたいせき","滴定液濃度":"てきていえきのうど","滴定計器":"てきていけいき","滴定設計":"てきていせっけい","滴定課題":"てきていかだい","漁具":"ぎょぐ","漁獲":"ぎょかく","漁獲割合":"ぎょかくわりあい","漁獲努力":"ぎょかくどりょく","漁獲圧":"ぎょかくあつ","漁獲量":"ぎょかくりょう","漂":{"う":"ただよ"},"漏":{"え":"ろう","る":"も","れ":"も"},"演奏者":"えんそうしゃ","演算":"えんざん","演算予算":"えんざんよさん","演算状態":"えんざんじょうたい","演算量":"えんざんりょう","漸深海帯":"ぜんしんかいたい","潜":{"っ":"もぐ","り":"もぐ"},"潜伏":"せんぷく","潜伏中":"せんぷくちゅう","潜水":"せんすい","潜水艇":"せんすいてい","潜水計画":"せんすいけいかく","潜熱":"せんねつ","潜航判断":"せんこうはんだん","潟":"かた","潤滑":"じゅんかつ","潮":"しお","潮位":"ちょうい","潮位図鑑":"ちょういずかん","潮位変化":"ちょういへんか","潮位差":"ちょういさ","潮位曲線":"ちょういきょくせん","潮位連動":"ちょういれんどう","潮差":"ちょうさ","潮時":"しおどき","潮汐":"ちょうせき","潮汐作用":"ちょうせきさよう","潮汐課題":"ちょうせきかだい","潮汐隆起":"ちょうせきりゅうき","潮流":"ちょうりゅう","潮流場":"ちょうりゅうば","潮流差":"ちょうりゅうさ","潮流強度":"ちょうりゅうきょうど","潮間帯":"ちょうかんたい","潮間帯生態":"ちょうかんたいせいたい","潮間帯生物":"ちょうかんたいせいぶつ","激":{"し":"はげ"},"濁":"にご","濁度":"だくど","濃":"こ","濃度":"のうど","濃度分布":"のうどぶんぷ","濃度勾配":"のうどこうばい","濃度場":"のうどば","濃度差":"のうどさ","濃度断面":"のうどだんめん","濡":"ぬ","濾液":"ろえき","濾過":"ろか","濾過圧":"ろかあつ","濾過量":"ろかりょう","灌流":"かんりゅう","火":"ひ","火口":"かこう","火口崩壊":"かこうほうかい","火山":"かざん","火山活動":"かざんかつどう","火山灰":"かざんばい","火成岩":"かせいがん","火星":"かせい","火災":"かさい","火道":"かどう","火道幅":"かどうはば","灯油":"とうゆ","灰":"はい","灰色":"はいいろ","災害安全判断":"さいがいあんぜんはんだん","炉温":"ろおん","炎":"ほのお","炎全体":"ほのおぜんたい","炎色":"えんしょく","炎色反応":"えんしょくはんのう","炭水化物":"たんすいかぶつ","炭素":"たんそ","炭素固定":"たんそこてい","炭素循環":"たんそじゅんかん","炭素源":"たんそげん","炭素蓄積":"たんそちくせき","炭素輸送":"たんそゆそう","炭酸":"たんさん","点":"てん","点密度":"てんみつど","点描":"てんびょう","点数":"てんすう","点標本":"てんひょうほん","点滅":"てんめつ","点火":"てんか","点率":"てんりつ","点線":"てんせん","点質量":"てんしつりょう","点軌跡模型":"てんきせきもけい","点間":"てんかん","無作為":"むさくい","無料":"むりょう","無次元":"むじげん","無次元二成分模型":"むじげんにせいぶんもけい","無秩序":"むちつじょ","無秩序初期":"むちつじょしょき","無視":"むし","無遅延":"むちえん","無限":"むげん","焦点":"しょうてん","焦点誤差":"しょうてんごさ","焦点距離":"しょうてんきょり","煙":"けむり","煙突":"えんとつ","照":"て","照合":"しょうごう","照射角":"しょうしゃかく","照射面積":"しょうしゃめんせき","照射高":"しょうしゃたか","照度":"しょうど","照明":"しょうめい","照明出力":"しょうめいしゅつりょく","照明率":"しょうめいりつ","熟練戦略":"じゅくれんせんりゃく","熱":"ねつ","熱交換":"ねつこうかん","熱伝導":"ねつでんどう","熱伝導率":"ねつでんどうりつ","熱供給":"ねつきょうきゅう","熱塩循環":"ねつえんじゅんかん","熱容量":"ねつようりょう","熱帯低気圧":"ねったいていきあつ","熱帯擾乱":"ねったいじょうらん","熱帯雨林":"ねったいうりん","熱応力":"ねつおうりょく","熱拡散":"ねつかくさん","熱暴走":"ねつぼうそう","熱機関":"ねつきかん","熱水":"ねっすい","熱水噴出孔":"ねっすいふんしゅつこう","熱水域":"ねっすいいき","熱水性":"ねっすいせい","熱水性巻貝":"ねっすいせいまきがい","熱水近":{"く":"ねっすいちか"},"熱流":"ねつりゅう","熱流率":"ねつりゅうりつ","熱移動":"ねついどう","熱移動課題":"ねついどうかだい","熱衝撃":"ねつしょうげき","熱輸送":"ねつゆそう","熱量誤差":"ねつりょうごさ","燃":{"え":"も"},"燃料":"ねんりょう","燃料予備量":"ねんりょうよびりょう","燃料消費":"ねんりょうしょうひ","燃焼":"ねんしょう","燃費":"ねんぴ","爆発的噴火":"ばくはつてきふんか","爪":"つめ","爬虫類":"はちゅうるい","父":"ちち","片道距離":"かたみちきょり","牙":"きば","物":"もの","物体":"ぶったい","物体位置":"ぶったいいち","物体型":"ぶったいがた","物体密度":"ぶったいみつど","物体径":"ぶったいけい","物体直径":"ぶったいちょっけい","物体距離":"ぶったいきょり","物体高":"ぶったいたか","物保護":"ものほご","物意思決定":"ものいしけってい","物流":"ぶつりゅう","物理":"ぶつり","物理法則":"ぶつりほうそく","物理的":"ぶつりてき","物理的粉砕":"ぶつりてきふんさい","物語":"ものがたり","物質":"ぶっしつ","物質内":"ぶっしつない","物質収支":"ぶっしつしゅうし","物質収支誤差":"ぶっしつしゅうしごさ","物質同定":"ぶっしつどうてい","物質循環":"ぶっしつじゅんかん","物質流":"ぶっしつなが","物質源":"ぶっしつげん","物質透過率":"ぶっしつとうかりつ","物質量":"ぶっしつりょう","物音":"ものおと","特別":"とくべつ","特定":"とくてい","特徴":"とくちょう","状":"じょう","状態":"じょうたい","状態半径":"じょうたいはんけい","状態変数":"じょうたいへんすう","状態履歴":"じょうたいりれき","状態方程式":"じょうたいほうていしき","状態番号":"じょうたいばんごう","状態遷移":"じょうたいせんい","状態量":"じょうたいりょう","独立":"どくりつ","独立獲得":"どくりつかくとく","狭":"せま","猫":"ねこ","獲得":"かくとく","獲物":"えもの","玄武岩":"げんぶがん","率":"りつ","珪酸質":"けいさんしつ","現":"あらわ","現代攻撃":"げんだいこうげき","現代暗号":"げんだいあんごう","現代用途":"げんだいようと","現在":"げんざい","現在世代":"げんざいせだい","現在亀裂長":"げんざいきれつちょう","現在位置":"げんざいいち","現在分割数":"げんざいぶんかつすう","現在地":"げんざいち","現在密度":"げんざいみつど","現在層":"げんざいそう","現在拍":"げんざいはく","現在時刻":"げんざいじこく","現在条件":"げんざいじょうけん","現在浸透能":"げんざいしんとうのう","現在点":"げんざいてん","現在高度":"げんざいこうど","現地":"げんち","現実":"げんじつ","現生種":"げんせいしゅ","現示":"げんじ","現象":"げんしょう","現金":"げんきん","球":"きゅう","理想":"りそう","理想化":"りそうか","理想化模型":"りそうかもけい","理想気体":"りそうきたい","理由":"りゆう","理解":"りかい","理論検出力":"りろんけんしゅつりょく","琥珀":"こはく","環境":"かんきょう","環境場":"かんきょうば","環境履歴":"かんきょうりれき","環境指標":"かんきょうしひょう","環境活性":"かんきょうかっせい","環境記録":"かんきょうきろく","環形動物":"かんけいどうぶつ","生化学":"せいかがく","生命":"せいめい","生命維持":"せいめいいじ","生存":"せいぞん","生存個体":"せいぞんこたい","生存差":"せいぞんさ","生存数":"せいぞんすう","生存条件":"せいぞんじょうけん","生存鳥":"せいぞんちょう","生息":"せいそく","生息地":"せいそくち","生息場所":"せいそくばしょ","生態":"せいたい","生態系":"せいたいけい","生成":"せいせい","生成文法":"せいせいぶんぽう","生成点":"せいせいてん","生成物":"せいせいぶつ","生成物履歴":"せいせいぶつりれき","生成物蓄積":"せいせいぶつちくせき","生成物量":"せいせいぶつりょう","生成速度":"せいせいそくど","生物":"せいぶつ","生物以外":"せいぶついがい","生物帯":"せいぶつたい","生物相":"せいぶつそう","生物種":"せいぶつしゅ","生物群":"せいぶつぐん","生産":"せいさん","生産者":"せいさんしゃ","生産能力":"せいさんのうりょく","生痕化石":"せいこんかせき","生鮮品":"せいせんひん","産":"う","用":{"い":"もち"},"甲殻類":"こうかくるい","町":"まち","画像":"がぞう","画素":"がそ","画面":"がめん","画面内":"がめんない","界面":"かいめん","留":{"ま":"とど"},"留分":"りゅうぶん","番":"ばん","番目":"ばんめ","異":"こと","異常年":"いじょうねん","異常発熱":"いじょうはつねつ","異所性":"いしょせい","異温度流体":"いおんどりゅうたい","異種境界":"いしゅきょうかい","疎":"そ","疑問":"ぎもん","疲労":"ひろう","疲労強度":"ひろうきょうど","疲労率":"ひろうりつ","疲労試行":"ひろうしこう","疲労負荷":"ひろうふか","疾患診断":"しっかんしんだん","疾病":"しっぺい","病原体":"びょうげんたい","病原体増殖":"びょうげんたいぞうしょく","病原体量":"びょうげんたいりょう","病原性判定":"びょうげんせいはんてい","病害":"びょうがい","病気":"びょうき","症状":"しょうじょう","症状負荷":"しょうじょうふか","痕跡強化":"こんせききょうか","痕跡記憶":"こんせききおく","痛":"いた","発信":"はっしん","発信周波数":"はっしんしゅうはすう","発光":"はっこう","発光器":"はっこうき","発光数":"はっこうすう","発光素子":"はっこうそし","発光線":"はっこうせん","発光能力":"はっこうのうりょく","発射":"はっしゃ","発射角":"はっしゃかく","発展":"はってん","発掘":"はっくつ","発掘図鑑":"はっくつずかん","発散":"はっさん","発散角":"はっさんかく","発注":"はっちゅう","発注変動":"はっちゅうへんどう","発注平滑化":"はっちゅうへいかつか","発注点":"はっちゅうてん","発注量":"はっちゅうりょう","発熱":"はつねつ","発現":"はつげん","発生":"はっせい","発生時刻":"はっせいじこく","発生条件模型":"はっせいじょうけんもけい","発生間隔":"はっせいかんかく","発見":"はっけん","発見済":"はっけんず","発見記録":"はっけんきろく","発見難度":"はっけんなんど","発達":"はったつ","発達余力":"はったつよりょく","発達段階":"はったつだんかい","発達率":"はったつりつ","発電機":"はつでんき","発音位置":"はつおんいち","発音数":"はつおんすう","発音時刻":"はつおんじこく","発音間隔":"はつおんかんかく","白":"しろ","白線":"はくせん","白色":"はくしょく","白色光":"はくしょくこう","白色菌糸":"はくしょくきんし","百万年以上":"ひゃくまんねんいじょう","的":"てき","皆既":"かいき","皮膚":"ひふ","皮膚模様":"ひふもよう","監視":"かんし","盤面":"ばんめん","盤面寿命":"ばんめんじゅみょう","目":"め","目印":"めじるし","目印信頼度":"めじるししんらいど","目安":"めやす","目幅":"めはば","目標":"もくひょう","目標優先":"もくひょうゆうせん","目標出力":"もくひょうしゅつりょく","目標分子":"もくひょうぶんし","目標在庫":"もくひょうざいこ","目標指向":"もくひょうしこう","目標照度":"もくひょうしょうど","目標用":"もくひょうよう","目標音数":"もくひょうおんすう","目標高度":"もくひょうこうど","目的":"もくてき","目的地":"もくてきち","目盛":"めも","目立":"めだ","盲点":"もうてん","直":{"し":"なお","す":"なお","ち":"ただ"},"直並列":"ちょくへいれつ","直交":"ちょっこう","直交通路":"ちょっこうつうろ","直列":"ちょくれつ","直列回路":"ちょくれつかいろ","直前":"ちょくぜん","直後":"ちょくご","直感":"ちょっかん","直感的":"ちょっかんてき","直接":"ちょくせつ","直接再現":"ちょくせつさいげん","直接変":"ちょくせつか","直接変更":"ちょくせつへんこう","直接投影":"ちょくせつとうえい","直接指定":"ちょくせつしてい","直接操作":"ちょくせつそうさ","直接操作強化":"ちょくせつそうさきょうか","直接数":{"え":"ちょくせつかぞ"},"直接決":"ちょくせつき","直接測":"ちょくせつはか","直接生":"ちょくせつう","直接示":"ちょくせつしめ","直接置":"ちょくせつお","直接記録":"ちょくせつきろく","直接説明":"ちょくせつせつめい","直接送":"ちょくせつおく","直線":"ちょくせん","直線形":"ちょくせんけい","直線的":"ちょくせんてき","直角":"ちょっかく","直角方向":"ちょっかくほうこう","直進":"ちょくしん","相":"そう","相互作用":"そうごさよう","相互作用範囲":"そうごさようはんい","相互作用粒子":"そうごさようりゅうし","相互作用行列":"そうごさようぎょうれつ","相同染色体":"そうどうせんしょくたい","相変化":"そうへんか","相対":"そうたい","相対値":"そうたいち","相対時間":"そうたいじかん","相対模型":"そうたいもけい","相対濃度":"そうたいのうど","相対的":"そうたいてき","相対誤差":"そうたいごさ","相対論":"そうたいろん","相対速度":"そうたいそくど","相対速度模型":"そうたいそくどもけい","相対運動小":"そうたいうんどうしょう","相対量":"そうたいりょう","相当":"そうとう","相状態":"そうじょうたい","相転移":"そうてんい","相関":"そうかん","省":"はぶ","省略":"しょうりゃく","省電力深海":"しょうでんりょくしんかい","真":"しん","真下":"ました","真値":"しんち","真値付近":"しんちふきん","真実":"しんじつ","真空":"しんくう","真空予測":"しんくうよそく","眠":"ねむ","眩":{"し":"まぶ"},"眼":"め","眼軸長":"がんじくちょう","着":"つ","着地":"ちゃくち","着地角":"ちゃくちかく","着地速度":"ちゃくちそくど","着水":"ちゃくすい","瞬時周波数":"しゅんじしゅうはすう","瞬間":"しゅんかん","瞳孔":"どうこう","瞳孔径":"どうこうけい","矛盾":"むじゅん","矢印":"やじるし","矢印先":"やじるしさき","知":{"ら":"し","る":"し"},"短":"みじか","短冊":"たんざく","短冊近似":"たんざくきんじ","短文":"たんぶん","短期":"たんき","短期優先":"たんきゆうせん","短歌":"たんか","短波長":"たんはちょう","短絡":"たんらく","短絡試験":"たんらくしけん","短詩":"たんし","短鎖脂肪酸":"たんさしぼうさん","石柱":"せきちゅう","石油":"せきゆ","石油形成":"せきゆけいせい","石灰岩":"せっかいがん","石灰岩溶解":"せっかいがんようかい","石灰質":"せっかいしつ","石筍":"せきじゅん","石膏":"せっこう","石膏結晶":"せっこうけっしょう","砂":"すな","砂山":"すなやま","砂山表面":"すなやまひょうめん","砂岩":"さがん","砂礫":"されき","研究":"けんきゅう","砕":{"く":"くだ"},"破":{"ら":"やぶ"},"破壊":"はかい","破壊力学":"はかいりきがく","破壊閾値":"はかいいきち","破壊靱性":"はかいじんせい","破損":"はそん","破損率":"はそんりつ","破損通信":"はそんつうしん","破断":"はだん","破砕":"はさい","破砕度":"はさいど","破線":"はせん","破裂":"はれつ","破裂余裕":"はれつよゆう","破裂時刻":"はれつじこく","破裂条件":"はれつじょうけん","硫化水素":"りゅうかすいそ","硫化物":"りゅうかぶつ","硫黄":"いおう","硫黄化合物":"いおうかごうぶつ","硫黄酸化細菌":"いおうさんかさいきん","硬":"かた","硬度":"こうど","確":"たし","確保":"かくほ","確定":"かくてい","確定率":"かくていりつ","確率":"かくりつ","確率分布":"かくりつぶんぷ","確率模型":"かくりつもけい","確率的":"かくりつてき","確率的変動":"かくりつてきへんどう","確率的成長模型":"かくりつてきせいちょうもけい","確率質量":"かくりつしつりょう","確率過程":"かくりつかてい","確認":"かくにん","確認中":"かくにんちゅう","磁力線":"じりょくせん","磁化":"じか","磁区":"じく","磁区境界":"じくきょうかい","磁場":"じば","磁束":"じそく","磯":"いそ","示":"しめ","社会性昆虫":"しゃかいせいこんちゅう","祖先":"そせん","神奈川沖浪裏":"かながわおきなみうら","神経":"しんけい","秋":"あき","秋世代":"あきせだい","秒":"びょう","秒進":{"め":"びょうすす"},"秘密":"ひみつ","秘密性":"ひみつせい","秘密情報":"ひみつじょうほう","秩序":"ちつじょ","移":"うつ","移住":"いじゅう","移住率":"いじゅうりつ","移動":"いどう","移動中":"いどうちゅう","移動力":"いどうりょく","移動地点":"いどうちてん","移動地点太陽高度":"いどうちてんたいようこうど","移動方向":"いどうほうこう","移動痕":"いどうこん","移動相":"いどうそう","移動相流速":"いどうそうりゅうそく","移動相速度":"いどうそうそくど","移動粒子":"いどうりゅうし","移動距離":"いどうきょり","移動距離比":"いどうきょりひ","移動速度":"いどうそくど","移動量":"いどうりょう","移流":"いりゅう","移流中":"いりゅうちゅう","程度違":{"う":"ていどちが"},"税":"ぜい","種":"しゅ","種供給":"しゅきょうきゅう","種多様性":"しゅたようせい","種子":"しゅし","種子供給":"しゅしきょうきゅう","種子散布":"しゅしさんぷ","種数":"しゅすう","種間関係":"しゅかんかんけい","種類":"しゅるい","穂":"ほ","積":{"み":"つ","も":"つ"},"積分":"せきぶん","積分法":"せきぶんほう","積載":"せきさい","積載上限":"せきさいじょうげん","積雪貯留":"せきせつちょりゅう","穏":{"や":"おだ"},"穴":"あな","空":{"き":"あ"},"空中":"くうちゅう","空力弾性":"くうりきだんせい","空気":"くうき","空気中":"くうきちゅう","空気層":"くうきそう","空気感":"くうきかん","空気抵抗":"くうきていこう","空洞":"くうどう","空洞体積":"くうどうたいせき","空洞形状":"くうどうけいじょう","空洞拡大":"くうどうかくだい","空腹":"くうふく","空間":"くうかん","空間優先":"くうかんゆうせん","空間構造":"くうかんこうぞう","空間波面":"くうかんはめん","空間管理":"くうかんかんり","空間認知":"くうかんにんち","空間重視":"くうかんじゅうし","空間電荷":"くうかんでんか","空隙":"くうげき","空隙内":"くうげきない","空隙率":"くうげきりつ","突":{"き":"つ"},"突出部":"とっしゅつぶ","突然変異":"とつぜんへんい","突然変異率":"とつぜんへんいりつ","突風":"とっぷう","突風後":"とっぷうご","窒素":"ちっそ","窓":"まど","窓補正":"まどほせい","立":"た","立体感":"りったいかん","立体構造":"りったいこうぞう","立体的":"りったいてき","立体配置":"りったいはいち","端":"はし","端子電圧":"たんしでんあつ","端子電圧低下":"たんしでんあつていか","端末":"たんまつ","端末保存":"たんまつほぞん","端末内":"たんまつない","端末記録":"たんまつきろく","端末速度":"たんまつそくど","端末音質":"たんまつおんしつ","競争":"きょうそう","競争阻害":"きょうそうそがい","競争面":"きょうそうめん","競合":"きょうごう","競技記録":"きょうぎきろく","符号":"ふごう","符号付":"ふごうつ","符号化":"ふごうか","符号基数":"ふごうきすう","第":"だい","第二":"だいに","筆":"ふで","筆触":"ひっしょく","等":{"し":"ひと"},"等容収縮":"とうようしゅうしゅく","等容拡張":"とうようかくちょう","等温圧縮":"とうおんあっしゅく","等脚類":"とうきゃくるい","等速":"とうそく","等速直線運動":"とうそくちょくせんうんどう","等量":"とうりょう","筋":"すじ","筋力":"きんりょく","筋肉":"きんにく","筋肉血流配分":"きんにくけつりゅうはいぶん","筋肉配分":"きんにくはいぶん","筋血流":"きんけつりゅう","筋道":"すじみち","答":"こた","箇所":"かしょ","算":"ざん","管":"くだ","管内":"かんない","管半径":"かんはんけい","管状":"かんじょう","管状鍾乳石":"かんじょうしょうにゅうせき","管理":"かんり","管網":"かんもう","管足":"かんそく","管長":"かんちょう","箱":"はこ","箱型模型":"はこがたもけい","箱押":"はこお","節約":"せつやく","節足動物":"せっそくどうぶつ","節足動物化石":"せっそくどうぶつかせき","範囲":"はんい","簡略":"かんりゃく","簡略化":"かんりゃくか","簡略収支":"かんりゃくしゅうし","簡略後流模型":"かんりゃくこうりゅうもけい","簡略探索模型":"かんりゃくたんさくもけい","簡略模型":"かんりゃくもけい","簡略的":"かんりゃくてき","簡略自動方策":"かんりゃくじどうほうさく","簡略表示":"かんりゃくひょうじ","簡略解析":"かんりゃくかいせき","簡略速度論":"かんりゃくそくどろん","粉塵":"ふんじん","粒":"つぶ","粒半径":"りゅうはんけい","粒子":"りゅうし","粒子加速器":"りゅうしかそくき","粒子堆積":"りゅうしたいせき","粒子密度":"りゅうしみつど","粒子数":"りゅうしすう","粒子束":"りゅうしそく","粒子検出":"りゅうしけんしゅつ","粒子法":"りゅうしほう","粒子特性":"りゅうしとくせい","粒子生命":"りゅうしせいめい","粒子的":"りゅうしてき","粒子群":"りゅうしぐん","粒子軌道":"りゅうしきどう","粒子輸送":"りゅうしゆそう","粒径":"りゅうけい","粒径分布":"りゅうけいぶんぷ","粒状":"りゅうじょう","粒状体":"りゅうじょうたい","粗":"あら","粘":"ねば","粘塑性":"ねんそせい","粘塑性沈降":"ねんそせいちんこう","粘度":"ねんど","粘性":"ねんせい","粘性境界層":"ねんせいきょうかいそう","粘性抵抗":"ねんせいていこう","粘液":"ねんえき","粘着":"ねんちゃく","粘着力":"ねんちゃくりょく","粘着性":"ねんちゃくせい","粘菌":"ねんきん","精密":"せいみつ","精密予測":"せいみつよそく","精密設計":"せいみつせっけい","精度":"せいど","精製":"せいせい","糖":"とう","糖尿病":"とうにょうびょう","糖生成":"とうせいせい","糞":"ふん","糸":"いと","糸張力":"いとちょうりょく","糸強度":"いときょうど","糸杉":"いとすぎ","糸状":"しじょう","糸球体":"しきゅうたい","系":"けい","系内粒子":"けいないりゅうし","系列":"けいれつ","系外":"けいがい","系外流出":"けいがいりゅうしゅつ","系統":"けいとう","系統樹":"けいとうじゅ","系統誤差":"けいとうごさ","約":"やく","純正比":"じゅんせいひ","純物質":"じゅんぶっしつ","紙":"かみ","紙飛行機":"かみひこうき","級数":"きゅうすう","素":"そ","素早":{"く":"すばや"},"素材":"そざい","紡錘体":"ぼうすいたい","紡錘体付着":"ぼうすいたいふちゃく","紡錘糸":"ぼうすいし","紫":"むらさき","累積":"るいせき","累積平均":"るいせきへいきん","累積感染":"るいせきかんせん","累積損傷":"るいせきそんしょう","累積損失":"るいせきそんしつ","累積流出":"るいせきりゅうしゅつ","累積浸透":"るいせきしんとう","累積浸透量":"るいせきしんとうりょう","累積滑":"るいせきすべ","累積漁獲":"るいせきぎょかく","累積漏":{"れ":"るいせきも"},"累積発音数":"るいせきはつおんすう","累積量":"るいせきりょう","累積関数":"るいせきかんすう","累積降雨":"るいせきこうう","細":{"い":"ほそ","か":"こま","く":"ほそ"},"細分化":"さいぶんか","細孔":"さいこう","細孔分布":"さいこうぶんぷ","細孔半径":"さいこうはんけい","細線":"さいせん","細胞":"さいぼう","細胞体積":"さいぼうたいせき","細胞内":"さいぼうない","細胞内分解":"さいぼうないぶんかい","細胞内区画":"さいぼうないくかく","細胞内固定電荷":"さいぼうないこていでんか","細胞内溶質":"さいぼうないようしつ","細胞分裂":"さいぼうぶんれつ","細胞周期":"さいぼうしゅうき","細胞形状":"さいぼうけいじょう","細胞条件":"さいぼうじょうけん","細胞膜":"さいぼうまく","細胞質分裂":"さいぼうしつぶんれつ","細胞集団":"さいぼうしゅうだん","細胞骨格":"さいぼうこっかく","細菌":"さいきん","細身":"ほそみ","細部":"さいぶ","細長":"ほそなが","終":"お","終了":"しゅうりょう","終止":"しゅうし","終端速度":"しゅうたんそくど","組":"く","組合":"くみあわ","組成":"そせい","組換":"くみか","組織":"そしき","組織化":"そしきか","組織的":"そしきてき","経":{"て":"へ"},"経度":"けいど","経度付近":"けいどふきん","経済":"けいざい","経路":"けいろ","経路分布":"けいろぶんぷ","経路差":"けいろさ","経路帯":"けいろたい","経路方針":"けいろほうしん","経路記憶":"けいろきおく","経路長":"けいろちょう","経過":"けいか","結":"むす","結合":"けつごう","結合境界":"けつごうきょうかい","結合強度":"けつごうきょうど","結合形成":"けつごうけいせい","結合数":"けつごうすう","結合次数":"けつごうじすう","結合種":"けつごうしゅ","結晶":"けっしょう","結晶化":"けっしょうか","結晶多形":"けっしょうたけい","結晶形":"けっしょうけい","結果":"けっか","結果差":"けっかさ","絞":{"":"しぼ","め":"し"},"統一的":"とういつてき","統合":"とうごう","統計":"とうけい","統計的仮説検定":"とうけいてきかせつけんてい","絵":"え","絵画":"かいが","絵画的":"かいがてき","絶対":"ぜったい","絶対値":"ぜったいち","絶対分布":"ぜったいぶんぷ","絶対時刻":"ぜったいじこく","絶対誤差":"ぜったいごさ","継":"つ","継続時間":"けいぞくじかん","続":"つづ","続成作用":"ぞくせいさよう","維持":"いじ","網":"あみ","網膜":"もうまく","網膜上":"もうまくじょう","網膜像":"もうまくぞう","緊張":"きんちょう","緊急車両":"きんきゅうしゃりょう","総個体数":"そうこたいすう","総在庫":"そうざいこ","総心拍出量":"そうしんはくしゅつりょう","総換気量":"そうかんきりょう","総正答率":"そうせいとうりつ","総残高":"そうざんだか","総発光強度":"そうはっこうきょうど","総管長":"そうかんちょう","総質量":"そうしつりょう","総距離":"そうきょり","総重量":"そうじゅうりょう","総長":"そうちょう","緑":"みどり","緑線":"みどりせん","緑色光":"りょくしょくこう","線":"せん","線形":"せんけい","線形保持":"せんけいほじ","線形加速":"せんけいかそく","線形動物":"せんけいどうぶつ","線形変換":"せんけいへんかん","線形規則":"せんけいきそく","線遠近":"せんえんきん","緩":{"め":"ゆる","や":"ゆる"},"緩和":"かんわ","緩衝":"かんしょう","緩衝余力":"かんしょうよりょく","緩衝型":"かんしょうがた","緩衝域":"かんしょういき","緩衝容量":"かんしょうようりょう","緩衝材":"かんしょうざい","緩衝条件":"かんしょうじょうけん","緩衝液":"かんしょうえき","緩衝系":"かんしょうけい","緩衝能":"かんしょうのう","緯度":"いど","縁":"ふち","縁傷":"ふちきず","縞":"しま","縞間隔":"しまかんかく","縦":"たて","縦軸":"たてじく","縮":{"み":"ちぢ","め":"ちぢ","ん":"ちぢ"},"縮小":"しゅくしょう","縮小同梱":"しゅくしょうどうこん","縮小画像":"しゅくしょうがぞう","縮小速度":"しゅくしょうそくど","縮尺":"しゅくしゃく","繁殖":"はんしょく","繁殖差":"はんしょくさ","繁殖痕":"はんしょくこん","織姫星":"おりひめぼし","繰":"く","繰返":"くりかえ","置":"お","置換":"ちかん","置換先":"ちかんさき","置換対応":"ちかんたいおう","置換経路":"ちかんけいろ","置換表":"ちかんひょう","美術":"びじゅつ","群":"む","群体":"ぐんたい","群作用":"ぐんさよう","群集":"ぐんしゅう","羽毛状":"うもうじょう","羽追加":"わついか","翅":"はね","翻訳":"ほんやく","翻訳中":"ほんやくちゅう","翻訳後":"ほんやくご","翼":"つばさ","翼面積":"よくめんせき","翼面荷重":"よくめんかじゅう","考":"かんが","耐":"た","耐圧認証":"たいあつにんしょう","耐熱性":"たいねつせい","耳":"みみ","耳小骨":"じしょうこつ","聖":"せい","聞":{"き":"き","こ":"き"},"聴覚":"ちょうかく","聴覚印象":"ちょうかくいんしょう","聴覚特性":"ちょうかくとくせい","聴覚評価":"ちょうかくひょうか","肉眼色":"にくがんしょく","肉質":"にくしつ","肝":"かん","肝放出":"かんほうしゅつ","肝臓":"かんぞう","肝貯蔵":"かんちょぞう","肩":"かた","育":"そだ","育児":"いくじ","育児個体":"いくじこたい","育児室":"いくじしつ","肺":"はい","肺全体":"はいぜんたい","肺循環":"はいじゅんかん","肺条件":"はいじょうけん","肺胞":"はいほう","肺胞内":"はいほうない","肺胞条件":"はいほうじょうけん","肺胞膜":"はいほうまく","肺胞膜拡散":"はいほうまくかくさん","肺血流":"はいけつりゅう","胃":"い","胃酸":"いさん","胆汁":"たんじゅう","背側":"はいそく","背景":"はいけい","胚":"はい","胸":"むね","胸元付近":"むなもとふきん","能力":"のうりょく","能動排出":"のうどうはいしゅつ","能動輸送":"のうどうゆそう","脂溶性":"しようせい","脂肪":"しぼう","脂肪成分":"しぼうせいぶん","脂質":"ししつ","脂質二重層":"ししつにじゅうそう","脊椎動物化石":"せきついどうぶつかせき","脊髄":"せきずい","脚":"あし","脱":"だつ","脱出":"だっしゅつ","脱出半径":"だっしゅつはんけい","脱出反復回数":"だっしゅつはんぷくかいすう","脱出数":"だっしゅつすう","脱出率":"だっしゅつりつ","脱分極":"だつぶんきょく","脱分極刺激":"だつぶんきょくしげき","脱水":"だっすい","脱硫強度":"だつりゅうきょうど","脳":"のう","脳処理":"のうしょり","腎機能検査値":"じんきのうけんさち","腎臓":"じんぞう","腕":"うで","腸":"ちょう","腸内細菌":"ちょうないさいきん","腹":"はら","腹側":"ふくそく","膜":"まく","膜上":"まくじょう","膜中央":"まくちゅうおう","膜厚":"まくあつ","膜性能":"まくせいのう","膜装置":"まくそうち","膜輸送":"まくゆそう","膜電位":"まくでんい","膨":"ふく","膨張":"ぼうちょう","膨張差":"ぼうちょうさ","膵酵素":"すいこうそ","臓器別血流":"ぞうきべつけつりゅう","臓器灌流":"ぞうきかんりゅう","臓器血流配分":"ぞうきけつりゅうはいぶん","臓器配分":"ぞうきはいぶん","臨床判断":"りんしょうはんだん","臨床検査":"りんしょうけんさ","臨床輸液":"りんしょうゆえき","臨界":"りんかい","臨界亀裂長":"りんかいきれつちょう","臨界余裕":"りんかいよゆう","臨界到達":"りんかいとうたつ","臨界寿命":"りんかいじゅみょう","臨界破壊":"りんかいはかい","自体":"じたい","自分":"じぶん","自動":"じどう","自動保証":"じどうほしょう","自動再生":"じどうさいせい","自動判定":"じどうはんてい","自動応答":"じどうおうとう","自動拡大":"じどうかくだい","自動的":"じどうてき","自動航法":"じどうこうほう","自動調光":"じどうちょうこう","自動配置":"じどうはいち","自動配置法":"じどうはいちほう","自己":"じこ","自己組織化":"じこそしきか","自律神経":"じりつしんけい","自然":"しぜん","自然免疫":"しぜんめんえき","自然選択":"しぜんせんたく","自由":"じゆう","自身":"じしん","自転":"じてん","自転車":"じてんしゃ","自転軸":"じてんじく","臭":{"い":"にお"},"舞":"ま","舟":"ふね","航法":"こうほう","航法手掛":"こうほうてが","航海":"こうかい","航空":"こうくう","航空安全":"こうくうあんぜん","航空機":"こうくうき","航空管制":"こうくうかんせい","航跡":"こうせき","航路":"こうろ","舵":"かじ","舵角":"だかく","船":"ふね","船体":"せんたい","船体強度":"せんたいきょうど","船底余裕":"せんていよゆう","船殻余裕":"せんかくよゆう","船殻応力比":"せんかくおうりょくひ","船殻性能":"せんかくせいのう","船舶":"せんぱく","船速":"せんそく","船長":"せんちょう","船首":"せんしゅ","良":"よ","良好":"りょうこう","色":"いろ","色付":"いろつ","色域":"しきいき","色温度":"しきおんど","色素":"しきそ","色素吸収":"しきそきゅうしゅう","色素混合":"しきそこんごう","芝生":"しばふ","花":{"":"はな","こ":"か","び":"はな"},"花粉":"かふん","花蜜":"かみつ","芽生":{"え":"めば"},"若":"わか","苦":{"し":"くる"},"英字":"えいじ","茎":"くき","茶":"ちゃ","草":"くさ","草原":"そうげん","草本":"そうほん","草食":"そうしょく","草食動物":"そうしょくどうぶつ","草食者":"そうしょくしゃ","荷物":"にもつ","荷重":"かじゅう","荷重計算":"かじゅうけいさん","菌":"きん","菌体":"きんたい","菌根":"きんこん","菌糸":"きんし","菌類":"きんるい","落":"お","落下":"らっか","落下開始":"らっかかいし","落下開始条件":"らっかかいしじょうけん","落葉":"らくよう","葉":"は","葉序":"ようじょ","葉序要素":"ようじょようそ","葉温":"ようおん","葉緑体":"ようりょくたい","葉脈":"ようみゃく","葛飾北斎":"かつしかほくさい","蒸気膨張":"じょうきぼうちょう","蒸発":"じょうはつ","蓄":{"え":"たくわ"},"蓄積":"ちくせき","蓄積率":"ちくせきりつ","蔓脚":"まんきゃく","薄":{"い":"うす"},"薄明帯":"はくめいたい","薄明部":"はくめいぶ","薬剤投与":"やくざいとうよ","薬物":"やくぶつ","薬理判断":"やくりはんだん","藍藻膜":"らんそうまく","藻類":"そうるい","藻類文法":"そうるいぶんぽう","虚像":"きょぞう","虚数":"きょすう","虚部":"きょぶ","虚部中心":"きょぶちゅうしん","虫入":{"り":"むしい"},"虫害":"ちゅうがい","虹色":"にじいろ","蛇行":"だこう","蛇行度":"だこうど","蜃気楼":"しんきろう","蜃気楼強度":"しんきろうきょうど","蜜":"みつ","蝶":"ちょう","蝸牛":"かぎゅう","融解":"ゆうかい","螺旋":"らせん","血流":"けつりゅう","血流再配分":"けつりゅうさいはいぶん","血流配分":"けつりゅうはいぶん","血液":"けつえき","血液側":"けつえきがわ","血液循環":"けつえきじゅんかん","血液量":"けつえきりょう","血球":"けっきゅう","血管":"けっかん","血管抵抗":"けっかんていこう","血糖":"けっとう","行":{"き":"い","く":"い","っ":"い","わ":"おこな"},"行列":"ぎょうれつ","行列変換":"ぎょうれつへんかん","行列履歴":"ぎょうれつりれき","行列式":"ぎょうれつしき","行動":"こうどう","行動変化":"こうどうへんか","行幅":"ぎょうはば","行数":"ぎょうすう","衝撃波領域":"しょうげきはりょういき","衝突":"しょうとつ","衝突余裕":"しょうとつよゆう","衝突併合":"しょうとつへいごう","衝突前":"しょうとつまえ","衝突前後":"しょうとつぜんご","衝突力":"しょうとつりょく","衝突半径":"しょうとつはんけい","衝突危険評価":"しょうとつきけんひょうか","衝突回避":"しょうとつかいひ","衝突状態":"しょうとつじょうたい","衝突課題":"しょうとつかだい","衝突頻度":"しょうとつひんど","表":"あらわ","表層":"ひょうそう","表層密度":"ひょうそうみつど","表層暖流":"ひょうそうだんりゅう","表層流":"ひょうそうりゅう","表現":"ひょうげん","表現型":"ひょうげんがた","表現型頻度":"ひょうげんがたひんど","表現目的":"ひょうげんもくてき","表現範囲":"ひょうげんはんい","表示":"ひょうじ","表示倍率":"ひょうじばいりつ","表示反復":"ひょうじはんぷく","表示時刻":"ひょうじじこく","表示段階":"ひょうじだんかい","表示装置":"ひょうじそうち","表示領域":"ひょうじりょういき","表面":"ひょうめん","表面張力":"ひょうめんちょうりょく","表面流出":"ひょうめんりゅうしゅつ","表面温度":"ひょうめんおんど","表面積":"ひょうめんせき","表面粗":{"さ":"ひょうめんあら"},"表面貯留":"ひょうめんちょりゅう","袋":"ふくろ","袋小路":"ふくろこうじ","袋状":"ふくろじょう","被覆率":"ひふくりつ","裂":"れつ","装置":"そうち","装置設計":"そうちせっけい","補":"おぎな","補充遅延":"ほじゅうちえん","補正":"ほせい","補給":"ほきゅう","補給到達率":"ほきゅうとうたつりつ","補給投資":"ほきゅうとうし","補給線":"ほきゅうせん","補給量":"ほきゅうりょう","裸地":"らち","製品":"せいひん","製油所処理":"せいゆしょしょり","裾":"すそ","複合正弦波":"ふくごうせいげんは","複数":"ふくすう","複数世代":"ふくすうせだい","複数反復":"ふくすうはんぷく","複数年周期":"ふくすうねんしゅうき","複数形質":"ふくすうけいしつ","複数情報":"ふくすうじょうほう","複数種":"ふくすうしゅ","複数経路":"ふくすうけいろ","複数緩衝成分":"ふくすうかんしょうせいぶん","複数肺胞":"ふくすうはいほう","複数色":"ふくすうしょく","複数解離":"ふくすうかいり","複数資産":"ふくすうしさん","複数車両":"ふくすうしゃりょう","複数都市":"ふくすうとし","複数音":"ふくすうおん","複素係数":"ふくそけいすう","複素平面":"ふくそへいめん","複素数":"ふくそすう","複素数平面":"ふくそすうへいめん","複素解析":"ふくそかいせき","複素軌道":"ふくそきどう","複製":"ふくせい","複製前":"ふくせいまえ","複製後":"ふくせいご","複製数":"ふくせいすう","複雑":"ふくざつ","複雑形状":"ふくざつけいじょう","複雑系":"ふくざつけい","西回":{"り":"にしまわ"},"要因":"よういん","要点":"ようてん","要素":"ようそ","要素半径":"ようそはんけい","要素数":"ようそすう","要素間隔":"ようそかんかく","覆":{"い":"おお","う":"おお","っ":"おお"},"見":"み","見出":"みだ","見分":"みわ","見失":"みうしな","見方":"みかた","見本":"みほん","見比":"みくら","見渡":{"し":"みわた"},"見直":"みなお","見積":"みつ","見立":"みた","見逃":"みのが","規制":"きせい","規制判断":"きせいはんだん","規則":"きそく","規則的":"きそくてき","規格化強度":"きかくかきょうど","規格外":"きかくがい","規格外割合":"きかくがいわりあい","規格外率":"きかくがいりつ","規模":"きぼ","視差":"しさ","視界":"しかい","視線":"しせん","視線誘導":"しせんゆうどう","視覚":"しかく","視覚以上":"しかくいじょう","視覚情報":"しかくじょうほう","視覚流":"しかくりゅう","視覚的":"しかくてき","視覚的制御模型":"しかくてきせいぎょもけい","視野":"しや","視野幅":"しやはば","親":"おや","親和性":"しんわせい","親型配偶子":"おやがたはいぐうし","親魚量":"しんぎょりょう","観察":"かんさつ","観察季節":"かんさつきせつ","観察指標":"かんさつしひょう","観察条件":"かんさつじょうけん","観察比":"かんさつひ","観察状態":"かんさつじょうたい","観察者":"かんさつしゃ","観察角":"かんさつかく","観察語":"かんさつご","観察道具":"かんさつどうぐ","観測":"かんそく","観測以上":"かんそくいじょう","観測可能":"かんそくかのう","観測周波数":"かんそくしゅうはすう","観測地点":"かんそくちてん","観測時刻":"かんそくじこく","観測条件":"かんそくじょうけん","観測機":"かんそくき","観測機会":"かんそくきかい","観測点":"かんそくてん","観測範囲":"かんそくはんい","観測緯度":"かんそくいど","観測者":"かんそくしゃ","観測者位置":"かんそくしゃいち","観測者自身":"かんそくしゃじしん","観測者速度":"かんそくしゃそくど","観測表示":"かんそくひょうじ","観測装備":"かんそくそうび","観測装置":"かんそくそうち","観測誤差":"かんそくごさ","観測距離":"かんそくきょり","観測量":"かんそくりょう","角加速度":"かくかそくど","角固定":"かどこてい","角度":"かくど","角度別":"かくどべつ","角度差":"かくどさ","角度方向":"かくどほうこう","角度雑音":"かくどざつおん","角速度":"かくそくど","角運動量":"かくうんどうりょう","解":{"く":"と","け":"と"},"解放":"かいほう","解析":"かいせき","解析中":"かいせきちゅう","解析予算":"かいせきよさん","解析的":"かいせきてき","解析誤":"かいせきあやま","解析量":"かいせきりょう","解釈":"かいしゃく","解除":"かいじょ","解離平衡":"かいりへいこう","解離曲線":"かいりきょくせん","解離近似":"かいりきんじ","触":{"":"さわ","れ":"ふ"},"触媒":"しょくばい","触媒能":"しょくばいのう","触手":"しょくしゅ","触腕":"しょくわん","触覚":"しょっかく","触角":"しょっかく","言":{"う":"い","え":"い"},"言葉":"ことば","訂正":"ていせい","計器":"けいき","計器差":"けいきさ","計画":"けいかく","計画模型":"けいかくもけい","計画経路":"けいかくけいろ","計算":"けいさん","計算回数":"けいさんかいすう","計算方法":"けいさんほうほう","計算量":"けいさんりょう","計算量増加":"けいさんりょうぞうか","記号":"きごう","記号列":"きごうれつ","記号数":"きごうすう","記号過多":"きごうかた","記憶":"きおく","記憶容量":"きおくようりょう","記憶細胞":"きおくさいぼう","記憶距離":"きおくきょり","記述":"きじゅつ","記録":"きろく","記録条件":"きろくじょうけん","訪問地点":"ほうもんちてん","訪問記憶":"ほうもんきおく","設":"もう","設備":"せつび","設定":"せってい","設計":"せっけい","設計値":"せっけいち","設計図":"せっけいず","許容差":"きょようさ","診断":"しんだん","診断用":"しんだんよう","証拠":"しょうこ","証明":"しょうめい","評価":"ひょうか","評価軸":"ひょうかじく","評価量":"ひょうかりょう","試":"ため","試料":"しりょう","試料体積":"しりょうたいせき","試料型":"しりょうがた","試料帯":"しりょうたい","試料濃度":"しりょうのうど","試験片":"しけんへん","詩的価値":"してきかち","詰":"つ","詳":{"し":"くわ"},"詳細":"しょうさい","認知能力診断":"にんちのうりょくしんだん","認証":"にんしょう","認証限界":"にんしょうげんかい","認識":"にんしき","誕生":"たんじょう","誘導電圧":"ゆうどうでんあつ","誘引突起":"ゆういんとっき","語彙特性":"ごいとくせい","語彙種":"ごいしゅ","語順":"ごじゅん","誤":"あやま","誤反応":"ごはんのう","誤差":"ごさ","誤検出":"ごけんしゅつ","誤誘導":"ごゆうどう","説明":"せつめい","説明可能性":"せつめいかのうせい","読":"よ","課題":"かだい","調":"しら","調光":"ちょうこう","調律":"ちょうりつ","調律法":"ちょうりつほう","調整":"ちょうせい","調査設計":"ちょうさせっけい","調節":"ちょうせつ","調節経路":"ちょうせつけいろ","調節領域":"ちょうせつりょういき","論理":"ろんり","論理値":"ろんりち","論理回路":"ろんりかいろ","識別":"しきべつ","谷":"たに","豊":"ゆた","豊作":"ほうさく","豊富":"ほうふ","象":"ぞう","豪雨":"ごうう","豪雨時":"ごううじ","豪雨追加":"ごううついか","貝":"かい","貝殻":"かいがら","負":"ふ","負極":"ふきょく","負荷":"ふか","負荷抵抗":"ふかていこう","負荷電力":"ふかでんりょく","負荷電流":"ふかでんりゅう","販売":"はんばい","貪欲反復":"どんよくはんぷく","貪欲性":"どんよくせい","貯留":"ちょりゅう","貯留場所":"ちょりゅうばしょ","貯蔵庫":"ちょぞうこ","貯蔵量":"ちょぞうりょう","買":"か","資源":"しげん","資源制約":"しげんせいやく","資源制限":"しげんせいげん","資源地点":"しげんちてん","資源探索":"しげんたんさく","資源模型":"しげんもけい","資源管理":"しげんかんり","資源評価":"しげんひょうか","資源量":"しげんりょう","質":"しつ","質分解":"しつぶんかい","質点模型":"しつてんもけい","質量":"しつりょう","質量中心":"しつりょうちゅうしん","質量保存":"しつりょうほぞん","質量収支":"しつりょうしゅうし","質量数":"しつりょうすう","質量比":"しつりょうひ","質量相当":"しつりょうそうとう","質量誤差":"しつりょうごさ","購入":"こうにゅう","赤":"あか","赤四角":"あかしかく","赤矢印":"あかやじるし","赤紫":"あかむらさき","赤線":"あかせん","赤色光":"せきしょくこう","赤褐色":"せっかっしょく","赤道付近":"せきどうふきん","赤道直上":"せきどうちょくじょう","走":"はし","走性":"そうせい","走査位置":"そうさいち","走行中":"そうこうちゅう","走行訓練":"そうこうくんれん","起":"お","超":"こ","超巨星":"ちょうきょせい","超深海":"ちょうしんかい","超深海二枚貝":"ちょうしんかいにまいがい","超深海帯":"ちょうしんかいたい","超深海有孔虫":"ちょうしんかいゆうこうちゅう","超音波":"ちょうおんぱ","超音波反射":"ちょうおんぱはんしゃ","超音波反響定位":"ちょうおんぱはんきょうていい","超音速衝撃波":"ちょうおんそくしょうげきは","超高木層":"ちょうこうぼくそう","越":"こ","越冬個体数":"えっとうこたいすう","越冬地":"えっとうち","越冬地条件":"えっとうちじょうけん","足":{"あ":"あし","し":"た","す":"た","を":"あし"},"足場":"あしば","足場糸":"あしばいと","足跡":"あしあと","距離":"きょり","距離場":"きょりば","距離場模型":"きょりばもけい","距離変動":"きょりへんどう","距離形":"きょりけい","距離規則":"きょりきそく","距離閾値":"きょりいきち","跡":"あと","路面":"ろめん","路面摩擦":"ろめんまさつ","車":"くるま","車両":"しゃりょう","車両数":"しゃりょうすう","車両流入":"しゃりょうりゅうにゅう","車輪":"しゃりん","軌跡":"きせき","軌跡点":"きせきてん","軌跡範囲":"きせきはんい","軌道":"きどう","軌道上":"きどうじょう","軌道偏":"きどうかたよ","軌道傾斜":"きどうけいしゃ","軌道差":"きどうさ","軌道間隔":"きどうかんかく","軌道関数":"きどうかんすう","軌道面":"きどうめん","軍事行動":"ぐんじこうどう","軟体動物":"なんたいどうぶつ","軟体動物化石":"なんたいどうぶつかせき","軟化長":"なんかちょう","軟弱地盤":"なんじゃくじばん","軟組織":"なんそしき","軟骨魚類":"なんこつぎょるい","転写":"てんしゃ","転写中":"てんしゃちゅう","転写後":"てんしゃご","転写済":"てんしゃず","転写調節":"てんしゃちょうせつ","転置":"てんち","転置幅":"てんちはば","軸":"じく","軸間角度":"じくかんかくど","軽":"かる","軽油":"けいゆ","軽質原油":"けいしつげんゆ","軽量":"けいりょう","軽量機":"けいりょうき","載荷":"さいか","載荷速度":"さいかそくど","輝度":"きど","輝度分布":"きどぶんぷ","輪":"わ","輪形動物":"りんけいどうぶつ","輪郭":"りんかく","輪郭品質":"りんかくひんしつ","輪郭密度":"りんかくみつど","輪郭対比":"りんかくたいひ","輪郭欠落":"りんかくけつらく","輪郭線":"りんかくせん","輪郭誤差":"りんかくごさ","輸送":"ゆそう","輸送中":"ゆそうちゅう","輸送体":"ゆそうたい","輸送体動態":"ゆそうたいどうたい","輸送効率":"ゆそうこうりつ","輸送混乱":"ゆそうこんらん","輸送網":"ゆそうもう","輸送能力":"ゆそうのうりょく","輸送遅":"ゆそうおく","農地管理":"のうちかんり","辺":"へん","込":"こ","迂回":"うかい","迎角":"げいかく","近":"ちか","近似":"きんじ","近似値":"きんじち","近似積分値":"きんじせきぶんち","近似誤差":"きんじごさ","近傍":"きんぼう","近接初期値":"きんせつしょきち","近接投影":"きんせつとうえい","近接率":"きんせつりつ","近接軌道":"きんせつきどう","近縁度":"きんえんど","近軸光線":"きんじくこうせん","返":"かえ","迷路":"めいろ","追":"お","追加":"ついか","追加速度":"ついかそくど","追加順":"ついかじゅん","追加順変化":"ついかじゅんへんか","追従性":"ついじゅうせい","追従誤差":"ついじゅうごさ","追跡":"ついせき","退化":"たいか","送":"おく","送信":"そうしん","送電線":"そうでんせん","送風":"そうふう","逃":"に","逆":"ぎゃく","逆向":"ぎゃくむ","逆変換":"ぎゃくへんかん","逆外場課題":"ぎゃくがいばかだい","逆方向":"ぎゃくほうこう","逆方向成分":"ぎゃくほうこうせいぶん","逆流":"ぎゃくりゅう","逆起電力":"ぎゃくきでんりょく","逆転":"ぎゃくてん","逆転層":"ぎゃくてんそう","逆転数":"ぎゃくてんすう","逆進":"ぎゃくしん","逆順":"ぎゃくじゅん","逆風":"ぎゃくふう","透明":"とうめい","透明度":"とうめいど","透水係数":"とうすいけいすう","透水能力":"とうすいのうりょく","透視投影":"とうしとうえい","透過":"とうか","透過成分":"とうかせいぶん","透過漏":"とうかも","透過率":"とうかりつ","透過粒子割合":"とうかりゅうしわりあい","途中":"とちゅう","途中蒸発":"とちゅうじょうはつ","途切":"とぎ","這":{"い":"は","っ":"は"},"通":{"し":"とお","じ":"つう","す":"とお","り":"とお","る":"とお"},"通信":"つうしん","通信破損":"つうしんはそん","通信誤":"つうしんあやま","通信負荷":"つうしんふか","通信路":"つうしんろ","通信遅延":"つうしんちえん","通常":"つうじょう","通常空気":"つうじょうくうき","通路":"つうろ","通路余裕":"つうろよゆう","通路数":"つうろすう","通過":"つうか","通過時間":"つうかじかん","通過痕":"つうかこん","通過速度":"つうかそくど","通過量":"つうかりょう","通電":"つうでん","速":"はや","速力":"そくりょく","速度":"そくど","速度場":"そくどば","速度変化":"そくどへんか","速度変更":"そくどへんこう","速度定数":"そくどていすう","速度履歴":"そくどりれき","速度差":"そくどさ","速度成分":"そくどせいぶん","速度方向":"そくどほうこう","速度曲線":"そくどきょくせん","速度測定":"そくどそくてい","速度矢印":"そくどやじるし","速度知覚":"そくどちかく","速度論":"そくどろん","造成":"ぞうせい","連動":"れんどう","連続":"れんぞく","連続入力":"れんぞくにゅうりょく","連続平面":"れんぞくへいめん","連続的":"れんぞくてき","連続色補間":"れんぞくしょくほかん","連続運動":"れんぞくうんどう","連鎖":"れんさ","週":"しゅう","週間":"しゅうかん","週間後":"しゅうかんご","進":"すす","進入中止":"しんにゅうちゅうし","進化":"しんか","進化課題":"しんかかだい","進展":"しんてん","進展曲線":"しんてんきょくせん","進展速度差":"しんてんそくどさ","進捗":"しんちょく","進行":"しんこう","進行方向":"しんこうほうこう","進路":"しんろ","進路分布":"しんろぶんぷ","進路指示":"しんろしじ","遅":{"い":"おそ","く":"おそ","れ":"おく"},"遅延":"ちえん","遅延後":"ちえんご","遊":"あそ","運":"はこ","運動":"うんどう","運動時":"うんどうじ","運動法則":"うんどうほうそく","運動状態":"うんどうじょうたい","運動神経":"うんどうしんけい","運動終了":"うんどうしゅうりょう","運動計画":"うんどうけいかく","運動量":"うんどうりょう","運動開始":"うんどうかいし","運動関係":"うんどうかんけい","運搬":"うんぱん","運搬体":"うんぱんたい","運搬条件":"うんぱんじょうけん","運搬済":{"み":"うんぱんず"},"運用手順":"うんようてじゅん","運航判断":"うんこうはんだん","運転":"うんてん","過":"か","過冷却":"かれいきゃく","過冷却水滴":"かれいきゃくすいてき","過剰反応":"かじょうはんのう","過剰在庫":"かじょうざいこ","過去":"かこ","過大":"かだい","過渡":"かと","過熱":"かねつ","過程":"かてい","道":"みち","道具":"どうぐ","道沿":{"い":"みちぞ"},"道路":"どうろ","道路色":"どうろしょく","道路設計":"どうろせっけい","達":"たっ","達成":"たっせい","達成箱":"たっせいばこ","違":"ちが","違法漁業":"いほうぎょぎょう","遠":"とお","遠回":"とおまわ","遠方":"えんぽう","遠方回折":"えんぽうかいせつ","遠方物体":"えんぽうぶったい","遠景":"えんけい","遠足":"えんそく","遠近法":"えんきんほう","適切":"てきせつ","適応":"てきおう","適温":"てきおん","適用範囲":"てきようはんい","遮":{"ら":"さえぎ","り":"さえぎ","る":"さえぎ"},"遮蔽":"しゃへい","遮蔽物":"しゃへいぶつ","遷移":"せんい","遷移先":"せんいさき","選":"えら","選別":"せんべつ","選択":"せんたく","選択中":"せんたくちゅう","選択係数":"せんたくけいすう","選択前":"せんたくまえ","選択性":"せんたくせい","選択気体":"せんたくきたい","選択法":"せんたくほう","選択点":"せんたくてん","選択肢":"せんたくし","遺伝":"いでん","遺伝問題":"いでんもんだい","遺伝子":"いでんし","遺伝子制御":"いでんしせいぎょ","遺伝子型":"いでんしがた","遺伝子発現":"いでんしはつげん","遺伝子課題":"いでんしかだい","遺伝情報":"いでんじょうほう","遺伝的浮動":"いでんてきふどう","遺伝相談":"いでんそうだん","遺骸":"いがい","避":"さ","還流":"かんりゅう","郊外":"こうがい","部位":"ぶい","部位別":"ぶいべつ","部位別作用":"ぶいべつさよう","部分":"ぶぶん","部分分離":"ぶぶんぶんり","部品":"ぶひん","部屋":"へや","部屋数":"へやすう","部屋配置":"へやはいち","都市":"とし","都市公園":"としこうえん","配偶子":"はいぐうし","配偶子形成":"はいぐうしけいせい","配光":"はいこう","配分":"はいぶん","配列":"はいれつ","配布":"はいふ","配管":"はいかん","配管摩擦":"はいかんまさつ","配線":"はいせん","配線容量":"はいせんようりょう","配線置換":"はいせんちかん","配置":"はいち","配送":"はいそう","配送期限":"はいそうきげん","配送率":"はいそうりつ","酵素":"こうそ","酵素分解":"こうそぶんかい","酵素占有率":"こうそせんゆうりつ","酵素反応":"こうそはんのう","酵素特異性":"こうそとくいせい","酵素課題":"こうそかだい","酵素量":"こうそりょう","酵素阻害":"こうそそがい","酸":"さん","酸化":"さんか","酸化微生物":"さんかびせいぶつ","酸化物":"さんかぶつ","酸化細菌":"さんかさいきん","酸型":"さんがた","酸塩基":"さんえんき","酸塩基平衡":"さんえんきへいこう","酸塩基等量":"さんえんきとうりょう","酸変化":"さんへんか","酸性":"さんせい","酸性度":"さんせいど","酸性水":"さんせいすい","酸等量":"さんとうりょう","酸素":"さんそ","酸素不足":"さんそぶそく","酸素余裕":"さんそよゆう","酸素供給":"さんそきょうきゅう","酸素化":"さんそか","酸素投与量決定":"さんそとうよりょうけってい","酸素拡散":"さんそかくさん","酸素指標":"さんそしひょう","酸素改善":"さんそかいぜん","酸置換":"さんちかん","酸鎖":"さんさ","重":{"い":"おも","く":"おも","さ":"おも","な":"かさ","ね":"かさ","み":"おも"},"重力":"じゅうりょく","重力強度":"じゅうりょくきょうど","重力応答":"じゅうりょくおうとう","重力方向":"じゅうりょくほうこう","重心":"じゅうしん","重心位置":"じゅうしんいち","重心優先":"じゅうしんゆうせん","重心点":"じゅうしんてん","重心速度":"じゅうしんそくど","重心運動":"じゅうしんうんどう","重心高":"じゅうしんたか","重症化":"じゅうしょうか","重症度":"じゅうしょうど","重複":"ちょうふく","重複多数":"ちょうふくたすう","重複率":"ちょうふくりつ","重複禁止":"ちょうふくきんし","重要":"じゅうよう","重視":"じゅうし","重質原油":"じゅうしつげんゆ","重量":"じゅうりょう","重量差":"じゅうりょうさ","量":"りょう","量子化学":"りょうしかがく","量子性":"りょうしせい","量子数":"りょうしすう","金属":"きんぞく","金環":"きんかん","金色":"きんいろ","金融助言":"きんゆうじょげん","針路補正":"しんろほせい","釣":"つ","釣合":"つりあ","釣果":"ちょうか","鈍":{"け":"に","り":"に"},"鉄":"てつ","鉄心":"てっしん","鉄片":"てっぺん","鉄硫化物":"てつりゅうかぶつ","鉄道":"てつどう","鉄酸化細菌":"てつさんかさいきん","鉛直":"えんちょく","鉛直加速度":"えんちょくかそくど","鉛直変位":"えんちょくへんい","鉛直成分":"えんちょくせいぶん","鉛直揚力成分":"えんちょくようりょくせいぶん","鉛直構造":"えんちょくこうぞう","鉛直速度":"えんちょくそくど","鉛直運動":"えんちょくうんどう","鉛直風切":{"り":"えんちょくかざき"},"鉱物":"こうぶつ","鉱物不純物":"こうぶつふじゅんぶつ","鉱物化":"こうぶつか","鉱物組成":"こうぶつそせい","銀河":"ぎんが","銀色":"ぎんいろ","銅損":"どうそん","鋭":"するど","錐体":"すいたい","鍵":"かぎ","鍵交換":"かぎこうかん","鍵強度":"かぎきょうど","鍵空間":"かぎくうかん","鍵管理":"かぎかんり","鍵長":"かぎちょう","鍾乳石":"しょうにゅうせき","鎌形":"かまがた","鎖":"くさり","鎖状":"さじょう","鏡":"かがみ","鏡映":"きょうえい","鏡映率":"きょうえいりつ","長":"なが","長三度":"ちょうさんど","長寿命":"ちょうじゅみょう","長寿命世代":"ちょうじゅみょうせだい","長文":"ちょうぶん","長方形和":"ちょうほうけいわ","長方形部屋":"ちょうほうけいべや","長時間":"ちょうじかん","長時間広角":"ちょうじかんこうかく","長時間後":"ちょうじかんご","長期":"ちょうき","長期予測":"ちょうきよそく","長期挙動":"ちょうききょどう","長期気候":"ちょうきこう","長期計画":"ちょうきけいかく","長波長":"ちょうはちょう","長距離相互作用":"ちょうきょりそうごさよう","長距離移動":"ちょうきょりいどう","長鎖脂質":"ちょうさししつ","長音":"ちょうおん","門脈":"もんみゃく","閉":"と","閉店前値引":"へいてんまえねび","開":"ひら","開口":"かいこう","開口部":"かいこうぶ","開回路電圧":"かいかいろでんあつ","開始":"かいし","開始文":"かいしぶん","開始時刻":"かいしじこく","開始時期":"かいしじき","開放電圧":"かいほうでんあつ","開閉":"かいへい","間多様性":"かんたようせい","間接効果":"かんせつこうか","間隔":"かんかく","間隙流速":"かんげきりゅうそく","間隙率":"かんげきりつ","関":"かか","関係":"かんけい","関数":"かんすう","関節":"かんせつ","関節角":"かんせつかく","関節角度":"かんせつかくど","関連":"かんれん","関門":"かんもん","閾値":"いきち","閾値未満":"いきちみまん","闇":"やみ","防":{"ぎ":"ふせ","ぐ":"ふせ"},"防御力":"ぼうぎょりょく","阻害":"そがい","阻害剤":"そがいざい","阻害剤濃度":"そがいざいのうど","阻害剤量":"そがいざいりょう","阻害型":"そがいがた","降":{"る":"ふ","ろ":"お"},"降下":"こうか","降伏":"こうふく","降伏応力":"こうふくおうりょく","降伏抵抗":"こうふくていこう","降伏限界":"こうふくげんかい","降水":"こうすい","降水量":"こうすいりょう","降雨":"こうう","降雨強度":"こううきょうど","降雨量":"こううりょう","限":"かぎ","限定":"げんてい","限界":"げんかい","限界状態":"げんかいじょうたい","限界等級":"げんかいとうきゅう","限界速度":"げんかいそくど","陣取":"じんと","除":"のぞ","除去率":"じょきょりつ","陰影":"いんえい","陳腐化":"ちんぷか","陸":"りく","陸生甲殻類":"りくせいこうかくるい","険":{"し":"けわ"},"陽子":"ようし","陽子中性子比":"ようしちゅうせいしひ","陽子数":"ようしすう","陽子比":"ようしひ","隆起":"りゅうき","階層":"かいそう","階層図鑑":"かいそうずかん","階層探索図鑑":"かいそうたんさくずかん","階層整合":"かいそうせいごう","階段":"かいだん","随意運動":"ずいいうんどう","隔離":"かくり","隔離中":"かくりちゅう","隙間":"すきま","際限":"さいげん","障壁":"しょうへき","障害":"しょうがい","障害物":"しょうがいぶつ","障害物回避":"しょうがいぶつかいひ","障害距離":"しょうがいきょり","隠":"かく","隠面処理":"いんめんしょり","隣":"となり","隣人数":"りんじんすう","隣接点":"りんせつてん","集":"あつ","集中":"しゅうちゅう","集中定数":"しゅうちゅうていすう","集中定数模型":"しゅうちゅうていすうもけい","集中度":"しゅうちゅうど","集中温度":"しゅうちゅうおんど","集中豪雨":"しゅうちゅうごうう","集合":"しゅうごう","集合判定":"しゅうごうはんてい","集合管":"しゅうごうかん","集団":"しゅうだん","集団位相":"しゅうだんいそう","集団同期":"しゅうだんどうき","集団平均":"しゅうだんへいきん","集団構造":"しゅうだんこうぞう","集団秩序":"しゅうだんちつじょ","集団行動":"しゅうだんこうどう","集団運動":"しゅうだんうんどう","集団遺伝":"しゅうだんいでん","集束":"しゅうそく","集約":"しゅうやく","雑音":"ざつおん","雑音環境":"ざつおんかんきょう","雑音通信":"ざつおんつうしん","離":"はな","離散発光線":"りさんはっこうせん","離散的":"りさんてき","離散表示":"りさんひょうじ","離脱":"りだつ","難":{"し":"むずか"},"雨":"あめ","雨域":"ういき","雨林":"うりん","雨水":"あまみず","雨水条件":"うすいじょうけん","雨粒":"あまつぶ","雨粒目線":"あまつぶめせん","雨粒視点":"あまつぶしてん","雨量":"うりょう","雪":"ゆき","雪崩":"なだれ","雪崩回数":"なだれかいすう","雪結晶":"ゆきけっしょう","雲":"くも","雲内":"うんない","雲内成長":"うんないせいちょう","雲凝結核":"うんぎょうけつかく","雲微物理":"くもびぶつり","雲粒":"うんりゅう","雲量":"うんりょう","雷":"かみなり","電位":"でんい","電位依存":"でんいいぞん","電力":"でんりょく","電圧":"でんあつ","電圧低下":"でんあつていか","電圧曲線":"でんあつきょくせん","電圧降下":"でんあつこうか","電場":"でんば","電子":"でんし","電子伝達":"でんしでんたつ","電子励起":"でんしれいき","電子数":"でんしすう","電子殻":"でんしかく","電子移動":"でんしいどう","電極":"でんきょく","電極反応速度":"でんきょくはんのうそくど","電気":"でんき","電気化学":"でんきかがく","電気回路":"でんきかいろ","電気的":"でんきてき","電池":"でんち","電池内部":"でんちないぶ","電池化学":"でんちかがく","電池改造":"でんちかいぞう","電池本体":"でんちほんたい","電池条件":"でんちじょうけん","電池端子電圧電流残量温度":"でんちたんしでんあつでんりゅうざんりょうおんど","電波":"でんぱ","電流":"でんりゅう","電流制限":"でんりゅうせいげん","電流表示":"でんりゅうひょうじ","電源":"でんげん","電源電圧":"でんげんでんあつ","電球":"でんきゅう","電磁場":"でんじば","電磁変換":"でんじへんかん","電磁容量":"でんじようりょう","電磁波":"でんじは","電磁石":"でんじしゃく","電荷":"でんか","電荷収支":"でんかしゅうし","電荷表示":"でんかひょうじ","電荷質量比":"でんかしつりょうひ","電解質":"でんかいしつ","需要":"じゅよう","需要急増":"じゅようきゅうぞう","需要情報":"じゅようじょうほう","震源":"しんげん","震源予知":"しんげんよち","震源距離":"しんげんきょり","霜":"しも","霞":{"む":"かす"},"霧":"きり","露出":"ろしゅつ","露出時":"ろしゅつじ","露出時間":"ろしゅつじかん","露出開始":"ろしゅつかいし","青":"あお","青信号":"あおしんごう","青時間":"あおじかん","青時間比":"あおじかんひ","青点線":"あおてんせん","青白":"あおじろ","青緑":"あおみどり","青緑多層":"あおみどりたそう","青線":"あおせん","青色":"あおいろ","静":"しず","静圧":"せいあつ","静止":"せいし","静止媒質":"せいしばいしつ","静止摩擦":"せいしまさつ","静止摩擦破壊":"せいしまさつはかい","静止摩擦限界":"せいしまさつげんかい","静脈容量":"じょうみゃくようりょう","静脈還流":"じょうみゃくかんりゅう","非":"ひ","非圧縮":"ひあっしゅく","非圧縮性":"ひあっしゅくせい","非圧縮性流体方程式":"ひあっしゅくせいりゅうたいほうていしき","非常":"ひじょう","非接触制御":"ひせっしょくせいぎょ","非接触制御模型":"ひせっしょくせいぎょもけい","非有意":"ひゆうい","非用途":"ひようと","非競争阻害":"ひきょうそうそがい","非線形":"ひせんけい","非線形方程式":"ひせんけいほうていしき","非線形相互作用":"ひせんけいそうごさよう","非線形系":"ひせんけいけい","非調和性":"ひちょうわせい","面":"めん","面積":"めんせき","面積倍率":"めんせきばいりつ","面積変動":"めんせきへんどう","面積差":"めんせきさ","面積比":"めんせきひ","音":"おと","音名":"おんめい","音声":"おんせい","音声出力":"おんせいしゅつりょく","音数":"おんすう","音数厳格度":"おんすうげんかくど","音数適合":"おんすうてきごう","音楽":"おんがく","音波":"おんぱ","音波模型":"おんぱもけい","音源":"おんげん","音源移動":"おんげんいどう","音源速度":"おんげんそくど","音源静止":"おんげんせいし","音程":"おんてい","音色":"ねいろ","音速":"おんそく","音量":"おんりょう","音量感度":"おんりょうかんど","音響":"おんきょう","音高":"おんこう","音高感度":"おんこうかんど","項目":"こうもく","順":"じゅん","順序":"じゅんじょ","順序立":"じゅんじょだ","順次追加":"じゅんじついか","順番":"じゅんばん","順路":"じゅんろ","頑健性":"がんけんせい","領土":"りょうど","領土紛争":"りょうどふんそう","領域":"りょういき","領域分割":"りょういきぶんかつ","領域境界":"りょういききょうかい","領域面積":"りょういきめんせき","頭":"あたま","頭打":"あたまう","頭足類":"とうそくるい","頭部":"とうぶ","頻度":"ひんど","頻度推定":"ひんどすいてい","頻度証拠":"ひんどしょうこ","頼":"たよ","顎":"あご","顔":"かお","顔料":"がんりょう","顕微鏡":"けんびきょう","類":"るい","風":"かぜ","風切":"かざき","風化":"ふうか","風化作用":"ふうかさよう","風化条件":"ふうかじょうけん","風化要因":"ふうかよういん","風化課題":"ふうかかだい","風化速度":"ふうかそくど","風向":"ふうこう","風矢印":"かぜやじるし","風経路":"かぜけいろ","風荷重":"ふうかじゅう","風速":"ふうそく","飛":"と","飛沫":"ひまつ","飛行":"ひこう","飛行中":"ひこうちゅう","飛行力学":"ひこうりきがく","飛行時間":"ひこうじかん","飛行機":"ひこうき","飛行状態":"ひこうじょうたい","飛行経路":"ひこうけいろ","飛行船":"ひこうせん","飛行船遠征":"ひこうせんえんせい","飛行角":"ひこうかく","飛距離":"ひきょり","食":{"べ":"た"},"食事":"しょくじ","食事投入":"しょくじとうにゅう","食事療法":"しょくじりょうほう","食事量":"しょくじりょう","食塊":"しょっかい","食帯":"しょくたい","食料":"しょくりょう","食料不足":"しょくりょうぶそく","食料庫":"しょくりょうこ","食料消費":"しょくりょうしょうひ","食料需要":"しょくりょうじゅよう","食条件":"しょくじょうけん","食物":"しょくもつ","食物源":"しょくもつげん","食物網":"しょくもつもう","食草":"しょくそう","食草余裕":"しょくそうよゆう","食道":"しょくどう","飲":"の","飲料水安全":"いんりょうすいあんぜん","飽和":"ほうわ","飽和度":"ほうわど","飽和透水係数":"ほうわとうすいけいすう","養分":"ようぶん","養分入力":"ようぶんにゅうりょく","餌":"えさ","餌場":"えさば","餌配置":"えさはいち","駅":"えき","駆出":"くしゅつ","駆出抵抗":"くしゅつていこう","駆出率":"くしゅつりつ","駆動":"くどう","駆動力":"くどうりょく","駆動周波数":"くどうしゅうはすう","駆動強度":"くどうきょうど","駆動振動":"くどうしんどう","駆動模型":"くどうもけい","駆動速度":"くどうそくど","骨":"ほね","骨格":"こっかく","髄鞘":"ずいしょう","高":"たか","高一致":"こういっち","高低差":"こうていさ","高低温":"こうていおん","高出力運用":"こうしゅつりょくうんよう","高圧環境":"こうあつかんきょう","高域":"こういき","高域強調":"こういききょうちょう","高域成分":"こういきせいぶん","高基質濃度":"こうきしつのうど","高塩分化":"こうえんぶんか","高密度":"こうみつど","高密度化":"こうみつどか","高密度層":"こうみつどそう","高層":"こうそう","高度":"こうど","高度別":"こうどべつ","高度差":"こうどさ","高感度":"こうかんど","高投射":"こうとうしゃ","高散乱":"こうさんらん","高次元":"こうじげん","高水温年":"こうすいおんねん","高浮力":"こうふりょく","高温":"こうおん","高温側":"こうおんがわ","高濃度":"こうのうど","高濃度領域":"こうのうどりょういき","高生産林":"こうせいさんりん","高硫黄原油":"こういおうげんゆ","高等":"こうとう","高粘度流体":"こうねんどりゅうたい","高精度多倍長計算":"こうせいどたばいちょうけいさん","高緯度":"こういど","高緯度密度差":"こういどみつどさ","高緯度水":"こういどすい","高緯度淡水流入":"こういどたんすいりゅうにゅう","高緯度温度差":"こういどおんどさ","高脂質食":"こうししつしょく","高負荷海溝":"こうふかかいこう","高速":"こうそく","高速移動":"こうそくいどう","高速重翼":"こうそくじゅうよく","高速飛行":"こうそくひこう","高重心":"こうじゅうしん","高難度出現":"こうなんどしゅつげん","高音":"こうおん","魔法":"まほう","魚":"さかな","魚類":"ぎょるい","鮮":"あざ","鮮明":"せんめい","鮮烈":"せんれつ","鯨":"くじら","鯨骨":"げいこつ","鯨骨性甲殻類":"げいこつせいこうかくるい","鯨骨細菌":"げいこつさいきん","鳥":"とり","鳥類":"ちょうるい","黄":"き","黄点":"きてん","黄緑":"きみどり","黄色":"きいろ","黄色優位":"きいろゆうい","黄色矢印":"きいろやじるし","黄色線":"きいろせん","黄金角":"おうごんかく","黄金角付近":"おうごんかくふきん","黄金角充填":"おうごんかくじゅうてん","黄金角条件":"おうごんかくじょうけん","黄金角誤差":"おうごんかくごさ","鼻葉":"びよう","齢":"れい"};

  const FURIGANA_STORAGE = "lab4wonder_furigana";
  const LIST_STORAGE = "lab4wonder_list";
  const KANJI_RUN = /[一-鿿]+/g;
  const KANA_HEAD = /^[ぁ-ゖ]{1,2}/;
  // Text here is either already annotated, not text at all, or would break if
  // its child nodes were replaced.
  const FURIGANA_SKIP = new Set([
    "SCRIPT", "STYLE", "NOSCRIPT", "CANVAS", "SVG", "RUBY", "RT", "RP",
    "TEXTAREA", "INPUT", "SELECT", "OPTION", "CODE", "PRE", "KBD", "SAMP",
  ]);
  const MAX_RUN = 8;
  // A ruby element's textContent is the base plus the reading, so annotating a
  // label that the app later reads back and tests would change the answer.
  // Every read-back in the repo is one of these controls: the play toggle,
  // which is tested for the word 一時停止, and one exercise button.
  const FURIGANA_KEEP_PLAIN = "#playPause,#playBtn,#play,#exerciseBtn";

  let furiganaOn = false;
  let furiganaObserver = null;

  function readingFor(run, tail) {
    const entry = FURIGANA[run];
    if (!entry) return null;
    if (typeof entry === "string") return entry;
    const kana = (tail.match(KANA_HEAD) || [""])[0];
    if (kana.length === 2 && entry[kana]) return entry[kana];
    if (kana.length >= 1 && entry[kana[0]]) return entry[kana[0]];
    return entry[""] || null;
  }

  // A whole run is annotated or none of it is. Composing a reading out of
  // shorter pieces looks plausible and is often wrong: with 火口崩壊 missing,
  // per character fallback produced 火(ひ)口崩(くず)壊(こわ) instead of
  // かこうほうかい. A child cannot tell a fabricated reading from a real one,
  // so an unknown run is left bare rather than guessed at.
  function annotate(run, tail) {
    if (run.length > MAX_RUN) return null;
    const reading = readingFor(run, tail);
    return reading ? [{ text: run, reading }] : null;
  }

  function annotateTextNode(node) {
    const text = node.nodeValue;
    if (!text || !KANJI_RUN.test(text)) return;
    KANJI_RUN.lastIndex = 0;

    const frag = document.createDocumentFragment();
    let cursor = 0;
    let changed = false;
    let match;
    while ((match = KANJI_RUN.exec(text))) {
      const parts = annotate(match[0], text.slice(match.index + match[0].length));
      if (!parts) continue;
      if (match.index > cursor) {
        frag.appendChild(document.createTextNode(text.slice(cursor, match.index)));
      }
      for (const part of parts) {
        if (!part.reading) {
          frag.appendChild(document.createTextNode(part.text));
          continue;
        }
        const ruby = document.createElement("ruby");
        ruby.appendChild(document.createTextNode(part.text));
        const rt = document.createElement("rt");
        rt.textContent = part.reading;
        ruby.appendChild(rt);
        frag.appendChild(ruby);
      }
      cursor = match.index + match[0].length;
      changed = true;
    }
    if (!changed) return;
    if (cursor < text.length) frag.appendChild(document.createTextNode(text.slice(cursor)));
    node.parentNode.replaceChild(frag, node);
  }

  function annotateTree(root) {
    if (!root || furiganaOn !== true) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        for (let el = node.parentElement; el; el = el.parentElement) {
          if (FURIGANA_SKIP.has(el.tagName)) return NodeFilter.FILTER_REJECT;
          if (el.dataset && el.dataset.noFurigana === "1") return NodeFilter.FILTER_REJECT;
          if (el.matches && el.matches(FURIGANA_KEEP_PLAIN)) return NodeFilter.FILTER_REJECT;
          if (el === document.body) break;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(annotateTextNode);
  }

  function furiganaStyle() {
    if (document.getElementById("lw-furigana-style")) return;
    const style = document.createElement("style");
    style.id = "lw-furigana-style";
    style.textContent =
      "html.lw-furigana ruby{ruby-position:over}" +
      "html.lw-furigana rt{font-size:.55em;font-weight:400;opacity:.9;letter-spacing:0}" +
      "html.lw-furigana body{line-height:2.05}" +
      "html.lw-furigana .metric b,html.lw-furigana .learn b{line-height:1.9}";
    document.head.appendChild(style);
  }

  // A parent may want the adult text back without leaving the kids entrance.
  function installFuriganaToggle() {
    const bar = document.querySelector("#r59-globalbar,.lw-globalbar");
    if (!bar || bar.querySelector(".lw-furigana-toggle")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "lw-furigana-toggle";
    const sync = () => {
      button.textContent = furiganaOn ? "ふりがな オン" : "ふりがな オフ";
      button.setAttribute("aria-pressed", furiganaOn ? "true" : "false");
      button.setAttribute("aria-label", furiganaOn ? "ふりがなを消す" : "ふりがなをつける");
    };
    button.addEventListener("click", () => {
      const next = !furiganaOn;
      try { localStorage.setItem(FURIGANA_STORAGE, next ? "1" : "0"); } catch (error) {}
      // Re-reading the page is the honest way to remove ruby: the original text
      // nodes are gone once they have been replaced.
      location.reload();
    });
    sync();
    bar.appendChild(button);
  }

  function furiganaWanted() {
    let stored = null;
    try { stored = localStorage.getItem(FURIGANA_STORAGE); } catch (error) {}
    if (stored === "1") return true;
    if (stored === "0") return false;
    let list = "";
    try { list = localStorage.getItem(LIST_STORAGE) || ""; } catch (error) {}
    const referrer = (document.referrer || "").split("/").pop();
    return list === "kids-index.html" || referrer === "kids-index.html";
  }

  function installFurigana() {
    if (typeof FURIGANA !== "object" || !FURIGANA) return;
    furiganaOn = furiganaWanted();
    furiganaStyle();
    installFuriganaToggle();
    if (!furiganaOn) return;
    document.documentElement.classList.add("lw-furigana");
    annotateTree(document.body);

    // Most of these apps write their results into the page as you use them, so
    // new text keeps arriving. Annotate it in the same task batch it lands in.
    let queue = [];
    let scheduled = false;
    const flush = () => {
      scheduled = false;
      const batch = queue;
      queue = [];
      batch.forEach((node) => {
        if (node.isConnected) annotateTree(node);
      });
    };
    furiganaObserver = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType === 1) queue.push(node);
          else if (node.nodeType === 3 && node.parentElement) queue.push(node.parentElement);
        }
      }
      if (queue.length && !scheduled) {
        scheduled = true;
        requestAnimationFrame(flush);
      }
    });
    furiganaObserver.observe(document.body, { childList: true, subtree: true });
  }
  // --- end furigana -----------------------------------------------

  function init() {
    document.body.classList.add("lw-v1-1");
    scrubVersions();
    installNavigation();
    installResetDock();
    installMeaning();
    installTouchHint();
    installVocabulary();
    watchExplorationAtlas();
    installPlanktonTouch();
    installFurigana();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
