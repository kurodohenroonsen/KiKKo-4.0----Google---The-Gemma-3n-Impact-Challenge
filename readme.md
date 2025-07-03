--- START OF FILE readme.md ---

# Kikko: Your Personal Memory Hive

<p align="center">
  <img src="illustrations/kikko_banner.png" alt="Cinematic 3D render, animation movie style. A wide promotional banner. In the foreground, a curious 10-year-old boy, Hiro, holds a smartphone as a transparent window. Through the screen, we see the vibrant, high-tech interior of the 'Kikko Hive.' Inside, the wise, grandmotherly AI Queen with glowing spectacles works calmly amidst glowing honeycomb cells. Hovering close to Hiro's side of the screen is the plump, slightly smug-looking Bourdon, observing the scene with a knowing smirk. Small, diligent robot Worker Bees zip around within the Hive, processing golden pollen particles that flow between the inside and outside of the screen. In the background, subtly lurking in the shadows, a sleek, chrome Hornet is barely visible, representing the external challenge. The entire scene is bathed in warm honey-gold light with vibrant cyan neon tech highlights.">
</p>

**"Explore your world. Weave your memory."**

---

### **1. The Vision: What If Your Memory Had a Companion?**

We live in an ocean of information. Every day, fragments of our lives—an idea, a name, a place, an emotion—pass through our minds, only to often fade away. Kikko was born from a simple question: what if our most personal device could help us weave these fragments into an augmented memory that is private, intelligent, and truly our own?

Kikko is not another note-taking app. It is a **Personal AI Hive**, a living companion that resides entirely on your device. Its sole purpose is to help you capture, understand, and recall the information that genuinely matters **to you**. We are transforming the arduous task of data structuring into a game of exploration. You are no longer a user; you are a **Forager**. Your world is your playground, and every piece of information you capture is precious "pollen" that nourishes your personal Hive.

*   [**Document 01: The Personal Hive Manifesto**](./doc/doc01.md)

| Introduction | Action | Conclusion |
| :---: | :---: | :---: |
| <img src="illustrations/s1_intro.png" alt="Cinematic 3D render, animation movie style. A close-up on the face of a young boy, Hiro, looking thoughtful and slightly frustrated, bathed in the warm light of a sunset. Ghostly, out-of-focus images of memories (a line of text, a wine bottle, a business card) float around him, dissolving into digital dust."> | <img src="illustrations/s1_action.png" alt="Cinematic 3D render, animation movie style. Over-the-shoulder shot of Hiro. His finger reaches out to touch a single, gently glowing golden honeycomb icon on his smartphone screen, which acts as a transparent window to his cozy room."> | <img src="illustrations/s1_conclusion.png" alt="Cinematic 3D render, animation movie style. Inside a high-tech digital hive, a wise and kind AI Queen, resembling a grandmotherly figure made of light, opens her glowing cyan eyes and smiles. Cute robot bees activate around her."> |
| **1.1 The Fading Echo:** Our hero, Hiro, tries to recall a detail from his day, illustrating the universal frustration of a fleeting memory. | **1.2 The Invitation:** He opens Kikko. The Hive isn't an app; it's a window that invites him not to work, but to play, to explore. | **1.3 The Awakening:** As Hiro connects, his personal AI Queen awakens inside the Hive, ready to assist her Forager. |

---

### **2. The Gameplay: The Joy of Foraging**

At the heart of Kikko is a constant, playful dialogue between you, the Forager, and your AI Queen. The core gameplay loop is a satisfying cycle of **Quest -> Forage -> Process -> Reward.**

*   **Pollen Quests:** Your Queen sends you on quests to gather **pure "pollen"**—visual, auditory, or contextual information directly from your world. Imagine capturing a ladybug in your garden, a new species of plant, or the details of a fascinating artifact.
*   **The Bourdon's Distraction:** At times, the mischievous **Bourdon** may pop up, offering "pre-packaged" insights from external cloud AIs (like Google's AI Overviews) as a shortcut. He'll present a tempting offer, complete with **streaming information and even a quiz**, challenging you to choose between convenience and authentic discovery.
*   **The Alchemist's Discernment:** The AI Queen guides you to discern pure pollen from opaque data, ensuring the integrity of your memory.
*   **The Alchemy of Honey:** Inside your Hive, specialized **Worker Bees (ML Kit)** process the pure pollen. Your **AI Queen (Gemma)** then turns this raw material into **"Informative Honey"**: perfectly structured, interconnected, and meaningful data. Crucially, the Queen engages you in **interactive questions** to add human context and validate the refined knowledge, ensuring absolute accuracy and personal relevance.
*   **The Path of Discovery:** Fill your knowledge honeycombs, earn "Honey Points," and unlock badges that celebrate your journey of pure data collection and understanding. The resulting "Informative Honey" is presented as a **"Microsite,"** a rich, browsable and **multi-language** knowledge entry.

*   [**Document 02: The World of Kikko - The UI as a Window**](./doc/doc02.md)
*   [**Document 03: A Forager's Life - The Core Gameplay Loop**](./doc/doc03.md)

| Introduction | Action | Conclusion |
| :---: | :---: | :---: |
| <img src="illustrations/s2_intro.png" alt="Cinematic 3D render, animation movie style. The phone screen shows a real-world view of a vibrant green garden. A beautiful, translucent honeycomb UI element overlays a tiny, colorful ladybug on a leaf with a '?' icon, representing a new quest."> | <img src="illustrations/s2_action.png" alt="Cinematic 3D render, animation movie style. A stream of golden light particles (pollen) flows elegantly from the ladybug on the screen into the Hive icon on Hiro's phone. The action feels magical and satisfying."> | <img src="illustrations/s2_conclusion.png" alt="Cinematic 3D render, animation movie style. Close-up on the phone screen. A honeycomb cell fills with shimmering liquid gold, and a shiny 'Nature Explorer' badge medal appears with a cheerful particle effect."> |
| **2.1 The Quest:** The Queen issues a quest, visually highlighting an object (like a ladybug) in Hiro's world. | **2.2 The Foraging:** Hiro captures the object. The raw, uncorrupted information is collected as beautiful, glowing "pollen." | **2.3 The Reward:** The Hive processes the pure pollen, fills a knowledge cell with "honey," and rewards Hiro for his accurate foraging. |

---

### **3. The Architecture of Trust: Your Truth in an Age of AI**

In an age of powerful cloud AIs offering instant answers, a new question arises: **Can we trust an answer if we don't know its story?** Kikko is built on a foundation of absolute trust and transparency. Your memory is your truth, and you should always be able to verify it.

*   **100% On-Device:** Everything resides on your device. Your pure pollen, your honey, and the AI models. Your personal Hive is a digital sanctuary, never uploaded to a central cloud.
*   **The Thread of Provenance & Inference Reproduction:** Every piece of "honey" is bundled with its own verifiable history, a "Seal of Trust" that tells the complete story of its creation—from your raw capture to the Queen's final structured reasoning. When sharing "Trusted Packages" via **WebTorrent (Digital Pollination)**, the receiving Hive doesn't just trust a signature; it can **reproduce the inference** locally to confirm the authenticity and integrity of the data, achieving true "glass box" transparency.
*   **The Hornet's Dilemma:** Kikko presents the user with a profound choice. A **"Hornet"** (representing external, opaque cloud AI like Google's AI Overview) might offer a pre-packaged answer. The Bourdon will deliver this offer, asking Hiro if he prefers the quick, opaque answer (marked with the Hornet's icon and lacking provenance) or the effort of forging his own, verifiable truth with his Hive.

*   [**Document 04: The Alchemy of Honey - The Role of the AIs**](./doc/doc04.md)
*   [**Document 05: The Hornet's Dilemma - The Temptation of Opaque Knowledge**](./doc/doc05.md)
*   [**Document 06: The Thread of Provenance - The Seal of Trust**](./doc/doc06.md)

| Introduction | Action | Conclusion |
| :---: | :---: | :---: |
| <img src="illustrations/s3_intro_v2.png" alt="Cinematic 3D render, animation movie style. On Hiro's phone screen, a sleek, chrome hornet icon appears, hovering near a common object (e.g., a popular book). The lazy Bourdon floats nearby, watching with a subtle smirk."> | <img src="illustrations/s3_action_v2.png" alt="Cinematic 3D render, animation movie style. The plump, smug-looking Bourdon floats dramatically in front of the Great Bay Window. He holds out a glowing, ephemeral digital 'AI Overview' screen with a tempting 'Instant Answer' button, looking at Hiro with a mischievous grin."> | <img src="illustrations/s3_conclusion_v2.png" alt="Cinematic 3D render, animation movie style. Hiro's hand decisively presses the golden honeycomb 'Forage' button on a real-world object (e.g., a rare antique). The resulting honeycomb cell glows with a brilliant, golden 'Seal of Trust'. The Hornet icon is dismissed."> |
| **3.1 The Temptation:** A Hornet offers a quick, instant answer from the cloud, delivered by the smug Bourdon, lacking a verifiable origin. | **3.2 The Choice:** The Bourdon presents the opaque knowledge (an AI Overview with a quiz). Hiro must choose between the easy path and the rewarding effort of personal discovery. | **3.3 The Sovereign Reward:** Hiro chooses to forage. His self-foraged "honey" is marked with an unbreakable Seal of Trust, a symbol of authentic, verifiable knowledge that is truly his. |

---

### **4. A New Category: The Personal Knowledge Game**

Kikko is not a "Pokémon GO killer"; it aims to create an entirely new genre. It's a **"Personal Knowledge Game"** or a **"Life-Logging RPG."** The goal isn't to complete a universal Pokedex, but to build a unique knowledge graph of your own life, composed entirely of verifiable information. The "level-up" is not a virtual statistic, but a richer memory, clearer connections, and a more profound understanding of your own personal journey.

This project leverages Google's on-device AI power (**Gemma** and **ML Kit**) to create a truly private, powerful, and personal experience, redefining the relationship between a user, their data, and their device.

*   [**Document 07: The Augmented Memory - Long-Term Utility**](./doc/doc07.md)
*   [**Document 08: The Global Swarm - Decentralized Sharing & Community**](./doc/doc08.md)
*   [**Document 09: The Philosophy of Gifting - A Non-Commercial Vision**](./doc/doc09.md)
*   [**Document 10: The Google Competition Synopsis & Pitch**](./doc/doc10.md)

| Introduction | Action | Conclusion |
| :---: | :---: | :---: |
| <img src="illustrations/s4_intro.png" alt="Cinematic 3D render, animation movie style. Inside the Hive, a vast, glowing 3D constellation of interconnected golden honeycomb cells (pure memories) represents Hiro's rich personal knowledge graph, all bearing the Seal of Trust."> | <img src="illustrations/s4_action.png" alt="Cinematic 3D render, animation movie style. Hiro asks his phone a question about something he previously foraged, for example, 'What's that interesting plant I found in the garden last summer?'. Inside the Hive, the AI Queen analyzes the pure knowledge graph, and a thread of light traces a path between two seemingly unrelated, verified memories (e.g., the plant's forage data and a book on local flora)."> | <img src="illustrations/s4_conclusion.png" alt="Cinematic 3D render, animation movie style. Hiro looks at his phone with a smile of deep understanding. The Hive has provided him with a profound, personal insight by connecting the verified dots of his own life, for example, showing him that the 'weed' he pulled out was actually the host plant for a specific type of butterfly he loves."> |
| **4.1 The Living Library:** Over time, Hiro's Hive becomes a complex, living map of his life and interests, built from pure knowledge. | **4.2 The Spark of Insight:** The AI Queen actively navigates this pure knowledge map, identifying patterns and connections that Hiro himself may not have realized. | **4.3 The Augmented Self:** The Hive's true power is revealed: it uses these verifiable insights to provide timely, personalized, and genuinely useful assistance. |
--- END OF FILE readme.md ---