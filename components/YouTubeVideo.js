import React from 'react';

const YouTubeVideo = ({ videoId }) => (
    <div className="video-container">
        <iframe
            title="YouTube Video"
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allowFullScreen
        ></iframe>
    </div>
);

export default YouTubeVideo;
