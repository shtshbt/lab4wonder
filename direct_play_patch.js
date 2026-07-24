(() => {
  'use strict';

  const page = location.pathname.split('/').pop();
  const byId = id => document.getElementById(id);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const point = (event, canvas) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: clamp((event.clientX - rect.left) / Math.max(1, rect.width), 0, 1),
      y: clamp((event.clientY - rect.top) / Math.max(1, rect.height), 0, 1)
    };
  };
  const change = (element, value) => {
    if (!element) return;
    element.value = String(clamp(value, Number(element.min), Number(element.max)));
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  };
  const rangeValue = (id, ratio) => {
    const element = byId(id);
    return element
      ? Number(element.min) + ratio * (Number(element.max) - Number(element.min))
      : 0;
  };
  const addPanel = (canvas, title, text) => {
    if (!canvas || byId('directPlayPanel')) return;
    const panel = document.createElement('section');
    panel.id = 'directPlayPanel';
    panel.className = 'direct-play-panel';
    const heading = document.createElement('strong');
    heading.textContent = title;
    const status = document.createElement('span');
    status.id = 'directPlayStatus';
    status.setAttribute('role', 'status');
    status.textContent = text;
    panel.append(heading, status);
    canvas.closest('.stage')?.insertAdjacentElement('afterend', panel);
  };
  const setStatus = text => {
    const status = byId('directPlayStatus');
    if (status) status.textContent = text;
  };

  const style = document.createElement('style');
  style.textContent = `
    .direct-play-panel{display:flex;gap:9px;align-items:center;margin:8px 0 10px;padding:9px 11px;
      border:1px solid #50789a;border-radius:12px;background:#10263a;color:#dceaf7;font-size:12px;line-height:1.55}
    .direct-play-panel strong{flex:0 0 auto;color:#ffd85a}
    .direct-editor{margin:10px 0;padding:12px;border:1px solid #385a79;border-radius:15px;background:#101f30}
    .direct-editor h2{margin:0 0 5px;color:#ffd85a;font-size:16px}
    .direct-editor p{margin:0 0 9px;color:#b9cadb;font-size:12px;line-height:1.6}
    .direct-lines{display:grid;gap:7px}.direct-line{display:grid;grid-template-columns:1fr auto;gap:7px;align-items:center}
    .direct-line input{width:100%;min-height:44px;border:1px solid #456582;border-radius:10px;
      background:#091725;color:#f4f8fc;padding:8px 10px;font-size:16px}
    .direct-count{min-width:58px;text-align:center;color:#ffd85a;font:700 13px ui-monospace,monospace}
    .direct-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}
    .direct-pad-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:9px}
    .direct-pad-grid button{min-height:58px;font-size:18px}
    @media(max-width:480px){.direct-play-panel{align-items:flex-start;flex-direction:column}
      .direct-pad-grid{grid-template-columns:repeat(2,1fr)}}
  `;
  document.head.appendChild(style);

  const bindTwoRanges = ({ canvasId, first, second, title, help, describe }) => {
    const canvas = byId(canvasId);
    if (!canvas) return;
    addPanel(canvas, title, help);
    let active = false;
    const apply = event => {
      const p = point(event, canvas);
      change(byId(first), rangeValue(first, p.x));
      change(byId(second), rangeValue(second, 1 - p.y));
      setStatus(describe(p));
    };
    canvas.style.touchAction = 'none';
    canvas.addEventListener('pointerdown', event => {
      active = true;
      try {
        canvas.setPointerCapture?.(event.pointerId);
      } catch (error) {
        console.debug('Pointer capture is unavailable', error);
      }
      apply(event);
    });
    canvas.addEventListener('pointermove', event => {
      if (active) apply(event);
    });
    const stop = () => { active = false; };
    canvas.addEventListener('pointerup', stop);
    canvas.addEventListener('pointercancel', stop);
  };

  const setupSupplyChain = () => {
    const canvas = byId('mainCanvas');
    if (!canvas) return;
    addPanel(canvas, '品物を手で動かす', '箱をタップで補給。箱から隣の箱へドラッグすると、6個を緊急輸送します。');
    let start = null;
    const stageAt = event => clamp(Math.floor(point(event, canvas).x * 4), 0, 3);
    canvas.style.touchAction = 'none';
    canvas.addEventListener('pointerdown', event => {
      start = stageAt(event);
      try {
        canvas.setPointerCapture?.(event.pointerId);
      } catch (error) {
        console.debug('Pointer capture is unavailable', error);
      }
    });
    canvas.addEventListener('pointerup', event => {
      const end = stageAt(event);
      try {
        const names = ['原料', '加工', '物流拠点', '店'];
        if (start === end) {
          s.inv[end] += 8;
          setStatus(`${names[end]}へ8個を補給しました。品物の波がどう変わるか見よう。`);
        } else if (Math.abs(start - end) === 1) {
          const qty = Math.min(6, Math.max(0, s.inv[start]));
          s.inv[start] -= qty;
          s.inv[end] += qty;
          setStatus(`${names[start]}から${names[end]}へ${qty}個を緊急輸送しました。`);
        } else {
          setStatus('一度に運べるのは隣の段階までです。');
        }
        drawAll();
      } catch (error) {
        console.error('Supply-chain direct play failed', error);
        setStatus('操作を反映できませんでした。同じ初期へ戻して試してください。');
      }
      start = null;
    });
  };

  const setupSolubility = () => {
    const canvas = byId('mainCv');
    if (!canvas) return;
    addPanel(canvas, 'ビーカーへ直接入れる', '水面をタップすると溶質を10 g追加。水中を左右になぞるとかき混ぜます。');
    let startX = null;
    canvas.style.touchAction = 'none';
    canvas.addEventListener('pointerdown', event => {
      startX = event.clientX;
      try {
        canvas.setPointerCapture?.(event.pointerId);
      } catch (error) {
        console.debug('Pointer capture is unavailable', error);
      }
      byId('addBtn')?.click();
      setStatus('溶質を10 g入れました。粒が溶けるか、底へ残るかを見よう。');
    });
    canvas.addEventListener('pointermove', event => {
      if (startX === null) return;
      const distance = Math.abs(event.clientX - startX);
      if (distance < 12) return;
      change(byId('stir'), clamp(distance * 1.5, 0, 100));
      setStatus('水をかき混ぜています。溶ける速さと、最後に溶ける量の違いを比べよう。');
    });
    const stop = () => { startX = null; };
    canvas.addEventListener('pointerup', stop);
    canvas.addEventListener('pointercancel', stop);
  };

  const japaneseCount = text => Array.from(
    text.normalize('NFKC')
      .replace(/[、。！？\s]/g, '')
      .replace(/[ゃゅょぁぃぅぇぉゎャュョァィゥェォヮ]/g, '')
  ).length;

  const setupPoemEditor = () => {
    const canvas = byId('mainCanvas');
    if (!canvas) return;
    const host = document.createElement('section');
    host.className = 'direct-editor';
    host.setAttribute('aria-label', '俳句と短歌の編集');
    const heading = document.createElement('h2');
    heading.textContent = 'ことばを置いて、音の数を見よう';
    const intro = document.createElement('p');
    intro.textContent = '一行ずつ自由に書けます。数は目安なので、声に出した感じも大切にしてください。';
    const lines = document.createElement('div');
    lines.className = 'direct-lines';
    const targets = [5, 7, 5, 7, 7];
    const inputs = targets.map((target, index) => {
      const row = document.createElement('label');
      row.className = 'direct-line';
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 32;
      input.placeholder = `${index + 1}行目（目安 ${target}音）`;
      input.setAttribute('aria-label', `${index + 1}行目`);
      const count = document.createElement('span');
      count.className = 'direct-count';
      const update = () => {
        const value = japaneseCount(input.value);
        count.textContent = `${value} / ${target}`;
        count.style.color = value === target ? '#89e6a7' : '#ffd85a';
      };
      input.addEventListener('input', update);
      update();
      row.append(input, count);
      lines.appendChild(row);
      return input;
    });
    const actions = document.createElement('div');
    actions.className = 'direct-actions';
    const sample = document.createElement('button');
    sample.type = 'button';
    sample.textContent = '見本を入れる';
    sample.addEventListener('click', () => {
      ['あさつゆに', 'ちいさなひかり', 'みつけたよ', 'そっとのぞけば', 'せかいがひらく'].forEach((value, i) => {
        inputs[i].value = value;
        inputs[i].dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.textContent = 'ことばを消す';
    clear.addEventListener('click', () => inputs.forEach(input => {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }));
    actions.append(sample, clear);
    host.append(heading, intro, lines, actions);
    canvas.closest('.stage')?.insertAdjacentElement('beforebegin', host);
  };

  const setupMusic = () => {
    const canvas = byId('mainCanvas');
    if (!canvas) return;
    const host = document.createElement('section');
    host.className = 'direct-editor';
    const heading = document.createElement('h2');
    heading.textContent = '音を鳴らして、形を見る';
    const intro = document.createElement('p');
    intro.textContent = 'パッドか波形をタップすると音が鳴ります。音は最初の操作後だけ再生し、自動では鳴りません。';
    const pads = document.createElement('div');
    pads.className = 'direct-pad-grid';
    let audio = null;
    const playTone = (frequency, amount = 0.65) => {
      try {
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtor) throw new Error('Web Audio is unavailable');
        audio ||= new AudioCtor();
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12 * amount, audio.currentTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.42);
        oscillator.connect(gain).connect(audio.destination);
        oscillator.start();
        oscillator.stop(audio.currentTime + 0.45);
      } catch (error) {
        console.error('Music direct play failed', error);
        intro.textContent = 'このブラウザでは音を鳴らせませんが、波形への介入は続けられます。';
      }
    };
    [
      ['低い音', 130.81, '#69b7ff'],
      ['まんなか', 261.63, '#69e0b0'],
      ['高い音', 523.25, '#ffd85a'],
      ['きらめき', 783.99, '#ff9ac8']
    ].forEach(([label, frequency, color], index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.style.borderColor = color;
      button.addEventListener('click', () => {
        playTone(frequency);
        change(byId('p1'), rangeValue('p1', index / 3));
        change(byId('p2'), rangeValue('p2', 1 - index / 3));
      });
      pads.appendChild(button);
    });
    canvas.addEventListener('pointerdown', event => {
      const p = point(event, canvas);
      playTone(110 * Math.pow(2, p.x * 3), 1 - p.y * 0.65);
      change(byId('p0'), rangeValue('p0', p.x));
      change(byId('p3'), rangeValue('p3', 1 - p.y));
    });
    host.append(heading, intro, pads);
    canvas.closest('.stage')?.insertAdjacentElement('beforebegin', host);
  };

  const setupTransformer = () => {
    const main = byId('mainCv');
    const graph = byId('graphCv');
    if (!main || !graph) return;
    addPanel(main, 'ことばを選んで介入', '下の確率グラフで候補をタップすると、その語へ注意を向けます。上の図をタップすると一段進みます。');
    graph.addEventListener('pointerdown', event => {
      const p = point(event, graph);
      const index = clamp(Math.floor((p.y * graph.height - 42) / 30), 0, 5);
      try {
        state.focus = index;
        drawAll();
        const labels = ['青い', '降る', '眠る', '進む', '光る', '止まる'];
        setStatus(`「${labels[index]}」へ注意を向けました。確率の並びがどう変わるか見よう。`);
      } catch (error) {
        console.error('Transformer direct play failed', error);
      }
    });
    main.addEventListener('pointerdown', () => {
      byId('stepBtn')?.click();
      setStatus('模型を一段進めました。選んだ語と最有力候補を比べよう。');
    });
  };

  if (page === 'resonance.html') {
    bindTwoRanges({
      canvasId: 'mainCv',
      first: 'driveFreq',
      second: 'force',
      title: 'おもりを直接ゆらす',
      help: '左右で押す速さ、上下で押す強さを変えます。大きく揺れるタイミングを探そう。',
      describe: p => `押す速さを${Math.round(p.x * 100)}%、強さを${Math.round((1 - p.y) * 100)}%側へ動かしました。`
    });
  } else if (page === 'solubility.html') {
    setupSolubility();
  } else if (page === 'supply-chain-manager.html') {
    setupSupplyChain();
  } else if (page === 'haiku-tanka.html') {
    setupPoemEditor();
  } else if (page === 'music-visualizer.html') {
    setupMusic();
  } else if (page === 'mini-transformer.html') {
    setupTransformer();
  }
})();
