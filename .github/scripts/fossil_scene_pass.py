from pathlib import Path
import re
p=Path('fossil-formation.html')
s=p.read_text(encoding='utf-8')

def must_replace(old,new,label):
    global s
    if old not in s:
        raise SystemExit(f'missing anchor: {label}')
    s=s.replace(old,new,1)

def sub(pattern,repl,label,flags=0):
    global s
    s2,n=re.subn(pattern,repl,s,count=1,flags=flags)
    if n!=1:
        raise SystemExit(f'pattern {label}: {n}')
    s=s2

# CSS
must_replace('</style>\n<script id="r81-taphonomy-direct-script">','''</style>
<style id="r83-fossil-scene-style">
.r83-time{display:none;margin:8px 0 10px;padding:10px;border:1px solid #7b6a2b;border-radius:14px;background:linear-gradient(135deg,#211e10,#302915)}.r83-time.show{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center}.r83-time button{min-height:54px;background:#ffd75a;color:#211a00;border-color:#ffe486;font-size:14px}.r83-time .meta{display:grid;gap:5px}.r83-time .meta b{color:#ffe77d;font-size:12px}.r83-time .track{height:12px;border-radius:999px;background:#17212a;overflow:hidden}.r83-time .fill{height:100%;width:0;background:linear-gradient(90deg,#7fe4ff,#ffd75a);transition:width .25s}.r83-time .ticks{display:flex;justify-content:space-between;color:#aebfd0;font-size:9px}.r83-foundtray{margin:9px 0;padding:9px;border:1px solid #447763;border-radius:13px;background:#0d211b}.r83-foundtray b{color:#7ff0bd;font-size:12px}.r83-foundgrid{display:flex;gap:6px;overflow:auto;margin-top:6px}.r83-founditem{flex:0 0 auto;min-width:128px;border:1px solid #61cca0;border-radius:10px;padding:7px;background:#143128;font-size:10px;line-height:1.45;cursor:pointer}.r83-founditem strong{display:block;color:#eafff6;font-size:11px}.r82-spec{cursor:pointer}.r82-spec.focus{box-shadow:0 0 0 3px rgba(255,224,91,.35)}.r81-direct.phase-plan #geo{opacity:.08}.r81-direct.phase-section #geo{opacity:1}.r81-direct #geo{transition:opacity .2s}.r81-direct.phase-plan #r82Xray{opacity:.45;pointer-events:none}@media(max-width:640px){.r83-time.show{grid-template-columns:1fr}.r83-time button{width:100%}.r83-founditem{min-width:112px}}
</style>
<script id="r81-taphonomy-direct-script">''','r83 css')

# clearer phase names/guides
repls={
"{name:'① 生物・痕跡',icon:'🐟',guide:'魚・貝・葉・骨・足跡を選び、水底の表面に置く。上下位置ではなく左右の環境を選ぶ。',gesture:'👆 水底をタップして置く'}":"{name:'① 水底の生物',icon:'🐟',guide:'魚・貝・葉・骨・足跡を選び、水底の好きな場所へ置く。画面全体が水底の平面図。',gesture:'👆 水底をタップして置く'}",
"{name:'② 死後・運搬',icon:'🌊',guide:'水中をスワイプ。流れの向きに遺骸が運ばれ、壊れたり骨格がばらけたりする。',gesture:'☝→ スワイプで水流'}":"{name:'② 流される',icon:'🌊',guide:'水底をスワイプして流れを作る。遺骸が移動・摩耗し、足跡は消えることがある。',gesture:'☝→ スワイプで水流'}",
"{name:'③ 埋没',icon:'🟫',guide:'遺骸がある場所の水底をタップ／なぞる。新しい土砂が上に積もり、遺骸は地中へ沈む。透視表示で位置を追える。',gesture:'👆 水底に土砂を積もらせる'}":"{name:'③ 地層に埋まる',icon:'🟫',guide:'ここで断面図へ切り替わる。水底をタップ／なぞると新しい地層が積もり、標本が下へ埋まる。',gesture:'👆 水底に新しい地層を積む'}",
"{name:'④ 深時間',icon:'⏳',guide:'画面を長押しして時間を進める。地下水ツールなら、標本の近くをタップして鉱物を含む水をしみ込ませる。',gesture:'⏱ 長押しで時間を進める'}":"{name:'④ 地中で化石化',icon:'⏳',guide:'黄色い「時間を進める」を押す。各標本が「化石形成」または「消失」に分かれる。地下水も試せる。',gesture:'⏩ ボタンで時間を進める'}",
"{name:'⑤ 隆起・侵食',icon:'⛰',guide:'地層をこするようにスワイプ。埋まった化石へ近づくが、削りすぎると化石も傷む。',gesture:'☝↔ 表面をこすって削る'}":"{name:'⑤ 地層を削る',icon:'⛰',guide:'断面の表面をこする。化石へ近づくと金色に光るが、削りすぎると壊れる。',gesture:'☝↔ 表面をこすって削る'}",
"{name:'⑥ 発掘',icon:'🖌',guide:'粗掘りで土を大きく除き、化石が近づいたらブラシで慎重に露出させる。',gesture:'🖌 なぞって発掘'}":"{name:'⑥ 化石を発掘',icon:'🖌',guide:'番号の付いた化石を粗掘り／ブラシで露出する。発掘した番号は下の「発掘トレイ」に残る。',gesture:'🖌 番号を見ながら発掘'}"
}
for a,b in repls.items(): must_replace(a,b,'phase guide')

must_replace("let phase=0,tool='fish',pointer=null,holdTimer=null,holdInterval=null,holdStart=0,directAge=0,xray=true;\nconst SURFACE_Y=190;","let phase=0,tool='fish',pointer=null,holdTimer=null,holdInterval=null,holdStart=0,directAge=0,xray=true,focusSpecimenId=null,focusUntil=0;\nconst SURFACE_Y=175,DEPTH_SCALE=225;",'state')
must_replace("createdPhase:0});","createdPhase:0,planY:s.y});",'planY ensure')
must_replace("document.documentElement.dataset.r81Fossil='taphonomy-direct';","document.documentElement.dataset.r81Fossil='taphonomy-direct';document.documentElement.dataset.r83Fossil='plan-section-time-identity';",'marker')

# panels
must_replace("const foundCard=document.createElement('div');foundCard.id='r81FoundCard';foundCard.className='r81-found-card';compare.after(foundCard);","const foundCard=document.createElement('div');foundCard.id='r81FoundCard';foundCard.className='r81-found-card';compare.after(foundCard);\nconst timePanel=document.createElement('section');timePanel.className='r83-time';timePanel.innerHTML='<button id=\"r83Advance\" type=\"button\">⏩ 時間を進める</button><div class=\"meta\"><b id=\"r83Age\">0年 — まだ遺骸・痕跡</b><div class=\"track\"><div id=\"r83TimeFill\" class=\"fill\"></div></div><div class=\"ticks\"><span>現在</span><span>1万年</span><span>10万年</span><span>100万年+</span></div></div>';panel.after(timePanel);\nconst foundTray=document.createElement('section');foundTray.className='r83-foundtray';foundTray.innerHTML='<b>🧺 発掘トレイ</b><div id=\"r83FoundGrid\" class=\"r83-foundgrid\"><span style=\"font-size:10px;color:#9eb0c4\">まだ発掘していません。</span></div>';compare.after(foundTray);",'time/found panels')

must_replace("if(phase===3)return[['time','⏳ 深時間'],['groundwater','💧 地下水']];","if(phase===3)return[['groundwater','💧 地下水をしみ込ませる']];",'phase4 tool')
must_replace("function defaultTool(i){return['fish','flow','mud','time','erode','brush'][i]}","function defaultTool(i){return['fish','flow','mud','groundwater','erode','brush'][i]}",'phase4 default')

# guide/setPhase functions
sub(r"function updateGuide\(\)\{.*?\n\}",'''function updateGuide(){
 const p=phaseData[phase];guide.innerHTML=`<strong>${p.icon} ${p.guide}</strong><span>${p.gesture}</span>`;
 [...phasebar.children].forEach((b,i)=>b.classList.toggle('on',i===phase));
 nextBtn.textContent=phase<5?`次へ：${phaseData[phase+1].name}`:'↻ もう一度くらべる';
 const help=document.querySelector('.stage-help');if(help)help.innerHTML=`<b>${p.name}</b><br>${p.gesture}<br><small>${phase<=1?'今は水底を上から見ています':'今は地層の断面を見ています'}</small>`;
 document.body.classList.toggle('phase-plan',phase<=1);document.body.classList.toggle('phase-section',phase>=2);timePanel.classList.toggle('show',phase===3);
 viewMode.innerHTML=phase<=1?'🗺 <b>水底を上から見る</b>':phase===2?`🟫 <b>ここから地層断面</b> ${xray?'<span class="r82-xray-note">｜地中を透視</span>':''}`:`🪨 <b>地層断面</b> ${xray?'<span class="r82-xray-note">｜地中を透視</span>':''}`;
 status.textContent=phase===3?`④ 地中で化石化 ｜ ${formatAge(directAge)} ｜ 黄色いボタンで進める`:`${p.name} ｜ ${p.gesture}`;updateTimePanel();
}''','updateGuide',re.S)
sub(r"function setPhase\(i\)\{.*?\n\}",'''function setPhase(i){
 phase=clamp81(i,0,5);tool=defaultTool(phase);pointer=null;clearHold();
 if(phase>=2)specimens.forEach(s=>{ensure(s);if(s.planY==null)s.planY=s.y;if(s.surfaceY==null)s.surfaceY=SURFACE_Y;s.y=clamp81(SURFACE_Y+s.burialDepth*DEPTH_SCALE,SURFACE_Y,545)});
 renderTools();updateGuide();if(phase===3)running=false;if(phase===5)updateComparison();
}''','setPhase',re.S)

# time controls
must_replace("const xrayBtn=panel.querySelector('#r82Xray');xrayBtn.onclick=()=>{xray=!xray;xrayBtn.classList.toggle('on',xray);xrayBtn.textContent=xray?'👁 地中を透視：ON':'👁 地中を透視：OFF';updateGuide()};","const xrayBtn=panel.querySelector('#r82Xray');xrayBtn.onclick=()=>{xray=!xray;xrayBtn.classList.toggle('on',xray);xrayBtn.textContent=xray?'👁 地中を透視：ON':'👁 地中を透視：OFF';updateGuide()};\nfunction updateTimePanel(){const fossilN=specimens.filter(s=>s.preserved&&s.status!=='lost').length,lostN=specimens.filter(s=>s.status==='lost').length;const age=document.getElementById('r83Age'),fill=document.getElementById('r83TimeFill');if(age)age.textContent=`${formatAge(directAge)} — 化石 ${fossilN} / 消失 ${lostN} / 判定待ち ${Math.max(0,specimens.length-fossilN-lostN)}`;if(fill){const q=directAge<=0?0:Math.min(1,Math.log10(directAge+1)/6.5);fill.style.width=`${Math.round(q*100)}%`}}\ndocument.getElementById('r83Advance').onclick=()=>{advanceDeepTime();acted[3]=true;updateTimePanel()};",'time controls')

# placement and flow
sub(r"function addDirectSpecimen\(p\)\{.*?\n\}",'''function addDirectSpecimen(p){
 if(specimens.length>=24){markAction('最大24個です。次の段階へ進むか、最初からやり直そう。');return}
 const py=clamp81(p.y,145,555),s=createSpecimen(p.x,SURFACE_Y,tool);ensure(s);s.createdPhase=phase;s.surfaceY=SURFACE_Y;s.planY=py;specimens.push(s);markAction(`#${s.id} ${typeIcons[tool]} ${typeNames[tool]}を${positionName(p.x)}の水底に置いた`);draw();updateComparison();
}''','addDirectSpecimen',re.S)
must_replace("const d=segDist(s.x,s.y,a,b);if(d>125)return;const near=1-d/125,m=mobility[s.type]??.4,scale=near*m*.42;\n   if(s.type!=='trace'){s.x=clamp81(s.x+dx*scale,45,915);s.y=clamp81(s.y+dy*scale*.45,150,565);","const sy=s.planY??s.y,d=segDist(s.x,sy,a,b);if(d>125)return;const near=1-d/125,m=mobility[s.type]??.4,scale=near*m*.42;\n   if(s.type!=='trace'){s.x=clamp81(s.x+dx*scale,45,915);s.planY=clamp81(sy+dy*scale*.45,145,555);",'flow planY')
must_replace("s.y=clamp81((s.surfaceY||SURFACE_Y)+s.burialDepth*82,SURFACE_Y,330);","s.y=clamp81((s.surfaceY||SURFACE_Y)+s.burialDepth*DEPTH_SCALE,SURFACE_Y,545);",'depth scale')

# stage4 messages and no hold
must_replace("const newly=specimens.filter(s=>s.preserved&&!beforePreserved.has(s.id));markAction(newly.length?`✨ 化石形成！ ${newly.map(s=>typeIcons[s.type]+' '+(s.preservationMode||'化石')).join('、')}`:`⏳ ${formatAge(directAge)}：地層中の化石 ${specimens.filter(s=>s.preserved).length}個`);draw();updateComparison();","const newly=specimens.filter(s=>s.preserved&&!beforePreserved.has(s.id));if(newly.length){focusSpecimenId=newly[0].id;focusUntil=performance.now()+2600}markAction(newly.length?`✨ 化石形成！ ${newly.map(s=>'#'+s.id+' '+typeIcons[s.type]+' '+(s.preservationMode||'化石')).join('、')}`:`⏳ ${formatAge(directAge)}：新しい化石形成なし`);draw();updateComparison();updateTimePanel();",'deep time outcome')
must_replace("if(phase===2)depositAt(p);else if(phase===3){if(tool==='groundwater')groundwaterAt(p);else startHold()}","if(phase===2)depositAt(p);else if(phase===3&&tool==='groundwater')groundwaterAt(p)",'no hold pointer')
must_replace("else if(phase===3){oc.beginPath();oc.arc(500,310,48*pulse,0,Math.PI*2);oc.stroke();oc.fillText('⏱ このあたりを長押し',500,380)}","else if(phase===3){oc.fillText('⏩ 上の黄色い「時間を進める」を押す',500,115);oc.fillText('💧 地下水は化石の近くをタップ',500,145)}",'phase4 gesture')

# identity and trays
must_replace("foundCard.classList.add('show');foundCard.innerHTML=`<b>✨ 発掘成功：${typeIcons[s.type]} ${typeNames[s.type]}</b>","focusSpecimenId=s.id;focusUntil=performance.now()+3500;foundCard.classList.add('show');foundCard.innerHTML=`<b>✨ 発掘成功：#${s.id} ${typeIcons[s.type]} ${typeNames[s.type]}</b>",'found card id')
sub(r"function renderLedger\(\)\{.*?\n\}",'''function focusSpecimen(id){focusSpecimenId=+id;focusUntil=performance.now()+3000;ledger.querySelectorAll('.r82-spec').forEach(n=>n.classList.toggle('focus',+n.dataset.id===focusSpecimenId))}
function renderLedger(){
 const formed=specimens.filter(s=>s.preserved&&s.status!=='lost').length,foundN=specimens.filter(s=>s.found).length;
 ledger.innerHTML=`<div class="r82-ledger-head"><b>標本の行方 — 番号は画面と共通</b><span>化石形成 ${formed}/${specimens.length} ｜ 発掘 ${foundN}/${formed||0}</span></div><div class="r82-ledger-grid">${specimens.map(s=>{const st=specimenState(s);return `<div class="r82-spec ${st[0]}" data-id="${s.id}"><div class="top">#${s.id} ${typeIcons[s.type]||'🦴'} ${typeNames[s.type]||s.type}</div><div class="state"><b>${st[1]}</b><br>${st[2]}</div></div>`}).join('')||'<div class="r82-spec"><div class="state">まず水底に生物・痕跡を置こう。</div></div>'}</div>`;
 ledger.querySelectorAll('.r82-spec[data-id]').forEach(n=>n.onclick=()=>focusSpecimen(n.dataset.id));
 const fg=document.getElementById('r83FoundGrid'),foundList=specimens.filter(s=>s.found);if(fg){fg.innerHTML=foundList.length?foundList.map(s=>`<div class="r83-founditem" data-id="${s.id}"><strong>#${s.id} ${typeIcons[s.type]} ${typeNames[s.type]}</strong>${s.preservationMode||'化石'}<br>完整度 ${Math.round(s.integrity*100)}%</div>`).join(''):'<span style="font-size:10px;color:#9eb0c4">まだ発掘していません。</span>';fg.querySelectorAll('[data-id]').forEach(n=>n.onclick=()=>focusSpecimen(n.dataset.id))}
}''','renderLedger',re.S)

# reset spreads specimens over full top-down view
sub(r"\[\[245,235,'fish'\],\[430,300,'shell'\],\[610,225,'leaf'\],\[735,350,'bone'\],\[365,430,'trace'\]\]\.forEach\(\(\[x,y,t\]\)=>\{const s=createSpecimen\(x,y,t\);ensure\(s\);s\.surfaceY=Math\.min\(y,SURFACE_Y\);s\.y=s\.surfaceY;specimens\.push\(s\)\}\);","[[210,260,'fish'],[430,390,'shell'],[610,230,'leaf'],[760,410,'bone'],[355,500,'trace']].forEach(([x,py,t])=>{const s=createSpecimen(x,SURFACE_Y,t);ensure(s);s.surfaceY=SURFACE_Y;s.planY=py;specimens.push(s)});",'reset layout')

# plan-view renderer and overlay branch
must_replace("function drawOverlay(now){\n oc.clearRect(0,0,960,620);","""function drawPlanView(now){
 oc.fillStyle='#123d4d';oc.fillRect(0,0,960,620);const zones=[['静かな潟','#315e58'],['川の土砂','#6a5a3e'],['波のある浅瀬','#416674']];zones.forEach((z,i)=>{oc.globalAlpha=.72;oc.fillStyle=z[1];oc.fillRect(i*320,0,320,620);oc.globalAlpha=1;oc.fillStyle='rgba(4,18,25,.66)';oc.fillRect(i*320+10,16,300,40);oc.fillStyle='#fff';oc.font='900 16px sans-serif';oc.textAlign='center';oc.fillText(z[0],i*320+160,42)});oc.strokeStyle='rgba(255,255,255,.14)';oc.lineWidth=2;for(let y=85;y<620;y+=70){oc.beginPath();for(let x=0;x<=960;x+=30)oc.lineTo(x,y+Math.sin(x*.025+y)*4);oc.stroke()}
 specimens.forEach(s=>{ensure(s);const y=s.planY??300;oc.globalAlpha=s.status==='lost'?.28:1;oc.fillStyle='rgba(3,14,20,.72)';oc.beginPath();oc.arc(s.x,y,29,0,Math.PI*2);oc.fill();oc.font='24px sans-serif';oc.textAlign='center';oc.fillStyle='#fff';oc.fillText(typeIcons[s.type]||'🦴',s.x,y+8);oc.font='900 11px sans-serif';oc.fillStyle=s.status==='lost'?'#ff9a8c':'#fff6a8';oc.fillText(`#${s.id}`,s.x,y+43);if(focusSpecimenId===s.id&&now<focusUntil){oc.strokeStyle='#ffe25c';oc.lineWidth=5;oc.beginPath();oc.arc(s.x,y,39+5*Math.sin(now/120),0,Math.PI*2);oc.stroke()}oc.globalAlpha=1});flowFx.forEach(f=>{const age=now-f.t;if(age>f.life)return;const a=1-age/f.life;oc.save();oc.globalAlpha=a;drawArrow(oc,f.a,f.b,'#8eeaff');oc.restore()});
}
function drawOverlay(now){
 oc.clearRect(0,0,960,620);if(phase<=1){drawPlanView(now);drawGesture(now);requestAnimationFrame(drawOverlay);return}""",'plan renderer')
must_replace("oc.fillText(s.preserved?`★ ${s.preservationMode||'化石'}`:`地中 ${Math.round(cover*100)}%`,s.x,s.y+61);","oc.fillText(s.preserved?`#${s.id} ★ ${s.preservationMode||'化石'}`:`#${s.id} 地中 ${Math.round(cover*100)}%`,s.x,s.y+61);",'xray id')
must_replace("oc.fillText('発掘済み ✓',s.x,s.y+68);oc.restore()}","oc.fillText(`#${s.id} 発掘済み ✓`,s.x,s.y+68);oc.restore()}\n   if(focusSpecimenId===s.id&&now<focusUntil){oc.save();oc.strokeStyle='#ffe25c';oc.lineWidth=6;oc.beginPath();oc.arc(s.x,s.y,66+7*Math.sin(now/110),0,Math.PI*2);oc.stroke();oc.restore()}",'found marker')
sub(r"\n if\(phase===3&&tool==='time'&&holdStart\)\{.*?\}\n drawGesture",'\n drawGesture','old hold ring',re.S)

# metrics
sub(r"const baseUpdateMetrics=updateMetrics;updateMetrics=function\(\)\{.*?\};","const baseUpdateMetrics=updateMetrics;updateMetrics=function(){baseUpdateMetrics();const preserved=specimens.filter(s=>s.preserved&&s.status!=='lost').length,found=specimens.filter(s=>s.found).length;geoLabel.textContent=phase<=1?`水底の標本 ${specimens.filter(s=>s.status!=='lost').length} ｜ 消失 ${specimens.filter(s=>s.status==='lost').length}`:`化石形成 ${preserved} ｜ 発掘済み ${found} ｜ ${formatAge(directAge)}`;updateTimePanel();};",'metrics',re.S)

p.write_text(s,encoding='utf-8')
print('patched fossil scene redesign')
