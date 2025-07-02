# Document 3/10: A Forager's Life - The Core Gameplay Loop

**Title:** A Forager's Life: The Core Gameplay Loop of Kikko

**Objective:** To define the primary mechanics of the game, detailing the "Foraging" process from the initial quest to the final reward, and establishing the core loop that drives user engagement.

---

### **Core Philosophy: From Chore to Quest**

The fundamental gameplay loop of Kikko is designed to transform the mundane act of data entry into an exciting and rewarding **Quest for Knowledge**. The user is not "filling out a form"; they are assisting their AI companion on a mission of discovery. This re-framing is crucial for maintaining long-term engagement. The loop is simple, satisfying, and cyclical: **Quest -> Forage -> Process -> Reward.**

### **1. The Quest: The Call from the Hive**

The loop begins when the AI Queen identifies an opportunity to learn more about the user's world. This "call to action" is presented as a Quest.

*   **Proactive Quests:** The Hive can be proactive. Using on-device sensors (location, time, or even subtle visual cues from the camera feed), it can generate quests.
    *   *Example:* "We are in a new place, Forager! The 'pollen' of this location is unknown. Shall we capture its coordinates?"
    *   *Example:* "I detect text on that sign. Its meaning is a mystery to me. Can you forage it with a photo?"
*   **User-Initiated Quests:** The user can initiate a quest at any time by simply pointing their device at an object and tapping the "Forage" button. This is equivalent to telling the Hive, "This is important to me. Learn about it."
*   **Quest Interface:** A quest is presented visually as a translucent, glowing hexagonal frame that overlays the object of interest in the "Great Bay Window" (the camera view). It contains a simple icon representing the type of pollen needed (e.g., a camera icon for visual pollen, a microphone for auditory pollen).

| Introduction | Action | Conclusion |
| :---: | :---: | :---: |
| <img src="illustrations/gp_intro.png" alt="Cinematic 3D render. The Hive's UI overlays the real world. A translucent honeycomb with a '?' icon hovers over a bottle of wine on a restaurant table, signifying a new quest."> | <img src="illustrations/gp_action.png" alt="Cinematic 3D render. Hiro's thumb presses the quest honeycomb on the screen. The UI confirms the action with a gentle flash of light."> | <img src="illustrations/gp_conclusion.png" alt="Cinematic 3D render. The view transitions to the 'Inner Hive' where a new, empty, pulsing honeycomb cell appears, ready to receive the pollen from the quest."> |
| **The Call:** The Queen identifies a learning opportunity and presents it as a simple, visual quest. | **The Acceptance:** The user accepts the quest with a single, simple tap. | **The Preparation:** Inside the Hive, a new memory cell is prepared, creating a sense of anticipation. |

### **2. The Foraging: Capturing the Pollen**

This is the central action performed by the user. "Foraging" is the act of capturing raw, unstructured information from the real world.

*   **Multimodal Input:** The user chooses their "foraging tool" based on the nature of the information:
    *   **The Camera (Visual Pollen):** The primary tool. Used for capturing photos of objects, text on labels (OCR), barcodes, or even short video clips.
    *   **The Microphone (Auditory Pollen):** For dictating notes, descriptions, or recording ambient sounds associated with a memory.
    *   **Sensors (Contextual Pollen):** The Hive can automatically gather GPS location, timestamps, and other sensor data to add rich context to every piece of pollen.
*   **The "Pollen" Metaphor:** The captured data is visualized as beautiful, glowing particles of light that are "sucked" into the Hive icon. This transforms a technical process (uploading a file) into a magical and organic one. The color of the pollen can even vary based on its type (e.g., golden for visual, cyan for auditory).

### **3. The Process: The Alchemy of the Worker Bees**

This phase is automated and happens inside the Hive, providing a moment of spectacle and feedback for the user.

*   **Extraction:** The Worker Bees (ML Kit) get to work. The OCR Bee extracts text, the Barcode Bee decodes symbols, the Voice Bee transcribes audio. This is visualized as the bees "dissecting" the pollen particles.
*   **Reasoning:** The processed data is sent to the AI Queen (Gemma). This is the most critical step. The Queen analyzes the fragments, cross-references them with its existing knowledge of schemas (Schema.org, GS1), and understands the context.
    *   *Example:* If OCR extracts "13.5% vol" and "750ml", the Queen knows these correspond to `alcoholPercentage` and `netContent`. If the user says "un vin rouge de Bordeaux", the Queen maps this to `category` and `origin`.
*   **Structuring:** The Queen assembles the fragments into a coherent, structured piece of data—the "Informative Honey."

| Introduction | Action | Conclusion |
| :---: | :---: | :---: |
| <img src="illustrations/process_intro.png" alt="Cinematic 3D render. Inside the Hive, a glowing orb of golden pollen floats. Cute robot bees with specialized tools (a lens, a soundwave antenna) swarm around it."> | <img src="illustrations/process_action.png" alt="Cinematic 3D render. Close-up on one robot bee projecting a light beam that scans the pollen, breaking it down into smaller, organized data streams of text and numbers."> | <img src="illustrations/process_conclusion.png" alt="Cinematic 3D render. The processed data streams flow towards the AI Queen, who elegantly weaves them together into a single, shimmering thread of structured knowledge."> |
| **The Raw Material:** The user's captured pollen arrives in the Hive, ready for processing. | **The Workers' Craft:** Specialized AI agents (ML Kit) extract raw information from the pollen. | **The Queen's Wisdom:** The orchestrator AI (Gemma) understands, connects, and structures the information. |

### **4. The Reward: The Sweet Taste of Knowledge**

This is the final, crucial step of the loop, designed to provide positive reinforcement and a clear sense of accomplishment.

*   **Filling the Honeycomb:** On the user's screen, the empty quest honeycomb animates, filling up with shimmering, golden liquid honey. This provides immediate, non-verbal feedback that the quest is complete.
*   **Data Unveiling:** The raw data is replaced by its structured form. "750ml" becomes a clean field labeled "Net Content".
*   **Points & Badges:** The user is awarded "Honey Points" for their contribution. Completing certain types of quests or a series of related quests unlocks stylish Badges (e.g., "Sommelier in Training," "Librarian's Apprentice," "Urban Explorer").
*   **Augmented Memory:** The most important reward. The new piece of knowledge is now part of the user's personal memory graph, ready to be recalled, connected, and used to answer future questions.

**Conclusion:**
The gameplay loop of Kikko is a virtuous cycle. By gamifying the act of observation and data collection, we encourage the user to be more present and curious about their own world. Each completed loop not only provides a satisfying reward but also makes the user's personal AI companion smarter and more useful, creating a powerful incentive to embark on the next quest.