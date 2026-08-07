from pathlib import Path
p=Path('quicksand-simulator.html')
s=p.read_text(encoding='utf-8')
assert '<script id="r76-quicksand-direct-interaction">' in s
if 'r77-quicksand-visible-feedback' in s:
    raise SystemExit('already patched')

s=s.replace(
"guide.innerHTML='<b>👆 沼を直接さわる：</b> 人を上下にドラッグすると、沈めたり引き上げたりできます。人以外の泥をドラッグすると泥をかき混ぜ、構造がくずれて柔らかくなります。手を離すと再び物理計算へ戻ります。';",
"guide.innerHTML='<b>👆 沼を直接さわる：</b> 泥は<b>タップだけでも</b>ゆるみ、なぞるほど大きく攪乱されます。触った場所の渦と色、構造強度の変化を見よう。人を上下にドラッグすると沈めたり引き上げたりでき、手を離すと物理計算へ戻ります。';"
)

s=s.replace(
"let direct=null,lastP=null,lastT=0;",
"let direct=null,lastP=null,lastT=0,touchFx=[];\n  const addTouchFx=(p,kind='stir',intensity=1,before=state.structure,after=state.structure)=>{touchFx.push({x:p.x,y:p.y,kind,intensity,before,after,t:performance.now()});if(touchFx.length>28)touchFx.splice(0,touchFx.length-28)};\n  const applyStirImpulse=(p,intensity=1)=>{const before=state.structure,loss=(.032+.058*num('c8'))*Math.max(.15,intensity);state.agit=Math.min(1,state.agit+.24*Math.max(.25,intensity));state.structure=Math.max(Q.structMin,state.structure-loss);state.eqDepth=null;state.eqTime=null;state.still=0;addTouchFx(p,'stir',intensity,before,state.structure);state.ripples.push({age:0,color:'#ffb36b',x:p.x,y:p.y});return before-state.structure};"
)

s=s.replace(
"const feet=Q.surf+state.depth*Q.px;direct={kind:'body',grip:p.y-feet};running=false;document.getElementById('playPause').textContent='▶ 再生';cv.setPointerCapture?.(e.pointerId);",
"const feet=Q.surf+state.depth*Q.px;direct={kind:'body',grip:p.y-feet,startY:p.y,lastY:p.y,resistance:0};addTouchFx(p,'grab',1);running=false;document.getElementById('playPause').textContent='▶ 再生';cv.setPointerCapture?.(e.pointerId);"
)

old="""}else if(p.y>Q.surf){
      e.preventDefault();e.stopImmediatePropagation();direct={kind:'stir'};cv.setPointerCapture?.(e.pointerId);
      note('泥をかき混ぜている。構造がこわれ、支えが弱くなる');
    }"""
new="""}else if(p.y>Q.surf){
      e.preventDefault();e.stopImmediatePropagation();direct={kind:'stir'};cv.setPointerCapture?.(e.pointerId);
      const changed=applyStirImpulse(p,1);
      note(`タップした場所の泥がゆるんだ（構造 −${Math.max(1,Math.round(changed*100))}%）。なぞるとさらに崩れる`);
      drawAll();
    }"""
assert old in s
s=s.replace(old,new,1)

old="""const gain=.72/(1+.45*resistance),old=state.depth;
      state.depth+= (target-state.depth)*gain;state.vel=Math.max(-Q.vMax,Math.min(Q.vMax,(state.depth-old)/dt));
      state.structure=Math.max(Q.structMin,state.structure-Math.abs(state.depth-old)*(.035+.08*num('c8')));
      state.eqDepth=null;state.eqTime=null;state.still=0;state.ripples.push({age:0,color:state.vel<0?'#69e0b0':'#ffd85a'});"""
new="""const gain=.72/(1+.45*resistance),old=state.depth;
      state.depth+= (target-state.depth)*gain;state.vel=Math.max(-Q.vMax,Math.min(Q.vMax,(state.depth-old)/dt));
      state.structure=Math.max(Q.structMin,state.structure-Math.abs(state.depth-old)*(.035+.08*num('c8')));
      state.eqDepth=null;state.eqTime=null;state.still=0;direct.lastY=p.y;direct.resistance=resistance;direct.dir=state.vel<0?'pull':'push';addTouchFx(p,direct.dir,.75);state.ripples.push({age:0,color:state.vel<0?'#69e0b0':'#ffd85a',x:p.x,y:p.y});"""
assert old in s
s=s.replace(old,new,1)

old="""const intensity=Math.min(1,dist/55);
      state.agit=Math.min(1,state.agit+intensity*.7);
      state.structure=Math.max(Q.structMin,state.structure-intensity*(.025+.055*num('c8')));
      state.eqDepth=null;state.eqTime=null;state.still=0;state.ripples.push({age:0,color:'#ffb36b'});"""
new="""const intensity=Math.min(1,dist/55);
      applyStirImpulse(p,.18+.55*intensity);"""
assert old in s
s=s.replace(old,new,1)

anchor="""cv.addEventListener('pointerup',release,true);cv.addEventListener('pointercancel',release,true);
    const style=document.createElement('style');style.textContent='#mainCv{cursor:grab}#mainCv:active{cursor:grabbing}';document.head.appendChild(style);"""
insert="""cv.addEventListener('pointerup',release,true);cv.addEventListener('pointercancel',release,true);
    const r77BaseDrawAll=drawAll;
    drawAll=()=>{
      r77BaseDrawAll();
      const g=cv.getContext('2d'),now=performance.now(),loosen=Math.max(0,Math.min(1,1-state.structure));
      touchFx=touchFx.filter(f=>now-f.t<1900);
      g.save();
      if(loosen>.008){
        g.fillStyle=`rgba(230,151,72,${.035+loosen*.16})`;g.fillRect(0,Q.surf,cv.width,cv.height-Q.surf);
        g.strokeStyle=`rgba(255,208,126,${.08+loosen*.34})`;g.lineWidth=1.4;
        for(let j=0;j<5;j++){const yy=Q.surf+42+j*48;g.beginPath();for(let xx=0;xx<=cv.width;xx+=18){const y=yy+Math.sin(xx*.025+state.phase*2+j)*5*loosen;xx?g.lineTo(xx,y):g.moveTo(xx,y)}g.stroke()}
      }
      g.fillStyle='rgba(7,17,28,.78)';g.strokeStyle='rgba(255,216,90,.55)';g.lineWidth=1;
      if(g.roundRect){g.beginPath();g.roundRect(16,Q.surf+13,176,34,10);g.fill();g.stroke()}else{g.fillRect(16,Q.surf+13,176,34);g.strokeRect(16,Q.surf+13,176,34)}
      g.fillStyle='#ffe18a';g.font='bold 12px system-ui';g.fillText('👆 泥をタップ・なぞる',27,Q.surf+35);
      for(const f of touchFx){
        const age=(now-f.t)/1900,a=Math.max(0,1-age),rad=22+age*54*(.7+f.intensity*.45);
        if(f.kind==='stir'){
          g.save();g.globalAlpha=a;g.strokeStyle='#ffb36b';g.lineWidth=3;g.beginPath();g.ellipse(f.x,f.y,rad,rad*.42,age*1.7,0,Math.PI*2);g.stroke();
          g.strokeStyle='rgba(255,226,160,.9)';g.lineWidth=2;for(let k=0;k<3;k++){const rr=10+k*9+age*18;g.beginPath();g.arc(f.x,f.y,rr,age*4+k,age*4+k+Math.PI*.9);g.stroke()}g.restore();
          if(age<.42 && f===touchFx[touchFx.length-1]){g.save();g.globalAlpha=Math.min(1,a*1.6);g.fillStyle='rgba(7,17,28,.9)';g.fillRect(Math.min(cv.width-176,f.x+18),Math.max(Q.surf+6,f.y-42),160,31);g.fillStyle='#ffcf89';g.font='bold 12px system-ui';g.fillText(`泥の構造 ${Math.round(f.after*100)}%`,Math.min(cv.width-164,f.x+28),Math.max(Q.surf+26,f.y-21));g.restore()}
        }else if(f.kind==='grab'){
          g.save();g.globalAlpha=a;g.strokeStyle='#69e0b0';g.lineWidth=3;g.beginPath();g.arc(f.x,f.y,18+age*18,0,Math.PI*2);g.stroke();g.restore();
        }
      }
      if(direct?.kind==='body'&&lastP){
        const x=Q.cx+118,y0=direct.startY,y1=lastP.y,up=y1<y0,col=up?'#69e0b0':'#ffd85a';
        g.strokeStyle=col;g.fillStyle=col;g.lineWidth=4;g.beginPath();g.moveTo(x,y0);g.lineTo(x,y1);g.stroke();const sg=up?-1:1;g.beginPath();g.moveTo(x,y1);g.lineTo(x-8,y1-sg*14);g.lineTo(x+8,y1-sg*14);g.closePath();g.fill();
        g.fillStyle='rgba(7,17,28,.88)';g.fillRect(x+14,Math.min(y0,y1)-4,155,40);g.fillStyle=col;g.font='bold 12px system-ui';g.fillText(up?'↑ 引き抜く':'↓ 押し込む',x+24,Math.min(y0,y1)+13);g.fillStyle='#dceafa';g.font='11px system-ui';g.fillText(`泥の抵抗 ${Math.round((direct.resistance||0)*100)}%`,x+24,Math.min(y0,y1)+30);
      }
      g.fillStyle='rgba(7,17,28,.82)';g.fillRect(cv.width-188,Q.surf+13,172,50);g.fillStyle='#9fcdf5';g.font='11px system-ui';g.fillText('泥の構造強度',cv.width-176,Q.surf+31);g.fillStyle=state.structure>.66?'#69e0b0':state.structure>.35?'#ffd85a':'#ff9b7a';g.font='bold 18px ui-monospace,monospace';g.fillText(`${Math.round(state.structure*100)}%`,cv.width-176,Q.surf+53);
      g.restore();
    };
    const marker=document.createElement('meta');marker.name='r77-quicksand-visible-feedback';marker.content='tap-stir-local-fx-drag-cues';document.head.appendChild(marker);
    const style=document.createElement('style');style.textContent='#mainCv{cursor:grab}#mainCv:active{cursor:grabbing}';document.head.appendChild(style);"""
assert anchor in s
s=s.replace(anchor,insert,1)
p.write_text(s,encoding='utf-8')
