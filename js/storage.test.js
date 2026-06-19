// Mock localStorage for Node.js environment
const store = {};
globalThis.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, value) => { store[key] = String(value); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { for (const k in store) delete store[k]; }
};

// Mock window.crypto.randomUUID if needed
globalThis.window = {
  crypto: {
    randomUUID: () => 'mocked-uuid'
  }
};

import assert from 'assert';
import { JournalStorage } from './storage.js';

console.log("Running TDD Tests for JournalStorage.importData...\n");

try {
  // Test Case 1: Invalid JSON string should return false
  console.log("Scenario 1: Importing invalid JSON string...");
  const result1 = JournalStorage.importData("{invalid json}");
  assert.strictEqual(result1, false, "Should return false for invalid JSON");
  console.log("✔ Scenario 1 Passed\n");
} catch (e) {
  console.error("❌ Scenario 1 Failed:", e.message);
}

try {
  // Test Case 2: Valid JSON but not an array should return false
  console.log("Scenario 2: Importing valid JSON that is not an array...");
  const result2 = JournalStorage.importData('{"title": "Single Entry"}');
  assert.strictEqual(result2, false, "Should return false if imported data is not an array");
  console.log("✔ Scenario 2 Passed\n");
} catch (e) {
  console.error("❌ Scenario 2 Failed:", e.message);
}

try {
  // Test Case 3: Valid JSON array of entries should merge into localStorage and return true
  console.log("Scenario 3: Importing valid JSON array of entries...");
  localStorage.clear();
  const validData = [
    {
      title: "Hari Indah",
      content: "Hari ini sangat menyenangkan di pantai.",
      mood: "awesome",
      tags: ["pantai", "liburan"],
      date: "2026-06-18T10:00:00.000Z"
    }
  ];
  const result3 = JournalStorage.importData(JSON.stringify(validData));
  assert.strictEqual(result3, true, "Should return true for valid array of entries");
  
  // Verify storage has the imported entries
  const stored = JournalStorage.getAllEntries();
  assert.strictEqual(stored.length, 1, "Should have 1 entry in storage");
  assert.strictEqual(stored[0].title, "Hari Indah", "Entry title should match");
  assert.strictEqual(stored[0].content, "Hari ini sangat menyenangkan di pantai.", "Entry content should match");
  console.log("✔ Scenario 3 Passed\n");
} catch (e) {
  console.error("❌ Scenario 3 Failed:", e.message);
}
