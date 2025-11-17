**Overview** 🚀  
This project lets users explore planets through an interactive scrolling experience. Each planet loads as a 3D model using model-viewer, and clicking a planet opens a modal with structured information and fun facts. The project also fetches real solar flare data using the NASA DONKI API to display recent solar activity. The focus is on smooth transitions, responsive layout, and a lightweight 3D experience without relying on a full WebGL engine.  


**Tech Stack** 🧩  
React, GSAP, Tailwind CSS, custom animations, model-viewer, NASA DONKI API for real time solar flare data

**Features** ✨  
• Scroll based planet navigation  
• 3D planet models rendered with model-viewer  
• Smooth GSAP transitions  
• Planet modal with structured data and fun facts  
• Solar flare feed powered by NASA DONKI API  
• Responsive layout with consistent spacing and animation timing  
• Preloader that waits for the Sun model before starting animations  

**Getting Started** 🛠  
1. Clone the repository  
2. `npm install`  
3. `npm run dev`  
4. Open in your browser

**API Setup** 🔑  
This project uses the NASA DONKI API, which requires an API key.  
1. Get your free key here: https://api.nasa.gov  
2. Create a `.env` file in the root folder  
3. Add the following line:  
   `VITE_NASA_API_KEY=your_key_here`  
4. Restart the dev server


