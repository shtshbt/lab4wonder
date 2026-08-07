from pathlib import Path
p=Path('fourier_drawing.html')
s=p.read_text(encoding='utf-8')
if 'r83-fourier-spectrum-direct-control' in s:
    raise SystemExit('already patched')
s=s.replace('<title>手描きフーリエ変換</title>','<title>手描きフーリエ変換</title>\n<meta name="r83-fourier-spectrum-direct-control" content="tappable-frequency-spectrum-presets-and-fit-score">',1)
s=s.replace('.concept p{margin:7px 0 2px;color:#d5e0e9;font-size:13px;line-height:1.75}', '''.concept p{margin:7px 0 2px;color:#d5e0e9;font-size:13px;line-height:1.75}
.spectrum{margin-top:10px;padding:11px;border:1px solid #38556f;border-radius:14px;background:#0d1b29}.spectrumHead{display:flex;gap:8px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap}.spectrumHead b{color:#ffd85a;font-size:13px}.spectrumHead span{font-size:11px;line-height:1.55;color:#aebfd0}.spectrumActions{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.spectrumActions button{min-height:38px;padding:6px 9px;font-size:11px}.spectrumBars{display:flex;align-items:flex-end;gap:4px;height:126px;padding:9px 5px 3px;border-radius:11px;background:#07131f;overflow-x:auto}.spectrumBar{position:relative;flex:1 0 28px;min-width:28px;height:100%;border:0;background:transparent;padding:0;border-radius:7px;overflow:visible}.spectrumBar i{position:absolute;left:5px;right:5px;bottom:24px;min-height:4px;border-radius:6px 6px 2px 2px;background:#63d8ff;box-shadow:0 0 8px #63d8ff33}.spectrumBar span{position:absolute;left:0;right:0;bottom:2px;text-align:center;color:#bcd0e1;font:9px/1 ui-monospace,monospace}.spectrumBar.off i{background:#344657;box-shadow:none;opacity:.42}.spectrumBar.off span{opacity:.48;text-decoration:line-through}.spectrumBar:focus-visible{outline:2px solid #ffd85a;outline-offset:-2px}.spectrumScore{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;font-size:11px;color:#b9cad9}.spectrumScore strong{color:#ffd85a}''',1)
s=s.replace('  let coefficients = [];\n  let trace = [];','  let coefficients = [];\n  let sampledPoints = [];\n  let coefficientMask = [];\n  let trace = [];\n  let spectrumRoot = null;\n  let spectrumBars = null;\n  let spectrumScore = null;',1)
s=s.replace('    rawPoints = points;\n    coefficients = transform(sampled);\n    trace = [];','    rawPoints = points;\n    sampledPoints = sampled;\n    coefficients = transform(sampled);\n    coefficientMask = coefficients.map(() => true);\n    trace = [];',1)
s=s.replace('    prompt.textContent = "もう一度描くと、その形に入れ替わります";\n  }','    prompt.textContent = "もう一度描くと、その形に入れ替わります";\n    renderSpectrum();\n  }',1)
old='''  function drawEpicycles() {
    let x = center.x;
    let y = center.y;
    const terms = Math.min(Number(termInput.value), coefficients.length);
    for (let index = 0; index < terms; index += 1) {
      const item = coefficients[index];
      const angle = item.phase + 2 * Math.PI * item.frequency * time;
      const nextX = x + item.amplitude * Math.cos(angle);
      const nextY = y + item.amplitude * Math.sin(angle);
      if (item.frequency !== 0) drawCircleArm(x, y, nextX, nextY, item.amplitude);
      x = nextX;
      y = nextY;
    }
    trace.push({ x, y });
    if (trace.length > 1100) trace.shift();
    drawTrace(x, y);
  }
'''
new='''  function activeTerms() {
    const terms = Math.min(Number(termInput.value), coefficients.length);
    return coefficients.slice(0, terms).filter((_, index) => coefficientMask[index] !== false);
  }

  function reconstructAt(unitTime) {
    let x = 0, y = 0;
    for (const item of activeTerms()) {
      const angle = item.phase + 2 * Math.PI * item.frequency * unitTime;
      x += item.amplitude * Math.cos(angle);
      y += item.amplitude * Math.sin(angle);
    }
    return {x, y};
  }

  function fitScore() {
    if (!sampledPoints.length || !coefficients.length) return 0;
    const step = Math.max(1, Math.floor(sampledPoints.length / 72));
    let err = 0, n = 0, scale = 1;
    for (const q of sampledPoints) scale = Math.max(scale, Math.hypot(q.x, q.y));
    for (let i = 0; i < sampledPoints.length; i += step) {
      const r = reconstructAt(i / sampledPoints.length), q = sampledPoints[i];
      err += Math.pow(r.x-q.x,2) + Math.pow(r.y-q.y,2); n++;
    }
    const rms = Math.sqrt(err / Math.max(1,n));
    return Math.max(0, Math.min(100, 100 * (1 - rms / Math.max(1, scale * .8))));
  }

  function drawEpicycles() {
    let x = center.x;
    let y = center.y;
    for (const item of activeTerms()) {
      const angle = item.phase + 2 * Math.PI * item.frequency * time;
      const nextX = x + item.amplitude * Math.cos(angle);
      const nextY = y + item.amplitude * Math.sin(angle);
      if (item.frequency !== 0) drawCircleArm(x, y, nextX, nextY, item.amplitude);
      x = nextX;
      y = nextY;
    }
    trace.push({ x, y });
    if (trace.length > 1100) trace.shift();
    drawTrace(x, y);
  }
'''
assert old in s
s=s.replace(old,new,1)
marker='  function frame(frameTime) {'
ui=r'''  function ensureSpectrumUi() {
    if (spectrumRoot) return;
    spectrumRoot = document.createElement("section");
    spectrumRoot.className = "spectrum";
    spectrumRoot.setAttribute("aria-label", "周波数成分を直接オン・オフする");
    spectrumRoot.innerHTML = `
      <div class="spectrumHead"><b>🎚️ 形をつくる周波数</b><span>棒をタップして、その回転成分だけ消す／戻す。左ほどゆっくりした形、右ほど細かな形。</span></div>
      <div class="spectrumActions"><button type="button" data-preset="all">全部</button><button type="button" data-preset="low">低周波だけ</button><button type="button" data-preset="high">高周波だけ</button><button type="button" data-preset="strong">強い12成分</button></div>
      <div class="spectrumBars" role="group" aria-label="強い周波数成分"></div>
      <div class="spectrumScore"><span>再現度 <strong data-fit>—</strong></span><span data-active>—</span><span>※ ±の周波数は別々の回転として表示</span></div>`;
    document.querySelector(".controls").insertAdjacentElement("afterend", spectrumRoot);
    spectrumBars = spectrumRoot.querySelector(".spectrumBars");
    spectrumScore = spectrumRoot.querySelector("[data-fit]");
    spectrumRoot.addEventListener("click", event => {
      const preset = event.target.closest("[data-preset]");
      if (preset) {
        const name = preset.dataset.preset, cutoff = 8;
        coefficientMask = coefficients.map((item,index) => name === "all" ? true : name === "low" ? item.frequency === 0 || Math.abs(item.frequency) <= cutoff : name === "high" ? item.frequency !== 0 && Math.abs(item.frequency) > cutoff : name === "strong" ? index < 12 : true);
        trace = []; renderSpectrum();
        explanation.textContent = name === "low" ? "低周波だけにすると、大きくなめらかな形が残ります。" : name === "high" ? "高周波だけにすると、角や細かな揺れだけが残ります。" : name === "strong" ? "振幅の大きい成分だけで、どこまで元の形が戻るか比べています。" : "すべての周波数成分を使える状態に戻しました。";
        return;
      }
      const bar = event.target.closest("[data-coef]"); if (!bar) return;
      const index = Number(bar.dataset.coef); coefficientMask[index] = coefficientMask[index] === false; trace = []; renderSpectrum();
      explanation.textContent = `周波数 ${coefficients[index].frequency} の回転成分を${coefficientMask[index] ? "戻しました" : "消しました"}。水色の形がどこで変わるか見よう。`;
    });
  }

  function renderSpectrum() {
    ensureSpectrumUi();
    if (!coefficients.length) { spectrumBars.innerHTML = ""; spectrumScore.textContent = "—"; return; }
    const visible = coefficients.map((item,index)=>({item,index})).filter(({item})=>item.frequency!==0).slice(0,24).sort((a,b)=>Math.abs(a.item.frequency)-Math.abs(b.item.frequency));
    const maxAmp = Math.max(1, ...visible.map(v=>v.item.amplitude));
    spectrumBars.innerHTML = visible.map(({item,index}) => { const height = 8 + 70 * Math.sqrt(item.amplitude/maxAmp), on = coefficientMask[index] !== false, f = item.frequency > 0 ? `+${item.frequency}` : `${item.frequency}`; return `<button type="button" class="spectrumBar ${on ? "" : "off"}" data-coef="${index}" aria-pressed="${on}" aria-label="周波数 ${f}、振幅 ${item.amplitude.toFixed(1)}、${on ? "使用中" : "停止中"}"><i style="height:${height.toFixed(0)}%"></i><span>${f}</span></button>`; }).join("");
    spectrumScore.textContent = `${fitScore().toFixed(0)}%`;
    const active = spectrumRoot.querySelector("[data-active]"); if (active) active.textContent = `使用中 ${activeTerms().length} / ${Math.min(Number(termInput.value),coefficients.length)}成分`;
  }

'''
assert marker in s
s=s.replace(marker,ui+marker,1)
s=s.replace('    trace = [];\n    explanation.textContent = Number(termInput.value) < 12','    trace = [];\n    renderSpectrum();\n    explanation.textContent = Number(termInput.value) < 12',1)
p.write_text(s,encoding='utf-8')
print('fourier patched')
