'use client';

import React, { useState, useEffect } from 'react';
import  Image from 'next/image';

const UiCard = ({ name, imageUrl, quote, linkedinUrl, githubUrl, instagramUrl }) => {
  const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <div className="card">
      <div className="top-section">
      {isClient && (
            <Image
              src={imageUrl}
              alt="profile"
              fill
              style={{
                objectFit: "cover",
                borderRadius: "15px"
              }}
            />
          )}
       
      </div>
      <div className="bottom-section">
        <span className="title">{name}</span>
        <div className="row row1">
          <div className="item">
            <span className="big-text">{quote}</span>
          </div>
          <div className="socials">
  {linkedinUrl && (
    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
      <svg className="svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 24h5V7H0v17zm7.5-17h4.8v2.5h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 5.99 3.3 5.99 7.59V24h-5v-7.98c0-1.9-.03-4.35-2.64-4.35-2.64 0-3.04 2.06-3.04 4.21V24h-5V7z"/>
      </svg>
    </a>
  )}
  {githubUrl && (
    <a href={githubUrl} target="_blank" rel="noopener noreferrer">
      <svg className="svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577v-2.04c-3.338.727-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.085 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.468-2.382 1.236-3.222-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.874.12 3.176.77.84 1.236 1.912 1.236 3.222 0 4.61-2.807 5.624-5.48 5.92.43.37.823 1.1.823 2.22v3.293c0 .32.218.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    </a>
  )}
  {instagramUrl && (
    <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
      <svg className="svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.974 1.246 2.241 1.308 3.607.058 1.267.07 1.647.07 4.851s-.012 3.584-.07 4.851c-.062 1.366-.333 2.633-1.308 3.607-.975.975-2.242 1.246-3.608 1.308-1.267.058-1.647.07-4.851.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.333-3.608-1.308-.975-.974-1.246-2.241-1.308-3.607C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.851c.062-1.366.333-2.633 1.308-3.607.974-.974 2.241-1.246 3.607-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.773.128 4.628.396 3.68 1.344c-.948.948-1.216 2.093-1.274 3.373C2.012 6.332 2 6.741 2 12c0 5.259.012 5.668.07 6.948.058 1.28.326 2.425 1.274 3.373.948.948 2.093 1.216 3.373 1.274C8.332 23.988 8.741 24 12 24s3.668-.012 4.948-.07c1.28-.058 2.425-.326 3.373-1.274.948-.948 1.216-2.093 1.274-3.373.058-1.28.07-1.689.07-6.948s-.012-5.668-.07-6.948c-.058-1.28-.326-2.425-1.274-3.373C19.373.396 18.228.128 16.948.07 15.668.012 15.259 0 12 0zM12 5.838A6.162 6.162 0 0 0 5.838 12 6.162 6.162 0 0 0 12 18.162 6.162 6.162 0 0 0 18.162 12 6.162 6.162 0 0 0 12 5.838zm0 10.162A3.999 3.999 0 1 1 12 8a3.999 3.999 0 0 1 0 7.999zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/>
      </svg>
    </a>
  )}
</div>
      </div>
     
     
      </div>
      <style jsx>{`
        .card {
          width: 240px;
          border-radius: 20px;
          opacity: 0.9;
          padding: 5px;
          overflow: hidden;
        background: rgba(180, 120, 255, 0.2);
backdrop-filter: blur(12px);
border: 1.5px solid rgba(255, 255, 255, 0.3);
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .card:hover {
          transform: scale(1.05);
        }
        
        .card .top-section {
          height: 180px;
          border-radius: 15px;
          display: flex;
          flex-direction: column;
          background: linear-gradient(45deg, rgb(4, 159, 187) 0%, rgb(80, 246, 255) 100%);
          position: relative;
        }
        .card .top-section .border {
      
          height: 50px;
          width: 130px;
          background: white;
          background: #1b233d;
          position: relative;
         border-radius: 15px;
          box-shadow: -10px -10px 0 0 #1b233d;
        }
        .card .top-section .border::before {
          
          position: absolute;
          width: 15px;
          height: 15px;
          top: 0;
          
          background: rgba(255, 255, 255, 0);
         
          box-shadow: -5px -5px 0 2px #1b233d;
        }
        .card .top-section::before {
         
          position: absolute;
          top: 30px;
          left: 0;
          background: rgba(255, 255, 255, 0);
          height: 15px;
          width: 15px;
         
          box-shadow: -5px -5px 0 2px #1b233d;
        }
        .card .top-section .icons {
          position: absolute;
          top: 0;
          width: 100%;
          height: 30px;
          display: flex;
          justify-content: space-between;
        }
        .card .top-section .icons .logo {
          height: 100%;
          aspect-ratio: 1;
          padding: 7px 0 7px 15px;
        }
        .card .top-section .icons .logo .top-section {
          height: 100%;
        }
        .card .top-section .icons .social-media {
          height: 100%;
          padding: 8px 15px;
          display: flex;
          gap: 7px;
        }
        .card .top-section .icons .social-media .svg {
          height: 100%;
          fill: --var(--color-white);
          filter: drop-shadow(0 5px 5px rgba(165, 132, 130, 0.1333));
          border: 1px solid rgba(255, 255, 255, 0.126);
        }
        .card .top-section .icons .social-media .svg:hover {
          fill: white;
        }
        .card .bottom-section {
          margin-top: 15px;
          padding: 10px 5px;
        }
        .card .bottom-section .title {
          display: block;
          font-size: 17px;
          font-weight: bolder;
          color: white;
          text-align: center;
          letter-spacing: 2px;
        }
        .card .bottom-section .row {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
        .card .bottom-section .row .item {
          flex: 30%;
          text-align: center;
          padding: 5px;
          color: rgba(170, 222, 243, 0.721);
        }
        .card .bottom-section .row .item .big-text {
          font-size: 12px;
          display: block;
        }
        .card .bottom-section .row .item .regular-text {
          font-size: 9px;
        }
        .card .bottom-section .row .item:nth-child(2) {
          border-left: 1px solid rgba(255, 255, 255, 0.126);
          border-right: 1px solid rgba(255, 255, 255, 0.126);
        }
          .socials {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.socials .svg {
  width: 22px;
  height: 22px;
  transition: transform 0.3s ease, fill 0.3s ease;
  cursor: pointer;
}

.socials .svg:hover {
  transform: scale(1.2);
  fill: #ffffff;
}
      `}</style>
    </div>
  );
};

export default UiCard;