"use client"
import React from 'react';
import styled from 'styled-components';

// Individual Card Component
const Card = ({ name, title, linkedinUrl,margin, imageUrl }) => {
  return (
    <div className="card">
      <div className="card-photo ">
        <img src={imageUrl} fill  alt={`${name} profile`} />
      </div>
      <div className="card-title">{name}<br />
        <span>{title}</span>
      </div>
      <div className="card-socials">
        <button className="card-socials-btn linkedin">
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width={512} viewBox="0 0 512 512" height={512}><path d="m51.326 185.85h90.011v270.872h-90.011zm45.608-130.572c-30.807 0-50.934 20.225-50.934 46.771 0 26 19.538 46.813 49.756 46.813h.574c31.396 0 50.948-20.814 50.948-46.813-.589-26.546-19.551-46.771-50.344-46.771zm265.405 124.209c-47.779 0-69.184 26.28-81.125 44.71v-38.347h-90.038c1.192 25.411 0 270.872 0 270.872h90.038v-151.274c0-8.102.589-16.174 2.958-21.978 6.519-16.174 21.333-32.923 46.182-32.923 32.602 0 45.622 24.851 45.622 61.248v144.926h90.024v-155.323c0-83.199-44.402-121.911-103.661-121.911z" /></svg>
          </a>
        </button>
      </div>
    </div>
  );
};

// Container for all cards with styling
const FacultyCardGrid = () => {
  const facultyMembers = [
    {
      name: "Dr. VENUGOPALA P S",
      title: "HOD",
      linkedinUrl: "https://www.youtube.com/shorts/SXHMnicI6Pg",
      imageUrl: "/facultyphotos/HOD.png"
    },
    {
      name: "Dr. ANKITHA K",
      title: "Assistant Professor Gd-III",
      linkedinUrl: "https://www.youtube.com/shorts/SXHMnicI6Pg",
      imageUrl: "/facultyphotos/teach1.png"
    },
    {
      name: "Dr. NAVANEETH BHASKAR",
      title: "Assistant Professor Gd-III",
      linkedinUrl: "https://www.youtube.com/shorts/SXHMnicI6Pg",
      imageUrl: "/facultyphotos/teach2.png",
      margin: "m-2"
    },
    {
      name: "Mr. PRAJWAL HEGDE N",
      title: "Assistant Professor Gd-II",
      linkedinUrl: "https://www.youtube.com/shorts/SXHMnicI6Pg",
      imageUrl: "/facultyphotos/teach3.png"
    },
    {
      name: "Dr. PRAVEEN M NAIK",
      title: "Asst. Professor Gd.II",
      linkedinUrl: "https://www.youtube.com/shorts/SXHMnicI6Pg",
      imageUrl: "/facultyphotos/teach4.png"
    },
    {
      name: "Ms. ANKITHA SHETTY",
      title: "Assistant Professor Gd-I",
      linkedinUrl: "https://www.youtube.com/shorts/SXHMnicI6Pg",
      imageUrl: "/facultyphotos/teach5.png"
    },
    {
      name: "Mr. MURALI S IYER",
      title: "Professor of Practice",
      linkedinUrl: "https://www.youtube.com/shorts/SXHMnicI6Pg",
      imageUrl: "/facultyphotos/teach6.png"
    },
  ];

  return (
    <StyledPageWrapper className="bg-[#17003A] dark:bg-[#8617C0]">
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-bold text-white mb-10 tracking-tight ">Faculty</h1>
        <div className="card-container">
          {facultyMembers.map((member, index) => (
            <Card
              key={index}
              name={member.name}
              title={member.title}
              linkedinUrl={member.linkedinUrl}
              imageUrl={member.imageUrl}
              margin={member.margin}
            />
          ))}
        </div>
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
    width: 250px;
    height: 320px;
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
  position: absolute;
  top: 10px;
  left: 25%;
  transform: translatey(15%);
  width: 120px;
  height: 120px;
  border-radius: 30%;
  overflow: hidden;
  border: 2px solid var(--main-color);
  background: white;
  transition: transform 0.3s ease;
  z-index: 1;
}
.card {
  position: relative;
  padding-top: 80px; /* Leave space for fixed image */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Start content from top */
}

  .card-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-title {
    text-align: center;
    color: var(--font-color);
    font-size: 24px; 
    font-weight: 400;
    margin-top: 80px;
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
    margin-top: 15px;
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
    transform: scale(1.1);
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
    
    .card-photo {
      width: 100px;
      height: 100px;
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
    
    .card-photo {
      width: 90px;
      height: 90px;
    }
      
  .card-title {
    text-align: center;
    color: var(--font-color);
    font-size: 24px; 
    font-weight: 400;
    margin-top: 40px;
  }
  }
`;

export default FacultyCardGrid;