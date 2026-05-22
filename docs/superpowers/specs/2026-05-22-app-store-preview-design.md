# App Store Preview Tool — Design Spec
**Date:** 2026-05-22  
**Status:** Approved

## Overview

A web tool for app developers, marketers, and ASO specialists to preview how their app listing looks in both the Apple App Store and Google Play Market simultaneously. Built with future SaaS monetization in mind, but fully open/free for v1.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Drag & drop:** @dnd-kit/core
- **Export:** html2canvas → PNG download
- **Storage:** localStorage (auto-save form state)
- **Hosting:** Vercel (free tier)
- **Repo:** GitHub with Node/Next.js .gitignore

No backend, no database, no auth for v1.

## Layout

Three-zone layout (Figma-style):

```
┌─────────────────────────────────────────────────────────┐
│  Header: logo + toggles [GP ✓] [AS ✓] + Dark Mode      │
├──────────────┬──────────────────────────────────────────┤
│  LEFT PANEL  │  RIGHT AREA (scrollable)                 │
│  (320px fix) │                                          │
│              │  ┌─────────────┐  ┌─────────────┐       │
│  Form inputs │  │  Android    │  │   iPhone    │       │
│              │  │  Google     │  │  App Store  │       │
│              │  │  Play frame │  │   frame     │       │
│              │  │  + listing  │  │  + listing  │       │
│  [Download]  │  └─────────────┘  └─────────────┘       │
│  [Clear]     │                                          │
└──────────────┴──────────────────────────────────────────┘
```

Either preview can be hidden via header toggles to focus on one store.

## Components

| Component | Responsibility |
|-----------|---------------|
| `AppForm` | Left panel — all inputs, auto-saves to localStorage |
| `PhoneFrame` | Reusable SVG phone frame, accepts `type: "android" \| "ios"` |
| `GooglePlayPreview` | GP listing rendered inside Android frame |
| `AppStorePreview` | AS listing rendered inside iPhone frame |
| `ScreenshotUploader` | Drag & drop zone, up to 8 files, reorder via drag |
| `ToggleStore` | Header buttons to show/hide each preview |

## Form Fields

| Field | App Store limit | Google Play limit |
|-------|----------------|-------------------|
| App Name | 30 chars | 50 chars |
| Subtitle / Short Description | 30 chars | 80 chars |
| Developer Name | display only | display only |
| Category | display only | display only |
| Rating (1–5) | stars + count | stars + count |
| Number of Reviews | formatted "12K" | formatted "12K" |
| Price / Button | GET or custom price | Install or price |
| In-App Purchases | badge | badge |
| App Icon | upload, iOS rounded corners | upload, Android rounded corners |
| Screenshots | up to 8, portrait 9:19.5 | up to 8, portrait 9:16 |

All text fields show a live character counter with color warning near the limit.

## Phone Frames

- **iPhone:** thin bezel, Dynamic Island cutout, side buttons — modern iPhone 15 style
- **Android:** thin bezel, punch-hole camera, Pixel-style — clean generic Android

Both are pure SVG/CSS, no external images required.

## Export

- "Download GP Preview" → html2canvas captures Android frame zone → `googleplay-preview.png`
- "Download AS Preview" → html2canvas captures iPhone frame zone → `appstore-preview.png`
- Two separate downloads, one button per preview panel

## Data Flow

```
User types in AppForm
  → state updates in React (useState)
  → auto-persisted to localStorage (useEffect)
  → GooglePlayPreview re-renders with new data
  → AppStorePreview re-renders with new data

User uploads icon/screenshot
  → FileReader → base64 data URL
  → stored in state + localStorage
  → previews update immediately

User reorders screenshots
  → @dnd-kit drag event
  → array reorder in state
  → previews update immediately

User clicks Download
  → html2canvas(targetRef.current)
  → toBlob → anchor click → file download
```

## Future Monetization (not in v1)

When the product gets traction, the natural upgrade path:
1. Add Supabase auth → saved projects per user
2. Add Stripe → Pro tier: remove watermark, more export formats, team sharing
3. Add watermark to free exports as conversion driver

## Out of Scope (v1)

- User accounts / auth
- Saved projects in cloud
- Huawei AppGallery / Samsung Galaxy Store
- Server-side screenshot generation (Puppeteer)
- Localization / multi-language store UI
