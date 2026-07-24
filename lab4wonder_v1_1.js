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

  function installNavigation() {
    if (document.querySelector("#r59-globalbar,.lw-globalbar")) return;
    const nav = document.createElement("nav");
    nav.className = "lw-globalbar";
    nav.setAttribute("aria-label", "アプリ一覧へ戻る");
    nav.innerHTML = [
      '<a href="index.html">← 入口</a>',
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

  function moveHuntTarget(target, stage) {
    const margin = 18;
    const maxX = Math.max(margin, stage.clientWidth - target.offsetWidth - margin);
    const maxY = Math.max(62, stage.clientHeight - target.offsetHeight - margin);
    target.style.left = `${margin + Math.random() * (maxX - margin)}px`;
    target.style.top = `${54 + Math.random() * (maxY - 54)}px`;
  }

  function createHunt(scan) {
    const stage = document.createElement("div");
    stage.className = "lw-hunt";
    stage.dataset.world = page.replace(".html", "");
    stage.hidden = true;
    const message = document.createElement("p");
    message.className = "lw-hunt-message";
    message.textContent = "動いたものを見つけてタップしよう。";
    const target = document.createElement("button");
    target.type = "button";
    target.className = "lw-hunt-target";
    target.setAttribute("aria-label", "動いている発見対象");
    stage.append(message, target);
    scan.closest(".controls")?.insertAdjacentElement("afterend", stage);
    return { stage, message, target };
  }

  function installExplorationHunt(root) {
    const scan = root.querySelector("#r60-atlas-scan,#r59-atlas-scan");
    if (!scan || scan.dataset.lwHunt) return;
    scan.dataset.lwHunt = "true";
    scan.textContent = "探索をはじめる";
    root.querySelector("#r60-atlas-random,#r59-atlas-random")?.setAttribute("hidden", "");
    const hunt = createHunt(scan);
    if (!hunt.stage.parentElement) return;
    let misses = 0;
    let encounter = null;
    let movementTimer = 0;

    const stopMovement = () => {
      window.clearInterval(movementTimer);
      movementTimer = 0;
    };

    const startMovement = () => {
      stopMovement();
      const rarity = Number(encounter?.rarity) || 1;
      movementTimer = window.setInterval(() => {
        if (!hunt.stage.hidden) moveHuntTarget(hunt.target, hunt.stage);
      }, Math.max(650, 1350 - rarity * 110));
    };

    scan.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const atlas = window.__lwAtlas;
      encounter = atlas?.getEncounter?.() || null;
      if (!encounter) {
        hunt.stage.hidden = false;
        hunt.target.hidden = true;
        hunt.message.textContent = "この区画の発見は完了！ 区画を変えて探してみよう。";
        stopMovement();
        return;
      }
      misses = 0;
      hunt.target.hidden = false;
      hunt.target.textContent = encounter.icon || "？";
      hunt.target.setAttribute("aria-label", `動いている${encounter.group || "発見対象"}`);
      hunt.message.textContent = `「${encounter.group || "なにか"}」がかくれている。動く姿をタップ！`;
      hunt.stage.hidden = false;
      requestAnimationFrame(() => {
        moveHuntTarget(hunt.target, hunt.stage);
        startMovement();
      });
    }, true);

    hunt.stage.addEventListener("pointerdown", (event) => {
      if (event.target === hunt.target) return;
      misses += 1;
      hunt.message.textContent = misses < 3
        ? "そこにはいないようです。動く姿を目で追おう。"
        : `ヒント：${encounter?.zone || "選んだ区画"}にくらす${encounter?.group || "もの"}です。`;
    });

    hunt.target.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!encounter) return;
      const collected = window.__lwAtlas?.collect?.(encounter.name);
      stopMovement();
      hunt.stage.hidden = true;
      if (collected) toast(`発見！ ${encounter.name}を図鑑に記録`);
      encounter = null;
    });
  }

  function watchExplorationAtlas() {
    if (!explorationPages.has(page)) return;
    const install = () => {
      const atlas = document.querySelector("#r60-atlas,#r59-atlas");
      if (atlas) installExplorationHunt(atlas);
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
