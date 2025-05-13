<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>DRUG-INDICATION-API</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        font-family: 'Roboto', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #1e1e1e;
        color: #e0e0e0;
      }

      h1,
      h2,
      h3,
      h4 {
        color: #e0e0e0;
      }

      h2 {
        text-align: center;
        margin-top: 20px;
      }

      p {
        font-size: 1.1rem;
        line-height: 1.6;
        margin: 10px 0;
      }

      a {
        color: #8ab4f8;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      .container {
        width: 80%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .steps,
      .api-docs {
        background-color: #2c2c2c;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        padding: 20px;
        margin-bottom: 40px;
      }

      .steps h3,
      .api-docs h3 {
        color: #8ab4f8;
      }

      ol {
        margin-left: 20px;
      }

      li {
        margin-bottom: 15px;
      }

      code {
        background-color: #1e1e1e;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 1rem;
        color: #b3b3b3;
        border: 1px solid #3c3c3c;
      }

      pre {
        background-color: #1e1e1e;
        color: #e0e0e0;
        padding: 10px;
        border-radius: 8px;
        overflow-x: auto;
      }

      pre code {
        white-space: pre-wrap;
      }

      .badge {
        display: block;
        text-align: center;
        margin-top: 20px;
      }

      .badge img {
        max-width: 100%;
        height: auto;
      }

      .note {
        background-color: #3a3a3a;
        color: #ffd700;
        padding: 10px;
        border-radius: 8px;
        margin-top: 20px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <p class="badge">
        <a href="https://github.com/your-repository-url" target="_blank">
          <img
            src="https://img.shields.io/badge/Project-DRUG--INDICATION--API-blue"
            alt="Project Badge"
          />
        </a>
      </p>

      <h2>DRUG-INDICATION-API</h2>

      <div class="steps">
        <h3>Step-by-Step Setup for Running the Project</h3>
        <p>Follow these steps to set up and run the project locally:</p>

        <ol>
          <li>
            <strong>Clone the repository</strong>: Clone the repository to your
            local environment:
            <pre><code>git clone git@github.com:thiagoncaetano/drug-indications-api.git</code></pre>
          </li>
          <li>
            <strong>Install Docker</strong>: Ensure that Docker is installed on
            your system. If not, download and install Docker Desktop from
            <a
              href="https://www.docker.com/products/docker-desktop"
              target="_blank"
              >here</a
            >. You can follow the
            <a href="https://docs.docker.com/get-docker/" target="_blank"
              >installation guide</a
            >
            if necessary.
          </li>
          <li>
            <strong>Configure environment variables</strong>:
            <div
              style="
                background-color: #2e2e2e;
                padding: 20px;
                border-radius: 8px;
                margin-top: 15px;
              "
            >
              <p style="color: white; font-size: 16px; margin-bottom: 15px">
                Create a <code>.env</code> file in the root folder and paste the
                following:
              </p>
              <ul style="color: white; line-height: 1.6">
                <li>NODE_ENV=production</li>
                <li>PORT=3001</li>
                <li>GLOBAL_PREFIX='api'</li>
                <li>JTW_SECRET=o0kB9ZmOFi</li>

                <li>POSTGRES_HOST=postgres</li>
                <li>POSTGRES_USER=postgres</li>
                <li>POSTGRES_PASSWORD=postgres</li>
                <li>POSTGRES_DB=mapmed</li>
                <li>POSTGRES_PORT=5432</li>

                <li>
                  DRUG_INDICATIONS_URL='https://dailymed.nlm.nih.gov/dailymed/search.cfm'
                </li>

                <li>
                  AI_API_URL="https://api.together.xyz/v1/chat/completions"
                </li>
                <li>
                  AI_API_KEY=tgp_v1__8N2mWG-RTK5Rz51_id_i9jcur2f1cK6TNs43ruCf5k
                </li>
                <li>
                  AI_API_MODEL="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"
                </li>
              </ul>
            </div>
          </li>
          <li>
            <strong>Start the Docker containers</strong>: Navigate to the root
            directory of the project and run the following command to build and
            start the necessary containers:
            <pre><code>docker-compose up</code></pre>
          </li>
          <li>
            <strong>Import the Postman Collection</strong>: The Postman
            collection will be sent to you via email. Import it into
            <a href="https://www.postman.com/downloads/" target="_blank"
              >Postman</a
            >
            to test the API.
          </li>
          <li>
            <strong>Execute the API requests</strong>: Once the Postman
            collection is imported, follow the instructions within the
            collection to execute the API requests and interact with the
            application.
          </li>
        </ol>
      </div>

      <div class="api-docs">
        <h3>API Documentation</h3>
        <p>
          This API provides endpoints for managing users, authentication, and
          drug indications with ICD-10 code mapping.
        </p>

        <h4>Routes</h4>

        <p><strong>1. Create User</strong></p>
        <pre><code>POST /api/users</code></pre>
        <p><strong>Authentication:</strong> Not Required</p>

        <p><strong>2. Login</strong></p>
        <pre><code>POST /api/auth/login</code></pre>
        <p><strong>Authentication:</strong> Not Required</p>

        <p><strong>3. Scrape and Map Indications</strong></p>
        <pre><code>GET /api/scraping?drug=dupixent</code></pre>
        <p><strong>Authentication:</strong> Required (Bearer Token)</p>
        <p><strong>Query Parameters:</strong></p>
        <ul>
          <li>
            <strong>drug</strong>: The drug name to scrape information for.
          </li>
        </ul>

        <p><strong>4. Create Indication</strong></p>
        <pre><code>POST /api/indications</code></pre>
        <p><strong>Authentication:</strong> Required (Bearer Token)</p>

        <p><strong>5. Get Indications</strong></p>
        <pre><code>GET /api/indications?indicationId={indicationId}&drugId={drugId}&code={code}</code></pre>
        <p><strong>Authentication:</strong> Required (Bearer Token)</p>
        <p><strong>Query Parameters:</strong></p>
        <ul>
          <li>
            <strong>indicationId</strong> (optional): The ID of the indication.
          </li>
          <li><strong>drugId</strong> (optional): The ID of the drug.</li>
          <li>
            <strong>code</strong> (optional): The ICD-10 code associated with
            the indication.
          </li>
        </ul>

        <p><strong>6. Get Indication</strong></p>
        <pre><code>GET /api/indications/{indicationId}</code></pre>
        <p><strong>Authentication:</strong> Required (Bearer Token)</p>

        <p><strong>7. Update Indication</strong></p>
        <pre><code>PUT /api/indications/{indicationId}</code></pre>
        <p><strong>Authentication:</strong> Required (Bearer Token)</p>

        <p><strong>8. Delete Indication</strong></p>
        <pre><code>DELETE /api/indications/{indicationId}</code></pre>
        <p><strong>Authentication:</strong> Required (Bearer Token)</p>

        <p><strong>9. Logout</strong></p>
        <pre><code>POST /api/auth/logout</code></pre>
        <p><strong>Authentication:</strong> Required (Bearer Token)</p>

        <p><strong>10. Health</strong></p>
        <pre><code>POST /api/health</code></pre>
        <p><strong>Authentication:</strong> Not Required</p>
      </div>

      <div class="api-docs">
        <h3>Potential Improvements & Production Challenges</h3>

        <h4>Potential Improvements</h4>
        <ul>
          <li>
            Better ICD-10 AI: Use a more accurate model with confidence scoring.
          </li>
          <li>
            Async processing: Run scraping and mapping in background jobs.
          </li>
          <li>
            Filters & pagination: Add filters and pagination to improve
            scalability.
          </li>
        </ul>

        <h4>Production Challenges</h4>
        <ul>
          <li>
            Site structure changes: DailyMed's layout may change and break
            scraping.
          </li>
          <li>
            ICD-10 accuracy: One indication may match multiple valid codes.
          </li>
          <li>
            Rate limiting: External APIs like OpenAI may enforce usage limits.
          </li>
        </ul>
      </div>

      <div class="api-docs">
        <h3>
          <em
            >How would you lead an engineering team to implement and maintain
            this project?</em
          >
        </h3>
        <p>
          I would guide the team with a focus on collaboration, code quality,
          and knowledge sharing. We'd use clear guidelines, automated tests, and
          regular syncs to ensure stability and progress. Prioritizing
          maintainability and documentation would be key to long-term success.
        </p>
      </div>
    </div>
  </body>
</html>
