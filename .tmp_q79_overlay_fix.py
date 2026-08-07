from pathlib import Path
p=Path('quicksand-simulator.html')
s=p.read_text(encoding='utf-8')
assert 'r79-quicksand-objects-and-deformation' in s
old="const cv=document.getElementById('mainCv'),g=cv.getContext('2d'),Q=APP.qs,sel=document.getElementById('qsObjectSel');"
new="const cv=document.getElementById('mainCv'),g=cv.getContext('2d'),Q=APP.qs,sel=document.getElementById('qsObjectSel');const stage=cv.parentElement;stage.style.position='relative';const input=document.createElement('canvas');input.width=cv.width;input.height=cv.height;input.setAttribute('aria-label','底なし沼の直接操作レイヤー');input.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:6;background:transparent;touch-action:none;cursor:grab';stage.appendChild(input);"
assert old in s
s=s.replace(old,new,1)
s=s.replace("let obj='person',deform=[],dragPath=[],mode=null,last=null,lastAt=0;","let obj='person',deform=[],dragPath=[],mode=null,lastP=null,lastAt=0;",1)
s=s.replace("const point=e=>{const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)*cv.width/r.width,y:(e.clientY-r.top)*cv.height/r.height}};","const point=e=>{const r=input.getBoundingClientRect();return{x:(e.clientX-r.left)*input.width/r.width,y:(e.clientY-r.top)*input.height/r.height}};",1)
s=s.replace("const wake=()=>{if(!running){running=true;document.getElementById('playPause').textContent='⏸ 一時停止';last=performance.now()}};","const wake=()=>{if(!running){running=true;document.getElementById('playPause').textContent='⏸ 一時停止'}};",1)
s=s.replace("cv.addEventListener('pointerdown',e=>{const p=point(e);last=p;lastAt=performance.now();","input.addEventListener('pointerdown',e=>{const p=point(e);lastP=p;lastAt=performance.now();",1)
s=s.replace("cv.setPointerCapture?.(e.pointerId)","input.setPointerCapture?.(e.pointerId)")
s=s.replace("cv.addEventListener('pointermove',e=>{if(!mode)return;const p=point(e),now=performance.now(),dt=Math.max(.016,(now-lastAt)/1000),dist=last?Math.hypot(p.x-last.x,p.y-last.y):0;","input.addEventListener('pointermove',e=>{if(!mode)return;const p=point(e),now=performance.now(),dt=Math.max(.016,(now-lastAt)/1000),dist=lastP?Math.hypot(p.x-lastP.x,p.y-lastP.y):0;",1)
s=s.replace("last=p;lastAt=now;drawAll()","lastP=p;lastAt=now;drawAll()",1)
s=s.replace("mode=null;last=null;dragPath=[];","mode=null;lastP=null;dragPath=[];",1)
s=s.replace("cv.addEventListener('pointerup',release,true);cv.addEventListener('pointercancel',release,true);","input.addEventListener('pointerup',release,true);input.addEventListener('pointercancel',release,true);",1)
s=s.replace("if(mode?.kind==='body'&&last){const x=Q.cx+110,col=last.y<mode.startY?'#69e0b0':'#ffd85a';","if(mode?.kind==='body'&&lastP){const x=Q.cx+110,col=lastP.y<mode.startY?'#69e0b0':'#ffd85a';",1)
s=s.replace("g.lineTo(x,last.y);","g.lineTo(x,lastP.y);",1)
s=s.replace("Math.min(mode.startY,last.y)-4","Math.min(mode.startY,lastP.y)-4")
s=s.replace("last.y<mode.startY?'↑ 引き抜く':'↓ 押し込む'","lastP.y<mode.startY?'↑ 引き抜く':'↓ 押し込む'")
s=s.replace("Math.min(mode.startY,last.y)+13","Math.min(mode.startY,lastP.y)+13")
s=s.replace("Math.min(mode.startY,last.y)+31","Math.min(mode.startY,lastP.y)+31")
# Make current drag unmistakable and leave a longer-lived churn trail.
s=s.replace("deform=deform.filter(d=>now-d.t<2600)","deform=deform.filter(d=>now-d.t<5200)",1)
s=s.replace("const age=(now-d.t)/2600,a=Math.max(0,1-age),r=28+d.power*34+age*32;","const age=(now-d.t)/5200,a=Math.max(0,1-age),r=34+d.power*42+age*42;",1)
s=s.replace("g.globalAlpha=.8;g.strokeStyle='#ffcb83';g.lineWidth=12;","g.globalAlpha=.9;g.strokeStyle='#ffcb83';g.lineWidth=18;",1)
s=s.replace("g.globalAlpha=.55;g.strokeStyle='#5a3c27';g.lineWidth=5;","g.globalAlpha=.72;g.strokeStyle='#5a3c27';g.lineWidth=8;",1)
# Add a visible cursor ring and instruction on overlay itself.
needle="const marker=document.createElement('meta');marker.name='r79-quicksand-objects-deformation';"
insert="input.addEventListener('pointermove',e=>{if(mode)return;const p=point(e),ig=input.getContext('2d');ig.clearRect(0,0,input.width,input.height);ig.strokeStyle='rgba(255,216,90,.8)';ig.lineWidth=3;ig.beginPath();ig.arc(p.x,p.y,18,0,Math.PI*2);ig.stroke()});input.addEventListener('pointerleave',()=>input.getContext('2d').clearRect(0,0,input.width,input.height));\n  const marker=document.createElement('meta');marker.name='r79-quicksand-objects-deformation';"
assert needle in s
s=s.replace(needle,insert,1)
p.write_text(s,encoding='utf-8')
