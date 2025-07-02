# Document 3/10: A Forager's Life - The Core Gameplay Loop

**Title:** A Forager's Life: The Core Gameplay Loop of Kikko

**Objective:** To define the primary mechanics of the game, detailing the "Foraging" process from the initial quest to the final reward, and establishing the core loop that drives user engagement and learning through conscious choices.

---

### **Core Philosophy: From Chore to Quest**

The fundamental gameplay loop of Kikko is designed to transform the mundane act of data entry into an exciting and rewarding **Quest for Knowledge**. The user is not "filling out a form"; they are assisting their AI companion on a mission of discovery. This re-framing is crucial for maintaining long-term engagement. The loop is simple, satisfying, and cyclical: **Quest -> Forage -> Process -> Reward.**

### **1. The Quest: The Call from the Hive**

The loop begins when the AI Queen identifies an opportunity to learn more about the user's world. This "call to action" is presented as a Quest.

*   **Proactive Quests (Optional):** The Hive can be proactive (if enabled by the user). Using on-device sensors, it can generate quests.
    *   *Example:* "We are in a new place, Forager! The 'pollen' of this location is unknown. Shall we capture its coordinates?"
*   **User-Initiated Quests:** The user can initiate a quest at any time by simply pointing their device at an object and tapping the "Forage" button. This is equivalent to telling the Hive, "This is important to me. Learn about it."
*   **Quest Interface:** A quest is presented visually as a translucent, glowing hexagonal frame that overlays the object of interest in the "Great Bay Window" (the camera view). The **Bourdon** often verbally introduces the quest with a nonchalant remark.

| Introduction | Action | Conclusion |
| :---: | :---: | :---: |
| <img src="illustrations/gp1_intro.png" alt="Cinematic 3D render, animation movie style. The AI Queen inside the Hive looks thoughtfully at a blank, empty honeycomb cell on her holographic interface, symbolizing a gap in knowledge. She then makes a subtle gesture towards the Great Bay Window."> | <img src="illustrations/gp1_action.png" alt="Cinematic 3D render, animation movie style. On Hiro's phone screen (the Great Bay Window), a quest honeycomb gracefully materializes over a real-world object (e.g., a curious old key on a wooden table). The lazy Bourdon floats nearby, observing the quest appearing with a slight yawn."> | <img src="illustrations/gp1_conclusion.png" alt="Cinematic 3D render, animation movie style. Close-up on Hiro's determined face, seen in a slight reflection on his phone. His eyes light up with a sense of adventure as he sees the new quest, eager to begin foraging."> |
| **The Need:** The AI Queen identifies a missing piece of knowledge relevant to her user's world. | **The Call:** A quest visually appears on the user's screen, highlighting the object for foraging. The Bourdon might offer a quick, playful commentary. | **The Engagement:** The user accepts the quest, turning a simple observation into a personal adventure. |

### **2. The Foraging: Capturing the Pollen**

This is the central action performed by the user. "Foraging" is the act of capturing raw, unstructured information directly from the real world using the device's sensors.

*   **Multimodal Input:** The user chooses their "foraging tool" based on the nature of the information:
    *   **The Camera (Visual Pollen):** The primary tool. Used for capturing photos of objects, text on labels (OCR), barcodes, documents (Document Scanner), or even identifying objects (Object Detection & Tracking) and their labels (Image Labeling).
    *   **The Microphone (Auditory Pollen):** For dictating notes, descriptions (Speech Recognition), or recording ambient sounds.
    *   **Sensors (Contextual Pollen):** The Hive can automatically gather GPS location, timestamps, and other sensor data to add rich context.
    *   **Digital Ink Recognition:** For capturing handwritten notes.
*   **The "Pollen" Metaphor:** The captured data is visualized as beautiful, glowing particles of light that are "sucked" into the Hive icon. This transforms a technical process into a magical and organic one.

| Introduction | Action | Conclusion |
| :---: | :---: | :---: |
| <img src="illustrations/gp2_intro.png" alt="Cinematic 3D render, animation movie style. Hiro aims his smartphone camera at a stack of old, intriguing books. The quest honeycomb frames them perfectly, ready for capture."> | <img src="illustrations/gp2_action.png" alt="Cinematic 3D render, animation movie style. As Hiro taps the screen, the image of the books dissolves into a swirling vortex of golden light particles (visual pollen) that are drawn towards the Hive icon. The action feels magical and satisfying."> | <img src="illustrations/gp2_conclusion.png" alt="Cinematic 3D render, animation movie style. The Hive icon on the screen glows brightly, pulsing once to signify that the pollen has been successfully collected and stored. The Bourdon gives a subtle nod of approval."> |
| **The Target:** The user aims their device at the object of the quest, preparing to gather raw information. | **The Capture:** The user's action transforms the physical object into magical, digital "pollen" that flows into the Hive. | **The Collection:** The Hive confirms successful collection, providing immediate, satisfying visual feedback. |

### **3. The Process: The Alchemy of Partnership & The Bourdon's Offer**

This is the most critical and complex phase, combining automated processing with a crucial choice presented by the Bourdon.

*   **Initial Extraction (Worker Bees - ML Kit):** As pollen enters the Hive, the Worker Bees (e.g., Text Recognition v2, Barcode Scanning, Image Labeling, Object Detection, Entity Extraction, Language Identification) immediately begin processing it in parallel.
*   **The Bourdon's Intervention & The Hornet's Offer:** Simultaneously, if the captured object is common or easily identifiable online, the **Bourdon** quickly performs a **web search via an internal WebView**. He extracts the "AI Overview" (e.g., from Google Search Generative Experience) as "Hornet's Pollen." He then pops up, holding this pre-packaged answer.
    *   **Bourdon's Dialogue:** `"Hé, Butineur ! Pendant que la Mémère et les filles triment, j'ai demandé à un Frelon du web. Voici une réponse toute prête. Rapide, non ? Qu'est-ce que tu préfères ? L'info facile, ou faire le travail toi-même ?" (He presents a split-screen UI: one side with the AI Overview, the other showing the slow progress of the Worker Bees).`
    *   **The Choice:** The user must decide:
        1.  **"Accept Hornet's Answer":** Instant honey, but without a Thread of Provenance. It's marked with the Hornet's icon. (Low Honey Points).
        2.  **"Forge with the Queen":** The user waits for the Hive's internal process to complete, collaborating with the Queen. (High Honey Points, Seal of Trust).
*   **The Queen's Alchemy (Gemma) & User Validation:** If the user chooses to "Forge with the Queen," the AI Queen (Gemma) takes the pure, raw pollen. She suggests classification and structuring, engaging in a dialogue with the user for validation. This collaborative process ensures accuracy and context.

| Introduction | Action | Conclusion |
| :---: | :---: | :---: |
| <img src="illustrations/proc_intro_v2.png" alt="Cinematic 3D render, animation movie style. Inside the Hive, golden pollen flows into a central chamber. Small, diligent Worker Bees (ML Kit) immediately start extracting data with light beams, but their progress bar is visible and moving slowly."> | <img src="illustrations/proc_action_v2.png" alt="Cinematic 3D render, animation movie style. The plump Bourdon, with a smug grin, floats in front of the Worker Bees, holding a glowing digital 'AI Overview' from a web search. He gestures towards the user, offering the instant answer as a tempting shortcut. The Queen watches calmly in the background."> | <img src="illustrations/proc_conclusion_v2.png" alt="Cinematic 3D render, animation movie style. The Bourdon's 'AI Overview' vanishes as Hiro rejects it. The Queen (Gemma) confidently weaves the raw pollen from the Worker Bees into a shimmering thread of pure knowledge. The Worker Bees continue their diligent work."> |
| **The Race Against Time:** Pure pollen arrives in the Hive, and Worker Bees begin processing, but it's a multi-step, slower process. | **The Temptation of Ease:** The Bourdon offers an instant, pre-digested answer from external cloud AI (AI Overview from Google Search), challenging the Forager's patience. | **The Path Chosen:** If the Forager chooses purity, the Queen confidently takes over the processing, ensuring the knowledge is truly forged by the Hive, not merely imported. |

### **4. The Reward: The Sweet Taste of Trusted Knowledge**

This is the final, crucial step of the loop, designed to provide positive reinforcement and a clear sense of accomplishment.

*   **Filling the Honeycomb:** On the user's screen, the empty quest honeycomb animates, filling up with shimmering, golden liquid honey. This is only for honey forged with the Queen.
*   **Data Unveiling & Seal of Trust:** The raw data is replaced by its structured, validated form. A **"Seal of Trust"** appears, signifying its verifiable origin. Hornet-sourced honey has a duller, opaque seal.
*   **Points & Badges:** The user is awarded "Honey Points" (more for pure honey) and can unlock stylish Badges.
*   **Augmented Memory:** The new, **trusted knowledge** is now part of the user's personal memory graph, ready to be recalled and connected.

| Introduction | Action | Conclusion |
| :---: | :---: | :---: |
| <img src="illustrations/gp4_intro.png" alt="Cinematic 3D render, animation movie style. The AI Queen, inside the hive, holds a completed, glowing honeycomb cell, now stamped with a Seal of Trust. The Bourdon watches with a satisfied, appreciative expression."> | <img src="illustrations/gp4_action.png" alt="Cinematic 3D render, animation movie style. The completed honeycomb cell flies from the Queen, through the Great Bay Window, and materializes on the user's screen with a satisfying 'pop' and a shower of reward points."> | <img src="illustrations/gp4_conclusion.png" alt="Cinematic 3D render, animation movie style. Hiro looks at his screen, where his collection of glowing, trusted honeycomb cells forms a beautiful mosaic. He smiles, proud of the authentic knowledge he has built himself."> |
| **The Creation:** The AI Queen finishes crafting the "Informative Honey" in partnership with the user, certified pure. | **The Delivery:** The result of the quest is delivered to the user's interface with satisfying visual and audio feedback, reinforcing the value of foraging. | **The Collection:** The user sees their personal knowledge base grow, a beautiful and tangible representation of their journey and effort, filled with trustworthy information. |

**Conclusion:**
The gameplay loop of Kikko is a virtuous cycle. By gamifying the act of observation and data structuring, we encourage the user to be more present and curious. Each completed loop not only provides a reward but also makes the user's AI companion smarter and more useful, creating a powerful incentive to embark on the next quest for authentic, personal knowledge.