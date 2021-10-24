import React, { useRef, useState, useEffect } from "react";
import "./App.css";
const getCloud = () =>
  `a book or other written or printed work regarded in terms of its content rather than its physical form the main body of a book or other piece of writing as distinct from other material such as notes appendices and illustrations`
    .split(" ")
    .sort(() => (Math.random() > 0.5 ? 1 : -1));

function Word(props) {
  const { text, active, correct } = props;

  if (correct === true) {
    return <span className="correct"> {text}</span>;
  }

  if (correct === false) {
    return <span className="incorrect"> {text}</span>;
  }

  if (active) {
    return <span className="active"> {text}</span>;
  }
  return <span> {text}</span>;
}
Word = React.memo(Word);

function Timer(props) {
  const { correctWords } = props;
  const [timeElapsed, setTimeElapsed] = useState(0);
  useEffect(() => {
    let id;
    if (props.startCounting) {
      id = setInterval(() => {
        setTimeElapsed((oldTime) => oldTime + 1);
      }, 1000);
    }
    return () => {
      clearInterval(id);
    };
  }, [props.startCounting]);
  
  const minutes = timeElapsed / 60;
  return (
    <div>
      <p>
        <b>Time:</b> {timeElapsed}{" "}
      </p>
      <p>
        <b>Speed:</b> {(correctWords / minutes || 0).toFixed(2)} WPM
      </p>
    </div>
  );
}
function App() {
  const [userInput, setUserInput] = useState("");
  const cloud = useRef(getCloud());
  const [startCounting, setStartCounting] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [correctWordArray, setCorrectWordArray] = useState([]);

  function processInput(value) {
    if (!startCounting) {
      setStartCounting(true);
    }
    if (value.endsWith(" ")) {
      // the user has finished the word
      if (activeWordIndex === cloud.current.length) {
        //overflow
        setStartCounting(false);
        setUserInput("Completed");
        return;
      }
      setActiveWordIndex((index) => index + 1);
      setUserInput("");
      // correct word
      setCorrectWordArray((data) => {
        const word = value.trim();
        const newResult = [...data];
        newResult[activeWordIndex] = word === cloud.current[activeWordIndex];
        return newResult;
      });
    } else {
      setUserInput(value);
    }
  }
  return (
    <div>
      <h1>Typing Test</h1>

      <Timer
        startCounting={startCounting}
        correctWords={correctWordArray.filter(Boolean).length}
      />
      <p>
        {cloud.current.map((word, index) => {
          return (
            <Word
              text={word}
              active={index === activeWordIndex}
              correct={correctWordArray[index]}
            />
          );
        })}
      </p>
      <input
        placeholder="Start typing..."
        type="text"
        value={userInput}
        onChange={(e) => processInput(e.target.value)}
      />
    </div>
  );
}

export default App;
// time :- 27:30 https://www.youtube.com/watch?v=Hpf2OmYnqhw
