<p align="center">
  <img src="illustrations/doc06_banner.png" alt="A wide, cinematic banner image for the 'Thread of Provenance' document, rendered in a 3D animation movie style. The scene is split into three parts. 1) Left: A glowing honeycomb cell representing a food memory for Léa is shown, with an intricate, golden 'Seal of Trust' forming on its surface. 2) Center: From a view over her shoulder, Léa's finger (10-year-old girl, yellow raincoat sleeve) touches the seal on her phone screen, which unfolds into a luminous, holographic scroll. 3) Right: The scroll displays a beautiful infographic detailing the data's journey: a photo of the ingredients, the AI processing steps, Léa's own validation inputs, and a clearly marked section for any externally sourced 'Hornet' data with its HTML source. The image emphasizes transparency, trust, and the verifiable story behind each memory.">
</p>

# Document 6/10: The Thread of Provenance - The Seal of Trust

**Title:** The Thread of Provenance: The Unbreakable Seal of Trust

**Objective:** To detail the structure, purpose, and in-game representation of the Provenance Document. This feature is positioned as the ultimate reward for choosing personal discovery over opaque convenience, guaranteeing transparency and trust in the knowledge created by the Forager.

---

### **Core Philosophy: The Story is the Reward**

In an age where AI can provide any answer, the answer itself loses value. The new value lies in its **origin story**. In Kikko, the "Informative Honey" is useful, but its true power comes from the verifiable story of its creation. The **Thread of Provenance** is that story.

It is not just metadata; it is a "Seal of Trust," the tangible proof that a piece of knowledge was born from a transparent, human-AI partnership. It is the definitive answer to the question: *Why should I trust this memory?* For **Léa**, this isn't a philosophical question; it's a matter of safety. The Thread of Provenance shows her *exactly* how the Hive determined a food was safe.

### **1. The Structure of the "Thread of Provenance"**

The Thread of Provenance is a JSON file, bundled with the structured data and its raw pollen sources. It is composed of sections that chronicle the creation of the knowledge, providing the blueprint for trust.

*   **A. The Hive's Identity (`hiveIdentity`):** This section identifies the "artisans" of the data for reproducibility checks.
    *   `hiveId`, `kikkoVersion`, `deviceFingerprint`, `activeSwarm` (Gemma, ML Kit versions, etc.).

*   **B. The Foraging Chronicle (`pollenChronicle`):** A timestamped log of every piece of raw data contributed **by the user**. This is the core of the proof.
    *   An array of "pollen" objects:
        *   `{ "timestamp": "...", "pollenType": "Visual", "source": "forager_camera", "reference": "pollen/ingredients_001.jpg", "hash": "sha256:..." }`
        *   `{ "timestamp": "...", "pollenType": "Contextual", "source": "device_gps", "data": { "latitude": "...", "longitude": "..." } }`

*   **C. The Hive Partnership Log (`hiveLog`):** A log of the key steps performed **by the Hive's internal AI** in collaboration with the Forager. This section is the technical **blueprint for Inference Reproduction**.
    *   An array of "dialogue" steps:
        *   `{ "timestamp": "...", "agent": "WorkerBee_OCR", "action": "Extraction", "input": "ingredients_001.jpg", "output": "{ 'text': 'Flour, Sugar, Peanuts...' }" }`
        *   `{ "timestamp": "...", "agent": "AI_Queen_Gemma", "action": "Suggestion", "input": "{ 'text': 'Flour, Sugar, Peanuts...' }", "output": "{ 'identifiedType': 'gs1:FoodProduct', 'confidence': 0.99 }" }`
        *   `{ "timestamp": "...", "agent": "AI_Queen_Gemma", "action": "Query", "query": "The word 'Peanut' was detected. Is this a confirmed allergen for you?", "options": ["Yes, severe", "Yes, mild", "No"] }`
        *   `{ "timestamp": "...", "agent": "Forager_Léa", "action": "UserAnswer", "answer": "Yes, severe" }`
        *   `{ "timestamp": "...", "agent": "AI_Queen_Gemma", "action": "FinalDecision", "decision": "STATUS_UNSAFE", "reason": "Confirmed allergen 'Peanut' detected in ingredients." }`

*   **D. The Hornet's Nest (`hornetLog`):** If external data was integrated, this section provides its full context for **traceability**.
    *   `{ "timestamp": "...", "action": "HornetOfferAccepted", "sourceUrl": "https://www.google.com/search?q=...", "savedHtmlReference": "hornet/cookie_overview_001.html" }`

| Introduction | Action | Conclusion |
| :---: | :---: | :---: |
| <img src="illustrations/prov_intro_v2.png" alt="Cinematic 3D render, animation movie style. A completed, glowing honeycomb cell is presented (e.g., about a cookie for Léa). A small, intricate hexagonal seal made of golden and grayish wax is forming on its surface, pulsating with inner light, symbolizing its mixed-source but fully transparent provenance."> | <img src="illustrations/prov_action_v2.png" alt="Cinematic 3D render, animation movie style, viewed from over her shoulder. A young girl's finger (Léa's, with yellow raincoat sleeve) touches the glowing wax seal on her phone screen. It elegantly unfolds into a holographic, luminous scroll (emakimono), revealing a beautiful infographic of the data's journey, clearly separating the Hive's reproducible steps from the Hornet's traceable HTML source."> | <img src="illustrations/prov_conclusion_v2.png" alt="Cinematic 3D render, animation movie style. The final structured data (the 'Microsite' for the cookie) is shown next to its complete, verified Thread of Provenance scroll. Both are bundled together as a single, glowing, shareable 'Trusted Package' of knowledge. The Bourdon hovers nearby, looking proud of the transparency."> |
| **The Seal of Trust:** Every piece of knowledge is automatically stamped with an unforgeable seal, signifying its transparent history. | **Unfolding the Story:** The user can inspect this seal, revealing the complete journey of the data's creation, from raw input to final structure, separating reproducible Hive logic from traceable Hornet sources. | **The Trusted Package:** The final data and its provenance are intrinsically linked, creating a single, verifiable unit of knowledge ready for use or sharing. |

### **2. The Role in Gameplay: The Ultimate Prize**

The Thread of Provenance is the soul of the reward system, distinguishing levels of trust within the knowledge itself.

*   **The Mark of the Hornet:** Data integrated from a Hornet's AI Overview is **traceable** to its source HTML but not **reproducible**. It's marked with a grayish tint. For Léa, this means "This information is from the web, use with caution for allergy decisions."
*   **The Seal of the Forager:** Data forged through the human-AI partnership receives the vibrant golden **Seal of Trust**. It is fully **reproducible**. For Léa, this means "This information has been verified by your Hive, based on the physical product. You can trust it." It grants the highest rewards and unlocks advanced features.
*   **A Visual Representation of Trust:** Léa's Hive becomes a visual library of food safety. Golden honeycombs are her "safe list," while grayish ones are "use with caution." This visual language is intuitive and powerful.

### **3. The Impact on Sharing: The Gift of Verifiable Trust**

When a user shares a "Trusted Package", they empower the recipient with unprecedented trust, enabled by our core innovation:

**Inference Reproduction.**

A parent receiving a "SAFE" food Microsite for their allergic child doesn't just have to take the sender's word for it. Their own Kikko Hive can automatically unroll the Thread of Provenance, re-examine the original photo of the ingredients, and **reproduce the exact inference steps** that the sender's Hive took to confirm its safety. This is trust, but with proof. This moves us from a world of "black box" data to a world of **"glass box" data**, where the process of creation is as important as the result, and is fully verifiable by anyone in the community.

**Conclusion:**
The Thread of Provenance is the soul of Kikko. It transforms the app from a clever data-capture tool into a powerful statement on information integrity and personal agency. It is the mechanism that gives weight and meaning to the Forager's choice, providing not only the power to remember, but the profound satisfaction of knowing that their memories are pure, their history is intact, and their knowledge is verifiably real through **inference reproduction** and transparent sourcing.