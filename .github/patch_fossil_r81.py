from pathlib import Path
import base64, zlib

TARGET = Path('fossil-formation.html')
parts = [Path(f'.github/r81.part{i:02d}') for i in range(5)]
encoded = ''.join(p.read_text(encoding='utf-8').strip() for p in parts)
patch = zlib.decompress(base64.b64decode(encoded)).decode('utf-8')
text = TARGET.read_text(encoding='utf-8')
if 'r81-taphonomy-direct-style' in text:
    print('r81 patch already present')
else:
    if '</body>' not in text:
        raise SystemExit('missing </body>')
    text = text.replace('発掘ノート・化石図鑑48／化石形成ラボ', '発掘ノート・化石図鑑48／化石・タフォノミーラボ')
    text = text.replace('</head>', '<meta name="r81-release" content="fossil-taphonomy-direct">\n</head>', 1)
    text = text.replace('</body>', patch + '\n</body>', 1)
    TARGET.write_text(text, encoding='utf-8')
    print('patched', TARGET)
