from pathlib import Path
p = Path('frontend/superadmin.html')
text = p.read_text(encoding='utf-8')
idx = text.find('</html>')
if idx != -1:
    clean_text = text[:idx+7]
    p.write_text(clean_text, encoding='utf-8')
    print('HTML file cleaned - removed junk code after closing tag')
else:
    print('No closing HTML tag found')
