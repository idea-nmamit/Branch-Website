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
      <div className="card">
        

        <div className="profile-pic">
          {isClient && (
            <Image
              src={imageUrl}
              alt="profile"
              width={60}
              height={60}
              style={{
              
                objectFit: "cover",
              }}
            />
          )}
        </div>

        <div className="bottom">
          <div className="mb-12 mr-40 w-44 content">
            <h1 className="name mr-32">{name}</h1>
            <span className="text-white">{designation}</span>
          </div>

          <div className="bottom-bottom">
            <div className="ml-14 social-links-container">
            
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="26" height="26" viewBox="0 0 192 192">
            <a href={linkedin} target="_blank" rel="noopener noreferrer">
            <path d="M156,0h-120c-19.875,0 -36,16.125 -36,36v120c0,19.875 16.125,36 36,36h120c19.875,0 36,-16.125 36,-36v-120c0,-19.875 -16.125,-36 -36,-36zM59.36539,162.98077h-29.82693l-0.17307,-89.30769h29.82692zM43.70192,61.99038h-0.17308c-9.75,0 -16.03846,-6.72115 -16.03846,-15.08653c0,-8.56731 6.49039,-15.0577 16.41347,-15.0577c9.92308,0 16.00961,6.49038 16.21153,15.0577c0,8.36538 -6.31731,15.08653 -16.41346,15.08653zM162.77885,162.98077h-30.08654v-48.51923c0,-11.74039 -3.11538,-19.73077 -13.61538,-19.73077c-8.01923,0 -12.34615,5.39423 -14.42308,10.61538c-0.77885,1.875 -0.98077,4.44231 -0.98077,7.06731v50.56731h-30.23077l-0.17308,-89.30769h30.23077l0.17308,12.60577c3.86538,-5.97116 10.29808,-14.42308 25.70192,-14.42308c19.09616,0 33.37501,12.46154 33.37501,39.25961v51.86539z"></path>
            </a>
            </svg>


            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <a href={instagram} target="_blank" rel="noopener noreferrer">
            <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
            </a>
            </svg>


            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
            <a href={github} target="_blank" rel="noopener noreferrer">
            <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
            </a>
            </svg>
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
    border-radius: 55px;
    
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
    border-radius: 80px 29px 29px 29px;
    z-index: 2;
    box-shadow: rgba(96, 75, 74, 0.1882352941) 0px 5px 5px 0px inset;
    overflow: hidden;
    transition: all 0.7s cubic-bezier(0.25, 0.8, 0.25, 1);
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
    transition: all 0.7s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  /* On hover, revert profile pic to original default */
  .card:hover .profile-pic {
    width: calc(100% - 6px);
    height: calc(100% - 6px);
    top: 3px;
    left: 3px;
    border-radius: 29px;
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
    transition: all 0.7s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  .card .profile-pic svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 0px 0px;
    transform-origin: 45% 20%;
    transition: all 0.7s cubic-bezier(0.25, 0.8, 0.25, 1);
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
