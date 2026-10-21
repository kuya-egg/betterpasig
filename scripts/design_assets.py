import json, sys, os, base64
R = sys.argv[1]
m = json.load(open(sys.argv[2]))
tokens = {
 "color": {
  "light": {"bg":"#FFFFFF","ink":"#16181D","muted":"#586070","line":"#E2E5EB","subtle":"#F4F6F9","blue":"#1A47A8","pale":"#E6ECF8","hover":"#C7D5F4","mark-bg":"#DCE5F8","red":"#B42318","red-bg":"#FEF3F2","amber":"#8A5A00","shadow":"rgba(16,24,40,.12)"},
  "dark": {"bg":"#0F1216","ink":"#ECEEF2","muted":"#A2A9B6","line":"#272C35","subtle":"#161A20","blue":"#86A6F4","pale":"#1E2633","hover":"#2C3A55","mark-bg":"#24314C","red":"#F97066","red-bg":"#2B1513","amber":"#E3B35C","shadow":"rgba(0,0,0,.45)"}
 },
 "font": {"family":"\"Geist\", \"Segoe UI\", system-ui, -apple-system, sans-serif","weights":[400,500,600,700]},
 "type": {"display":{"size":"52px","line":1.04,"tracking":"-0.04em","weight":700},"h2":{"size":"30px","tracking":"-0.03em","weight":700},"h3":{"size":"19px","tracking":"-0.01em","weight":600},"body":{"size":"17px","line":1.55,"weight":400},"small":{"size":"15px"},"caption":{"size":"14px"},"micro":{"size":"13px"}},
 "radius": {"xs":"4px","sm":"6px","md":"8px","lg":"10px","xl":"12px"},
 "space": {"gutter":"16px","max-width":"1200px","grid":"8px"},
 "motion": {"ease":"cubic-bezier(.2,.7,.2,1)","fast":"140ms","mid":"240ms","reduced":"prefers-reduced-motion: all transitions off, loader skipped"},
 "rules": ["No gradients","Red only for emergency","Amber only for 'Sinusuri pa' (verify) labels","Hairline 1px structure, no card shadows except floating menus","Pasig Blue is the only accent"]
}
os.makedirs(f"{R}/design/tokens", exist_ok=True)
json.dump(tokens, open(f"{R}/design/tokens/tokens.json","w"), indent=2)
def block(d): return "\n".join(f"  --{k}: {v};" for k,v in d.items())
css = f""":root {{
{block(tokens['color']['light'])}
  --font: {tokens['font']['family']};
  --ease: {tokens['motion']['ease']}; --fast: {tokens['motion']['fast']}; --mid: {tokens['motion']['mid']};
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{
{block(tokens['color']['dark'])}
  color-scheme: dark;
}} }}
:root[data-theme="dark"] {{
{block(tokens['color']['dark'])}
  color-scheme: dark;
}}
@media (prefers-reduced-motion: reduce) {{ *, *::before, *::after {{ transition: none !important; animation: none !important; }} }}
"""
open(f"{R}/design/tokens/tokens.css","w").write(css)
L = f"{R}/design/logo"; os.makedirs(L, exist_ok=True)
def svg(path, fill, vb="8 2 32 44", w=None, h=None, bg=None, extra=""):
    size = f' width="{w}" height="{h}"' if w else ""
    b = f'<rect x="-1000" y="-1000" width="3000" height="3000" fill="{bg}"/>' if bg else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"{size}>{b}<path d="{path}" fill="{fill}"/>{extra}</svg>\n'
open(f"{L}/mark-blue.svg","w").write(svg(m["smooth"],"#1A47A8"))
open(f"{L}/mark-ink.svg","w").write(svg(m["smooth"],"#16181D"))
open(f"{L}/mark-white.svg","w").write(svg(m["smooth"],"#FFFFFF"))
open(f"{L}/mark-detail-blue.svg","w").write(svg(m["detail"],"#1A47A8"))
# app icon: blue square with white mark
icon = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="11" fill="#1A47A8"/><g transform="translate(24 24) scale(0.78) translate(-24 -24)"><path d="{m["smooth"]}" fill="#FFFFFF"/></g></svg>\n'
open(f"{L}/app-icon.svg","w").write(icon)
open(f"{L}/favicon.svg","w").write(icon)
lock = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 48"><svg x="0" y="0" width="34" height="48" viewBox="8 2 32 44"><path d="{m["smooth"]}" fill="#1A47A8"/></svg><text x="44" y="33" font-family="Geist, Segoe UI, system-ui, sans-serif" font-size="27" font-weight="700" letter-spacing="-0.7" fill="#16181D">BetterPasig</text></svg>\n'''
open(f"{L}/lockup-horizontal.svg","w").write(lock)
print("ok")
