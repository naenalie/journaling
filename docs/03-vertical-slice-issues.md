# Implementation Issues — Moody

## Sources Read
- [02-prd.md](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/docs/02-prd.md)
- [01-requirements.md](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/docs/01-requirements.md)

---

## Issue 1: Project Setup, SPA Shell, and Glassmorphic Theme
- **Title:** Project Setup, SPA Shell, and Glassmorphic Theme
- **Type:** HITL
- **What to build:** 
  - Create the base files (`index.html`, `style.css`, `app.js`).
  - Configure the **Dreamy Dark Mode** theme styling (slate background with subtle neon gradient spots).
  - Build the **Floating Bottom Dock** navigation menu with glassmorphism blur and hover effects.
  - Implement a client-side Single Page Application (SPA) routing mechanism that toggles visibility of the three page containers: "Jurnal Baru" (Editor), "Riwayat Jurnal" (History), and "Analisis Mood" (Analytics).
- **User stories:** As a user, I want a beautiful app interface with a bottom navigation dock so I can switch tabs smoothly without reloading.
- **Acceptance criteria:**
  - Clicking dock icons instantly switches visibility between the three sections.
  - Visual layout implements card designs with `backdrop-filter: blur(12px)` and thin semi-translucent borders.
  - Layout is fully responsive on mobile viewports (dock stays pinned to the bottom).
- **Blocked by:** None.
- **Testing notes:**
  - Open page, click each icon on the floating dock. Verify only the targeted container is visible.
  - Inspect layout at 375px width (mobile) to verify the dock scales down and fits correctly without breaking UI constraints.
- **AI usage notes:**
  - AI can generate the boilerplate HTML/CSS structure, the glassmorphism variables, and the basic display toggle script.
  - Human must review and adjust the visual appearance, blur strength, gradient glows, and hover transition times.

---

## Issue 2: Journal Entry Editor & Mood Selector
- **Title:** Journal Entry Editor & Mood Selector
- **Type:** AFK
- **What to build:**
  - Inside the "Jurnal Baru" section, build an editor form.
  - Fields include: Title input (optional), Body text editor (textarea, required).
  - An interactive **Mood Selector** displaying 5 choices: *Awesome, Good, Neutral, Bad, Awful* represented by large emojis with hover/active state glows.
  - A **Tag Input** system: user types tag name in input, clicks "+" button or hits Enter, which renders a tag pill. Clicking the close icon on a tag pill removes it.
  - A "Simpan Jurnal" button.
- **User stories:** As a writer, I want to type my entry, select a mood, and add tags, so I can save my thoughts.
- **Acceptance criteria:**
  - Validation triggers if body textarea is empty upon clicking save, showing a warning tooltip.
  - Mood selector highlights exactly one selected mood.
  - Adding tag pills displays them in the list correctly and doesn't submit the main form.
- **Blocked by:** Issue 1.
- **Testing notes:**
  - Attempt to save without typing in the textarea. Verify validation feedback.
  - Add tags "kerja", "santai", "keluarga". Click 'x' on "santai" and verify it is removed.
- **AI usage notes:**
  - AI can implement form validations, the JavaScript tag array handling, and CSS styles for mood selector glow states.

---

## Issue 3: Local Storage Persistence & History Card List
- **Title:** Local Storage Persistence & History Card List
- **Type:** AFK
- **What to build:**
  - Implement data save/load logic in `app.js` using `localStorage` (key: `moody_entries`).
  - Upon clicking "Simpan Jurnal", save the entry object: `{ id, title, content, mood, tags, date }` (date as ISO string). Clear editor states.
  - Create the list view in "Riwayat Jurnal".
  - Render cards dynamically. Each card shows title, snippet of text, formatted date, mood name/emoji, and tag pills.
  - Each card's left-hand border is thick and colored with the corresponding mood's gradient.
  - Each card has a Delete button. Clicking it removes the entry from storage and UI.
- **User stories:** As a user, I want my entries to persist in my browser and see them listed on a history page, so I can revisit them anytime.
- **Acceptance criteria:**
  - Entry object saves with a unique ID and correct timestamp.
  - Saving redirects the view to the History tab, where the new entry card immediately appears at the top.
  - Refreshing the page retains all saved entries in the list.
  - Deleting an entry asks for confirmation (using a clean prompt or styled dialog) and removes it from `localStorage`.
- **Blocked by:** Issue 2.
- **Testing notes:**
  - Create 3 entries. Refresh browser. Verify list still displays 3 entries in reverse chronological order.
  - Check LocalStorage inside DevTools to verify structure.
- **AI usage notes:**
  - AI can implement `localStorage` operations, mapping dates to relative time strings, and compiling card templates.

---

## Issue 4: History Search & Filtering
- **Title:** History Search & Filtering
- **Type:** AFK
- **What to build:**
  - Add a search input bar at the top of the "Riwayat Jurnal" list.
  - Add a line of 5 quick-filter mood buttons.
  - Add tag-based filtering: clicking any tag pill on a journal card automatically populates the search bar/filter state with that tag and filters the list.
- **User stories:** As a user, I want to filter and search my past entries, so that I can quickly find specific memories.
- **Acceptance criteria:**
  - Typing in the search bar filters cards dynamically by matching text in titles or content body (case-insensitive).
  - Clicking a mood filter shows only cards matching that mood. Clicking it again resets the filter.
  - Clicking a tag pill filters the view to show only cards containing that tag.
- **Blocked by:** Issue 3.
- **Testing notes:**
  - Add two entries: one with title "Hari Hujan" (tag: "sedih"), one with title "Pesta Pantai" (tag: "senang").
  - Search "pantai" -> only "Pesta Pantai" appears.
  - Filter by mood -> verify correct display.
  - Click tag "sedih" on card -> verify list filters to show only the "Hari Hujan" card.
- **AI usage notes:**
  - AI can implement the filtering mapping array logic, combining search text, mood filter, and tag filter states in one central render loop.

---

## Issue 5: Entry Detail Modal View
- **Title:** Entry Detail Modal View
- **Type:** HITL
- **What to build:**
  - Create a modal dialog container overlay in `index.html`.
  - Clicking a journal card in the History list opens this modal, populating it with:
    - Full entry title and full date/time.
    - Large mood indicator with its glowing accent color.
    - List of tag pills.
    - Full body text, preserving line breaks (`white-space: pre-wrap`).
  - Close button and click-backdrop-to-close behavior.
- **User stories:** As a user, I want to click an entry card to read the full entry in a detailed, clear popup, so I don't clutter the main history screen.
- **Acceptance criteria:**
  - Modal opens with a smooth fade-in and scale-up animation.
  - Pressing `Escape` key or clicking outside the modal content area closes it.
  - Scrolling inside the modal is supported if the text is long.
- **Blocked by:** Issue 3.
- **Testing notes:**
  - Create a long entry (3 paragraphs). Click card to view details. Verify scrollbar works inside modal and layout does not break viewport heights.
  - Verify modal backdrop blocks clicks on background buttons.
- **AI usage notes:**
  - AI can write the HTML structure, the show/hide JS event listeners (including keyboard listener), and text wrapping CSS.
  - Human reviews scrollbar visuals, layout padding, and closing animations.

---

## Issue 6: Dashboard Statistics: Streaks, Tag Stats & Backup Utilities
- **Title:** Dashboard Statistics: Streaks, Tag Stats & Backup Utilities
- **Type:** AFK
- **What to build:**
  - In the "Analisis Mood" tab, implement:
    - **Streak Calculator**: count consecutive days of entries up to today/yesterday.
    - **Top Tags list**: calculate tag frequency, displaying the top 5 used tags with a horizontal bar indicator (pure CSS width percentage).
    - **Backup Utilities**: An "Ekspor Data" button that generates a JSON blob of all local storage entries and triggers a browser download. An "Impor Data" file picker that reads an uploaded JSON file, parses it, merges it with LocalStorage, and reloads/updates the view.
- **User stories:** As a user, I want to see my writing streaks and most used tags, and be able to backup my journal to a file, so that I stay motivated and keep my data safe.
- **Acceptance criteria:**
  - Streak remains active if user wrote yesterday or today; resets to 0 if a gap exists.
  - Backup exports a clean `.json` file containing the exact schema of entries.
  - Uploading a valid `.json` parses, populates `localStorage`, and updates stats instantly.
- **Blocked by:** Issue 3.
- **Testing notes:**
  - Add entry for yesterday and today -> streak shows 2. Clear LocalStorage -> upload exported JSON -> verify streak returns to 2 and entry count matches.
- **AI usage notes:**
  - AI can write the streak logic algorithm, tag aggregation algorithms, and JS Blob downloading/FileReader parsing mechanisms.

---

## Issue 7: Dashboard Visualizations: SVG Mood Line Chart & Contribution Calendar
- **Title:** Dashboard Visualizations: SVG Mood Line Chart & Contribution Calendar
- **Type:** AFK
- **What to build:**
  - In the bottom section of "Analisis Mood", implement two visual elements:
    - **Mood Trend Line Chart**: An inline SVG path. X-axis represents chronological days (up to last 10 entries), Y-axis represents mood levels (Awesome = 5, Awful = 1). Renders a smooth line connecting dots.
    - **Monthly Contribution Calendar**: A grid representing the last 30 days. Each grid box is colored based on the mood of the entry created on that date. Days without entries remain dark grey.
- **User stories:** As a visual thinker, I want to see charts of my mood patterns, so that I can easily spot trends and cycle periods.
- **Acceptance criteria:**
  - SVG line chart renders paths and circles cleanly without clipping. Renders a placeholder text if there are less than 2 entries.
  - Calendar grid highlights the exact day box with the correct mood gradient or color.
- **Blocked by:** Issue 3, Issue 6.
- **Testing notes:**
  - Create multiple entries on different days. Navigate to Analisis and inspect the SVG path coordinates in DevTools. Verify they scale within the SVG container.
- **AI usage notes:**
  - AI can write the SVG path generation math (scaling points to fit viewport viewBox dimensions) and grid box rendering loops based on date subtraction.
