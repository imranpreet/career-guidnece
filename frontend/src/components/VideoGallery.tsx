import React, { useState } from 'react';
import { PlayIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface VideoOption {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  duration: string;
  thumbnail: string;
}

const videoOptions: VideoOption[] = [
  {
    id: 'ai-career-future',
    title: 'The Future of AI in Career Development',
    description: 'Discover how artificial intelligence is revolutionizing career paths and job opportunities',
    youtubeId: 'JMLsHI8aV0g',
    duration: '10:25',
    thumbnail: 'https://img.youtube.com/vi/JMLsHI8aV0g/maxresdefault.jpg'
  },
  {
    id: 'ai-resume-optimization',
    title: 'AI Resume Optimization & ATS Systems',
    description: 'Learn how to optimize your resume for AI screening systems and beat ATS filters',
    youtubeId: 'ciIkiWwZnlc',
    duration: '12:15',
    thumbnail: 'https://img.youtube.com/vi/ciIkiWwZnlc/maxresdefault.jpg'
  },
  {
    id: 'ai-interview-skills',
    title: 'AI-Powered Interview Preparation',
    description: 'Master AI interview techniques and practice with virtual interview systems',
    youtubeId: 'n_6p-1J551Y',
    duration: '8:45',
    thumbnail: 'https://img.youtube.com/vi/n_6p-1J551Y/maxresdefault.jpg'
  },
  {
    id: 'ai-career-transition',
    title: 'Career Transition into AI Field',
    description: 'Complete guide for professionals looking to transition into AI and machine learning careers',
    youtubeId: 'aircAruvnKk',
    duration: '18:30',
    thumbnail: 'https://img.youtube.com/vi/aircAruvnKk/maxresdefault.jpg'
  },
  {
    id: 'ai-skills-2024',
    title: 'Top AI Skills for 2024 & Beyond',
    description: 'Essential AI skills and competencies that will be in high demand for future careers',
    youtubeId: 'F5PjcwSwKwE',
    duration: '14:20',
    thumbnail: 'https://img.youtube.com/vi/F5PjcwSwKwE/maxresdefault.jpg'
  }
];

interface VideoGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ isOpen, onClose }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoOption | null>(null);

  const selectVideo = (video: VideoOption) => {
    setSelectedVideo(video);
  };

  const backToGallery = () => {
    setSelectedVideo(null);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl mx-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
        >
          <XMarkIcon className="w-8 h-8" />
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
          {selectedVideo ? (
            /* Video Player View */
            <div>
              {/* Video Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedVideo.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {selectedVideo.description}
                  </p>
                </div>
                <button
                  onClick={backToGallery}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  ← Back to Videos
                </button>
              </div>

              {/* Video Player */}
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ) : (
            /* Video Gallery View */
            <div>
              {/* Gallery Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  AI Career Development Videos
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Explore how AI can transform your career journey
                </p>
              </div>

              {/* Video Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videoOptions.map((video) => (
                    <div
                      key={video.id}
                      className="cursor-pointer group"
                      onClick={() => selectVideo(video)}
                    >
                      <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
                        {/* Video Thumbnail */}
                        <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/480x270/4f46e5/ffffff?text=AI+Career+Video';
                            }}
                          />
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white bg-opacity-90 rounded-full p-3">
                              <PlayIcon className="w-8 h-8 text-indigo-600" />
                            </div>
                          </div>
                          {/* Duration Badge */}
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </div>
                        </div>
                        
                        {/* Video Info */}
                        <div className="p-4 bg-white dark:bg-gray-800">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Call to Action */}
                <div className="mt-8 text-center p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                    Ready to start your AI-powered career journey?
                  </h3>
                  <p className="text-indigo-700 dark:text-indigo-300 mb-4">
                    Join thousands of professionals already using our platform
                  </p>
                  <button 
                    onClick={onClose}
                    className="btn-primary"
                  >
                    Get Started Free
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoGallery;