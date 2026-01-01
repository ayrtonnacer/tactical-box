import { useEffect } from 'react';

export function SpotifyPlayer() {
  useEffect(() => {
    // Load Spotify Embed Script
    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iam.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-20 max-w-sm rounded-lg overflow-hidden">
      <iframe
        style={{
          borderRadius: '12px',
          width: '100%',
          height: '152px',
        }}
        src="https://open.spotify.com/embed/track/6AQbmUe0Qwf5PZnt4HmTXv?utm_source=generator&theme=0"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
