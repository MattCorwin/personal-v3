export const fetchAnswer = async (url: string, question: string): Promise<string> => {
  const path = '/answer';
  const body = JSON.stringify({
    question
  });
  let retries = 0;
  let answer;
  while (!answer && retries < 3) {
    try {
      retries++;
      const response = await fetch(`${url}${path}`, {
        method: "POST",
        body
      });
      const { Answer } = await response.json();
      answer = Answer;
    } catch (error) {
      console.log(error);
      await new Promise((resolve) => {
        setTimeout(resolve, 2000)
      });
    }
  }
  return answer;
};
