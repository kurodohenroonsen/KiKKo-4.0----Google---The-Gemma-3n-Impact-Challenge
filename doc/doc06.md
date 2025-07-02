# Document 6/10: The Thread of Provenance - The Seal of Trust

**Title:** The Thread of Provenance: The Unbreakable Seal of Trust

**Objective:** To detail the structure, purpose, and in-game representation of the Provenance Document. This feature is positioned as the ultimate reward for choosing personal discovery over opaque convenience, guaranteeing transparency and trust in the knowledge created by the Forager.

---

### **Core Philosophy: The Story is the Reward**

In an age where AI can provide any answer, the answer itself loses value. The new value lies in its **origin story**. In Kikko, the "Informative Honey" is useful, but its true power comes from the verifiable story of its creation. The **Thread of Provenance** is that story.

It is not just metadata; it is a "Seal of Trust," the tangible proof that a piece of knowledge was born from the Forager's own experience, not accepted from an opaque cloud source. It is the definitive answer to the question: *Why should I trust this memory?* Because **you** were there. **You** created it. Here is the proof.

### **1. The Structure of the "Thread of Provenance"**

The Thread of Provenance is a JSON file, bundled with the structured data and its raw pollen sources. It is composed of three main sections that chronicle the partnership between the Forager and their Hive.

*   **A. The Hive's Identity (`hiveIdentity`):** This section identifies the "artisans" of the data.
    *   `hiveId`: A unique, locally generated identifier for the user's Kikko instance.
    *   `kikkoVersion`: The version of the application (e.g., "1.0.0").
    *   `activeSwarm`: An array listing the AI agents that participated.
        *   `queenAI`: `{ "name": "Gemma", "version": "2B-OnDevice-V1.2" }`
        *   `workerBees`: `[ { "role": "Oculist", "name": "ML Kit Text Recognition", "version": "18.0.2" }, { ... } ]`

*   **B. The Foraging Chronicle (`pollenChronicle`):** A timestamped log of every piece of raw data contributed **by the user**. This is the core of the proof.
    *   An array of "pollen" objects:
        *   `{ "timestamp": "...", "pollenType": "Visual", "source": "forager_camera", "reference": "pollen/image_001.jpg" }`
        *   `{ "timestamp": "...", "pollenType": "Auditory", "source": "forager_microphone", "data": { "transcription": "Tastes like cherries..." }, "reference": "pollen/audio_001.wav" }`

*   **C. The Partnership Log (`partnershipLog`):** A log of the key dialogue steps between the Queen and the Forager. This demonstrates collaboration, not blind acceptance.
    *   An array of "dialogue" steps:
        *   `{ "timestamp": "...", "action": "Suggestion", "queenSuggestion": "{ 'identifiedType': 'schema:Wine', 'confidence': 0.95 }" }`
        *   `{ "timestamp": "...", "action": "UserConfirmation", "userAction": "Confirmed 'schema:Wine'" }`
        *   `{ "timestamp": "...", "action": "UserCorrection", "queenSuggestion": "Vintage: 1998", "userCorrection": "Vintage: 1999" }`

| Introduction | Action | Conclusion |
| :---: | :---: | :---: |
| <img src="illustrations/prov_intro.png" alt="Cinematic 3D render, animation movie style. A glowing honeycomb cell of 'honey' is presented. A small, intricate hexagonal seal made of golden wax is forming on its surface, pulsating with light."> | <img src="illustrations/prov_action.png" alt="Cinematic 3D render, animation movie style. A finger touches the seal, which elegantly unfolds into a holographic scroll (emakimono), revealing a beautiful infographic of the data's journey, from photo to final structure."> | <img src="illustrations/prov_conclusion.png" alt="Cinematic 3D render, animation movie style. The final structured data (the 'honey') is shown next to its complete, verified Thread of Provenance scroll. Both are bundled together in a single, shareable package of light."> |
| **The Seal of Trust:** Every piece of knowledge created through personal foraging is automatically stamped with a seal, signifying its verifiable history. | **Unfolding the Story:** The user can inspect the seal at any time, revealing the entire creation process in a simple, visual, and understandable way. | **The Trusted Package:** The final data and its provenance are intrinsically linked, creating a single, verifiable unit of knowledge ready for use or sharing. |

### **2. The Role in Gameplay: The Ultimate Prize**

The Thread of Provenance is the core of the reward system.

*   **The Mark of the Hornet:** If a user accepts an answer from the Hornet, the resulting honeycomb has **no Thread of Provenance**. Its seal is gray and marked with the Hornet's icon. It is useful but untrustworthy knowledge. It provides minimal points.
*   **The Seal of the Forager:** A honeycomb created through the personal foraging loop receives the golden **Seal of Trust**. This is the visual indicator of a "pure" memory. It grants the highest rewards, unlocks special badges ("Master Forager," "Guardian of Truth"), and is the only type of honey that can be used for certain advanced, long-term memory connections.
*   **A Visual Representation of Your Choices:** Over time, the user's Hive becomes a mosaic of their decisions. A sea of golden, trusted honeycombs is a testament to their dedication to building an authentic memory, while a few gray "Hornet" cells represent moments where they chose convenience.

### **3. The Impact on Sharing: The Gift of Trust**

When a user shares a honeycomb via WebTorrent, they are sharing the complete "Trusted Package": the data, its provenance, and the raw pollen.

*   **Empowering the Recipient:** A friend who receives your recommendation for a restaurant doesn't just get a name and address. They receive the **proof**. They can unroll the Thread of Provenance and see the original photo you took of the menu, hear your voice note about the ambiance, and see how you and your Queen structured that information together.
*   **The New Standard for Information:** This creates an unparalleled level of trust. We move from a world of "black box" data, where we must trust the source blindly, to a world of **"glass box" data**, where the process is as important as the result.

**Conclusion:**
The Thread of Provenance is the soul of Kikko. It transforms the app from a clever data-capture tool into a powerful statement on information integrity. It is the mechanism that gives weight and meaning to the Forager's choice. It provides not only the power to remember, but the profound satisfaction of knowing that your memories are pure, your history is intact, and your knowledge is verifiably real.