# HYPin Compress - Advanced Media Compression Web App

A powerful AI-powered web application for compressing all your media files including images, PDFs, and videos with elegant design and advanced compression algorithms.

## ✨ Features

- **Multi-Format Support**: Compress images (JPG, PNG, WebP, HEIC), PDFs, and videos (MP4, AVI, MOV, WebM, MKV)
- **Three Compression Levels**:
  - 🟢 Low: Fast processing, 85% quality retention
  - 🔵 Medium: Balanced compression, 70% quality
  - 🟣 High: Maximum compression, 50% quality for smallest files
- **Drag & Drop Interface**: Intuitive file upload with visual feedback
- **Real-time Progress**: Live compression progress with animated indicators
- **Batch Processing**: Compress multiple files simultaneously
- **Download Management**: Easy download of compressed files with size comparisons

## 🎨 Design

- **Elegant Aesthetics**: Modern slate design with subtle animations and glassmorphism effects
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Smooth Animations**: Powered by Framer Motion for fluid user interactions
- **Dark Theme**: Elegant dark design with gradient backgrounds and modern color palette

## 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS with elegant slate theme
- **Animations**: Framer Motion
- **Image Compression**: browser-image-compression
- **PDF Processing**: pdf-lib
- **Video Compression**: FFmpeg.wasm (with fallback)
- **File Handling**: react-dropzone

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd compress
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # App header with logo and title
│   ├── FileUpload.tsx  # Drag & drop file upload
│   ├── CompressionPanel.tsx  # Compression settings
│   ├── ProgressDisplay.tsx   # Processing indicator
│   └── ResultsPanel.tsx      # Results and download
├── utils/
│   └── fileProcessor.ts # File compression logic
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles with TailwindCSS

```

## 🎯 Compression Algorithms

### Images

- Uses advanced browser-image-compression with quality optimization
- Supports modern formats like WebP and HEIC
- Intelligent resolution scaling based on compression level
- Preserves EXIF data on low compression

### PDFs

- Metadata removal for privacy and size reduction
- Object stream optimization
- Lossless compression for text content
- Image optimization within PDFs

### Videos

- Client-side FFmpeg.wasm processing
- Codec optimization (H.264 with AAC audio)
- Adaptive bitrate based on compression level
- Resolution scaling for maximum compression

## 🌟 Performance

- **WebWorkers**: Image compression runs in background threads
- **Progressive Loading**: FFmpeg loads asynchronously
- **Memory Efficient**: Proper cleanup of temporary files
- **Fast Processing**: Optimized algorithms for each file type

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Note: Video compression requires SharedArrayBuffer support and may need specific browser flags in development.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression) for image processing
- [pdf-lib](https://github.com/Hopding/pdf-lib) for PDF manipulation
- [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) for video compression
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide React](https://lucide.dev/) for beautiful icons

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## 📖 About HYPin AI Compressor

This repository contains a powerful AI-enhanced program that helps compress all your media files including images, PDFs, and videos with intelligent optimization algorithms and an intuitive user interface.
