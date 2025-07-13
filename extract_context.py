import os

# --- CONFIGURATION ---
# Le nom du dossier contenant votre extension Chrome.
EXTENSION_DIR = '/Applications/MAMP/htdocs/OpenBatra-Gemma3n/KiKKo-4.0----Google---The-Gemma-3n-Impact-Challenge/'
# Le nom du fichier de sortie.
OUTPUT_FILE = 'code_pour_ia.txt'
# Dossiers à ignorer complètement.
DIRS_TO_EXCLUDE = ['android videos','.git', 'bataille', 'decks', 'ecrans', 'illustrations', 'reflexions design', 'tests', 'videos', 'voices']
# Fichiers spécifiques à ignorer.
FILES_TO_EXCLUDE = ['.DS_Store','food_data_downloader.py','prompt conseil  best prompt!!.txt','prompt.md', 'nubel-nutrition-mapping-strategy.md','gpc_en.json','m.html','compass_artifact_wf-61430fac-b376-465f-b781-b3aee3f3c532_text_markdown.md','extract_context.py', 'gs1Voc.jsonld', 'unionLabelling_products.json', 'unionLabelling_rules.json', 'Nubel_FR.csv', OUTPUT_FILE]
# Extensions de fichiers à traiter comme binaires.
BINARY_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.svg']

def get_file_content(file_path):
    """
    Tente de lire un fichier comme du texte (UTF-8), avec fallback pour les binaires.
    """
    # Vérifie si l'extension est dans notre liste de binaires
    if any(file_path.lower().endswith(ext) for ext in BINARY_EXTENSIONS):
        return '[Fichier binaire - contenu non inclus]'

    # Tente de lire le fichier en UTF-8, le standard du web.
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception:
        # Si la lecture en UTF-8 échoue, on le traite comme un fichier binaire.
        return '[Fichier binaire - contenu non inclus]'

def main():
    """
    Fonction principale qui parcourt les fichiers et génère le contexte.
    """
    if not os.path.isdir(EXTENSION_DIR):
        print(f"Erreur : Le dossier '{EXTENSION_DIR}' n'a pas été trouvé.")
        print("Veuillez vous assurer que ce script est dans le même répertoire que le dossier de votre extension.")
        return

    all_files_content = []
    base_path = os.path.dirname(os.path.abspath(__file__))
    extension_full_path = os.path.join(base_path, EXTENSION_DIR)

    for root, dirs, files in os.walk(extension_full_path):
        # Exclut les dossiers spécifiés de la recherche
        dirs[:] = [d for d in dirs if d not in DIRS_TO_EXCLUDE]

        for filename in sorted(files): # Tri pour un ordre prévisible
            if filename in FILES_TO_EXCLUDE:
                continue

            file_path = os.path.join(root, filename)
            # Affiche le chemin relatif à partir du dossier de l'extension
            relative_path = os.path.relpath(file_path, extension_full_path)
            # Utilise des slashes pour la compatibilité
            relative_path_for_display = relative_path.replace(os.sep, '/')

            content = get_file_content(file_path)
            
            formatted_content = (
                f"--- START OF FILE {relative_path_for_display} ---\n\n"
                f"{content}\n\n"
                f"--- END OF FILE {relative_path_for_display} ---\n"
            )
            all_files_content.append(formatted_content)
            print(f"✅ Traité : {relative_path_for_display}")

    # Écrit tout le contenu dans le fichier de sortie
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write('\n\n'.join(all_files_content))
        print(f"\n🎉 Succès ! Le contexte complet a été sauvegardé dans le fichier '{OUTPUT_FILE}'.")
        print("Vous pouvez maintenant copier-coller l'intégralité de ce fichier dans une nouvelle session AI.")
    except Exception as e:
        print(f"\n❌ Erreur lors de l'écriture du fichier de sortie : {e}")

if __name__ == '__main__':
    main()