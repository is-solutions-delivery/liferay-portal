import "../../index.scss";
import ClayLayout from "@clayui/layout";
import { useEffect, useState } from "react";
import { getTopThreePaths } from "../../services/learning-path";
import SectionCard from "../Common/SectionCard";

const LearningPathsList = () => {
  const [learningPaths, setLearningPaths] = useState(null);

  useEffect(() => {
    getTopThreePaths()
      .then((allLearningPaths) => {
        setLearningPaths(allLearningPaths.items);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <ClayLayout.ContainerFluid view>
      <ClayLayout.Row justify="start">
        {learningPaths && learningPaths.length > 0 && (
          <>
            {learningPaths.map((learningPath, index) => {
              return (
                <SectionCard
                  description={learningPath.description}
                  expertise={learningPath.level.name}
                  index={index}
                  key={learningPath.id}
                  link={`/l/${learningPath.id}`}
                  personas={learningPath.persona}
                  title={learningPath.title}
                />
              );
            })}
          </>
        )}
      </ClayLayout.Row>
    </ClayLayout.ContainerFluid>
  );
};

export default LearningPathsList;