# Movie-Streaming

A sleek, dynamic, and responsive Movie Discovery Web App powered by The Movie Database (TMDb) API. Search, explore, and deep dive into details about your favorite films — all with genre filtering, real-time data, and a beautiful dark/light theme toggle!

---

## 🚀 Features

### 🔍 **Search Functionality**
- Search any movie by name using the search input field.
- Automatically resets genre filters on new searches.

### 🎞️ **Genre Filtering**
- Dropdown to select and filter movies by genre.
- Dynamically fetched genre list from TMDb API.

### 🌗 **Light/Dark Theme Toggle**
- Toggle between **Light Mode** and **Dark Mode**.
- Automatically saves the preferred theme using `localStorage`.

### 📊 **Movie Cards Display**
- Movie cards show:
  - Poster image
  - Title
  - TMDb rating (color-coded):
    - 🟢 8.0 and above
    - 🟠 Between 5.0 and 7.9
    - 🔴 Below 5.0
- Hover or click for an **overview**.

### 🎥 **Movie Details Modal**
Clicking a movie opens a detailed modal with:
- ✅ Title, overview/plot
- 🎭 Top cast (first 5)
- 💰 Budget and revenue
- 🌐 IMDb rating + link
- 📺 Trailer embed (YouTube)
- 📡 Streaming platforms (based on region, e.g., US)

---

## 🧠 Tech Stack

- **HTML5 / CSS3** (with responsive layout and dark mode support)
- **Vanilla JavaScript**
- **TMDb API**: For fetching movies, genres, details, trailers, streaming platforms.
- **Google Fonts**: "Playfair Display" and "Poppins" for elegant typography.

---

## 🎨 Design Highlights

- 📱 **Responsive layout** with 4-column grid (adjusts for smaller screens)
- 🎨 Custom color palette with smooth transitions
- 🌓 Stylish dark mode with themed background
- 🔘 Rounded search inputs and buttons
- 🎬 Smooth modal animations for movie details

---

## 📦 Folder Structure

```plaintext
├── index.html          # Main HTML structure
├── style.css           # All styling and responsive design
├── script.js           # JavaScript logic and API interactions
├── assets/             # (Optional) Images or static assets
└── README.md           # Project documentation
```

## 🚀 How to Run

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Sanjana-sriv/Movie-Streaming.git
   cd Movie-Streaming
