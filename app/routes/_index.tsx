import me from '../images/bwCropped.jpg';
import fgf from '../images/findGiftsFor.png';
import fofo from '../images/fofo.png';
import QueryBox from '~/components/QueryBox/QueryBox';
import StackablePair from '~/components/StackablePair/StackablePair';
import { Link, useLoaderData } from '@remix-run/react';
import { LinkedinLogo, GithubLogo } from '@phosphor-icons/react';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/titillium-web/300.css';
import { json } from '@remix-run/node';

export const meta = () => {
    return [
        {
            title: 'Matt Corwin - Software Developer',
        },
        {
            name: 'description',
            content: 'Software Developer | Typescript | React | Node.js | AWS',
        },
    ];
};

export async function loader() {
    return json({
        ENV: {
            API_URL: process.env.API_URL as string,
        },
    });
}

export default function Index() {
    const env = useLoaderData<typeof loader>();
    return (
        <div className="wrapper">
            <h1>MATT CORWIN</h1>
            <StackablePair>
                <img
                    className="rounded-image"
                    src={me}
                    alt="Person standing in front of a tree"
                />
                <h2>
                    I am a Full Stack Developer and lifelong learner. I've been
                    building with Typescript, NodeJs, and React on AWS, and I'm
                    always learning new tech. Check out a couple of my hobby
                    projects below!
                </h2>
                <div className="contact-box">
                    <a href="https://www.linkedin.com/in/matt-corwin/">
                        <LinkedinLogo
                            size={32}
                            weight="duotone"
                            className="contact-icon"
                            style={{ paddingTop: '5px' }}
                        />
                    </a>
                    <a href="https://github.com/MattCorwin">
                        <GithubLogo
                            size={32}
                            weight="duotone"
                            className="contact-icon"
                            style={{ paddingTop: '5px' }}
                        />
                    </a>
                    <Link
                        to="/blog"
                        prefetch="render"
                        className="contact-icon"
                        style={{
                            fontSize: '1.5em',
                            textDecoration: 'none',
                            background: '#faf5ef',
                            border: '#ff8552',
                            borderStyle: 'solid',
                            borderRadius: '3px',
                            marginLeft: '10px',
                        }}>
                        BLOG
                    </Link>
                </div>
            </StackablePair>
            <div className="stackable">
                <QueryBox url={env.ENV.API_URL} />
            </div>
            <StackablePair>
                <Link to="https://www.findgiftsfor.com/" prefetch="render">
                    <img
                        className="rounded-image"
                        src={fgf}
                        alt="Gift search website with robot"
                    />
                </Link>
                <h2>
                    I built Find Gifts For to play with ChatGPT. It is built on
                    AWS, hosted from S3, and backed by Lambda and DynamoDB. I
                    cached over 16,000 ChatGPT responses for faster response
                    times, which was a major challenge. It is a static site
                    built with Gatsby.
                </h2>
            </StackablePair>
            <StackablePair>
                <Link to="https://www.falofofo.com/" prefetch="render">
                    <img
                        className="rounded-image"
                        src={fofo}
                        alt="Language learning website with rabbit"
                    />
                </Link>
                <h2>
                    FaloFofo is a site for selling digital education products.
                    It is deployed to AWS and integrated with Stripe for
                    payment, relying on AWS Lambda for the back end
                    communication. I utilized S3 presigned URLs to deliver the
                    products, and deploy with a CI/CD pipeline automatically
                    from Github.
                </h2>
            </StackablePair>
            <div style={{ padding: '-2px' }}></div>
        </div>
    );
}
