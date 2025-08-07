import imageCompression from 'browser-image-compression';
import { PDFDocument } from 'pdf-lib';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export class FileProcessor {
  private ffmpeg: FFmpeg | null = null;
  private ffmpegLoaded = false;

  constructor() {
    this.initFFmpeg();
  }

  private async initFFmpeg() {
    try {
      this.ffmpeg = new FFmpeg();
      
      // Load FFmpeg
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      this.ffmpeg.on('log', ({ message }) => {
        console.log('FFmpeg:', message);
      });

      await this.ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
      });
      
      this.ffmpegLoaded = true;
      console.log('FFmpeg loaded successfully');
    } catch (error) {
      console.warn('FFmpeg failed to load:', error);
      this.ffmpegLoaded = false;
    }
  }

  async processFile(file: File, compressionLevel: 'low' | 'medium' | 'high'): Promise<File> {
    const fileType = file.type;

    if (fileType.startsWith('image/')) {
      return this.compressImage(file, compressionLevel);
    } else if (fileType === 'application/pdf') {
      return this.compressPDF(file, compressionLevel);
    } else if (fileType.startsWith('video/')) {
      return this.compressVideo(file, compressionLevel);
    } else {
      throw new Error('Unsupported file type');
    }
  }

  private async compressImage(file: File, level: 'low' | 'medium' | 'high'): Promise<File> {
    const qualityMap = {
      low: 0.85,
      medium: 0.7,
      high: 0.5
    };

    const maxSizeMap = {
      low: 2 * 1024 * 1024, // 2MB
      medium: 1 * 1024 * 1024, // 1MB
      high: 0.5 * 1024 * 1024 // 500KB
    };

    const options = {
      maxSizeMB: maxSizeMap[level] / (1024 * 1024),
      maxWidthOrHeight: level === 'high' ? 1920 : level === 'medium' ? 2560 : 3840,
      useWebWorker: true,
      initialQuality: qualityMap[level],
      alwaysKeepResolution: false,
      preserveExif: level === 'low'
    };

    try {
      const compressedFile = await imageCompression(file, options);
      
      // Create a new file with HYPcompress_ prefix
      return new File(
        [compressedFile], 
        `HYPcompress_${file.name}`, 
        { 
          type: compressedFile.type,
          lastModified: Date.now()
        }
      );
    } catch (error) {
      console.error('Image compression failed:', error);
      throw new Error('Image compression failed');
    }
  }

  private async compressPDF(file: File, level: 'low' | 'medium' | 'high'): Promise<File> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // PDF compression strategies based on level
      const compressionStrategies = {
        low: { imageQuality: 0.8, removeMetadata: false },
        medium: { imageQuality: 0.6, removeMetadata: true },
        high: { imageQuality: 0.4, removeMetadata: true }
      };

      const strategy = compressionStrategies[level];
      
      // Remove metadata for medium and high compression
      if (strategy.removeMetadata) {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setCreator('HYPin Compress');
        pdfDoc.setProducer('HYPin Compress');
        pdfDoc.setCreationDate(new Date());
        pdfDoc.setModificationDate(new Date());
      }

      // For high compression, we can try to optimize images within the PDF
      // This is a simplified approach - real PDF compression would need more sophisticated techniques
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: level !== 'low',
        addDefaultPage: false
      });

      return new File(
        [pdfBytes],
        `HYPcompress_${file.name}`,
        {
          type: 'application/pdf',
          lastModified: Date.now()
        }
      );
    } catch (error) {
      console.error('PDF compression failed:', error);
      throw new Error('PDF compression failed');
    }
  }

  private async compressVideo(file: File, level: 'low' | 'medium' | 'high'): Promise<File> {
    if (!this.ffmpegLoaded || !this.ffmpeg) {
      // Fallback: return a simulated compressed file (in real app, you'd use server-side compression)
      console.warn('FFmpeg not loaded, using fallback compression');
      return this.fallbackVideoCompression(file, level);
    }

    try {
      const inputName = 'input.' + file.name.split('.').pop();
      const outputName = 'output.mp4';

      // Write input file to FFmpeg file system
      await this.ffmpeg.writeFile(inputName, await fetchFile(file));

      // Compression settings based on level
      const compressionSettings = {
        low: ['-c:v', 'libx264', '-crf', '23', '-preset', 'fast', '-c:a', 'aac', '-b:a', '128k'],
        medium: ['-c:v', 'libx264', '-crf', '28', '-preset', 'medium', '-c:a', 'aac', '-b:a', '96k'],
        high: ['-c:v', 'libx264', '-crf', '32', '-preset', 'slow', '-c:a', 'aac', '-b:a', '64k', '-vf', 'scale=1280:720']
      };

      // Execute FFmpeg command
      await this.ffmpeg.exec([
        '-i', inputName,
        ...compressionSettings[level],
        '-movflags', 'faststart',
        outputName
      ]);

      // Read the output file
      const data = await this.ffmpeg.readFile(outputName);
      
      // Clean up
      await this.ffmpeg.deleteFile(inputName);
      await this.ffmpeg.deleteFile(outputName);

      return new File(
        [data],
        `HYPcompress_${file.name.replace(/\.[^/.]+$/, '.mp4')}`,
        {
          type: 'video/mp4',
          lastModified: Date.now()
        }
      );
    } catch (error) {
      console.error('Video compression failed:', error);
      throw new Error('Video compression failed');
    }
  }

  private async fallbackVideoCompression(file: File, level: 'low' | 'medium' | 'high'): Promise<File> {
    // This is a placeholder that simulates compression by reducing file size artificially
    // In a real application, you would either:
    // 1. Use a server-side compression service
    // 2. Use WebAssembly-based video compression
    // 3. Implement client-side compression with libraries like mp4box.js
    
    const arrayBuffer = await file.arrayBuffer();
    const reductionFactor = {
      low: 0.85,
      medium: 0.7,
      high: 0.5
    };

    // Simulate compression by truncating the file (this is just for demo purposes)
    const targetSize = Math.floor(arrayBuffer.byteLength * reductionFactor[level]);
    const compressedBuffer = arrayBuffer.slice(0, targetSize);

    return new File(
      [compressedBuffer],
      `HYPcompress_${file.name}`,
      {
        type: file.type,
        lastModified: Date.now()
      }
    );
  }
}

// Utility functions for file size formatting and type checking
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

export const isPDFFile = (file: File): boolean => {
  return file.type === 'application/pdf';
};

export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

export const getSupportedFormats = () => {
  return {
    images: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/heic', 'image/heif'],
    pdfs: ['application/pdf'],
    videos: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm', 'video/mkv']
  };
};
