"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';



const Card = ({ name, imageUrl, designation, linkedin, github, instagram }) => {
const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <StyledWrapper>
    <div className="card mb-4">
      {/* Add margin-bottom to create space below the image */}
      <div className="profile-pic mb-4 relative w-24 h-24 rounded-full overflow-hidden">
        {isClient && (
          <Image
            src={imageUrl}
            alt="profile"
            fill
            style={{ objectFit: 'cover' }}
          />
        )}
      </div>
      <div className="bottom">
        <div className="mb-12 flex flex-col justify-center items-center content">
          <h1 className="name w-full">{name}</h1>
          <span className="w-full text-white">{designation}</span>
        </div>
        <div className="bottom-bottom">
          {/* Use flex with gap for equal spacing between icons */}
          <div className="flex gap-4 justify-center social-links-container">
            <a href={instagram} target="_blank" rel="noopener noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
                className="svg"
              >
                <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z" />
              </svg>
            </a>
            <a href={github} target="_blank" rel="noopener noreferrer">
              <svg
                className="svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                fill="currentColor"
              >
                <path d="M256 32C114.62 32 0 146.62 0 288c0 113.31 73.38 209.06 175.47 242.8 12.82 2.34 17.53-5.56 17.53-12.33 0-6.08-.24-26.21-.35-47.56-71.34 15.51-86.42-30.96-86.42-30.96-11.65-29.59-28.46-37.46-28.46-37.46-23.27-15.91 1.76-15.59 1.76-15.59 25.7 1.81 39.23 26.39 39.23 26.39 22.88 39.21 59.99 27.9 74.62 21.33 2.32-16.56 8.94-27.91 16.27-34.33-56.95-6.48-116.81-28.47-116.81-126.74 0-27.99 10-50.86 26.39-68.78-2.64-6.5-11.43-32.69 2.51-68.19 0 0 21.51-6.88 70.45 26.27a243.69 243.69 0 01128.26 0c48.91-33.15 70.39-26.27 70.39-26.27 13.97 35.5 5.18 61.69 2.54 68.19 16.43 17.92 26.36 40.79 26.36 68.78 0 98.5-59.97 120.19-117.15 126.51 9.18 7.9 17.37 23.52 17.37 47.45 0 34.29-.3 61.92-.3 70.37 0 6.81 4.63 14.74 17.61 12.23C438.66 497 512 401.32 512 288 512 146.62 397.38 32 256 32z" />
              </svg>
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer">
              <svg
                className="svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                fill="currentColor"
              >
                <path d="M100.28 448H7.4V149.76h92.88zM53.79 108.1C24.09 108.1 0 83.37 0 53.79a53.79 53.79 0 11107.58 0c0 29.58-24.1 54.31-53.79 54.31zM447.9 448h-92.4V302.4c0-34.7-12.5-58.4-43.7-58.4-23.9 0-38.2 16.1-44.4 31.6-2.3 5.5-2.8 13.1-2.8 20.8V448h-92.6s1.2-268.5 0-296.4h92.6v42c12.3-19 34.3-46.1 83.6-46.1 61 0 106.9 39.8 106.9 125.3V448z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </StyledWrapper>
  );
};
 


 

const StyledWrapper = styled.div`
 

  /* CARD */
 

  .card {
 

    width: 280px;
 

    height: 280px;
 

    background: white;
 

    /* Reversed default state (lifted/animated) */
 

    border-top-left-radius: 55px;
 

    border-radius: 29px;
 

    
 

    padding: 3px;
 

    position: relative;
 

    box-shadow: #604b4a30 0px 70px 30px -50px;
 

    transition: all 0.7s cubic-bezier(.23,1,.32,1);
 

  }
 

  /* On hover, revert to original resting style */
 

  .card:hover {
 

    border-top-left-radius: 32px;
 

  }
 


 

  /* BOTTOM */
 

  .card .bottom {
 

    position: absolute;
 

    bottom: 3px;
 

    left: 3px;
 

    right: 3px;
 

    background:rgb(68, 26, 110);
 

   opacity: 0.9;
 

    /* Reversed default: previous hover values */
 

    top: 20%;
 

    border-radius: 29px 29px 29px 29px;
 

    z-index: 2;
 

    box-shadow: rgba(96, 75, 74, 0.1882352941) 0px 5px 5px 0px inset;
 

    overflow: hidden;
 

    transition: all 1.5s cubic-bezier(0, 0.1, 0.01, 1);
 

  }
 

  /* On hover, revert to original bottom style */
 

  .card:hover .bottom {
 

    top: 80%;
 

    border-radius: 29px;
 

  }
 


 

  /* PROFILE PIC */
 

  .card .profile-pic {
 

    position: absolute;
 

    /* Reversed default: previous hover state */
 

    width: 100px;
 

    height: 100px;
 

    aspect-ratio: 1;
 

    top: 10px;
 

    left: 10px;
 

    border-radius: 50%;
 

    z-index: 3;
 

    box-shadow: rgba(96, 75, 74, 0.1882352941) 0px 5px 5px 0px;
 

    overflow: hidden;
 

    transition: all 0.4s cubic-bezier(0.5, 1, 0.9, 1);
 

  }
 

  /* On hover, revert profile pic to original default */
 

  .card:hover .profile-pic {
 

    width: calc(100% - 6px);
 

    height: calc(100% - 6px);
 

    top: 3px;
 

    left: 3px;
 

    border-radius: 50px;
 

    z-index: 1;
 

  
 

    box-shadow: none;
 

  }
 


 

  /* MAIL */
 

  .card .mail {
 

    position: absolute;
 

    right: 2rem;
 

    top: 1.4rem;
 

    background: transparent;
 

    border: none;
 

  }
 

  .card .mail svg {
 

    stroke: #fbb9b6;
 

    stroke-width: 3px;
 

    transition: stroke 0.4s ease;
 

  }
 

  .card .mail svg:hover {
 

    stroke: #f55d56;
 

  }
 


 


 

  /* PROFILE PIC IMG & SVG */
 

  .card .profile-pic img {
 

    object-fit: cover;
 

    width: 100%;
 

    height: 100%;
 

    object-position: 0px 0px;
 

    transition: all 0.7s cubic-bezier(9.25, 5.8, 0.75, 1);
 

  }
 

  .card .profile-pic svg {
 

    width: 100%;
 

    height: 100%;
 

    object-fit: cover;
 

    object-position: 0px 0px;
 

    transform-origin: 20% 20%;
 

    transition: all 0.7s cubic-bezier(9.25, 7.8, 0.75, 1);
 

  }
 


 

  /* BOTTOM CONTENT */
 

  .card .bottom .content {
 

    position: absolute;
 

    bottom: 0;
 

    left: 1.5rem;
 

    right: 1.5rem;
 

    height: 160px;
 

    display: flex;
 

    flex-direction: column;
 

    align-items: center;
 

    justify-content: center;
 

    gap: 4px;
 

  }
 

  .card .bottom .content .name {
 

    display: block;
 

    font-size: 1.2rem;
 

    color: white;
 

    font-weight: bold;
 

  }
 

  .card .bottom .content .about-me {
 

    display: block;
 

    font-size: 0.9rem;
 

    color: white;
 

    margin-top: 1rem;
 

  }
 


 

  /* BOTTOM BOTTOM */
 

  .card .bottom .bottom-bottom {
 

    position: absolute;
 

    bottom: 1rem;
 

    left: 1.5rem;
 

    right: 1.5rem;
 

    display: flex;
 

    align-items: center;
 

    justify-content: space-between;
 

  }
 

  .card .bottom .bottom-bottom .social-links-container {
 

    display: flex;
 

    gap: 1rem;
 

  }
 

  .card .bottom .bottom-bottom .social-links-container svg {
 

    height: 20px;
 

    fill: white;
 

    filter: drop-shadow(0 5px 5px rgba(165, 132, 130, 0.1333));
 

    transition: all 0.8s ease;
 

  }
 

  .card .bottom .bottom-bottom .social-links-container svg:hover {
 

    fill: #f55d56;
 

    transform: scale(1.2);
 

  }
 

  .card .bottom .bottom-bottom .button {
 

    background: white;
 

    color: #fbb9b6;
 

    border: none;
 

    border-radius: 20px;
 

    font-size: 0.6rem;
 

    padding: 0.4rem 0.6rem;
 

    box-shadow: rgba(165, 132, 130, 0.1333) 0px 5px 5px 0px;
 

    transition: background-color 0.8s ease, color 0.8s ease;
 

  }
 

  .card .bottom .bottom-bottom .button:hover {
 

    background: #f55d56;
 

    color: white;
 

  }
 

`;
 


 

export default Card;