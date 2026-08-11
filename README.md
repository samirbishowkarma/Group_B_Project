# Technologia

A dark-themed, multi-page web marketplace for buying and selling sensors, robotics parts, gadgets, and IoT devices.

> This README documents the files currently on hand. Some pages referenced in navigation (`shop.html`, `sell.html`, `chat.html`, `discussions.html`, `cart.html`, `login.html`, `exchange.html`, `register.html`, `product.html`, ) and `js/base.js` itself are linked
---

## 📁 Project Structure

```
technologia/
├── Home.html            # Homepage
├── marketplace.html       # Community marketplace / listings page
├── profile.html            # User profile page
├── register.html           # Registration page

├── base.css            # (referenced, not included) global styles/variables
│home.css             # (referenced, not included) homepage-specific styles
│marketplace.css      # Persona cards, marketplace CTA banner
└── profile.css          # Profile header, tabs, listings, projects, edit form

├── base.js              # (referenced, not included) shared TG namespace: auth, storage, cards
├── home.js               # Homepage logic (index_js.js in this file set)
├── marketplace.js        # Marketplace filtering/search/sort logic
└── profile.js             # Profile page logic (tabs, editing, projects, listings)
```

---

## 📄 Pages

### `Home.html` — Homepage
- Hero section with animated stat counters (products listed, happy makers, categories)
- Scrolling marquee of tech keywords (Arduino, ESP32, Robotics, etc.)
- Dynamic category grid (`#catGrid`) — populated by `home.js`
- Featured products grid (`#featured`) — pulled from `TG.catalog()`
- Promo banner encouraging users to sell items
- "Recently listed" section (`#recent`) — pulled from `TG.listings()`, with demo fallback data
- Newsletter signup form with basic email validation

### `marketplace.html` — Marketplace
- Persona cards (Seller / Builder / Idea person / Student) — rendered from `TG.PERSONAS`
- "Got parts to sell?" CTA banner
- Category filter chips (All / Sensors / Mechanical / Gadgets / IoT)
- Search, sort (newest / price low–high / high–low), and condition (new/used) filters
- Product grid (`#mpGrid`) with an empty state when no listings match filters

### `profile.html` — User Profile
- Profile header container (`#profileHeader`) — avatar, name, persona badge, bio, stats
- Tabbed content: **Overview**, **Listings**, **Projects**
- Sign-in gate: shows a "Sign in to view your profile" prompt if no active session

### `register.html` — Registration
- Present in the upload set but not included in this document review; assumed to handle new user sign-up (feeds into `TG.registerUser`).

---

## ⚙️ JavaScript Modules

### `home.js` *(uploaded as `home.js`)*
Runs only on the homepage (`#catGrid` present). Responsibilities:
- Builds the 4 category cards (Sensors, Mechanical, Gadgets, IoT) with icons and images
- Renders 8 featured products by filtering `TG.catalog()` for a fixed set of IDs
- Renders the 4 most recent listings via `TG.listings()`, falling back to 4 demo used-item entries
- Animates the hero stat counters using `requestAnimationFrame`
- Handles newsletter form submission with regex email validation

### `marketplace.js`
Runs only on the marketplace page (`#mpGrid` present). Responsibilities:
- Renders persona cards from `TG.PERSONAS` with per-persona icon/color
- Renders category filter chips
- Maintains a `state` object (`cat`, `q`, `cond`, `sort`) and a single `render()` function that:
  - Filters `TG.all()` by category, condition, and search query
  - Sorts by price (low/high) or leaves default "newest" order
  - Renders product cards or an empty state
- Debounces the search input (200ms) for performance

### `profile.js`
Runs only on the profile page (`#profileHeader` present). Responsibilities:
- Checks `TG.session()`; shows a sign-in prompt and hides tabs if not logged in
- Auto-registers a minimal user record if a session exists but no matching user is found
- **Header**: avatar (image or initial letter), name, persona badge, bio, join date, stats (listings/projects/reputation)
- **Overview tab**: bio, skill tags, and a merged/sorted activity feed of recent listings + projects
- **Listings tab**: grid of the user's own listings (via `TG.cardHTML`), with an empty state
- **Projects tab**: grid of the user's own projects + a "New Project" form (title, description, tags, image URL)
- **Edit Profile**: inline form to update name, bio, and skills (`TG.updateProfile`)
- **Avatar upload**: reads a local image file as a data URL and saves it (`TG.updateUserAvatar`)
- **Logout**: clears session (`TG.logout`) and redirects home
- Project create/delete wired to `TG.saveProject` / `TG.deleteProject`

---

## 🎨 Stylesheets

### `marketplace.css`
- `.persona-row` / `.persona-card` — flex row of persona cards with a colored top border and icon badge driven by a `--persona-color` CSS variable
- `.mp-cta` — gradient CTA banner with soft radial-gradient glow effects
- Responsive breakpoints: 2-per-row personas at ≤720px, full-width at ≤520px

### `profile.css`
- `.profile-header` — gradient card with avatar, name, persona badge, bio, stats
- `.profile-avatar` — circular avatar with hover scale + glow, includes a hidden file input for uploads
- `.profile-tabs` — underline-style tab navigation
- `.skill-tag`, `.activity-item`, `.project-card`, `.project-form` — supporting components for the Overview/Listings/Projects tabs
- `.edit-form` — inline profile editing form styles
- `.signin-prompt` — centered empty state for logged-out users
- Responsive adjustments for avatar size, stacked stats, and single-column project grid at ≤720px


---

## 🚩 Missing / Referenced Files

These files are linked from the HTML or called by the JS but were not part of this upload — needed for the site to run correctly:

- `base.css` — global design tokens, layout, buttons, product-grid/card styles
- `home.css` — homepage-specific styles (hero, marquee, promo banner)
- `base.js` — the `TG` shared module (session/auth, catalog, storage helpers)
- `jquery.min.js` — jQuery library (all JS files use the `$` jQuery wrapper)
- `shop.html`, `sell.html`, `chat.html`, `discussions.html`, `cart.html`, `login.html`
## 🛠️ Tech Stack

- **HTML5** — semantic, multi-page structure
- **CSS3** — custom properties/theming, gradients, responsive breakpoints
- **jQuery** — DOM manipulation and event handling
- **localStorage** (via `TG`) — client-side persistence for auth, listings, and projects (no backend)

```

Then open `index.html` in your browser.

---

# Group_B_Project

## Architectural Design

**1. Frontend**
- HTML
- CSS
- JavaScript

**2. Database**
- Users
- Products
- Projects
- Messages
- Comments

**3. Main Features**
- User Login
- User Profiles
- Marketplace
- Product Listings
- Search Products
- Buy/Sell IoT Devices
- Project Showcase
- Chat System
- Discussion Threads
- Notifications

**4. User Flow**

Users can:
- Sign up or log in
- Browse IoT devices and sensors
- Create product listings
- Search for components
- Chat with sellers
- Comment on products and projects
- Share project ideas
- Collaborate with other users

**Flow:**

```
Users
  ↓
Frontend (HTML/CSS/JS)
  ↓
Database
```

<img width="461" height="331" alt="Architectural Design diagram" src="https://github.com/user-attachments/assets/b37e6799-6358-4e12-97e7-8df0c150ea90" />

---

## Home Page

The Home Page is the landing page of Technologia, an online marketplace designed for makers, hobbyists, students, and engineers to buy, sell, and discover IoT devices, sensors, robotics components, and electronic gadgets.

The page introduces users to the platform through an engaging hero section, featured products, category browsing, and recently listed items while encouraging both buyers and sellers to interact with the marketplace.

### Features

**Hero Section**
- Large welcoming banner introducing the marketplace.
- Call-to-action buttons.
- Animated statistics displaying:
  - Products listed
  - Product categories
- Interactive floating information cards.

**Category Section**

Users can browse products by category, including:
- Sensors
- Robotics
- Mechanical Parts
- Gadgets
- IoT Devices

Each category card includes:
- Background image
- Icon
- Category name
- Short description
- Hover animation

**Featured Products**

Displays selected products that are popular within the marketplace. This section highlights:
- Product cards
- Images
- Prices
- Product information

**Promotional Banner**

Encourages users to sell unused components by providing a quick link to create a new listing.

**Recently Listed Products**

Displays the latest items uploaded by sellers, allowing users to discover newly available components and devices.

**Navigation**

The homepage navigation provides quick access to:
- Home
- Shop
- IoT
- Sell
- Exchange
- User Account

**Footer**

The footer contains:
- Marketplace information
- Newsletter subscription
- Shop links
- Seller links
- Company information
- Copyright notice

### Technologies Used
- HTML
- CSS
- JavaScript
- jQuery

### UI Features
- Responsive design
- CSS Grid layouts
- Glassmorphism effects
- Hover animations
- Floating animations
- Gradient overlays
- Animated marquee
- Mobile-friendly layout

### Responsive Design

The homepage adapts to different screen sizes by:
- Stacking the hero section on tablets and mobile devices.
- Hiding decorative floating cards on smaller screens.
- Adjusting promotional banners for mobile viewing.
- Maintaining responsive spacing and typography.

### Project Structure
