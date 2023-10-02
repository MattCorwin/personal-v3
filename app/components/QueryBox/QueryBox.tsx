import React, { useState } from "react";
import { fetchAnswer } from "~/util/fetchAnswer";

const QueryBox = (props: { url: string }) => {
  const [question, setQuestion] = useState<string>();
  const [answer, setAnswer] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const updateQuestion = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };
  const onClick = async (): Promise<void> => {
    if (question) {
      setLoading(true);
      let answer = '';
      try {
        answer = await fetchAnswer(props.url, question);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setAnswer(answer);
      }
    }
  };
  return (
    <>
      <div className="stackable-item">
        <p>
          <h2>Self Hosted Machine Learning</h2>
        </p>
        <p>
          <h2>
            Ask a question about this{" "}
            <a
              href="https://en.wikipedia.org/wiki/Machine_learning"
              target="_blank"
              rel="noreferrer"
            >
              Wikipedia article
            </a>{" "}
            on machine learning and an{" "}
            <a
              href="https://huggingface.co/distilbert-base-uncased-distilled-squad"
              target="_blank"
              rel="noreferrer"
            >
              ML model
            </a>{" "}
            will provide an answer. For example: "What is Machine Learning?"
          </h2>
        </p>
        <input
          type="text"
          aria-label="Enter a question"
          onChange={updateQuestion}
          value={question}
          style={{ width: "100%", height: "2em" }}
        ></input>
        <button
          onClick={onClick}
          style={{
            width: "50%",
            height: "3em",
            margin: "1.5em",
            fontSize: "1em",
            fontFamily: "Cormorant Garamond",
            fontWeight: 400,
          }}
        >
          Ask Distilbert
        </button>
        { loading && (
          <h2>Loading...</h2>
        )}
        {answer && (
          <>
            <h2>Answer:</h2>
            <h2>{answer}</h2>
          </>
        )}
      </div>
      <div className="stackable-item">
        <h2>
          Recently I deployed an open source machine learning model for text
          summary in order to explore deploying ML models to AWS. You can play
          with the model by asking a question on the left. I had a great time
          deploying an AWS Lambda function backed by a Docker image containing
          the ML model. Huggingface makes it easy to pull down open source
          models, I intend to continue learning in this space.
        </h2>
      </div>
    </>
  );
};

export default QueryBox;
