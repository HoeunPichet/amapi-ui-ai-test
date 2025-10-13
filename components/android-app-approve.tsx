'use client';

import { useState, useEffect } from 'react';

export default function AndroidAppApproval() {
    const [iframeUrl, setIframeUrl] = useState('');
    const [error, setError] = useState('');
  
    useEffect(() => {
      // Fetch token from your backend
      fetch('http://localhost:8081/api/android/get-token?enterpriseId=LC012frb56', {
        method: 'POST',
      })
        .then(res => res.json())
        .then(data => {

            console.log("DDDDDDD: ",data);
            
          if (data.token && data.enterpriseId) {
            const url = `https://play.google.com/work/embedded/search?mode=SELECT&useinline=true&token=${encodeURIComponent(data.token)}&hl=en`;
            setIframeUrl(url);
          } else {
            setError('Failed to get token');
          }
        })
        .catch(err => setError(err.message));
    }, []);
  
    if (error) return <div>Error: {error}</div>;
    if (!iframeUrl) return <div>Loading...</div>;
  
    return (
      <iframe
        src={iframeUrl}
        width="100%"
        height="900"
        frameBorder="0"
        title="Google Play EMM"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    );
}