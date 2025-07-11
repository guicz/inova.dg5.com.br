# **App Name**: InnoSurveyAI

## Core Features:

- Landing Page: Landing page with a clear description of the Innovation Maturity Test and a call-to-action button to start the test.
- Interactive Form: Interactive form divided into four sections (P, D, I, G), each containing 8 statements rated on a 0-5 star scale using the StarRating component. Navigation includes 'Next' and 'Back' buttons for moving between sections.
- Form Validation: Form validation that ensures all statements in each section are rated before allowing progression to the next section. Real-time feedback for missing ratings.
- Score Calculation: Calculation of Innovation Maturity Rating (IVR) and dimension scores. This involves averaging the star ratings within each dimension, scaling the averages to a 0-100 scale, applying a 25% weight to each, and generating the final IVR score.
- AI-Powered Analysis: Integration with OpenAI Assistants API for interpreting the test results based on the calculated IVR and dimension scores.  A prompt, leveraging an OpenAI tool, will provide a qualitative analysis to generate insights based on the test taker's submission.
- Results Display: Display of results, including dimension scores (0-100), overall IVR, maturity level, and a detailed analysis generated by the AI.
- Data Storage: Data persistence in a PostgreSQL database to store the test responses, dimension scores, IVR, maturity level, and timestamp. The database schema will be defined using Prisma.

## Style Guidelines:

- Primary color for Pioneers (P) section: Gold (#FFC107) to represent innovation and vision.
- Primary color for Drivers (D) section: Orange-Red (#F44336) to signify action and leadership.
- Primary color for Integrators (I) section: Light Green (#4CAF50) to embody collaboration and synergy.
- Primary color for Guardians (G) section: Deep Purple (#673AB7) to represent stability and compliance.
- Background color: Almost-white (#F9F9F9), same hue as yellow but desaturated, to ensure sections stand out and maintain focus on content. Very light and clean to allow colored sections to pop.
- Headline font: 'Space Grotesk' (sans-serif) for headings, offering a modern and slightly tech-forward feel. Note: currently only Google Fonts are supported.
- Body font: 'Inter' (sans-serif) for body text, chosen for its clear and readable design. Note: currently only Google Fonts are supported.
- Use a two-column grid layout, each column having equal width (50%), and a horizontal gutter of 24px between them for desktop view. On mobile, stack elements vertically.
- Employ minimalist, monochrome icons, applying section-specific colors where necessary to maintain visual consistency. Avoid strong shadows or textures for a flat design aesthetic.