# UI/UX Specification & Design System
## Interface Blueprint: IG / WA / TikTok Hybrid

---

### 1. Design Tokens & Color Palette

```css
:root {
  /* Light Theme Tokens */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F0F2F5;
  --bg-tertiary: #E4E6EB;

  --text-primary: #050505;
  --text-secondary: #65676B;
  --text-muted: #8A8D91;

  --brand-primary: #0084FF; /* Pulse Blue */
  --brand-gradient: linear-gradient(135deg, #833AB4, #FD1D1D, #FCB045); /* IG Accent */

  --bubble-incoming: #F0F2F5;
  --bubble-outgoing: #0084FF;
  --bubble-outgoing-text: #FFFFFF;

  --status-online: #31A24C;
  --accent-read: #53BDEB;
}

[data-theme="dark"] {
  /* OLED Dark Theme Tokens */
  --bg-primary: #000000;
  --bg-secondary: #121212;
  --bg-tertiary: #242526;

  --text-primary: #E4E6EB;
  --text-secondary: #B0B3B8;
  --text-muted: #8A8D91;

  --bubble-incoming: #242526;
  --bubble-outgoing: #3797F0;
  --bubble-outgoing-text: #FFFFFF;

  --status-online: #31A24C;
  --accent-read: #53BDEB;
}
```

---

### 2. Responsive Layout Wireframes

#### 2.1 Desktop View (Two-Column Split View ala WhatsApp Web)

```
+-----------------------------------------------------------------------------------+
| DESKTOP VIEW (Two-column split view ala WhatsApp Web)                             |
| +-------------------------+-----------------------------------------------------+ |
| | SIDEBAR (340px)         | ACTIVE CHAT CONVERSATION                            | |
| | [User Avatar] [🛠️]      | [Avatar + Nama + Status]                 [📞] [📹] [ℹ️]| |
| | [🔍 Cari kontak...]     | --------------------------------------------------- | |
| |                         | [Pesan Masuk (bubble kiri)]                         | |
| | [Chat List Item]        |               [Pesan Keluar (bubble kanan)]         | |
| |  - Avatar               |               ❤️ (Reaksi emoji)                     | |
| |  - Nama + Waktu         | --------------------------------------------------- | |
| |  - Preview pesan        | [📎] [😊] [ Tulis pesan...                  ] [🎤/🚀] | |
| +-------------------------+-----------------------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

#### 2.2 Mobile Layout & Navigation (Instagram/TikTok DM Style)
- **Single-view navigation:** Chat list view and Conversation view operate in separate screens with left-to-right gesture transitions.
- **Header:** Sticky top navigation bar showing avatar, active contact name, online/typing status, and back button (`<`).
- **Footer Input:** Floating input box with quick attachments (`📎`), emoji picker trigger (`😊`), text input field, and voice note (`🎤`) or send (`🚀`) button.

---

### 3. Micro-Interaction Specifications
1. **Swipe-to-Reply (WhatsApp Style):**
   - Drag message bubble to the right to trigger reply preview box over the input bar with haptic feedback.
2. **Double-Tap Reaction (Instagram/TikTok Style):**
   - Double-tap any message bubble to instantly trigger a heart reaction (`❤️`) animation.
   - Long-press or hover shows quick reaction bar: `❤️` `🔥` `😂` `😮` `😢` `👍` plus `+` for full emoji drawer.
3. **Voice Note Recording (WhatsApp Style):**
   - Press & hold mic icon to record with live waveform visualization.
   - Slide left to cancel recording, slide up to lock hands-free recording.
   - Live preview player with play/pause and delete before sending.
4. **Mobile Virtual Keyboard Handling:**
   - Dynamic viewport resizing (`dvh` / Visual Viewport API) to prevent keyboard overlaying input fields.
