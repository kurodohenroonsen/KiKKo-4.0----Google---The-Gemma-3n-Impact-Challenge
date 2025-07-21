import tensorflow as tf
import numpy as np

def inspect_tflite_model_basic(model_path):
    """Inspection basique d'un modèle TensorFlow Lite"""
    # Chargement et allocation du modèle
    interpreter = tf.lite.Interpreter(model_path=model_path)
    interpreter.allocate_tensors()
    
    # Détails des tenseurs d'entrée
    input_details = interpreter.get_input_details()
    print("=== TENSEURS D'ENTRÉE ===")
    for i, tensor in enumerate(input_details):
        print(f"Input {i}:")
        print(f"  Nom: {tensor['name']}")
        print(f"  Index: {tensor['index']}")
        print(f"  Forme: {tensor['shape']}")
        print(f"  Type: {tensor['dtype']}")
        print(f"  Quantification: {tensor.get('quantization_parameters', {})}")
    
    # Détails des tenseurs de sortie
    output_details = interpreter.get_output_details()
    print("\n=== TENSEURS DE SORTIE ===")
    for i, tensor in enumerate(output_details):
        print(f"Output {i}:")
        print(f"  Nom: {tensor['name']}")
        print(f"  Index: {tensor['index']}")
        print(f"  Forme: {tensor['shape']}")
        print(f"  Type: {tensor['dtype']}")
    
    return {
        'input_details': input_details,
        'output_details': output_details,
        'num_classes': output_details[0]['shape'][-1] if output_details else 0
    }

# Utilisation
model_info = inspect_tflite_model_basic("/Users/kurodohenroonsen/Downloads/models/INatVision_Small_2_fact256_8bit.tflite")
print(f"Nombre de classes détecté: {model_info['num_classes']}")