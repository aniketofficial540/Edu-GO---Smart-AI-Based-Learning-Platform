import React, { useState } from "react";
import { Container, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AiOutlineMessage } from "react-icons/ai";
import ProgressBar from "react-bootstrap/ProgressBar";

function Home2() {
  const [goal, setGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleGenerateRoadmap = async () => {
    setIsLoading(true);
    setProgress(20);

    try {
      const response = await fetch('http://localhost:8000/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goal }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate roadmap');
      }

      const data = await response.json();

      // Validate the response structure
      if (!data.roadmap || !Array.isArray(data.roadmap)) {
        throw new Error('Invalid roadmap format received from server');
      }

      localStorage.setItem('currentRoadmap', JSON.stringify(data.roadmap));
      navigate('/roadmap');

    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Failed to generate roadmap. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Container fluid className="home-about-section" id="home2">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              LET'S <span className="purple"> CREATE </span> YOUR ROADMAP
            </h1>

            <div className="goal-input-section mb-5">
              <Form.Group controlId="goalInput">
                <Form.Label>
                  <h4 style={{ color: "white" }}>What do you want to learn or become?</h4>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Example: 'I want to be a frontend developer'"
                  className="mb-3 custom-textarea"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    border: "1px solid #6e45e2",
                    borderRadius: "10px",
                    padding: "15px",
                  }}
                  disabled={isLoading}
                />

                {isLoading ? (
                  <>
                    <ProgressBar
                      now={progress}
                      label={`${progress}%`}
                      striped
                      animated
                      style={{ height: "10px", marginBottom: "15px" }}
                    />
                    <div className="text-center">
                      <Spinner animation="border" variant="light" />
                      <p className="text-white mt-2">Generating your roadmap...</p>
                    </div>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleGenerateRoadmap}
                    disabled={!goal.trim()}
                    style={{
                      background: "linear-gradient(135deg, #6e45e2 0%, #89d4cf 100%)",
                      border: "none",
                      padding: "12px 30px",
                      borderRadius: "8px",
                    }}
                  >
                    Get My Roadmap
                  </Button>
                )}
              </Form.Group>
            </div>

            {/* Quick Access to Chatbot */}
            <div className="chatbot-access">
              <Button
                variant="outline-primary"
                className="d-flex align-items-center"
                style={{
                  borderColor: "#6e45e2",
                  color: "#6e45e2",
                  background: "transparent"
                }}
              >
                <AiOutlineMessage className="me-2" />
                Need help choosing a goal? Ask Edo!
              </Button>
            </div>
          </Col>
          <Col md={4} className="myAvtar">
            {/* Your avatar image here */}
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Home2;