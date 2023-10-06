import hugging from "../images/hf-logo-c.png";

type Post = {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  image: any;
  imageAltText: string;
  markdown: string;
};

const posts: { [key: string]: Post } = {
  "open-source-machine-learning-aws-v1": {
    slug: "open-source-machine-learning-aws-v1",
    title: "Deploying a machine learning model to AWS",
    date: "10-05-23",
    summary:
      "Deploying a machine learning model from huggingface to AWS Lambda, backed by a Docker container.",
    image: hugging,
    imageAltText: "Logo of HuggingFace, the hugging face emoji",
    markdown: `
## Overview

I recently used AWS Lambda to host an open source Pytorch machine learning model.
I'll walk through the steps I took to get everything set up, and share a couple of gotchas I ran into and how to get past them.

A note on Infrastructure as Code: I'm using [SST](https://sst.dev/) for IAC (my personal favorite tool in the space). I'll throw in a couple of examples using the
Serverless framework to get to the same goal. I'll also link to an AWS walkthrough that uses AWS SAM in case that is your jam.

## Lambda Handler Function

First I set up a Python lambda to handle our incoming REST request. [This file](https://github.com/MattCorwin/personal-v3/blob/main/functions/inference/app.py)
is the full handler function code you can reference. I'll step through a bit of what is going on in there. The model used in this example is
[distilbert-base-uncased-distilled-squad]("https://huggingface.co/distilbert-base-uncased-distilled-squad").


The following is a util function that uses the BeautifySoup package to fetch the web page for a given URL and scrape all the text from all paragraph html elements,
and returns the text as a list of strings split on space characters. This worked well for a Wikipedia article, but might require some tweaking based on the page you are scraping.

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

Here we initialize the articleText outside of the lambda handler. The benefit of this is that this value can be referenced across Lambda invocations, as long as the
lambda container is active. We're essentially caching the response from scrapePageText when we assign it inside the handler function. The transformers package includes
functions for getting the tokenizer (for converting words into tokens) and loading the model. Loading the tokenizer in this way ensures it matches the tokenizer used
to train the model.

    articleText = []
    tokenizer = AutoTokenizer.from_pretrained("model/")
    model = AutoModelForQuestionAnswering.from_pretrained("model/")

Then we iterate through chunks of context small enough for the model to handle. This is a workaround for the fact that this model
can only handle 512 tokens of total input. For the next iteration of this project I'll swap to a model that can handle more context.

    question_length = len(question.split())
    chunk_size = 360 - question_length
    chunks = [articleText[i : i + chunk_size] for i in range(0, len(articleText), chunk_size)]

Finally, tokenize the question and context, and pass them to the model for prediction. Then convert the model output from tokens back into text.

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

## Lambda Function and Docker Container Provisioning

Now that we have our REST endpoint referencing our model, we need to provision the Lambda function and Docker image that contains our dependencies
referenced in the app.py file. We're going to use a Docker container to back our lambda, rather than using one of the regular lambda runtimes because
the regular lambda runtimes only allow for 250 MB of code and dependencies, while building our own Docker image gives us 10 GB to play with.
The ML model in this instance takes up 250 MB on its own. To provision a Docker lambda with SST, we'll add to our sst.config file.

    const dockerFn = new Function(stack, "pythonDockerFunction", {
      timeout: 30,
          runtime: "container",
          handler: "functions",
    })
    const api = new Api(stack, "Api", {
      routes: {
        "POST /answer": dockerFn,
      },
    });

There is a lot of magic baked into those few lines. We are telling SST that a Dockerfile lives in our functions directory, and creating an API route
that handles a POST request, which it passes to our handler code. At build time SST will build a Docker image based on our Dockerfile and upload the resulting
image to AWS ECR so that it can be pulled when needed by AWS lambda. I'll link to an AWS walkthrough that shows how to upload the image to ECR manually.

Now we need to create a Dockerfile in the functions directory that will tie together our dependencies and our app.py handler function. First we extend
the Python3.9 Docker image maintained by AWS.

    FROM public.ecr.aws/lambda/python:3.9

Now we have a container that has Python 3.9 installed, and we can pull in our other dependencies and install them in the container.

    RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    ENV PATH="/root/.cargo/bin:\${PATH}"
    COPY requirements.txt ./
    
    # Install the python requirements from requirements.txt
    RUN python3.9 -m pip install -r requirements.txt
    
    COPY inference/app.py ./

Finally we can pull the model from huggingface and put it in the model directory so our app.py file can reference it. The final line tells the container
what the entrypoint is for our lambda.

    RUN mkdir model
    RUN curl -L https://huggingface.co/distilbert-base-uncased-distilled-squad/resolve/main/pytorch_model.bin -o ./model/pytorch_model.bin
    RUN curl https://huggingface.co/distilbert-base-uncased-distilled-squad/resolve/main/config.json -o ./model/config.json
    RUN curl https://huggingface.co/distilbert-base-uncased-distilled-squad/resolve/main/tokenizer.json -o ./model/tokenizer.json
    RUN curl https://huggingface.co/distilbert-base-uncased-distilled-squad/resolve/main/tokenizer_config.json -o ./model/tokenizer_config.json
    
    # Set the CMD to your handler
    CMD ["app.lambda_handler"]

## Using The Serverless Framework For IAC (not necessary if you followed the SST steps above)

Here is an example of declaring the Docker image in a serverless.ts file. This tells Serverless to look for a Dockerfile in the /functions directory,
which Serverless uses to build a Docker container named pythonlambdaimage and store it in ECR.

    ecr: {
      images: {
        pythonlambdaimage: {
          path: './functions'
        }
      }
    },

You can then reference the pythonlambdaimage in your Lambda function declaration:

    functions: {
      myFunction: {
        image: 'pythonlambdaimage'
      }
    }

## Gotchas

One issue I ran into was a build failure when running sst dev, which was because I didn't have Docker Desktop running,
which is required to build the Docker container locally.

Other errors I ran into:
- IndexError: index out of range in self - Too large an input was passed to the tokenizer encode function. I fixed this by scaling back
the amount of tokens I was passing the encode function, and setting truncation=True as a fallback.
- TypeError: PreTokenizedInputSequence must be Union[List[str], Tuple[str]] - I was initially passing the encode function the full string question,
while the context was a list of strings. The tokenizer expects the two items to be of the same type, either an unsplit string or list of strings.
- Rust version errors - For some reason when using the Python 3.10 lambda container image as a base in the Dockerfile I was seeing some odd rust version errors.
Python 3.9 worked like a charm.

## Future Revisions

This was one of my first experiments with deploying open source machine learning models to AWS Lambda. There are a couple of things I would change
for the next experiment. First, I would like to experiment with a model that can take the entire wikipedia article as context, that would allow the
predictions to be a lot more accurate. Secondly I would like to convert the API endpoint to a Websockets endpoint to allow for longer processing times
that are common with more complex ML models.

Thanks for reading!

## Useful Links

[My Github](https://github.com/MattCorwin/personal-v3) Contains all the code for this project  
[SST](https://sst.dev/)  
[AWS Walkthrough on this topic](https://aws.amazon.com/blogs/machine-learning/using-container-images-to-run-pytorch-models-in-aws-lambda/)  
[Serverless Lambda Function Docs](https://www.serverless.com/framework/docs/providers/aws/guide/functions)
    `.trim(),
  },
};

export function getPosts(): Array<Post> {
  return Object.values(posts);
}

export function getPost(slug: string): Post {
  return posts[`${slug}`];
}
