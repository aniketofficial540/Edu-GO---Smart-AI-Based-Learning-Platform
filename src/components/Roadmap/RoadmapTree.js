import React from "react";
import { FaBook, FaCode, FaLayerGroup } from "react-icons/fa";

const RoadmapTree = ({ data }) => {
  const getIcon = (type) => {
    switch(type) {
      case "theory": return <FaBook className="icon-purple" />;
      case "practice": return <FaCode className="icon-purple" />;
      default: return <FaLayerGroup className="icon-purple" />;
    }
  };

  return (
    <div className="roadmap-tree">
      {data.map((category, index) => (
        <div key={index} className="tree-category">
          <h3 className="purple">{category.step}</h3>
          <ul className="tree-substeps">
            {category.substeps.map((substep, subIndex) => (
              <li key={subIndex}>
                {getIcon(substep.icon)}
                <div className="substep-content">
                  <h4>{substep.title}</h4>
                  <p>{substep.description}</p>
                  {substep.resources && (
                    <div className="resources">
                      <span>Resources:</span>
                      <ul>
                        {substep.resources.map((resource, resIndex) => (
                          <li key={resIndex}>
                            <a href={resource.link} target="_blank" rel="noopener noreferrer">
                              {resource.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default RoadmapTree;