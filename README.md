# Wordle Clone

- This is a Wordle Clone using Next.js, MUI, Express, Mongoose and MongoDB.

<br />

## Development

- Development server: `npm run dev`
- MUI theme details are in colorMode.context.js
- color styles use CSS variables - see `_document.js`, `colorMode.context,js` and '/styles/globals.css'
- set the intial random numbers in the MongoDB database using the script `npm run loadsamples`.
    - see '/helpers/loadInitialData.js'

<br />

## Deployment

- add your deployed URL to the GitHub action that sets new random numbers each day in `.github/workflows/scheduled.yaml`


<br />

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!


<br />

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
