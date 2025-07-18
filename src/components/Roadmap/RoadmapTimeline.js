import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { FaChevronRight, FaExternalLinkAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './RoadmapTimeline.css';

const RoadmapTimeline = () => {
  const [roadmap, setRoadmap] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRoadmap = localStorage.getItem('currentRoadmap');
    if (storedRoadmap) {
      try {
        const parsedData = JSON.parse(storedRoadmap);
        const roadmapData = parsedData.roadmap || parsedData;
        
        if (Array.isArray(roadmapData)) {
          setRoadmap(roadmapData);
        } else {
          console.error('Invalid roadmap structure:', parsedData);
          navigate('/');
        }
      } catch (e) {
        console.error('Failed to parse roadmap:', e);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!roadmap || roadmap.length === 0) {
    return (
      <div className="loading-screen">
        <div className="neon-loader"></div>
        <h3 className="neon-text">Loading your journey...</h3>
      </div>
    );
  }

  return (
    <div className="roadmap-background">
      <Container className="roadmap-container">
        {/* Added spacing div below navbar */}
        <div className="navbar-spacer"></div>
        
        <h1 className="main-title">
          <span className="neon-purple">Your</span>
          <span className="neon-teal">Learning</span>
          <span className="neon-pink">Journey</span>
        </h1>
        
        <div className="tree-timeline">
          {roadmap.map((item, index) => (
            <div key={index} className="timeline-phase">
              {/* Enhanced Phase Header with Tree Connection */}
              <div className="phase-header">
                <div className="tree-connector">
                  {index > 0 && <div className="branch-up"></div>}
                  <div className="phase-marker neon-pulse">
                    {index + 1}
                  </div>
                  {index < roadmap.length - 1 && <div className="branch-down"></div>}
                </div>
                <h2 className="phase-title">
                  {item.step || item.title}
                </h2>
              </div>

              {item.description && (
                <p className="phase-description">
                  {item.description}
                </p>
              )}

              <div className="knowledge-grid">
                {item.substeps && item.substeps.map((substep, i) => (
                  <div key={i} className="knowledge-card">
                    <div className="card-glow"></div>
                    <div className="card-content">
                      <div className="substep-connector"></div>
                      <h4>
                        <FaChevronRight className="icon-accent" />
                        {substep.title}
                      </h4>
                      {substep.description && (
                        <p>{substep.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {item.resources && (
                <div className="resource-section">
                  <h5 className="resource-title">Enhance Your Knowledge</h5>
                  <div className="resource-grid">
                    {item.resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url || res.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-pill"
                      >
                        {res.name}
                        <FaExternalLinkAlt className="link-icon" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default RoadmapTimeline;