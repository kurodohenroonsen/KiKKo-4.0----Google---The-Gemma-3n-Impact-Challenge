import os
import sys

# --- CONFIGURATION ---
# Le chemin ABSOLU du dossier à analyser.
# Important : Ce chemin doit être complet.
PROJECT_DIR = '/Applications/MAMP/htdocs/OpenBatra-Gemma3n/KiKKo-4.0----Google---The-Gemma-3n-Impact-Challenge/'

# Le nom du fichier de sortie.
OUTPUT_FILENAME = ' consolidated_project_context.txt'

# Dossiers à ignorer complètement.
DIRS_TO_EXCLUDE = [
    '.git', '.idea', '.gradle', 'build', 'captures',  # Dossiers techniques
    'android videos', 'bataille', 'decks', 'ecrans', 
    'illustrations', 'reflexions design', 'tests', 'videos', 'voices'
]

# Fichiers spécifiques à ignorer (incluant les anciens fichiers de contexte et le futur fichier de sortie).
FILES_TO_EXCLUDE = [
    '.DS_Store',
    'kikkosourceCOde.txt', # Ajout de l'exclusion demandée
    'kikko_project_context.txt',
    'project_galleryedge_context.txt',
    'project_kikko_based_on_galleryedge_context.txt',
    'project_MLKITVISION_context.txt',
    'project_vosk_context.txt',
    'food_data_downloader.py',
    'prompt conseil  best prompt!!.txt',
    'prompt.md',
    'nubel-nutrition-mapping-strategy.md',
    'gpc_en.json',
    'm.html',
    'compass_artifact_wf-61430fac-b376-465f-b781-b3aee3f3c532_text_markdown.md',
    'extract_context.py',
    'gs1Voc.jsonld',
    'unionLabelling_products.json',
    'unionLabelling_rules.json',
    'Nubel_FR.csv',
    OUTPUT_FILENAME # Ne pas inclure le fichier de sortie lui-même
]

# Extensions de fichiers à traiter comme binaires (leur contenu ne sera pas lu).
# J'ai retiré .py et .svg qui sont des fichiers texte.
BINARY_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.mp3', '.wav', '.ogg', '.mp4', '.py']

def get_file_content(file_path):
    """
    Tente de lire un fichier comme du texte (UTF-8), avec un fallback pour les binaires.
    """
    if any(file_path.lower().endswith(ext) for ext in BINARY_EXTENSIONS):
        return f'[Fichier binaire ({os.path.basename(file_path)}) - contenu non inclus]'

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception:
        return f'[Fichier potentiellement binaire ou illisible ({os.path.basename(file_path)}) - contenu non inclus]'

def main():
    """
    Fonction principale qui parcourt les fichiers et génère le contexte.
    """
    # Correction: S'assurer que le chemin du projet existe
    if not os.path.isdir(PROJECT_DIR):
        print(f"ERREUR : Le dossier du projet spécifié n'existe pas : '{PROJECT_DIR}'")
        return

    # Correction: Construire le chemin de sortie absolu à côté du script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_full_path = os.path.join(script_dir, OUTPUT_FILENAME)
    
    # S'assurer que le fichier de sortie lui-même est bien dans la liste d'exclusion
    # au cas où le nom du fichier changerait dans la config.
    files_to_exclude_dynamic = FILES_TO_EXCLUDE + [os.path.basename(output_full_path)]

    all_files_content = []
    print(f"Démarrage de l'analyse du dossier : {PROJECT_DIR}")
    
    for root, dirs, files in os.walk(PROJECT_DIR):
        # Exclut les dossiers spécifiés de la recherche
        dirs[:] = [d for d in dirs if d not in DIRS_TO_EXCLUDE]

        for filename in sorted(files):
            if filename in files_to_exclude_dynamic:
                continue

            file_path = os.path.join(root, filename)
            relative_path = os.path.relpath(file_path, PROJECT_DIR)
            relative_path_for_display = relative_path.replace(os.sep, '/')

            content = get_file_content(file_path)
            
            formatted_content = (
                f"--- START OF FILE {relative_path_for_display} ---\n\n"
                f"{content}\n\n"
                f"--- END OF FILE {relative_path_for_display} ---\n"
            )
            all_files_content.append(formatted_content)
            print(f"✅ Traité : {relative_path_for_display}")

    # Écrit tout le contenu dans le fichier de sortie au chemin absolu
    try:
        with open(output_full_path, 'w', encoding='utf-8') as f:
            f.write('\n\n'.join(all_files_content))
        print(f"\n🎉 Succès ! Le contexte complet a été sauvegardé ici : '{output_full_path}'.")
    except IOError as e:
        print(f"\n❌ ERREUR CRITIQUE lors de l'écriture du fichier de sortie : {e}")

if __name__ == '__main__':
    main()