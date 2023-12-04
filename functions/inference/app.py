import json
import torch
import requests
from bs4 import BeautifulSoup


def scrapePageText(url):
    text = ""
    response = requests.get(url)
    print(response.status_code)
    soup = BeautifulSoup(response.content, "html.parser")

    paragraphs = soup.find_all("p")
    for p in paragraphs:
        text = text + p.text

    print('returning page text')
    return text.split()

articleText = []
tokenizer = False
model = False

def initialize():
    if not tokenizer:
        from transformers import AutoTokenizer, AutoModelForQuestionAnswering
        tokenizer = AutoTokenizer.from_pretrained("model/")
        model = AutoModelForQuestionAnswering.from_pretrained("model/")
    

# tokenizer = AutoTokenizer.from_pretrained("model/")
# model = AutoModelForQuestionAnswering.from_pretrained("model/")

def lambda_handler(event, context):
    global articleText
    
    initialize()
    
    body = json.loads(event["body"])
    print(articleText)

    if len(articleText) < 1:
        articleText = scrapePageText("https://en.wikipedia.org/wiki/Machine_learning")

    question = body["question"]
    print(question)
    
    question_length = len(question.split())
    chunk_size = 360 - question_length
    chunks = [articleText[i : i + chunk_size] for i in range(0, len(articleText), chunk_size)]

    for question_context in chunks:
        print(question_context)
        if context.get_remaining_time_in_millis() < 4000:
            print("exiting before timeout")
            return {
                "statusCode": 200,
                "body": json.dumps(
                    {"Question": question, "Answer": "Answer could not be determined before timeout."}
                ),
            }

        inputs = tokenizer.encode_plus(
            question.split(), question_context, add_special_tokens=True, is_split_into_words=True, truncation=True, max_length=512, return_tensors="pt"
        )
        input_ids = inputs["input_ids"].tolist()[0]

        output = model(**inputs)
        answer_start_scores = output.start_logits
        answer_end_scores = output.end_logits

        answer_start = torch.argmax(answer_start_scores)
        answer_end = torch.argmax(answer_end_scores) + 1

        answer = tokenizer.convert_tokens_to_string(
            tokenizer.convert_ids_to_tokens(input_ids[answer_start:answer_end])
        )

        print("Question: {0}, Answer: {1}".format(question, answer))

        if len(answer) > 0 and answer != "[CLS]":
            return {
                "statusCode": 200,
                "body": json.dumps({"Question": question, "Answer": answer}),
            }
    return {
        "statusCode": 200,
        "body": json.dumps(
            {"Question": question, "Answer": "Answer could not be determined"}
        ),
    }
