import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function RoadmapViewer() {
  const [roadmap, setRoadmap] = useState([]); // Initialize as empty array
  const navigate = useNavigate();

  useEffect(() => {
    const storedRoadmap = localStorage.getItem("currentRoadmap");
    if (storedRoadmap) {
      try {
        const parsedData = JSON.parse(storedRoadmap);
        // Ensure we have the correct data structure
        if (parsedData && Array.isArray(parsedData)) {
          setRoadmap(parsedData);
        } else if (parsedData && parsedData.roadmap) {
          setRoadmap(parsedData.roadmap);
        } else {
          console.error("Invalid roadmap structure:", parsedData);
          navigate("/");
        }
      } catch (e) {
        console.error("Failed to parse roadmap:", e);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!roadmap || roadmap.length === 0) {
    return (
      <Container className="text-center py-5">
        <h3>Loading roadmap...</h3>
        <Button 
          variant="primary" 
          onClick={() => navigate("/")}
          className="mt-3"
        >
          <FaArrowLeft className="me-2" />
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Button 
        variant="outline-primary" 
        onClick={() => navigate("/")}
        className="mb-4"
      >
        <FaArrowLeft className="me-2" />
        Back to Home
      </Button>

      <h1 className="mb-4">Your Learning Roadmap</h1>
      
      {roadmap.map((category, i) => (
        <div key={i} className="mb-5">
          <h2 className="text-primary">{category.step}</h2>
          {category.substeps && (
            <ul>
              {category.substeps.map((substep, j) => (
                <li key={j} className="mb-3">
                  <h4>{substep.title}</h4>
                  <p>{substep.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </Container>
  );
}

export default RoadmapViewer;