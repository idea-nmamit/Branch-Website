"use client";
import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const cards = ({name, quote, imageUrl, linkedinUrl, instagramUrl, githubUrl}) => {
  return (
    <StyledWrapper>
      <div className="cards">
        <div className="top-section">
        
        <Image src={imageUrl} alt="profile" fill className='rounded-lg' />
          <div className="border border-none" />
          <div className="icons ">
            <div className="logo">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 94 94" className="svg">
                <path fill="white" d="M38.0481 4.82927C38.0481 2.16214 40.018 0 42.4481 0H51.2391C53.6692 0 55.6391 2.16214 55.6391 4.82927V40.1401C55.6391 48.8912 53.2343 55.6657 48.4248 60.4636C43.6153 65.2277 36.7304 67.6098 27.7701 67.6098C18.8099 67.6098 11.925 65.2953 7.11548 60.6663C2.37183 56.0036 3.8147e-06 49.2967 3.8147e-06 40.5456V4.82927C3.8147e-06 2.16213 1.96995 0 4.4 0H13.2405C15.6705 0 17.6405 2.16214 17.6405 4.82927V39.1265C17.6405 43.7892 18.4805 47.2018 20.1605 49.3642C21.8735 51.5267 24.4759 52.6079 27.9678 52.6079C31.4596 52.6079 34.0127 51.5436 35.6268 49.4149C37.241 47.2863 38.0481 43.8399 38.0481 39.0758V4.82927Z" />
                <path fill="white" d="M86.9 61.8682C86.9 64.5353 84.9301 66.6975 82.5 66.6975H73.6595C71.2295 66.6975 69.2595 64.5353 69.2595 61.8682V4.82927C69.2595 2.16214 71.2295 0 73.6595 0H82.5C84.9301 0 86.9 2.16214 86.9 4.82927V61.8682Z" />
                <path fill="white" d="M2.86102e-06 83.2195C2.86102e-06 80.5524 1.96995 78.3902 4.4 78.3902H83.6C86.0301 78.3902 88 80.5524 88 83.2195V89.1707C88 91.8379 86.0301 94 83.6 94H4.4C1.96995 94 0 91.8379 0 89.1707L2.86102e-06 83.2195Z" />
              </svg>
            </div>
            <div className="social-media">
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
                className="svg"
              >
                <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z" />
              </svg>
            </a>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              <svg
                className="svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                fill="currentColor"
              >
                <path d="M256 32C114.62 32 0 146.62 0 288c0 113.31 73.38 209.06 175.47 242.8 12.82 2.34 17.53-5.56 17.53-12.33 0-6.08-.24-26.21-.35-47.56-71.34 15.51-86.42-30.96-86.42-30.96-11.65-29.59-28.46-37.46-28.46-37.46-23.27-15.91 1.76-15.59 1.76-15.59 25.7 1.81 39.23 26.39 39.23 26.39 22.88 39.21 59.99 27.9 74.62 21.33 2.32-16.56 8.94-27.91 16.27-34.33-56.95-6.48-116.81-28.47-116.81-126.74 0-27.99 10-50.86 26.39-68.78-2.64-6.5-11.43-32.69 2.51-68.19 0 0 21.51-6.88 70.45 26.27a243.69 243.69 0 01128.26 0c48.91-33.15 70.39-26.27 70.39-26.27 13.97 35.5 5.18 61.69 2.54 68.19 16.43 17.92 26.36 40.79 26.36 68.78 0 98.5-59.97 120.19-117.15 126.51 9.18 7.9 17.37 23.52 17.37 47.45 0 34.29-.3 61.92-.3 70.37 0 6.81 4.63 14.74 17.61 12.23C438.66 497 512 401.32 512 288 512 146.62 397.38 32 256 32z" />
              </svg>
            </a>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
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
        <div className="bottom-section">
          <span className="title">{name}</span>
          <div className="row row1">
            <div className="item">
              <span className="big-text">2626</span>
              <span className="regular-text">UI elements</span>
            </div>
            <div className="item">
              <span className="big-text">100%</span>
              <span className="regular-text">Free for use</span>
            </div>
            <div className="item">
              <span className="big-text">38,631</span>
              <span className="regular-text">Contributers</span>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .cards {
    width: 280px;
    border-radius: 20px;
    background: #1b233d;
    padding: 5px;
    overflow: hidden;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 20px 0px;
    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 0 20px rgba(173, 70, 255, 0.6);
    
  }

  .cards:hover {
    transform: scale(1.05);
  }

  .cards .top-section {
    height: 180px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    background: linear-gradient(45deg, rgb(4, 159, 187) 0%, rgb(80, 246, 255) 100%);
    position: relative;
  }

  .cards .top-section .border {
    border-bottom-right-radius: 10px;
    height: 30px;
    width: 130px;
    background: white;
    background: #1b233d;
    position: relative;
    transform: skew(-40deg);
    box-shadow: -10px -10px 0 0 #1b233d;
  }

  .cards .top-section .border::before {
    
    position: absolute;
    width: 15px;
    height: 15px;
    top: 0;
    right: -15px;
    background: rgba(255, 255, 255, 0);
    border-top-left-radius: 10px;
    box-shadow: -5px -5px 0 2px #1b233d;
  }

  .cards .top-section::before {
    
    position: absolute;
    top: 30px;
    left: 0;
    background: rgba(255, 255, 255, 0);
    height: 15px;
    width: 15px;
    border-top-left-radius: 15px;
    box-shadow: -5px -5px 0 2px #1b233d;
  }

  .cards .top-section .icons {
    position: absolute;
    top: 0;
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
  }

  .cards .top-section .icons .logo {
    height: 100%;
    aspect-ratio: 1;
    padding: 7px 0 7px 15px;
  }

  .cards .top-section .icons .logo .top-section {
    height: 100%;
  }

  .cards .top-section .icons .social-media {
    height: 100%;
    padding: 8px 15px;
    display: flex;
    gap: 7px;
  }

  .cards .top-section .icons .social-media .svg {
    height: 100%;
    fill: #1b233d;
  }

  .cards .top-section .icons .social-media .svg:hover {
    fill: white;
  }

  .cards .bottom-section {
    margin-top: 15px;
    padding: 10px 5px;
  }

  .cards .bottom-section .title {
    display: block;
    font-size: 17px;
    font-weight: bolder;
    color: white;
    text-align: center;
    letter-spacing: 2px;
  }

  .cards .bottom-section .row {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }

  .cards .bottom-section .row .item {
    flex: 30%;
    text-align: center;
    padding: 5px;
    color: rgba(170, 222, 243, 0.721);
  }

  .cards .bottom-section .row .item .big-text {
    font-size: 12px;
    display: block;
  }

  .cards .bottom-section .row .item .regular-text {
    font-size: 9px;
  }

  .cards .bottom-section .row .item:nth-child(2) {
    border-left: 1px solid rgba(255, 255, 255, 0.126);
    border-right: 1px solid rgba(255, 255, 255, 0.126);
  }`;

export default cards;
