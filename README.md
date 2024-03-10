The Highfeast Explorer

Problem Statement:
Many individuals lack specialized assistance when planning menus for events or estimating food quantities and costs.

## Shots:

![Explorer showcase](public/showcase.png)


## Short Description:

Highfeast Explorer is a LLM powered food companion and catering assistant.

## Vision:

To provide users with an intuitive platform where they can easily plan menus, estimate costs, and receive cooking assistance, leveraging a decentralized internet for storage, and similarity checks from specialized datasets curated from over 23 years of traditional catering services.

## Description and Outline:

Highfeast Explorer is designed to cater to users' diverse food-related events, whether they are planning a wedding, organizing a community feeding program, or managing home cooking. Unlike generalized search engines or chat models, Highfeast Explorer offers specialized assistance with cultural menus.

Users can access these datasets to gain context-specific insights and chat with the AI for personalized recommendations.

## Features:

- Specialized food companion and catering assistant
- Intuitive platform for planning menus and estimating food costs
- Access to specialized datasets from highfeast and other cookbook creators.
- Secure AI chat history and data storage with internet computer's Juno framework

## Technologies Used:

- Client: Next.js, Tailwind
- Vector Database: Pinecode
- Authentication and History Storage: Juno (ICP Framework)
- LLM: OpenAI GPT-3.5
- Other Framwworks: Langchain

## Installation:

1. Clone the repository: `git clone  https://github.com/highfeast/explorer`
2. Navigate to the project directory: `cd explorer`
3. Install dependencies: `npm install`
4. Create a .env file and enter openAI and pinecone Keys

## Usage:

1. Start the frontend development server: `npm run dev`
2. Access the application in your browser: `http://localhost:3000/explorer`
3. Sign up and start a conversation

## Credits:

- [Highfeast Catering Services](https://www.instagram.com/highfeast_ng), for giving us mock data on African Jollof rice for this demo purpose
