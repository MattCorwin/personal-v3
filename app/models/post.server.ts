import hugging from "../images/hf-logo.png";

type Post = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  image: any;
  imageAltText: string;
  markdown: string;
};

const posts: { [key: string]: Post } = {
  "open-source-machine-learning-aws-v1": {
    slug: "open-source-machine-learning-aws-v1",
    title: "Deploying an open source machine learning model to AWS",
    summary:
      "A walkthrough of the steps I took to get an ML model from huggingface deployed to AWS as a Lambda function backed by a docker container.",
    body: "This is the body of my first post, and it is really log",
    image: hugging,
    imageAltText: "Logo of HuggingFace, the hugging face emoji",
    markdown: `
# 90s Mixtape

- I wish (Skee-Lo)
- This Is How We Do It (Montell Jordan)
- Everlong (Foo Fighters)
- Ms. Jackson (Outkast)
- Interstate Love Song (Stone Temple Pilots)
- Killing Me Softly With His Song (Fugees, Ms. Lauryn Hill)
- Just a Friend (Biz Markie)
- The Man Who Sold The World (Nirvana)
- Semi-Charmed Life (Third Eye Blind)
- ...Baby One More Time (Britney Spears)
- Better Man (Pearl Jam)
- It's All Coming Back to Me Now (Céline Dion)
- This Kiss (Faith Hill)
- Fly Away (Lenny Kravits)
- Scar Tissue (Red Hot Chili Peppers)
- Santa Monica (Everclear)
- C'mon N' Ride it (Quad City DJ's)
    `.trim(),
  },
};

export function getPosts(): Array<Post> {
  return Object.values(posts);
}

export function getPost(slug: string): Post {
  return posts[`${slug}`];
}

/*
Intro - what is this post about

adding a docker based lambda - sst config

adding a docker based lambda - Dockerfile

adding a docker based lambda - Python lambda function

snippet of front end code

deploy - Github Actions/ Seed

callouts -
run docker desktop if you want to build locally
sst shoutout to seed
bundling resources with code rather than fetching at docker build

IndexError: index out of range in self
Too large an input passed to encode, truncate=True

TypeError: PreTokenizedInputSequence must be Union[List[str], Tuple[str]] Traceback (most recent call last)
Passed a string as question and list of strings as context, had to convert to a list for both

Upcoming -
Different model to get larger context window
Use websockets to avoid retries
*/
