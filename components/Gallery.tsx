
import React from 'react';
import { GeneratedImage } from '../types';

interface GalleryProps {
  images: GeneratedImage[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  if (images.length === 0) return null;

  return (
    <section id="gallery" className="py-16 px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <h2 className="text-3xl font-bold text-white">Your Creations</h2>
        <div className="h-[1px] flex-grow bg-white/10"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((img) => (
          <div key={img.id} className="group glass rounded-2xl overflow-hidden shadow-xl hover:translate-y-[-4px] transition-all duration-300">
            <div className="relative aspect-square md:aspect-video lg:aspect-square overflow-hidden bg-zinc-900">
              <img 
                src={img.url} 
                alt={img.prompt} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                 <p className="text-white text-sm line-clamp-2 font-medium mb-4">{img.prompt}</p>
                 <a 
                    href={img.url} 
                    download={`luminary-ai-${img.id}.png`}
                    className="w-full py-2 bg-white text-black rounded-lg text-sm font-bold text-center hover:bg-zinc-200 transition-colors"
                 >
                   Download Image
                 </a>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center bg-zinc-900/40">
              <div className="flex gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10">{img.params.aspectRatio}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10">{img.params.style}</span>
              </div>
              <span className="text-[10px] text-zinc-600">{new Date(img.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
