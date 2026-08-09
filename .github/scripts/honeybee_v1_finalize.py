from pathlib import Path
import re, json

APP = {
 "f":"honeybee-colony.html","t":"ニホンミツバチ・巣づくりとコロニー運営ラボ","e":"🐝","c":"eco",
 "s":"蜜・花粉を集め、六角形の巣房を増やし、幼虫を育て、スズメバチから巣を守る。",
 "first":"「🌸 花」を選んで草地をタップし、採餌蜂が蜜を運ぶ様子を見よう。",
 "fun":"巣の状態に応じて採餌・育児・建築・防衛・換気へ仕事が変わり、秋にはスズメバチへの集団防衛も起こる。",
 "m5":"巣房を増やし、蜂蜜をためながら働き蜂を増やそう。",
 "m10":"スズメバチ圧力だけを変え、偵察頻度と防衛蜂の集まり方、コロニー損失を比べよう。",
 "mode":"quick","modeLabel":"すぐあそべる","modeIcon":"⚡",
 "th":"ニホンミツバチの す","sh":"はなから みつを はこんで、ろっかくの すを そだてよう。スズメバチも やってくるよ。"
}
app_json=json.dumps(APP,ensure_ascii=False,separators=(',',':'))

def insert_app(text):
    if '"f":"honeybee-colony.html"' in text:
        return text
    m=re.search(r'\{"f":"ant-colony\.html".*?\}',text)
    if not m:
        raise SystemExit('ant app object not found')
    sep=',' if m.end()<len(text) and text[m.end():m.end()+1] != ',' else ''
    return text[:m.end()]+','+app_json+text[m.end():]

def add_front(text,key):
    if 'honeybee-colony.html' in text and re.search(rf'{key}\s*:\s*\[[^\]]*honeybee-colony\.html',text):
        return text
    pat=rf'({key}\s*:\s*\[)([^\]]*)(\])'
    m=re.search(pat,text)
    if not m: return text
    body=m.group(2)
    if 'ant-colony.html' not in body: return text
    q='"honeybee-colony.html"'
    body2=body + (',' if body.strip() else '') + q
    return text[:m.start(2)]+body2+text[m.end(2):]

def patch_index(path):
    p=Path(path); t=p.read_text()
    before=t
    t=insert_app(t)
    # App-count labels only; the catalog currently has 183 entries before this addition.
    t=t.replace('全183本','全184本').replace('183こ','184こ').replace('183本','184本')
    for key in ('quick','life'):
        t=add_front(t,key)
    # Add title aliases used by optional front-page enhancers when the map is present.
    if 'R64_TITLES' in t and '"honeybee-colony.html":"ニホンミツバチ・巣づくりとコロニー運営ラボ"' not in t:
        m=re.search(r'(const\s+R64_TITLES\s*=\s*\{)(.*?)(\};)',t)
        if m:
            body=m.group(2)
            addition='"honeybee-colony.html":"ニホンミツバチ・巣づくりとコロニー運営ラボ"'
            body2=body + (',' if body.strip() and not body.rstrip().endswith(',') else '') + addition
            t=t[:m.start(2)]+body2+t[m.end(2):]
    if t==before: raise SystemExit(f'no changes for {path}')
    p.write_text(t)

for f in ('kids-index.html','explore.html'):
    patch_index(f)

# Add simple explicit navigation to the new standalone app.
p=Path('honeybee-colony.html'); t=p.read_text()
if 'id="beeNav"' not in t:
    t=t.replace('<body data-first=', '<body><nav id="beeNav" style="display:flex;gap:6px;flex-wrap:wrap;margin:0 0 9px"><a href="kids-index.html" style="color:#241c00;background:#ffd765;border-radius:10px;padding:8px 10px;font-weight:900;text-decoration:none">← こども一覧</a><a href="explore.html" style="color:#eef5fb;background:#182638;border:1px solid #40536b;border-radius:10px;padding:8px 10px;font-weight:800;text-decoration:none">おとな一覧</a></nav><div style="display:none" data-first=')
    # The hidden wrapper only exists because the original body carried data-first; close it immediately after the opening quoted attribute.
    t=t.replace('data-first="「🌸 花」を選んで草地をタップし、ニホンミツバチが蜜と花粉を巣へ運ぶ様子を見よう。">\n<header', 'data-first="「🌸 花」を選んで草地をタップし、ニホンミツバチが蜜と花粉を巣へ運ぶ様子を見よう。"></div>\n<header',1)
p.write_text(t)

# Integrity checks
for f in ('kids-index.html','explore.html'):
    s=Path(f).read_text()
    assert s.count('"f":"honeybee-colony.html"')==1, (f,'app count')
assert Path('honeybee-colony.html').read_text().count('<canvas')==1
print('honeybee integration patched')
