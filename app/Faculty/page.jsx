
"use client"
import React from 'react';
import styled from 'styled-components';

// Individual Card Component
const Card = ({ name, title }) => {
  return (

    <div className="card">
      <div className="card-photo" />
      <div className="card-title">{name}<br />
        <span>{title}</span>
      </div>
      <div className="card-socials">
        <button className="card-socials-btn linkedin">
          <svg xmlns="http://www.w3.org/2000/svg" width={512} viewBox="0 0 512 512" height={512}><path d="m51.326 185.85h90.011v270.872h-90.011zm45.608-130.572c-30.807 0-50.934 20.225-50.934 46.771 0 26 19.538 46.813 49.756 46.813h.574c31.396 0 50.948-20.814 50.948-46.813-.589-26.546-19.551-46.771-50.344-46.771zm265.405 124.209c-47.779 0-69.184 26.28-81.125 44.71v-38.347h-90.038c1.192 25.411 0 270.872 0 270.872h90.038v-151.274c0-8.102.589-16.174 2.958-21.978 6.519-16.174 21.333-32.923 46.182-32.923 32.602 0 45.622 24.851 45.622 61.248v144.926h90.024v-155.323c0-83.199-44.402-121.911-103.661-121.911z" /></svg>
        </button>
      </div>
    </div>
  );
};

// Container for all cards with styling
const FacultyCardGrid = () => {

  const facultyMembers = [
    { name: "DR VENUGOPAL", title: "HOD" },
    { name: "DR SHARMA", title: "Professor" },
    { name: "DR PATEL", title: "Associate Professor" },
    { name: "DR GUPTA", title: "Assistant Professor" },
    { name: "DR SINGH", title: "Professor" },
  ];

  return (
    <StyledPageWrapper className="bg-[#17003A] dark:bg-[#8617C0]">
      <div className="card-container">
        {facultyMembers.map((member, index) => (
          <Card key={index} name={member.name} title={member.title} />
        ))}
      </div>
    </StyledPageWrapper>
  );
};

const StyledPageWrapper = styled.div`
  /* Main container styling */
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;

  /* Card container - handles grid layout */
  .card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 50px;
    max-width: 1200px;
    
  }

  /* Card styling */
  .card {
    --font-color: #fefefe;
    --font-color-sub: #7e7e7e;
    --bg-color: linear-gradient(to bottom right, #321a52, #3a1a60);
    --main-color: #ad46ff;
    width: 250px; /* Larger card size */
    height: 320px; /* Larger card size */
    background: var(--bg-color);
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-3px);
    }
  }

  .card-photo {
    transform: scale(0.4) translate(150px, 180px);
    width: 250px;
    height: 250px;
    margin-left: -125px;
    margin-top: -125px;
    background: radial-gradient(circle,rgba(0,0,0,0.15) 50%,rgba(0,0,0,0) 50.8%) 14% 30%/11% 11%,radial-gradient(circle,#ffdab9 50%,rgba(255,218,185,0) 50.8%) 10% 30%/16% 16%,radial-gradient(circle,#8b4513 50%,rgba(139,69,19,0) 50.8%) 7.5% 29%/20% 20%,radial-gradient(circle,rgba(0,0,0,0.15) 50%,rgba(0,0,0,0) 50.8%) 86% 30%/11% 11%,radial-gradient(circle,#ffdab9 50%,rgba(255,218,185,0) 50.8%) 90% 30%/16% 16%,radial-gradient(circle,#8b4513 50%,rgba(139,69,19,0) 50.8%) 92.5% 29%/20% 20%,radial-gradient(circle at 50% 0,#ffdab9 29.5%,#8b4513 30%,#8b4513 35%,rgba(139,69,19,0) 35.5%) 50% 95%/40% 20%,radial-gradient(ellipse at 50% 100%,rgba(139,69,19,0) 49%,#8b4513 49.5%,#8b4513 52%,rgba(139,69,19,0) 52.5%) 50% 110%/120% 40%,radial-gradient(circle at 50% 0,rgba(255,255,255,0) 35%,white 35%,white 45%,rgba(255,255,255,0) 45.5%) 50% 89%/40% 13%,linear-gradient(#8b4513,#8b4513) 37% 100%/.25em 22%,linear-gradient(#8b4513,#8b4513) 63% 100%/.25em 22%,linear-gradient(80deg,rgba(0,0,0,0) 50%,#333 50.5%) 24% 100%/1em 18%,linear-gradient(-80deg,rgba(0,0,0,0) 50%,#333 50.5%) 76% 100%/1em 18%,linear-gradient(162deg,rgba(0,0,0,0) 10%,#333 10%) 30% 100%/1.5em 21%,linear-gradient(-162deg,rgba(0,0,0,0) 10%,#333 10%) 70% 100%/1.5em 21%,radial-gradient(ellipse at 100% 100%,#556b2f 50%,rgba(85,107,47,0) 50.5%) 0 100%/37% 29%,radial-gradient(ellipse at 0 100%,#556b2f 50%,rgba(85,107,47,0) 50.5%) 100% 100%/37% 29%,radial-gradient(ellipse at 50% 100%,#222 51%,rgba(0,0,0,0) 51.5%) 50% 110%/120% 40%,radial-gradient(circle at 50% 0,rgba(0,0,0,0.15) 40%,rgba(0,0,0,0) 40.5%) 50% 82%/20% 20%,linear-gradient(to right,#8b4513 4px,rgba(139,69,19,0) 4px) 50% 80%/20% 20%,linear-gradient(to left,#8b4513 4px,rgba(139,69,19,0) 4px) 50% 80%/20% 20%,linear-gradient(#ffdab9,#ffdab9) 50% 80%/20% 20%,linear-gradient(#48240a,#48240a) 50% 100%/65% 60%,radial-gradient(circle,white 30%,rgba(255,255,255,0) 62%) 50% 50%/100% 100%;
    background-color: #ccc;
    background-repeat: no-repeat;
    border-radius: 30%;
    transition: 0.3s;
  }

  .card-title {
    text-align: center;
    color: var(--font-color);
    font-size: 24px; 
    font-weight: 400;
    margin-top: 20px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .card-title span {
    font-size: 18px; 
    color: var(--font-color-sub);
  }

  .card-socials {
    display: flex;
    height: 0;
    opacity: 0;
    margin-top: 25px;
    gap: 20px;
    transition: 0.5s;
  }

  .card-socials-btn {
    width: 30px; 
    height: 30px;
    border: none;
    background: transparent;
    cursor: pointer;
  }

  .card-socials-btn svg {
    width: 100%;
    height: 100%;
    fill: var(--main-color);
  }

  .card:hover > .card-socials {
    opacity: 1;
    height: 35px;
  }


  .card-socials-btn:hover {
    transform: translateY(-5px);
    transition: all 0.15s;
  }

  .card:hover .card-photo {
    transform: scale(0.5) translate(120px, 120px);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .card-container {
      gap: 40px;
    }
    
    .card {
      width: 220px;
      height: 280px;
    }
  }
  
  @media (max-width: 480px) {
    .card-container {
      gap: 30px;
    }
    
    .card {
      width: 200px;
      height: 260px;
    }
  }
//     @media (prefers-color-scheme: dark) {
//   background: linear-gradient(to bottom right, #8617C0, #6012A4)!important;
// }

`;

export default FacultyCardGrid;