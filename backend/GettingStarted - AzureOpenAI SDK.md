# Get Started

Below are example code snippets for a few use cases. For additional information about Azure OpenAI SDK

1. **Authentication using API Key**  
   For OpenAI API Endpoints, deploy the model to generate the endpoint URL and an API key to authenticate against the service. In this sample, `endpoint` and `apiKey` are strings holding the endpoint URL and the API key.

   The API endpoint URL and API key can be found on the **Deployments + Endpoint** page once the model is deployed.

   To create a client with the OpenAI SDK using an API key, initialize the client by passing your API key to the SDK's configuration. This allows you to authenticate and interact with OpenAI's services seamlessly:

   ```javascript
   const apiKey = "<your-api-key>";
   const apiVersion = "2024-04-01-preview";
   const endpoint = "https://jcc-aoai-east-us2.openai.azure.com/";
   const modelName = "o4-mini";
   const deployment = "o4-mini";
   const options = { endpoint, apiKey, deployment, apiVersion };

   const client = new AzureOpenAI(options);
   ```

2. **Install dependencies**  
   - Install [Node.js](https://nodejs.org/).  
   - Create a file named `package.json` in your project folder with the following content:

     ```json
     {
       "type": "module",
       "dependencies": {
         "openai": "latest",
         "@azure/identity": "latest"
       }
     }
     ```

   > **Note:** `@azure/core-sse` is only needed when you stream the chat completions response.

   Open a terminal in this folder and run:

   ```bash
   npm install
   ```

   For each of the code samples below, copy the content into a file named `sample.js` and run it with:

   ```bash
   node sample.js
   ```

3. **Run a basic code sample**  
   This sample demonstrates a basic call to the chat completion API. The call is synchronous.

   ```javascript
   import { AzureOpenAI } from "openai";

   const endpoint = "https://jcc-aoai-east-us2.openai.azure.com/";
   const modelName = "o4-mini";
   const deployment = "o4-mini";

   export async function main() {
     const apiKey = "<your-api-key>";
     const apiVersion = "2024-04-01-preview";
     const options = { endpoint, apiKey, deployment, apiVersion };

     const client = new AzureOpenAI(options);

     const response = await client.chat.completions.create({
       messages: [
         { role: "system", content: "You are a helpful assistant." },
         { role: "user", content: "I am going to Paris, what should I see?" }
       ],
       max_completion_tokens: 100000,
       model: modelName
     });

     if (response?.error !== undefined && response.status !== "200") {
       throw response.error;
     }
     console.log(response.choices[0].message.content);
   }

   main().catch((err) => {
     console.error("The sample encountered an error:", err);
   });
   ```

4. **Explore more samples**  
   - **Run a multi-turn conversation**  
     This sample demonstrates a multi-turn conversation with the chat completion API. When using the model for a chat application, you'll need to manage the history of that conversation and send the latest messages to the model.

     ```javascript
     import { AzureOpenAI } from "openai";

     const endpoint = "https://jcc-aoai-east-us2.openai.azure.com/";
     const modelName = "o4-mini";
     const deployment = "o4-mini";

     export async function main() {
       const apiKey = "<your-api-key>";
       const apiVersion = "2024-04-01-preview";
       const options = { endpoint, apiKey, deployment, apiVersion };

       const client = new AzureOpenAI(options);

       const response = await client.chat.completions.create({
         messages: [
           { role: "system", content: "You are a helpful assistant." },
           { role: "user", content: "I am going to Paris, what should I see?" }
         ],
         max_completion_tokens: 100000,
         model: modelName
       });

       if (response?.error !== undefined && response.status !== "200") {
         throw response.error;
       }

       for (const choice of response.choices) {
         console.log(choice.message.content);
       }
     }

     main().catch((err) => {
       console.error("The sample encountered an error:", err);
     });
     ```

   - **Stream the output**  
     For a better user experience, you will want to stream the response of the model so that the first token shows up early and you avoid waiting for long responses.

     ```javascript
     import { AzureOpenAI } from "openai";

     const endpoint = "https://jcc-aoai-east-us2.openai.azure.com/";
     const modelName = "o4-mini";
     const deployment = "o4-mini";

     export async function main() {
       const apiKey = "<your-api-key>";
       const apiVersion = "2024-04-01-preview";
       const options = { endpoint, apiKey, deployment, apiVersion };

       const client = new AzureOpenAI(options);

       const response = await client.chat.completions.create({
         messages: [
           { role: "system", content: "You are a helpful assistant." },
           { role: "user", content: "I am going to Paris, what should I see?" }
         ],
         stream: true,
         max_completion_tokens: 100000,
         model: modelName
       });

       for await (const part of stream) {
         process.stdout.write(part.choices[0]?.delta?.content || "");
       }
       process.stdout.write("\n");
     }

     main().catch((err) => {
       console.error("The sample encountered an error:", err);
     });
     ```
