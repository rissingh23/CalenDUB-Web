import './HomePage.css';
import Header from '../../components/Header/Header';
import homepage1 from '../../assets/homepage-1.jpg';
import homepage2 from '../../assets/homepage-2.jpg';
import homepage3 from '../../assets/homepage-3.jpg';
import homepage2_discovering from '../../assets/homepage-2-discovering.jpg';
import homepage2_filter from '../../assets/homepage-2-filter.webp';
import homepage3_personal from '../../assets/homepage-3-personal.jpg';
import homepage3_calendar from '../../assets/homepage-3-calendar.jpeg';
import homepage4_1 from '../../assets/homepage-4-1.webp';
import homepage4_2 from '../../assets/homepage-4-2.png';
import homepage4_3 from '../../assets/homepage-4-3.jpg';
import homepage4_4 from '../../assets/homepage-4-4.jpg';
import { useNavigate } from 'react-router-dom';
import  { useEffect, useState, useRef } from 'react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const sectionsRef = useRef<NodeListOf<Element> | null>(null);
  const isScrolling = useRef(false);
  const [scrollingEnabled, setScrollingEnabled] = useState(true);

  const removeScroll = () => {
    setScrollingEnabled(false);
  }

  const enableScroll = () => {
    setScrollingEnabled(true);
  }

  useEffect(() => {
    if (!scrollingEnabled) return;

    sectionsRef.current = document.querySelectorAll('.homepage-body > div');

    const handleScroll = (event: WheelEvent) => {
      event.preventDefault(); 
      triggerScroll(event.deltaY > 0 ? 1 : -1); 
    };

    window.addEventListener('wheel', handleScroll, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [currentSection, scrollingEnabled]);

  const triggerScroll = (direction: number) => {
    if (isScrolling.current) return;

    isScrolling.current = true;
    const nextSectionIndex = Math.max(0, Math.min(currentSection + direction, sectionsRef.current!.length - 1));

    sectionsRef.current![nextSectionIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    setCurrentSection(nextSectionIndex);

    setTimeout(() => {
      isScrolling.current = false;
    }, 1000); 
  };

  return (
    <div>
      <div className='header-container'>
        <Header  />
      </div>
      <div className='homepage-body'>
        <div className='homepage-body-1'>
          <div className='homepage-body-1-tagline'>
            Your School, Your Events, <span>One Calendar.</span>
          </div>
          <div className='homepage-body-1-content'>
            <div className='homepage-body-1-button'>
              <button onClick={() => navigate('/explore')}>View Calendar</button>
            </div>
            <div className='homepage-body-1-image-container'>
              <img src={homepage1} alt='homepage-1' className='homepage-body-1-image-1' />
              <img src={homepage2} alt='homepage-2' className='homepage-body-1-image-2' />
              <img src={homepage3} alt='homepage-3' className='homepage-body-1-image-3' />
            </div>
          </div>
          <div className='homepage-body-1-caret' onClick={() => triggerScroll(1)}>
            &#8964;
          </div>
          <div className='homepage-body-1-continue'>
            Learn more about what we do!
          </div>
        </div>
        <div className='homepage-body-2'>
          <div className='homepage-body-2-image'>
            <img src={homepage2_discovering} alt='homepage-2-discovering' />
            <img src={homepage2_filter} alt='homepage-2-filter' />
          </div>
          <div className='homepage-body-2-text'>
            <div className='homepage-body-2-text-content'>
              <h1>Search for events you love</h1>
              <p>Calendub allows you to search and filter for events that you are interested in. Whether it be a club meeting, a sports game, or a dorm event, Calendub has it all.</p>
            </div>
          </div>
        </div>
        <div className='homepage-body-3'>
          <div className='homepage-body-3-text'>
            <div className='homepage-body-3-text-content'>
              <h1>Personalize your experience</h1>
              <p>Calendub allows you to receive notifications for selected events, create a personal event dashboard, and sync events with your own daily use calendar.</p>
            </div>  
          </div>
          <div className='homepage-body-3-image'>
            <img src={homepage3_personal} alt='homepage3-personal' />
            <img src={homepage3_calendar} alt='homepage3-calendar' />
          </div>
        </div>
        <div className='homepage-body-4'>
          <div className='homepage-body-4-image'>
            <img src={homepage4_1} alt='homepage-4-1' />
            <img src={homepage4_2} alt='homepage-4-2' />
            <img src={homepage4_3} alt='homepage-4-3' />
            <img src={homepage4_4} alt='homepage-4-4' />
          </div>
          <div className='homepage-body-4-text'>
            <div className='homepage-body-4-text-content'>
              <h1>Make your events known</h1>
              <p>With Calendub, you can then create and share events with your school community. In one calendar space, the entire school can know about your event, leaving you the time to create the best event possible.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
