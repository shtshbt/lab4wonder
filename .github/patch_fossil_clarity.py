from pathlib import Path

p = Path('fossil-formation.html')
s = p.read_text(encoding='utf-8')


def rep(old, new, label):
    global s
    if old not in s:
        raise SystemExit(f'missing anchor: {label}')
    s = s.replace(old, new, 1)


css = '''<style id="r82-fossil-clarity-style">
.r82-ledger{margin:9px 0 10px;border:1px solid #45637b;border-radius:14px;background:#0c1a27;padding:9px}.r82-ledger-head{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:7px}.r82-ledger-head b{color:#ffd75a;font-size:12px}.r82-ledger-head span{font-size:10px;color:#b8cddd}.r82-ledger-grid{display:flex;gap:6px;overflow:auto;padding-bottom:3px}.r82-spec{flex:0 0 auto;min-width:130px;max-width:190px;border:1px solid #38536b;border-radius:10px;background:#132536;padding:7px}.r82-spec .top{display:flex;gap:5px;align-items:center;font-size:11px;font-weight:900}.r82-spec .state{margin-top:4px;font-size:10px;line-height:1.45;color:#bfd0df}.r82-spec.fossil{border-color:#e0ba42;background:#302a15}.r82-spec.fossil .state{color:#ffe88a}.r82-spec.lost{border-color:#9b554d;background:#2b1b1c}.r82-spec.found{border-color:#66d9a7;background:#143126}.r82-viewmode{position:absolute;z-index:10;left:10px;top:48px;background:rgba(5,14,22,.88);border:1px solid #7090a9;border-radius:999px;padding:5px 9px;font-size:10px;font-weight:900;pointer-events:none}.r82-xray-note{color:#ffe37a}.r81-compare{grid-template-columns:1fr auto 1fr auto 1fr}.r81-compare .r82-fossilcol{border:1px solid #9c8333;background:#282713!important}.r81-compare .r82-fossilcol b{color:#ffe064}.r81-head .r82-xray{min-height:34px!important}.r81-head .r82-xray.on{background:#e6c84d!important;color:#251e00!important;border-color:#ffe179!important}
@media(max-width:760px){.r81-compare{grid-template-columns:1fr 1fr 1fr}.r81-compare .r81-arrow{display:none}.r82-spec{min-width:118px}.r82-viewmode{top:46px}}
@media(max-width:460px){.r81-compare{grid-template-columns:1fr}.r82-ledger-grid{gap:5px}.r82-viewmode{font-size:9px;max-width:74%}}
</style>'''
rep('</style>\n<script id="r81-taphonomy-direct-script">', '</style>\n' + css + '\n<script id="r81-taphonomy-direct-script">', 'clarity css')

rep(" {name:'① 生物・痕跡',icon:'🐟',guide:'魚・貝・葉・骨・足跡を選び、画面をタップして「昔の世界」を作る。',gesture:'👆 タップして置く'},",
    " {name:'① 生物・痕跡',icon:'🐟',guide:'魚・貝・葉・骨・足跡を選び、水底の表面に置く。上下位置ではなく左右の環境を選ぶ。',gesture:'👆 水底をタップして置く'},", 'phase 1 guide')
rep(" {name:'③ 埋没',icon:'🟫',guide:'遺骸の上をタップ／なぞって土砂をかぶせる。短時間に厚く埋めるほど急速埋没になる。',gesture:'👆 タップ・なぞって埋める'},",
    " {name:'③ 埋没',icon:'🟫',guide:'遺骸がある場所の水底をタップ／なぞる。新しい土砂が上に積もり、遺骸は地中へ沈む。透視表示で位置を追える。',gesture:'👆 水底に土砂を積もらせる'},", 'phase 3 guide')

rep("let phase=0,tool='fish',pointer=null,holdTimer=null,holdInterval=null,holdStart=0,directAge=0;",
    "let phase=0,tool='fish',pointer=null,holdTimer=null,holdInterval=null,holdStart=0,directAge=0,xray=true;\nconst SURFACE_Y=190;", 'state')

old = '''panel.innerHTML=`<div class="r81-head"><div><b>🦴 タフォノミー実験</b><span>昔の世界 → 化石記録 → あなたの発掘結果</span></div><button id="r81Reset" type="button">↻ 最初から</button></div><div id="r81-phasebar" class="r81-phasebar"></div><div class="r81-action"><div id="r81Guide" class="r81-guide"></div><div id="r81Tools" class="r81-tools"></div><button id="r81Next" class="primary" type="button"></button></div>`;'''
new = '''panel.innerHTML=`<div class="r81-head"><div><b>🦴 タフォノミー実験</b><span>昔の世界 → 化石になったもの → 発掘できたもの</span></div><div><button id="r82Xray" class="r82-xray on" type="button">👁 地中を透視：ON</button><button id="r81Reset" type="button">↻ 最初から</button></div></div><div id="r81-phasebar" class="r81-phasebar"></div><div class="r81-action"><div id="r81Guide" class="r81-guide"></div><div id="r81Tools" class="r81-tools"></div><button id="r81Next" class="primary" type="button"></button></div>`;'''
rep(old, new, 'panel')

old = '''const status=document.createElement('div');status.id='r81Status';status.className='r81-status';stage.appendChild(status);
const compare=document.createElement('section');compare.className='r81-compare';compare.innerHTML='<div><b>昔の世界</b><div id="r81Past"></div></div><div class="r81-arrow">→ 保存フィルター →</div><div><b>あなたが発掘</b><div id="r81Found"></div></div><div id="r81Question" class="r81-question">同じ割合で残るだろうか？</div>';
stage.after(compare);'''
new = '''const status=document.createElement('div');status.id='r81Status';status.className='r81-status';stage.appendChild(status);
const viewMode=document.createElement('div');viewMode.className='r82-viewmode';stage.appendChild(viewMode);
const compare=document.createElement('section');compare.className='r81-compare';compare.innerHTML='<div><b>① 昔の世界</b><div id="r81Past"></div></div><div class="r81-arrow">→ 死後・保存 →</div><div class="r82-fossilcol"><b>② 化石になった</b><div id="r82Fossil"></div></div><div class="r81-arrow">→ 露出・発見 →</div><div><b>③ あなたが発掘</b><div id="r81Found"></div></div><div id="r81Question" class="r81-question">化石になっても、発見されるとは限らない。</div>';
const ledger=document.createElement('section');ledger.className='r82-ledger';
stage.after(compare);stage.after(ledger);'''
rep(old, new, 'status compare')

old = '''function addDirectSpecimen(p){
 if(specimens.length>=24){markAction('最大24個です。次の段階へ進むか、最初からやり直そう。');return}
 const s=createSpecimen(p.x,p.y,tool);ensure(s);s.createdPhase=phase;specimens.push(s);markAction(`${typeIcons[tool]} ${typeNames[tool]}を${positionName(p.x)}に置いた`);draw();updateComparison();
}'''
new = '''function addDirectSpecimen(p){
 if(specimens.length>=24){markAction('最大24個です。次の段階へ進むか、最初からやり直そう。');return}
 const py=SURFACE_Y+((specimens.length%3)-1)*7;
 const s=createSpecimen(p.x,py,tool);ensure(s);s.createdPhase=phase;s.surfaceY=py;specimens.push(s);markAction(`${typeIcons[tool]} ${typeNames[tool]}を${positionName(p.x)}の水底に置いた`);draw();updateComparison();
}'''
rep(old, new, 'surface placement')

old = '''function depositAt(p){
 const kind=tool==='sand'?'sand':'mud',r=kind==='mud'?58:48,now=performance.now(),fast=now-lastDepositAt<850;lastDepositAt=now;
 sedimentMarks.push({x:p.x,y:p.y,r,a:1,kind});if(sedimentMarks.length>140)sedimentMarks.shift();
 let hit=0;specimens.forEach(s=>{ensure(s);if(s.status==='lost')return;const d=Math.hypot(s.x-p.x,s.y-p.y);if(d>r+52)return;const gain=(kind==='mud'?.18:.13)*(1-d/(r+70));s.burialDepth=clamp81(s.burialDepth+gain,0,1.5);s.rapidBurial=clamp81(s.rapidBurial+(fast?.075:.025),0,1);s.exposure=clamp81(s.exposure-gain*.6,0,1.5);hit++});
 addFx(dustFx,{x:p.x,y:p.y,kind,life:800},70);markAction(hit?`🟫 ${hit}個の標本を埋めた：${fast?'急速埋没が進む':'埋没が進む'}`:'🟫 土砂を堆積させた');draw();
}'''
new = '''function depositAt(p){
 const kind=tool==='sand'?'sand':'mud',r=kind==='mud'?58:48,now=performance.now(),fast=now-lastDepositAt<850;lastDepositAt=now,dp={x:p.x,y:SURFACE_Y};
 sedimentMarks.push({x:dp.x,y:dp.y,r,a:1,kind});if(sedimentMarks.length>140)sedimentMarks.shift();
 let hit=0;specimens.forEach(s=>{ensure(s);if(s.status==='lost')return;if(s.surfaceY==null)s.surfaceY=Math.min(s.y,SURFACE_Y);const d=Math.hypot(s.x-dp.x,(s.surfaceY||SURFACE_Y)-dp.y);if(d>r+52)return;const gain=(kind==='mud'?.18:.13)*(1-d/(r+70));s.burialDepth=clamp81(s.burialDepth+gain,0,1.5);s.rapidBurial=clamp81(s.rapidBurial+(fast?.075:.025),0,1);s.exposure=clamp81(s.exposure-gain*.6,0,1.5);s.y=clamp81((s.surfaceY||SURFACE_Y)+s.burialDepth*82,SURFACE_Y,330);hit++});
 addFx(dustFx,{x:dp.x,y:dp.y,kind,life:800},70);markAction(hit?`🟫 ${hit}個の上に土砂が積もった：${fast?'急速埋没':'埋没'}。透視表示で地中の位置を確認できる`:'🟫 水底に新しい土砂を堆積させた');draw();updateComparison();
}'''
rep(old, new, 'burial')

rep("panel.querySelector('#r81Reset').onclick=resetDirect;",
    "panel.querySelector('#r81Reset').onclick=resetDirect;\nconst xrayBtn=panel.querySelector('#r82Xray');xrayBtn.onclick=()=>{xray=!xray;xrayBtn.classList.toggle('on',xray);xrayBtn.textContent=xray?'👁 地中を透視：ON':'👁 地中を透視：OFF';updateGuide()};", 'xray')

old = ''' const help=document.querySelector('.stage-help');if(help)help.innerHTML=`<b>${p.name}</b><br>${p.gesture}<br><small>上の段階ボタンはいつでも戻れます</small>`;
 status.textContent=phase===3?`模型時間：${formatAge(directAge)}`:`${p.name} ｜ ${p.gesture}`;'''
new = ''' const help=document.querySelector('.stage-help');if(help)help.innerHTML=`<b>${p.name}</b><br>${p.gesture}<br><small>上の段階ボタンはいつでも戻れます</small>`;
 viewMode.innerHTML=phase<=1?'🌊 <b>水底の表面</b>を見る':phase===2?`🟫 <b>埋没中</b> ${xray?'<span class="r82-xray-note">｜地中を透視</span>':''}`:`🪨 <b>地層断面</b> ${xray?'<span class="r82-xray-note">｜地中を透視</span>':''}`;
 status.textContent=phase===3?`模型時間：${formatAge(directAge)}`:`${p.name} ｜ ${p.gesture}`;'''
rep(old, new, 'view mode')

old = '''function updateComparison(){
 const keys=['fish','shell','leaf','bone','trace'],past={},found={};keys.forEach(k=>past[k]=found[k]=0);specimens.forEach(s=>{if(past[s.type]!=null)past[s.type]++;if(s.found&&found[s.type]!=null)found[s.type]++});
 const render=o=>keys.filter(k=>o[k]).map(k=>`<span>${typeIcons[k]} ${o[k]}</span>`).join(' ')||'<span>—</span>';
 document.getElementById('r81Past').innerHTML=render(past);document.getElementById('r81Found').innerHTML=render(found);
 const totalPast=Object.values(past).reduce((a,b)=>a+b,0),totalFound=Object.values(found).reduce((a,b)=>a+b,0);document.getElementById('r81Question').textContent=totalFound?`昔 ${totalPast} → 発掘 ${totalFound}。見つかった割合は昔の生物相と同じだろうか？`:'同じ割合で未来に残るだろうか？';
}'''
new = '''function specimenState(s){
 ensure(s);if(s.found)return['found','✓ 発掘済み',s.preservationMode||'化石'];if(s.preserved&&s.status!=='lost')return['fossil','★ 化石形成',s.preservationMode||'化石'];if(s.status==='lost')return['lost','× 消失',s.reason||'保存されなかった'];if(s.burialDepth>.18)return['buried','↓ 埋没中',`埋没 ${Math.round(Math.min(1,s.burialDepth)*100)}%`];return['active','○ 遺骸・痕跡','まだ化石ではない'];
}
function renderLedger(){
 const formed=specimens.filter(s=>s.preserved&&s.status!=='lost').length,foundN=specimens.filter(s=>s.found).length;
 ledger.innerHTML=`<div class="r82-ledger-head"><b>標本の行方 — 「見えない」と「化石になった」は別</b><span>化石形成 ${formed}/${specimens.length} ｜ 発掘 ${foundN}/${formed||0}</span></div><div class="r82-ledger-grid">${specimens.map(s=>{const st=specimenState(s);return `<div class="r82-spec ${st[0]}"><div class="top">${typeIcons[s.type]||'🦴'} #${s.id} ${typeNames[s.type]||s.type}</div><div class="state"><b>${st[1]}</b><br>${st[2]}</div></div>`}).join('')||'<div class="r82-spec"><div class="state">まず水底に生物・痕跡を置こう。</div></div>'}</div>`;
}
function updateComparison(){
 const keys=['fish','shell','leaf','bone','trace'],past={},fossil={},found={};keys.forEach(k=>past[k]=fossil[k]=found[k]=0);specimens.forEach(s=>{if(past[s.type]!=null)past[s.type]++;if(s.preserved&&s.status!=='lost'&&fossil[s.type]!=null)fossil[s.type]++;if(s.found&&found[s.type]!=null)found[s.type]++});
 const render=o=>keys.filter(k=>o[k]).map(k=>`<span>${typeIcons[k]} ${o[k]}</span>`).join(' ')||'<span>—</span>';
 document.getElementById('r81Past').innerHTML=render(past);document.getElementById('r82Fossil').innerHTML=render(fossil);document.getElementById('r81Found').innerHTML=render(found);
 const totalPast=Object.values(past).reduce((a,b)=>a+b,0),totalFossil=Object.values(fossil).reduce((a,b)=>a+b,0),totalFound=Object.values(found).reduce((a,b)=>a+b,0);document.getElementById('r81Question').textContent=totalFossil?`昔 ${totalPast} → 化石形成 ${totalFossil} → 発掘 ${totalFound}。地中に化石があっても、発見されるとは限らない。`:'深時間を進めると、どれが本当に化石になったか中央に表示される。';renderLedger();
}'''
rep(old, new, 'comparison')

old = '''function resetDirect(){
 running=false;directAge=0;sedimentMarks.length=0;flowFx.length=0;dustFx.length=0;for(let i=0;i<acted.length;i++)acted[i]=false;specimens=[];nextId=1;
 [[245,235,'fish'],[430,300,'shell'],[610,225,'leaf'],[735,350,'bone'],[365,430,'trace']].forEach(([x,y,t])=>{const s=createSpecimen(x,y,t);ensure(s);specimens.push(s)});
 foundCard.classList.remove('show');setPhase(0);draw();updateComparison();markAction('まず生物・痕跡を追加するか、配置を見て次へ進もう');acted[0]=false;
}'''
new = '''function resetDirect(){
 running=false;directAge=0;sedimentMarks.length=0;flowFx.length=0;dustFx.length=0;for(let i=0;i<acted.length;i++)acted[i]=false;specimens=[];nextId=1;
 [[245,'fish'],[430,'shell'],[610,'leaf'],[735,'bone'],[365,'trace']].forEach(([x,t],i)=>{const y=SURFACE_Y+((i%3)-1)*7,s=createSpecimen(x,y,t);ensure(s);s.surfaceY=y;specimens.push(s)});
 foundCard.classList.remove('show');setPhase(0);draw();updateComparison();markAction('標本はすべて水底の表面にある。左右の環境を見て、死後の運命を比べよう');acted[0]=false;
}'''
rep(old, new, 'reset')

rep("function advanceDeepTime(){\n const steps=[1e4,5e4,2e5,1e6,5e6];",
    "function advanceDeepTime(){\n const beforePreserved=new Set(specimens.filter(s=>s.preserved).map(s=>s.id));\n const steps=[1e4,5e4,2e5,1e6,5e6];", 'deep time start')
rep(" markAction(`⏳ ${formatAge(directAge)}：${specimens.filter(s=>s.preserved).length}個が地層中に保存`);draw();updateComparison();",
    " const newly=specimens.filter(s=>s.preserved&&!beforePreserved.has(s.id));markAction(newly.length?`✨ 化石形成！ ${newly.map(s=>typeIcons[s.type]+' '+(s.preservationMode||'化石')).join('、')}`:`⏳ ${formatAge(directAge)}：地層中の化石 ${specimens.filter(s=>s.preserved).length}個`);draw();updateComparison();", 'deep time result')

old = "if(s.burialDepth>0&&!s.found){const cover=clamp81(s.burialDepth/1.05,0,1);oc.save();oc.globalAlpha=.92*cover;oc.fillStyle='#765843';oc.beginPath();oc.ellipse(s.x,s.y,58+18*cover,32+22*cover,0,0,Math.PI*2);oc.fill();oc.restore()}"
new = "if(s.burialDepth>0&&!s.found){const cover=clamp81(s.burialDepth/1.05,0,1);oc.save();oc.globalAlpha=(xray?.34:.92)*cover;oc.fillStyle='#765843';oc.beginPath();oc.ellipse(s.x,SURFACE_Y+8,62+22*cover,22+18*cover,0,0,Math.PI*2);oc.fill();oc.restore();if(xray){oc.save();oc.setLineDash([6,5]);oc.strokeStyle=s.preserved?'#ffe266':'#9de7ff';oc.lineWidth=3;oc.beginPath();oc.arc(s.x,s.y,45,0,Math.PI*2);oc.stroke();oc.setLineDash([]);oc.font='bold 22px sans-serif';oc.textAlign='center';oc.fillStyle=s.preserved?'#ffe266':'#d8f5ff';oc.fillText(typeIcons[s.type]||'🦴',s.x,s.y+8);oc.font='bold 11px sans-serif';oc.fillText(s.preserved?`★ ${s.preservationMode||'化石'}`:`地中 ${Math.round(cover*100)}%`,s.x,s.y+61);oc.restore()}}"
rep(old, new, 'buried visibility')

p.write_text(s, encoding='utf-8')
print('patched fossil-formation.html')
