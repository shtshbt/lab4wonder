from pathlib import Path

p=Path('ant-colony.html')
s=p.read_text(encoding='utf-8')
if 'r84-ant-queen-brood-cycle' in s:
    raise SystemExit('already patched')

old='実際のアリでは齢、体サイズ、温度、病原体、女王、種ごとの巣構造などが役割分担へ影響します。巣内酸素とフェロモンは簡略化しています。'
new='実際のアリでは齢、体サイズ、温度、病原体、種ごとの巣構造などが役割分担へ影響します。この模型は女王1匹のコロニーを扱いますが、種によっては複数の女王がいます。巣内酸素とフェロモンは簡略化しています。'
if old not in s:
    raise SystemExit('guide omission anchor missing')
s=s.replace(old,new,1)

meta='<meta name="r84-ant-queen-brood-cycle" content="queen-eggs-larvae-pupae-worker-recruitment-resource-coupling">'
s=s.replace('</head>',meta+'</head>',1)

addon=r'''
<style id="r84-ant-queen-brood-style">
.r84-brood-card{margin:9px 0 0;padding:10px 11px;border:1px solid #e6b85f88;border-radius:13px;background:linear-gradient(145deg,#171d2b,#241d20);display:grid;gap:8px}.r84-brood-head{display:flex;gap:9px;align-items:flex-start;justify-content:space-between}.r84-brood-head b{color:#ffd85a;font-size:14px}.r84-brood-head span{font-size:10px;color:#c9bfae;line-height:1.5}.r84-cycle{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px}.r84-stage{padding:7px 5px;border:1px solid #604d42;border-radius:10px;background:#0c1723;text-align:center;min-width:0}.r84-stage strong{display:block;font-size:17px;color:#ffe4a3}.r84-stage span{display:block;font-size:9px;color:#c9d4df;margin-top:2px}.r84-brood-status{padding:7px 9px;border-radius:9px;background:#0b1624;font-size:11px;line-height:1.55;color:#dce8f3}.r84-queen-info{display:none;padding:8px 10px;border-radius:10px;border:1px solid #ffd85a99;background:#211a16;font-size:11px;line-height:1.6}.r84-queen-info.show{display:block}.r84-new-worker{animation:r84pop .8s ease-out}@keyframes r84pop{0%{box-shadow:0 0 0 0 #ffd85aaa}100%{box-shadow:0 0 0 18px #ffd85a00}}@media(max-width:520px){.r84-cycle{grid-template-columns:repeat(3,1fr)}.r84-brood-head{display:block}.r84-brood-head span{display:block;margin-top:4px}}
</style>
<script id="r84-ant-queen-brood-cycle">
(()=>{
if(document.documentElement.dataset.r84AntQueen)return;
const canvas=document.getElementById('mainCv'),stage=canvas&&canvas.closest('.stage'),countEl=document.getElementById('count');
if(!canvas||!stage||!countEl||typeof step!=='function'||typeof draw!=='function'||typeof reset!=='function'||typeof ants==='undefined'||typeof rooms==='undefined')return;
document.documentElement.dataset.r84AntQueen='queen-brood-worker-cycle';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const brood={eggs:[],larvae:[],pupae:[],laid:0,recruits:0,layCarry:0,queenPulse:0,lastEvent:'👑 女王が卵を産み、働きアリが子育てします。'};
function seedAges(n,max){return Array.from({length:n},(_,i)=>({age:max*(i+.35)/(n+.35)}))}
function resetBrood(){brood.eggs=seedAges(6,14);brood.larvae=seedAges(5,28);brood.pupae=seedAges(3,22);brood.laid=0;brood.recruits=0;brood.layCarry=0;brood.queenPulse=0;brood.lastEvent='👑 女王が卵を産み、働きアリが子育てします。'}
function broodRoom(){return rooms[0]||{x:360,y:335,r:34}}
function queenPos(){const r=broodRoom();return{x:r.x,y:r.y+2}}
function nurseRatio(){return ants.filter(a=>a.state==='nurse').length/Math.max(1,ants.length)}
function addWorker(){
 const max=Number(countEl.max)||120,current=Number(countEl.value)||ants.length;if(current>=max)return false;
 countEl.value=String(current+1);countEl.dispatchEvent(new Event('input',{bubbles:true}));
 const q=queenPos();ants.push({x:q.x+(Math.random()-.5)*10,y:q.y+(Math.random()-.5)*8,state:'nurse',carry:0,target:null,a:Math.random()*6.28,r84born:true});brood.recruits++;brood.lastEvent='🐜 新しい働きアリが羽化！ 子育てから仕事に加わりました。';
 const card=document.getElementById('r84BroodCard');if(card){card.classList.remove('r84-new-worker');void card.offsetWidth;card.classList.add('r84-new-worker')}
 if(typeof r67Toast==='function')try{r67Toast(canvas,'🐜 新しい働きアリが生まれた！')}catch(_){}
 return true;
}
function advanceBrood(dt){
 dt=Math.max(0,Math.min(4,Number(dt)||0));if(!dt)return;const p=par(),nurse=nurseRatio(),food=clamp((store-7)/42,0,1),care=clamp(.28+nurse*2.0+health*.42+food*.18,.25,1.2);
 const larvalNeed=dt*brood.larvae.length*(.004+.008*p.brood);store=Math.max(0,store-larvalNeed-dt*.012);
 const layRate=.08+.14*food*health+Math.min(.06,nurse*.18);brood.layCarry+=dt*layRate;
 while(brood.layCarry>=1&&brood.eggs.length+brood.larvae.length+brood.pupae.length<38){brood.layCarry-=1;brood.eggs.push({age:0});brood.laid++;brood.queenPulse=performance.now()+900;brood.lastEvent='🥚 女王が卵を産みました。'}
 for(const e of brood.eggs)e.age+=dt*(.75+.25*health);for(const l of brood.larvae)l.age+=dt*care;for(const u of brood.pupae)u.age+=dt*(.8+.2*health);
 for(let i=brood.eggs.length-1;i>=0;i--)if(brood.eggs[i].age>=14){brood.eggs.splice(i,1);brood.larvae.push({age:0});brood.lastEvent='🐛 卵から幼虫になりました。'}
 if(store<5&&brood.larvae.length&&Math.random()<dt*.035){brood.larvae.pop();brood.lastEvent='⚠️ 食料不足で幼虫を1匹育てられませんでした。';health=Math.max(0,health-.012)}
 for(let i=brood.larvae.length-1;i>=0;i--)if(brood.larvae[i].age>=28){brood.larvae.splice(i,1);brood.pupae.push({age:0});brood.lastEvent='🟤 幼虫が蛹になりました。'}
 for(let i=brood.pupae.length-1;i>=0;i--)if(brood.pupae[i].age>=22){brood.pupae.splice(i,1);if(!addWorker())brood.lastEvent='🟤 羽化待ち：働きアリ数が上限です。'}
}
const host=document.querySelector('.r83-ant-inspector')||stage;
const card=document.createElement('section');card.id='r84BroodCard';card.className='r84-brood-card';card.innerHTML=`<div class="r84-brood-head"><div><b>👑 女王と子ども</b><span>女王 → 卵 → 幼虫 → 蛹 → 働きアリ</span></div><span>この模型は女王1匹。種によって複数女王もいます。</span></div><div class="r84-cycle"><div class="r84-stage"><strong>👑 1</strong><span>女王</span></div><div class="r84-stage"><strong id="r84Eggs">🥚 0</strong><span>卵</span></div><div class="r84-stage"><strong id="r84Larvae">🐛 0</strong><span>幼虫</span></div><div class="r84-stage"><strong id="r84Pupae">🟤 0</strong><span>蛹</span></div><div class="r84-stage"><strong id="r84Workers">🐜 +0</strong><span>生まれた働きアリ</span></div></div><div id="r84BroodStatus" class="r84-brood-status"></div><div id="r84QueenInfo" class="r84-queen-info"><b>👑 女王アリ</b><br>卵を産むコロニーの母。食料と育児アリが足りると、子どもが育って新しい働きアリになります。</div>`;
host.insertAdjacentElement('afterend',card);
const label=countEl.closest('label');if(label&&label.firstChild&&label.firstChild.nodeType===3)label.firstChild.textContent='働きアリ数（現在） ';
const sub=document.querySelector('.hdr .sub');if(sub)sub.textContent='女王が卵を産み、卵→幼虫→蛹→働きアリへ育つ一方、採餌・掘削・育児・換気へ働きアリが分かれるコロニーを追う。';
const learn=[...document.querySelectorAll('.learn p')];if(learn[0])learn[0].textContent='女王と子どもの成長、働きアリの役割分担、食料と巣づくりを一つのコロニーとして追う。';if(learn[1])learn[1].textContent='地下の女王・育児室で卵→幼虫→蛹→働きアリへ育つ流れと、地表の採餌・地下の仕事を見る。';
function updateCard(){
 const e=document.getElementById('r84Eggs'),l=document.getElementById('r84Larvae'),u=document.getElementById('r84Pupae'),w=document.getElementById('r84Workers'),st=document.getElementById('r84BroodStatus');if(e)e.textContent='🥚 '+brood.eggs.length;if(l)l.textContent='🐛 '+brood.larvae.length;if(u)u.textContent='🟤 '+brood.pupae.length;if(w)w.textContent='🐜 +'+brood.recruits;
 if(st){const nr=Math.round(nurseRatio()*100),food=store<10?'食料が少ない':store<25?'食料に注意':'食料は十分',care=nr<12?'育児アリが少ない':nr<22?'育児アリはまずまず':'育児アリは十分';st.textContent=`${brood.lastEvent}　｜　${food} ／ ${care}（${nr}%）`}
}
function drawBrood(){
 const q=queenPos(),r=broodRoom();c.save();c.globalAlpha=.96;c.strokeStyle='#d4aa62';c.lineWidth=2.5;c.setLineDash([5,4]);c.beginPath();c.ellipse(r.x,r.y,r.r*1.08,r.r*.9,0,0,Math.PI*2);c.stroke();c.setLineDash([]);c.fillStyle='#ffe7a5';c.font='bold 11px system-ui';c.textAlign='center';c.fillText('👑 女王・育児室',r.x,r.y-r.r*.92-8);
 const pulse=performance.now()<brood.queenPulse?1.22:1;c.save();c.translate(q.x,q.y);c.scale(pulse,pulse);c.strokeStyle='#24130f';c.lineWidth=1.4;for(const side of [-1,1])for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(i*4,side*4);c.lineTo(i*7,side*11);c.stroke()}c.fillStyle='#9c4435';c.beginPath();c.ellipse(-11,0,10,7,0,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(0,0,6,5,0,0,Math.PI*2);c.fill();c.beginPath();c.arc(9,0,5,0,Math.PI*2);c.fill();c.restore();c.font='17px system-ui';c.fillText('👑',q.x,q.y-15);
 const drawMany=(n,kind)=>{const m=Math.min(n,12);for(let i=0;i<m;i++){const a=i*2.399,x=r.x+Math.cos(a)*(20+(i%3)*7),y=r.y+Math.sin(a)*(13+(i%3)*5)+8;if(kind==='egg'){c.fillStyle='#fff5dc';c.beginPath();c.ellipse(x,y,2.5,4,Math.cos(a),0,Math.PI*2);c.fill()}else if(kind==='larva'){c.strokeStyle='#e9e0bf';c.lineWidth=3.2;c.lineCap='round';c.beginPath();c.arc(x,y,5,-.2,2.6);c.stroke()}else{c.fillStyle='#c88e58';c.beginPath();c.roundRect(x-2.5,y-5,5,10,3);c.fill()}}};drawMany(brood.eggs.length,'egg');drawMany(brood.larvae.length,'larva');drawMany(brood.pupae.length,'pupa');c.restore();
}
const baseStepR84=step;step=function(dt){baseStepR84(dt);advanceBrood(dt)};
const baseDrawR84=draw;draw=function(){baseDrawR84();drawBrood();updateCard()};
const baseResetR84=reset;reset=function(){baseResetR84();resetBrood();updateCard();draw()};window.resetSimulation=reset;
const overlay=document.querySelector('.r83-ant-overlay'),info=document.getElementById('r84QueenInfo');if(overlay&&info){overlay.addEventListener('pointerdown',e=>{const rr=canvas.getBoundingClientRect(),p={x:(e.clientX-rr.left)/rr.width*canvas.width,y:(e.clientY-rr.top)/rr.height*canvas.height},q=queenPos();if(Math.hypot(p.x-q.x,p.y-q.y)<30){info.classList.toggle('show');info.textContent='';info.innerHTML=`<b>👑 女王アリ</b><br>🥚 卵 ${brood.eggs.length} ／ 🐛 幼虫 ${brood.larvae.length} ／ 🟤 蛹 ${brood.pupae.length}<br>食料と育児アリが足りると子どもが育ち、働きアリが増えます。`;e.preventDefault();e.stopImmediatePropagation()}},true)}
resetBrood();updateCard();draw();
})();
</script>
'''

s=s.replace('</body>',addon+'</body>',1)
p.write_text(s,encoding='utf-8')
print('patched ant queen/brood cycle')
