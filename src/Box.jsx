import React from "react";

const Box = ({ mood, handleDelete }) => {
  const [showDetails, setShowDetails] = React.useState(false);

  function getMoodColor(moodType) {
    switch (moodType) {
      case "Happy":
        return "#ffd900dd";
      case "Sad":
        return "#1e8fffdb";
      case "Anxious":
        return "#800080";
      case "Angry":
        return "#ff4400ff";
      case "Calm":
        return "#4DD0E1";
      default:
        return "#B0B0B0";
    }
  }

  return (
    <div
      className="box"
      style={{
        backgroundColor: getMoodColor(mood.mood),
        color: "white",
      }}
    >
      <button className="x" onClick={() => handleDelete(mood.id)}>
        X
      </button>

      <h1>{mood.mood}</h1>

      <div className="bruh">
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide details" : "Details"}
        </button>

        {showDetails && (
          <div>
            <span>Score: {mood.score}</span>

            {mood.details ? (
              <div>{mood.details}</div>
            ) : (
              <small style={{ display: "block", marginTop: "10px" }}>
                no notes
              </small>
            )}
          </div>
        )}
      </div>

      <p>{new Date(mood.created_at).toLocaleDateString()}</p>
      <span>on </span>
      <span>{new Date(mood.created_at).toLocaleTimeString()}</span>
    </div>
  );
};

export default Box;