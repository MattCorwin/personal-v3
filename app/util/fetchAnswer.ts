export const fetchAnswer = async (url: string, question: string): Promise<string> => {
  const path = '/answer';
  const body = JSON.stringify({
    question
  });
  try {
    const response = await fetch(`${url}${path}`, {
      method: "POST",
      body
    });
    const { Answer } = await response.json();
    return Answer;
  } catch (error) {
    alert(error);
  }
  return '';
};
