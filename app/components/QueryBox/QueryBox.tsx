import React, { useState } from "react";
import { fetchAnswer } from "~/util/fetchAnswer";

const QueryBox = (props: { url: string }) => {
  const [question, setQuestion] = useState<string>();
  const [answer, setAnswer] = useState<string>();
  const updateQuestion = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  }
  const onSubmit = async (): Promise<void> => {
    if (question) {
      const answer = await fetchAnswer(props.url, question);
      setAnswer(answer);
    }
  };
  return (
    <div>
      <input type='text' aria-label="Enter a question" onChange={updateQuestion} value={question}></input>
      <button onSubmit={onSubmit}></button>
      <p>{answer}</p>
    </div>
  );
}

export default QueryBox;