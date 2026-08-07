from pathlib import Path
p=Path('fossil-formation.html')
s=p.read_text(encoding='utf-8')
old="[[245,'fish'],[430,'shell'],[610,'leaf'],[735,'bone'],[365,'trace']].forEach(([x,t],i)=>{const y=SURFACE_Y+((i%3)-1)*7,s=createSpecimen(x,y,t);ensure(s);s.surfaceY=y;specimens.push(s)});"
new="[[245,235,'fish'],[430,300,'shell'],[610,225,'leaf'],[735,350,'bone'],[365,430,'trace']].forEach(([x,y,t])=>{const s=createSpecimen(x,y,t);ensure(s);s.surfaceY=Math.min(y,SURFACE_Y);s.y=s.surfaceY;specimens.push(s)});"
if old not in s: raise SystemExit('current reset anchor missing')
p.write_text(s.replace(old,new,1),encoding='utf-8')
