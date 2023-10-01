import json
from transformers import AutoTokenizer, AutoModelForQuestionAnswering
import torch
import requests
from bs4 import BeautifulSoup


def scrapePageText(url):
    articleText = ""
    response = requests.get(url)
    print(response.status_code)
    soup = BeautifulSoup(response.content, "html.parser")

    paragraphs = soup.find_all("p")
    for p in paragraphs:
        articleText = articleText + p.text
    return articleText


articleText = scrapePageText("https://en.wikipedia.org/wiki/Machine_learning")
tokenizer = AutoTokenizer.from_pretrained("model/")
model = AutoModelForQuestionAnswering.from_pretrained("model/")


def lambda_handler(event, context):
    body = json.loads(event["body"])

    question = body["question"]
    context = articleText

    inputs = tokenizer.encode_plus(
        question, context, add_special_tokens=True, return_tensors="pt"
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

    return {
        "statusCode": 200,
        "body": json.dumps({"Question": question, "Answer": answer}),
    }
