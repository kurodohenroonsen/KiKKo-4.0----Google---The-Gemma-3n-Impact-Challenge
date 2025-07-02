# Document 4/10: The Alchemy of Honey - The Role of the AIs

**Title:** The Alchemy of Honey: The Symbiotic Roles of the AI Agents

**Objective:** To define the conceptual technical architecture of Kikko's on-device AI system, detailing the distinct responsibilities of the "Worker Bees" (ML Kit) and the "AI Queen" (Gemma), and how they collaborate to create structured knowledge.

---

### **Core Philosophy: A Hive, Not a Monolith**

Kikko's intelligence is not a single, monolithic AI. It is a **symbiotic swarm** of specialized agents, each with a precise function. This approach mirrors a real beehive, where different bees perform different tasks for the good of the whole. This distributed, task-specific architecture is more efficient, more modular, and allows us to use the best tool for each job.

The process follows a clear pipeline: **Capture -> Extraction -> Reasoning -> Structuring.**

### **1. The Worker Bees: Specialists in Raw Data Extraction (ML Kit)**

The Worker Bees are the first to interact with the raw "pollen" brought back by the Forager. They are highly efficient, single-purpose models from Google's ML Kit, designed for fast and accurate on-device data extraction. They do not understand context; they simply convert unstructured reality into digital text or codes.

*   **The Oculist Bee (ML Kit Text Recognition - OCR):**
    *   **Function:** To read. When presented with visual pollen (a photo of a label, a document, a sign), this bee extracts every character of text it can see.
    *   **Output:** A raw, unstructured string of text. Example: `"Château La Pompe\nGrand Vin de Bordeaux\n2025 - 13% vol. - 750ml"`
*   **The Scanner Bee (ML Kit Barcode Scanning):**
    *   **Function:** To decode. When it detects a barcode or QR code in the visual pollen, this bee instantly deciphers it.
    *   **Output:** A standardized code string. Example: `"gtin": "314159265359"`
*   **The Listener Bee (ML Kit Speech Recognition):**
    *   **Function:** To transcribe. When the Forager provides auditory pollen (a voice note), this bee converts the soundwaves into text.
    *   **Output:** A raw transcription. Example: `"This wine tastes like cherry and pairs well with cheese."`
*   **The Identifier Bee (ML Kit Language ID & Entity Extraction):**
    *   **Function:** To pre-sort. This bee can analyze the text produced by other workers to identify the language and extract basic, pre-defined entities like addresses, dates, or phone numbers.
    *   **Output:** Tagged text fragments. Example: `{ "ADDRESS": "123 Forager Lane", "PHONE": "555-0123" }`

| Introduction | Action | Conclusion |
| :---: | :---: | :---: |
| <img src="illustrations/mlkit_intro.png" alt="Cinematic 3D render, animation movie style. A glowing orb of 'pollen' (a photo of a wine label) floats inside the Hive. A team of cute, specialized robot bees with different tools (a lens, a barcode scanner) surrounds it."> | <img src="illustrations/mlkit_action.png" alt="Cinematic 3D render, animation movie style. One robot bee projects a beam of light, extracting glowing text strings from the pollen. Another bee extracts a barcode string. The data is still raw and disconnected."> | <img src="illustrations/mlkit_conclusion.png" alt="Cinematic 3D render, animation movie style. The worker bees present their findings—neat streams of raw text and numbers—to the AI Queen, who waits patiently at the center of the Hive."> |
| **The Raw Pollen:** An unstructured piece of information from the user's world arrives in the Hive. | **The Specialists' Work:** The Worker Bees (ML Kit) perform their specific tasks, converting the raw pollen into digital text and codes. | **The Prepared Ingredients:** The workers deliver the extracted, but still un-contextualized, data to the Queen for the next stage. |

### **2. The AI Queen: The Weaver of Context and Meaning (Gemma)**

The AI Queen is the orchestrator, the brain of the Hive. She receives the simple, digitized outputs from her Worker Bees and performs the most critical task: **reasoning**. She uses a Large Language Model (like Gemma) to understand the *meaning* and *relationships* between the data fragments.

*   **Function 1: Identification & Classification:**
    *   The Queen receives the extracted data and determines the nature of the entity.
    *   **Example Prompt:** `Given this extracted text: {"Château La Pompe", "Grand Vin de Bordeaux", "13% vol."}, and this barcode type: {"EAN-13"}, which schema is the most appropriate: 'schema:Book', 'gs1:FoodBeverageTobaccoProduct', or 'schema:Car'?`
    *   **Output:** A structured decision: `{ "identifiedType": "gs1:Beverage" }`

*   **Function 2: Data-to-Property Mapping:**
    *   Once the type is identified, the Queen maps the raw data to the correct properties of that schema. She has access to our local database of schemas to know what properties to look for.
    *   **Example Prompt:** `For the schema 'gs1:Beverage', map the following data to their correct properties: {"name": ?, "alcoholPercentage": ?, "countryOfOrigin": ?}. Data available: {"Château La Pompe", "Bordeaux", "13% vol"}.`
    *   **Output:** A structured JSON fragment: `{ "name": "Château La Pompe", "alcoholPercentage": "13", "origin": "Bordeaux" }`

*   **Function 3: Structuring Complex Information:**
    *   The Queen understands nested structures. When the Identifier Bee extracts an address, the Queen knows how to format it as a `schema:PostalAddress` object.
    *   **Example Prompt:** `Structure the following address for a 'schema:PostalAddress' object: {"123 Forager Lane 90210 Beverly Hills CA"}.`
    *   **Output:** `{ "address": { "@type": "PostalAddress", "streetAddress": "123 Forager Lane", "postalCode": "90210", "addressLocality": "Beverly Hills", "addressRegion": "CA" } }`

*   **Function 4: Dialogue and Clarification:**
    *   If the data is ambiguous, the Queen formulates the next question for the Forager.
    *   **Example Logic:** If OCR extracts "Expires 12/25," the Queen knows this is ambiguous.
    *   **Output for UI:** `Ask user: "Does '12/25' refer to December 2025 or the 12th of the Month, 2025?" Provide choice cards: ["December 2025", "12th of the Month, 2025"].`

| Introduction | Action | Conclusion |
| :---: | :---: | :---: |
| <img src="illustrations/gemma_intro.png" alt="Cinematic 3D render, animation movie style. The wise AI Queen contemplates the streams of raw data flowing from her worker bees. Her glowing spectacles analyze the information."> | <img src="illustrations/gemma_action.png" alt="Cinematic 3D render, animation movie style. The Queen gracefully weaves the data streams together with her hands of light. The streams snap into place within a holographic, hexagonal data structure (a JSON object)."> | <img src="illustrations/gemma_conclusion.png" alt="Cinematic 3D render, animation movie style. The Queen holds up a finished, shimmering honeycomb cell. Inside, the data is perfectly structured and organized. She looks satisfied with her work."> |
| **The Unstructured Data:** The Queen receives the raw, digitized information from her workers. | **The Act of Reasoning:** She uses her knowledge of schemas to classify the entity, map data to properties, and structure complex information. | **The Informative Honey:** The final output is a perfectly structured, context-rich piece of knowledge, ready to be stored in the user's memory. |

**Conclusion:**
Kikko's intelligence is a two-stage rocket. ML Kit provides the initial, powerful "first stage" of fast and efficient data extraction. Gemma provides the crucial "second stage" of contextual understanding, reasoning, and structuring. This symbiotic relationship allows Kikko to transform messy, real-world information into beautiful, reliable, and useful "Informative Honey," all within the private sanctuary of the user's device.