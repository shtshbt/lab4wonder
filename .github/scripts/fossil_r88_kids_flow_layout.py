from pathlib import Path
import re

p=Path('fossil-formation.html')
s=p.read_text(encoding='utf-8')

def rep(old,new,label):
    global s
    if old not in s:
        raise SystemExit(f'missing {label}')
    s=s.replace(old,new,1)

def sub(pattern,repl,label):
    global s
    s2,n=re.subn(pattern,repl,s,count=1,flags=re.S)
    if n!=1:
        raise SystemExit(f'{label}: {n}')
    s=s2

# Child-readable framing.
rep("document.documentElement.dataset.r87Fossil='star-rarity-weighted-duplicates';",
    "document.documentElement.dataset.r87Fossil='star-rarity-weighted-duplicates';document.documentElement.dataset.r88Fossil='kid-readable-strong-flow-clean-layout';",
    'r88 marker')
rep("if(sub)sub.textContent='この遺骸は100万年後まで残る？ 水底から埋没・化石化・露出・発掘までを追う化石サバイバル実験。';",
    "if(sub)sub.textContent='さいごまで のこったら、★ 化石！ 流す・埋める・時間を進める・削る・掘る。';",
    'subtitle')
rep("{name:'② 流される',icon:'🌊',guide:'水底をスワイプして流れを作る。遺骸が移動・摩耗し、足跡は消えることがある。',gesture:'☝→ スワイプで水流'},",
    "{name:'② 水でながす',icon:'🌊',guide:'水底を大きくスワイプ。葉や魚は大きく、貝や骨は少し動く。足跡は消えることもある。',gesture:'☝→ 大きくスワイプ'},",
    'phase 2')
rep("{name:'④ 生き残るか？',icon:'⏳',guide:'黄色い「次の関門へ」を押す。腐敗・散逸・圧密・続成作用を1つずつ通過し、最後まで残れば化石になる。',gesture:'⏩ 1関門ずつ運命を見る'},",
    "{name:'④ のこる？',icon:'⏳',guide:'「時間をすすめる」を押すたび、○ のこった / × きえた がわかる。さいごまで残ったら ★ 化石！',gesture:'⏩ 時間をすすめる'},",
    'phase 4')
rep("const fateGates=[{age:0,label:'開始',risk:'まだ遺骸・痕跡'},{age:1/365,label:'1日',risk:'腐敗・掃除屋'},{age:1,label:'1年',risk:'散逸・埋没'},{age:1e4,label:'1万年',risk:'圧密・変形'},{age:1e5,label:'10万年',risk:'続成作用'},{age:1e6,label:'100万年',risk:'化石記録へ'}];",
    "const fateGates=[{age:0,label:'いま',risk:'まだそのまま'},{age:1/365,label:'1日後',risk:'くさらず のこれる？'},{age:1,label:'1年後',risk:'流されず のこれる？'},{age:1e4,label:'1万年後',risk:'つぶれず のこれる？'},{age:1e5,label:'10万年後',risk:'地中で のこれる？'},{age:1e6,label:'100万年後',risk:'★ 化石になれる？'}];",
    'fate gates')
rep("const mobility={fish:.72,shell:.28,leaf:1.08,bone:.38,trace:0};",
    "const mobility={fish:.95,shell:.45,leaf:1.35,bone:.55,trace:0};",
    'mobility')

# Header / time panel wording.
rep("panel.innerHTML=`<div class=\"r81-head\"><div><b>🦴 化石サバイバル実験</b><span>この遺骸は100万年後まで残る？</span></div><div><button id=\"r82Xray\" class=\"r82-xray on\" type=\"button\">👁 地中を透視：ON</button><button id=\"r81Reset\" type=\"button\">↻ 最初から</button></div></div><div id=\"r81-phasebar\" class=\"r81-phasebar\"></div><div class=\"r81-action\"><div id=\"r81Guide\" class=\"r81-guide\"></div><div id=\"r81Tools\" class=\"r81-tools\"></div><button id=\"r81Next\" class=\"primary\" type=\"button\"></button></div>`;",
    "panel.innerHTML=`<div class=\"r81-head\"><div><b>🦴 化石になれるかな？</b><span>さいごまで のこったら ★化石！</span></div><div><button id=\"r82Xray\" class=\"r82-xray on\" type=\"button\">👁 地中を透視：ON</button><button id=\"r81Reset\" type=\"button\">↻ 最初から</button></div></div><div id=\"r81-phasebar\" class=\"r81-phasebar\"></div><div class=\"r81-action\"><div id=\"r81Guide\" class=\"r81-guide\"></div><div id=\"r81Tools\" class=\"r81-tools\"></div><button id=\"r81Next\" class=\"primary\" type=\"button\"></button></div>`;",
    'panel header')
rep("const status=document.createElement('div');status.id='r81Status';status.className='r81-status';stage.appendChild(status);",
    "const status=document.createElement('div');status.id='r81Status';status.className='r81-status';panel.appendChild(status);",
    'status outside canvas')
rep("const timePanel=document.createElement('section');timePanel.className='r83-time';timePanel.innerHTML='<button id=\"r83Advance\" type=\"button\">⏩ 次の関門へ</button><div class=\"meta\"><b id=\"r83Age\">まだ判定前</b><div class=\"track\"><div id=\"r83TimeFill\" class=\"fill\"></div></div><div class=\"ticks\"><span>遺骸</span><span>埋没</span><span>圧密</span><span>続成</span><span>化石</span></div><div id=\"r84Gate\" class=\"r84-gate\">次の関門：腐敗・掃除屋</div><div id=\"r84Fates\" class=\"r84-fates\"></div></div>';panel.after(timePanel);",
    "const timePanel=document.createElement('section');timePanel.className='r83-time';timePanel.innerHTML='<button id=\"r83Advance\" type=\"button\">⏩ 時間をすすめる</button><div class=\"meta\"><b id=\"r83Age\">○ のこってる 0　× きえた 0　★ 化石 0</b><div class=\"track\"><div id=\"r83TimeFill\" class=\"fill\"></div></div><div class=\"ticks\"><span>いま</span><span>1日</span><span>1年</span><span>1万年</span><span>10万年</span><span>100万年</span></div><div id=\"r84Gate\" class=\"r84-gate\">つぎ：1日後　くさらず のこれる？</div><div id=\"r84Fates\" class=\"r84-fates\"></div></div>';panel.after(timePanel);",
    'time panel')

# Guide: all explanatory text lives outside the canvas.
sub(r"function updateGuide\(\)\{.*?\n\}", '''function updateGuide(){
 const p=phaseData[phase],view=phase<=1?'🗺 水底を上から見る':'🪨 地層の断面を見る';guide.innerHTML=`<strong>${p.icon} ${p.guide}</strong><span>${p.gesture}</span><small class="r88-viewbadge">${view}</small>`;
 [...phasebar.children].forEach((b,i)=>b.classList.toggle('on',i===phase));
 nextBtn.textContent=phase<5?`次へ：${phaseData[phase+1].name}`:'↻ もう一度くらべる';
 document.body.classList.toggle('phase-plan',phase<=1);document.body.classList.toggle('phase-section',phase>=2);timePanel.classList.toggle('show',phase===3);
 viewMode.textContent='';
 status.textContent=phase===3?`④ のこる？ ｜ ${formatAge(directAge)} ｜ ○ / × / ★ を見よう`:`${p.name} ｜ ${p.gesture}`;updateTimePanel();
}''','updateGuide')

# Child-readable fate panel.
sub(r"function updateTimePanel\(\)\{.*?\n\}", '''function updateTimePanel(){
 const fossilN=specimens.filter(s=>s.preserved&&s.status!=='lost').length,lostN=specimens.filter(s=>s.status==='lost').length,liveN=Math.max(0,specimens.length-lostN-fossilN),age=document.getElementById('r83Age'),fill=document.getElementById('r83TimeFill'),gate=document.getElementById('r84Gate'),fates=document.getElementById('r84Fates'),btn=document.getElementById('r83Advance');
 if(age)age.textContent=`${fateStep?fateGates[fateStep].label+'　':''}○ のこってる ${liveN}　× きえた ${lostN}　★ 化石 ${fossilN}`;if(fill)fill.style.width=`${Math.round(fateStep/(fateGates.length-1)*100)}%`;
 if(gate)gate.textContent=fateStep>=fateGates.length-1?'★ おしまい：どれが化石になった？':`つぎ：${fateGates[fateStep+1].label}　${fateGates[fateStep+1].risk}`;
 if(btn)btn.textContent=fateStep>=fateGates.length-1?'✓ おしまい':'⏩ 時間をすすめる';
 if(fates)fates.innerHTML=specimens.map(s=>{ensure(s);const cls=s.preserved?'fossil':s.status==='lost'?'lost':s.fateState==='close'?'close':'wait',txt=s.preserved?'★ 化石！':s.status==='lost'?'× きえた':s.fateState==='close'?'△ あぶない！':s.fateState==='survive'?'○ のこった！':'? まだ';return `<div class="r84-fate ${cls}"><b>#${s.id} ${typeIcons[s.type]||'🦴'}</b><span class="mini">${txt}</span></div>`}).join('');
}''','updateTimePanel')

# One swipe = one clear current pulse, with broad influence and visible displacement trails.
sub(r"function applyFlow\(a,b\)\{.*?\n\}", '''function applyFlow(a,b){
 const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy);if(len<10)return;addFx(flowFx,{a:{...a},b:{...b},life:1500},60);let moved=[];
 specimens.forEach(s=>{ensure(s);if(s.status==='lost'||s.burialDepth>.28)return;const sy=s.planY??s.y,d=segDist(s.x,sy,a,b);if(d>210)return;const near=1-d/210,m=mobility[s.type]??.4,scale=near*m*.88;
   const old={x:s.x,y:sy};if(s.type!=='trace'){let mx=dx*scale,my=dy*scale*.65,maxShift=s.type==='leaf'?260:s.type==='fish'?190:s.type==='bone'?110:85,mag=Math.hypot(mx,my);if(mag>maxShift){mx*=maxShift/mag;my*=maxShift/mag}s.x=clamp81(s.x+mx,45,915);s.planY=clamp81(sy+my,145,555);const shift=Math.hypot(s.x-old.x,s.planY-old.y);s.transport+=shift;s.abrasion=clamp81(s.abrasion+shift/800,0,1);if(shift>3){moved.push({id:s.id,shift:Math.round(shift)});addFx(flowFx,{a:old,b:{x:s.x,y:s.planY},carried:true,life:1700},80)}}
   const frag=(s.type==='leaf'?.0012:s.type==='fish'?.0006:s.type==='bone'?.00018:.00012)*len*near;s.integrity=clamp81(s.integrity-frag,0,1);if(s.type==='fish'||s.type==='bone')s.articulation=clamp81(s.articulation-len*near*(s.type==='fish'?.0007:.00025),0,1);s.organic=clamp81(s.organic-len*near*(s.type==='leaf'?.0004:.0002),0,1);if(s.type==='trace')s.integrity=clamp81(s.integrity-len*near*.0022,0,1);if(s.integrity<.16){s.status='lost';s.reason=s.type==='trace'?'水流で痕跡が消えた':'運搬・摩耗で壊れた'}
 });
 markAction(moved.length?`🌊 ${moved.slice(0,4).map(x=>'#'+x.id+' が '+x.shift+' 動いた').join(' ｜ ')}${moved.length>4?' ほか':''}`:'🌊 水流はできた。標本の近くを大きくスワイプしてみよう');draw();updateComparison();
}''','applyFlow')

# Fate messages and state labels.
rep("s.fateNote='× '+s.reason;lost.push(s)","s.fateNote='× きえた';lost.push(s)",'lost fate note')
rep("s.fateNote='★ '+s.preservationMode;survived.push(s)","s.fateNote='★ 化石！';survived.push(s)",'fossil fate note')
rep("s.fateNote=margin<.13?'⚠ 危ない…まだ残った':'● 関門を通過';(margin<.13?close:survived).push(s)","s.fateNote=margin<.13?'△ あぶない！':'○ のこった！';(margin<.13?close:survived).push(s)",'survive fate note')
rep("if(fateStep===fateGates.length-1){showBurst(formed?`✨ ${formed}個が化石になった！`:'今回は化石が残らなかった…');markAction(formed?`✨ 100万年後：${specimens.filter(s=>s.preserved).map(s=>'#'+s.id+' '+typeIcons[s.type]).join('・')} が化石になった！`:'100万年後まで残った標本はなかった。条件を変えて再挑戦できる')}\n else {showBurst(`${gate.label}：${gate.risk} を通過できる？`);markAction(`⏳ ${gate.label}｜残った ${live}｜消失 ${lost.length}${close.length?'｜危ない '+close.map(s=>'#'+s.id).join('・'):''}`)}",
    "if(fateStep===fateGates.length-1){showBurst(formed?`✨ ★ 化石！ ${formed}こ のこった！`:'今回は のこらなかった…');markAction(formed?`✨ 100万年後：${specimens.filter(s=>s.preserved).map(s=>'#'+s.id+' '+typeIcons[s.type]).join('・')} が ★化石！`:'100万年後まで残らなかった。埋め方を変えてもう一度できる')}\n else {showBurst(`${gate.label}　○ ${live}こ のこった　× ${lost.length}こ きえた`);markAction(`⏳ ${gate.label}｜○ のこった ${live}｜× きえた ${lost.length}${close.length?'｜△ '+close.map(s=>'#'+s.id).join('・'):''}`)}",
    'fate feedback')

# Apply water once per completed swipe rather than tiny pointer-move increments.
rep("if(phase===1&&d>3)applyFlow(pointer.last,p);else if(phase===2&&d>18)depositAt(p);else if(phase===4&&d>4)erodeSegment(pointer.last,p,.075);else if(phase===5&&d>3)digSegment(pointer.last,p);",
    "if(phase===2&&d>18)depositAt(p);else if(phase===4&&d>4)erodeSegment(pointer.last,p,.075);else if(phase===5&&d>3)digSegment(pointer.last,p);",
    'pointer move flow')
rep("if(!pointer)return;const p=point(e);if(phase===0&&!pointer.moved)addDirectSpecimen(p);else if(phase===1&&!pointer.moved){applyFlow({x:p.x-70,y:p.y},{x:p.x+70,y:p.y});}else if(phase===4&&!pointer.moved){erodeSegment({x:p.x-35,y:p.y},{x:p.x+35,y:p.y},.055)}else if(phase===5&&!pointer.moved){digSegment({x:p.x-22,y:p.y},{x:p.x+22,y:p.y})}",
    "if(!pointer)return;const p=point(e);if(phase===0&&!pointer.moved)addDirectSpecimen(p);else if(phase===1){pointer.moved?applyFlow(pointer.start,p):applyFlow({x:p.x-85,y:p.y},{x:p.x+85,y:p.y});}else if(phase===4&&!pointer.moved){erodeSegment({x:p.x-35,y:p.y},{x:p.x+35,y:p.y},.055)}else if(phase===5&&!pointer.moved){digSegment({x:p.x-22,y:p.y},{x:p.x+22,y:p.y})}",
    'pointer up flow')

# Short, non-overlapping gesture text.
rep("else if(phase===1){drawArrow(oc,{x:260,y:270},{x:690,y:270},'#7fe5ff');oc.fillText('☝ 指で水流を描く',475,235)}",
    "else if(phase===1){drawArrow(oc,{x:260,y:300},{x:690,y:300},'#7fe5ff');oc.fillText('🌊 大きくスワイプ',475,255)}",
    'flow gesture')
rep("else if(phase===2){for(let i=0;i<5;i++){oc.beginPath();oc.arc(450+i*24,300+(i%2)*12,11*pulse,0,Math.PI*2);oc.stroke()}oc.fillText('👆 上から地層を積む（標本は動かない）',510,255)}",
    "else if(phase===2){for(let i=0;i<5;i++){oc.beginPath();oc.arc(450+i*24,300+(i%2)*12,11*pulse,0,Math.PI*2);oc.stroke()}oc.fillText('🟫 土をかぶせる',510,255)}",
    'deposit gesture')
rep("else if(phase===3){oc.fillText('⏩ 黄色いボタンで1関門ずつ進む',500,115);oc.fillText('💧 地下水は化石の近くをタップ',500,145)}",
    "else if(phase===3){oc.fillText('○ のこる？　× きえる？　★ 化石？',500,118)}",
    'fate gesture')
rep("else if(phase===4){drawArrow(oc,{x:720,y:190},{x:300,y:190},'#ffd772');oc.fillText('☝ 地表線をこすって下げる',510,235)}",
    "else if(phase===4){drawArrow(oc,{x:720,y:190},{x:300,y:190},'#ffd772');oc.fillText('☝ 地表をこする',510,235)}",
    'erosion gesture')
rep("else{drawArrow(oc,{x:390,y:330},{x:610,y:300},'#dff7ff');oc.fillText('🖌 土を削って化石を露出する',500,270)}oc.restore();",
    "else{drawArrow(oc,{x:390,y:330},{x:610,y:300},'#dff7ff');oc.fillText('🖌 土をけずる',500,270)}oc.restore();",
    'dig gesture')

# Movement trails and compact specimen labels on canvas.
rep("flowFx.forEach(f=>{const age=now-f.t;if(age>f.life)return;const a=1-age/f.life;oc.save();oc.globalAlpha=a;drawArrow(oc,f.a,f.b,'#8eeaff');oc.restore()});",
    "flowFx.forEach(f=>{const age=now-f.t;if(age>f.life)return;const a=1-age/f.life;oc.save();oc.globalAlpha=a;drawArrow(oc,f.a,f.b,f.carried?'#fff0a3':'#8eeaff');oc.restore()});",
    'plan flow colors')
rep("oc.fillText(`#${s.id} 取り出した跡`,s.x,s.stratumY+38);",
    "oc.fillText(`#${s.id} ✓`,s.x,s.stratumY+38);",
    'found canvas label')
rep("const tag=s.preserved?'★ 化石':s.status==='lost'?'× 消失':over>8?`${Math.round(over)}px 覆われた`:'水底';oc.fillText(`#${s.id} ${tag}`,s.x,s.stratumY+35);",
    "const tag=s.preserved?'★':s.status==='lost'?'×':over>8?'↓':'○';oc.fillText(`#${s.id}${tag}`,s.x,s.stratumY+35);",
    'compact canvas tag')

# Comparison prompt no longer uses the abstract phrase 'deep time'.
rep("'深時間を進めると、どれが本当に化石になったか中央に表示される。'",
    "'④で「時間をすすめる」を押すと、○ のこる / × きえる / ★ 化石 がわかる。'",
    'comparison wording')

# Clean layout: keep explanatory text out of the canvas, make fate cards wrap.
css='''\n<style id="r88-fossil-kids-flow-layout-style">\n.r81-direct .stage-help,.r81-direct #geoLabel,.r81-direct .r82-viewmode,.r81-direct .r84-section-label{display:none!important}\n.r81-panel #r81Status{position:static!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;max-width:none!important;margin-top:8px;padding:7px 9px;border-radius:10px!important;background:#0c1b28!important;border:1px solid #46647b!important;color:#eaf6ff!important;font-size:11px!important;line-height:1.45;font-weight:850}\n.r88-viewbadge{display:inline-flex;width:max-content;margin-top:2px;padding:3px 7px;border:1px solid #486b82;border-radius:999px;background:#102637;color:#cfeeff;font-size:9px;font-weight:900}\n.r81-head{flex-wrap:wrap}.r81-head>div:last-child{margin-left:auto}.r81-phasebar button{white-space:normal;overflow-wrap:anywhere}\n.r83-time .ticks{gap:2px}.r83-time .ticks span{min-width:0;text-align:center;flex:1}.r84-fates{display:flex;flex-wrap:wrap;overflow:visible}.r84-fate{flex:1 1 105px;min-width:92px;max-width:160px}.r84-fate .mini{font-size:11px;font-weight:900;color:inherit}\n.r86-atlas-route span,.r81-found-card span{overflow-wrap:anywhere}.r81-found-card{line-height:1.5}\n@media(max-width:560px){.r81-head>div{width:100%}.r81-head>div:last-child{margin-left:0}.r81-head button{flex:1}.r83-time .ticks{font-size:8px}.r84-fate{flex-basis:88px;min-width:82px}.r81-guide strong{font-size:11px;line-height:1.45}}\n</style>\n'''
marker='<style id="r81-taphonomy-direct-style">'
if marker not in s: raise SystemExit('missing css marker')
s=s.replace(marker,css+marker,1)

p.write_text(s,encoding='utf-8')
print('patched fossil r88 kids/flow/layout')
