import { useState } from 'react';
import { generateImage, generateSpeech } from '../services/geminiService';

export default function StoryViewer({ story }: { story: any[] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageSize, setImageSize] = useState("1K");

  const handlePageChange = async (index: number) => {
    setCurrentPage(index);
    setLoading(true);
    setImage(null);
    setAudio(null);
    
    const page = story[index];
    const [img, speech] = await Promise.all([
      generateImage(`Illustration for: ${page.text}`, imageSize),
      generateSpeech(page.text)
    ]);
    
    setImage(img);
    setAudio(speech);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {["1K", "2K", "4K"].map(size => (
          <button key={size} onClick={() => setImageSize(size)} className={`px-2 py-1 rounded ${imageSize === size ? 'bg-stone-900 text-white' : 'bg-stone-200'}`}>
            {size}
          </button>
        ))}
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <p className="text-xl mb-4">{story[currentPage].text}</p>
        {loading && <p>Generating...</p>}
        {image && <img src={image} alt="Story illustration" className="w-full rounded-xl" />}
        {audio && <audio src={audio} controls className="w-full mt-4" />}
      </div>
      <div className="flex justify-between">
        <button disabled={currentPage === 0} onClick={() => handlePageChange(currentPage - 1)} className="px-4 py-2 bg-stone-200 rounded-xl">Previous</button>
        <button disabled={currentPage === story.length - 1} onClick={() => handlePageChange(currentPage + 1)} className="px-4 py-2 bg-stone-200 rounded-xl">Next</button>
      </div>
    </div>
  );
}
