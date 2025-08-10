#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Batch-clean des fichiers HTML d'un dossier 'htmlToCLean' situé à côté de ce script.

Actions :
- ❌ Supprime TOUT le SVG : <svg>, <path d="...">, <g>, <defs>, etc. (avec ou sans namespace)
- ❌ Supprime <img src="*.svg"> et data:image/svg+xml
- ❌ Supprime <object>/<embed>/<source> de type image/svg+xml (ou src/srcset .svg)
- ❌ Supprime TOUTES les balises <script>, <style>, <meta> et <link> (peu importe leurs attributs)
- ❌ Supprime attributs CSS inline (style="…") et événements (on*)
- ❌ Supprime commentaires HTML
- ✅ Conserve le reste des balises + texte + id/class/attrs utiles
- ✅ Déballe <noscript> pour garder leur contenu

Entrée :  dossier ./htmlToCLean (à côté de ce script)
Sortie :  foo.html -> foo_clean.html (par défaut) ou écrasement avec --overwrite

Dépendances : beautifulsoup4, html5lib (ou lxml)
    pip install beautifulsoup4 html5lib lxml

Usage :
    python clean_html.py
    python clean_html.py --recursive
    python clean_html.py --overwrite
    python clean_html.py --collapse-whitespace
    python clean_html.py --src-dir ./autreDossier --suffix _purge
"""

import argparse
import re
import sys
from pathlib import Path

try:
    from bs4 import BeautifulSoup, Comment
except Exception:
    print("❌ BeautifulSoup (bs4) manquant. Installez-le :", file=sys.stderr)
    print("   pip install beautifulsoup4 html5lib lxml", file=sys.stderr)
    raise

# --- Réglages par défaut ---
DEFAULT_SRC_DIR = "htmlToCLean"  # respecte la casse demandée
DEFAULT_SUFFIX = "_clean"
WHITESPACE_SENSITIVE = {"pre", "code", "textarea"}

# Noms locaux SVG fréquents
SVG_LOCAL_NAMES = {
    "svg", "path", "g", "defs", "symbol", "use", "clipPath", "mask",
    "pattern", "marker", "linearGradient", "radialGradient", "stop",
    "filter", "feBlend", "feColorMatrix", "feComponentTransfer",
    "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap",
    "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG",
    "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology",
    "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile",
    "feTurbulence", "ellipse", "circle", "rect", "line", "polyline", "polygon",
    "text", "tspan", "textPath"
}

EVENT_HANDLER_RE = re.compile(r"^on[a-zA-Z]+$")  # onclick, onload, ...


def pick_parser() -> str:
    """Choisit le parser le plus robuste disponible."""
    for name in ("html5lib", "lxml", "html.parser"):
        try:
            if name != "html.parser":
                __import__(name)
            return name
        except Exception:
            continue
    return "html.parser"


PARSER_NAME = pick_parser()


def _local_name(tag_name: str) -> str:
    # gère les noms avec préfixe de namespace, ex. "svg:path"
    return (tag_name or "").split(":")[-1].lower()


def _is_svg_tag(tag) -> bool:
    return _local_name(tag.name) in SVG_LOCAL_NAMES


def collapse_whitespace(soup: BeautifulSoup) -> None:
    """Compacte les espaces successifs dans les textes (sauf zones sensibles)."""
    for node in soup.find_all(string=True):
        parent = node.parent.name if node.parent else None
        if parent in WHITESPACE_SENSITIVE:
            continue
        txt = str(node)
        if not txt or txt.isspace():
            continue
        collapsed = re.sub(r"\s+", " ", txt).strip()
        node.replace_with(collapsed if collapsed else " ")


def clean_soup(soup: BeautifulSoup) -> None:
    """Applique les règles de nettoyage au DOM."""
    # --- A) Éliminer tout SVG (balises vectorielles) ---
    for tag in list(soup.find_all(_is_svg_tag)):
        tag.decompose()

    # 1.b) Balises possédant un attribut 'd' (typiquement <path>)
    for tag in list(soup.find_all(True)):
        if tag.has_attr("d"):
            if _local_name(tag.name) in {"path", "polygon", "polyline"}:
                tag.decompose()

    # 2) Images SVG (URL ou data URI)
    for img in list(soup.find_all("img")):
        src = (img.get("src") or "").strip().lower()
        if src.endswith(".svg") or src.startswith("data:image/svg+xml"):
            img.decompose()

    # 3) Objets/embeds/source de type SVG
    for obj in list(soup.find_all(["object", "embed", "source"])):
        typ = (obj.get("type") or "").strip().lower()
        if typ == "image/svg+xml":
            obj.decompose()
            continue
        if obj.name == "source":
            srcset = (obj.get("srcset") or "").lower()
            if ".svg" in srcset:
                obj.decompose()
                continue
        src_any = (obj.get("src") or obj.get("href") or "").lower()
        if src_any.endswith(".svg"):
            obj.decompose()

    # --- B) Scripts, CSS, META & LINK ---
    for tag in list(soup.find_all(["script", "style", "meta", "link"])):
        tag.decompose()

    # --- C) Commentaires ---
    for comment in soup.find_all(string=lambda t: isinstance(t, Comment)):
        comment.extract()

    # --- D) Attributs à risque ---
    for tag in soup.find_all(True):
        if tag.has_attr("style"):
            del tag["style"]
        for attr in list(tag.attrs.keys()):
            if EVENT_HANDLER_RE.match(attr):
                del tag.attrs[attr]

    # --- E) Unwrap <noscript> ---
    for ns in list(soup.find_all("noscript")):
        ns.unwrap()


def process_file(path: Path, overwrite: bool, suffix: str, do_collapse_ws: bool) -> Path:
    html = path.read_text(encoding="utf-8", errors="ignore")
    soup = BeautifulSoup(html, PARSER_NAME)
    clean_soup(soup)
    if do_collapse_ws:
        collapse_whitespace(soup)

    if overwrite:
        out_path = path
    else:
        out_path = path.with_name(f"{path.stem}{suffix}{path.suffix}")

    out_path.write_text(str(soup), encoding="utf-8", errors="ignore")
    return out_path


def iter_html_files(root: Path, recursive: bool):
    patterns = ("*.html", "*.htm")
    if recursive:
        for pat in patterns:
            yield from root.rglob(pat)
    else:
        for pat in patterns:
            yield from root.glob(pat)


def main():
    ap = argparse.ArgumentParser(description="Nettoie les HTML d'un dossier (SVG/script/style/meta/link/etc.).")
    ap.add_argument("--src-dir", default=DEFAULT_SRC_DIR, help="Dossier source (par défaut: ./htmlToCLean)")
    ap.add_argument("--recursive", action="store_true", help="Descend dans les sous-dossiers")
    ap.add_argument("--overwrite", action="store_true", help="Écrase les fichiers d'origine (attention)")
    ap.add_argument("--collapse-whitespace", action="store_true", help="Compacte les espaces (hors <pre><code><textarea>)")
    ap.add_argument("--suffix", default=DEFAULT_SUFFIX, help="Suffixe du fichier de sortie (si pas --overwrite)")
    args = ap.parse_args()

    script_dir = Path(__file__).resolve().parent
    src_dir = (Path(args.src_dir)
               if Path(args.src_dir).is_absolute()
               else (script_dir / args.src_dir)).resolve()

    if not src_dir.is_dir():
        print(f"❌ Dossier introuvable : {src_dir}", file=sys.stderr)
        sys.exit(1)

    files = sorted(iter_html_files(src_dir, recursive=args.recursive))
    if not files:
        print(f"ℹ️ Aucun .html/.htm trouvé dans {src_dir}")
        return

    print(f"Parser utilisé : {PARSER_NAME}")
    print(f"Source : {src_dir}")
    print(f"Mode   : {'overwrite' if args.overwrite else f'suffix={args.suffix}'}")
    if args.recursive:
        print("Parcours : récursif")
    if args.collapse_whitespace:
        print("Option  : collapse whitespace = ON")

    ok, err = 0, 0
    for f in files:
        try:
            out = process_file(f, overwrite=args.overwrite, suffix=args.suffix,
                               do_collapse_ws=args.collapse_whitespace)
            print(f"✔ {f.relative_to(src_dir)}  →  {out.name if out != f else '(overwrite)'}")
            ok += 1
        except Exception as e:
            print(f"✖ ERREUR sur {f}: {e}", file=sys.stderr)
            err += 1

    print(f"\nTerminé. {ok} fichier(s) OK, {err} erreur(s).")


if __name__ == "__main__":
    main()
