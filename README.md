# FindMyFood 🧇
<img width="1710" alt="Screenshot 2025-03-24 at 3 03 06 PM" src="https://github.com/user-attachments/assets/db93c561-8024-4827-abeb-1718294aa09e" />

## 🏆 2025 DELL Best Cloud Native Award Winner 🏆 
Thank you Professor Swetha Gottipati for all your guidance throughout our time in ESD G10 and Instructor Layfoo for tolerating our consultations every single week, shoutout the GOATs

## Presentation Documents
<a href="https://drive.google.com/file/d/1BAGRpDP4OddZDKB9bEnejTRaJEmkh2-T/view?usp=sharing">Presentation Slides</a>

## Prerequisite
IDE (Any) <br>
Node Package Manager (npm) <br>
Github Desktop (If you prefer else CLI) <br>
Terraform <br>
Kubectl <br>
Docker <br>

## Instructions

Switch to your branch before starting to code <br>

> Local Setup, ensure Docker Desktop is running
1. Open a terminal and run the following command:
```bash
  cd backend
  docker-compose up -d --build
  docker-compose down
```
2. Open another terminal and run the following command:
```bash
  cd frontend
  npm i
  npm run dev
```

## Technical Architecture Diagram
<img width="1103" alt="Screenshot 2025-05-04 at 12 38 52 AM" src="https://github.com/user-attachments/assets/68f162c4-e679-43a6-a712-dda2cb9f32ea" />

## Cloud Architecture Diagram
### Website on GCP
<img width="1146" alt="Screenshot 2025-04-04 at 11 18 18 PM" src="https://github.com/user-attachments/assets/a0ca9c10-a321-432b-b6c4-0cf608cfdc0c" />

### Website and Telegram on GCP + Vercel
<img width="1119" alt="Screenshot 2025-04-27 at 3 44 18 PM" src="https://github.com/user-attachments/assets/81b5c9e0-4dd0-464d-b841-a38d8b6baf48" />


## Kubernetes Architecture Diagram
<img width="1000" alt="Screenshot 2025-04-01 at 2 38 43 PM" src="https://github.com/user-attachments/assets/5ed8cf54-6960-48b1-91a3-099e6fcc792f" />

## Development CI/CD Pipelines
<img width="1000" alt="Screenshot 2025-04-18 at 2 16 19 AM" src="https://github.com/user-attachments/assets/ca2da8b9-80e0-4fe9-afb8-bf8741b436a4" />

## Notable Technical Implementations
### Backend
- <b>Microservice Archictecture</b>
- <b>Loosely Coupled</b> Atomic Microservices
- Variety of <b>Languages and Frameworks and Runtimes</b> to show <b>Language Agnostic</b> properties in Microservices
- <b>Golang Concurrency Servers</b> on Composite Services for <b>Multi-Threading</b>
- Mix of <b>SQL and NoSQL Databases</b>
- <b>RabbitMQ as message broker</b> for real time changes
- Websocket as message consumer of RabbitMQ
- Stripe API for payment system
- OpenAI API for recommendation service
- Outsystems as low code provider and acts as external microservice
- <b>Kong API Gateway</b> for aggregating requests and routing
- <b>Grafana + Prometheus</b> for data ingestion and monitoring of microservices and Kong
- <b>CI/CD pipeline</b> to automate Image and Container building on Cloud
- <b>CI/CD pipeline</b> to run automated static code testing with Snyk and Checkov
- <b>Kubernetes Deployment</b> via declarative yaml files
- Argo CD intergrated within pipelines to sync kubenernetes declarative files to cloud
- Application fully deployed onto Cloud Services using Google Cloud Platform
- Google Cloud Services provisioned via Terraform
- Backend microservices are deployed onto Google Kubernetes Engine
- Frontend deployed as static asset on Google Cloud Storage and accessed via Google CDN
- Telegram Backend deployed on Vercel Serverless Function and interacts with GCP GKE

### Frontend
- React + Tailwind + TypeScript + ShadCN Web UI
- Supabase Authentication for user accounts

## Frameworks and Databases Utilised

<p align="center"><strong>UI Stack</strong></p>
<p align="center">
<a href="https://vitejs.dev/"><img src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg" alt="Vite" width="40"/></a>&nbsp;&nbsp;
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" alt="JavaScript" width="40"/></a>&nbsp;&nbsp;
<a href="https://www.typescriptlang.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png" alt="TypeScript" width="40"/></a>&nbsp;&nbsp;
<a href="https://react.dev/"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" width="40"/></a>&nbsp;&nbsp;
<a href="https://tailwindcss.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" alt="Tailwind" width="30"/></a>&nbsp;&nbsp;
<a href="https://ui.shadcn.com/"><img src="https://github.com/user-attachments/assets/dd2eb75e-28c6-46e5-bb11-734e9e9a04f3" alt="ShadCN" width="30"/></a>&nbsp;&nbsp;
<a href="https://supabase.com/auth"><img src="https://www.vectorlogo.zone/logos/supabase/supabase-icon.svg" alt="Supabase" width="40"/></a>&nbsp;&nbsp;
<br>
<i>Vite · JavaScript · TypeScript · React · Tailwind CSS · ShadCN · Supabase Auth</i>
</p>
<br>

<p align="center"><strong>Microservices Languages</strong></p>
<p align="center">
<a href="https://go.dev/"><img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Go_Logo_Blue.svg" alt="Golang" width="80"/></a>&nbsp;&nbsp;
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" alt="JavaScript" width="40"/></a>&nbsp;&nbsp;
<a href="https://www.typescriptlang.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png" alt="TypeScript" width="40"/></a>&nbsp;&nbsp;
<a href="https://www.python.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1024px-Python-logo-notext.svg.png" alt="Python" width="40"/></a>&nbsp;&nbsp;
<br>
<i>Golang · JavaScript · TypeScript · Python</i>
</p>
<br>

<p align="center"><strong>Microservices Frameworks</strong></p>
<p align="center">
<a href="https://gin-gonic.com/"><img src="https://raw.githubusercontent.com/gin-gonic/logo/master/color.png" alt="Gin" width="40"/></a>&nbsp;&nbsp;
<a href="https://expressjs.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" alt="ExpressJS" width="100"/></a>&nbsp;&nbsp;
<a href="https://hono.dev/"><img src="https://upload.wikimedia.org/wikipedia/commons/6/60/Hono-logo.svg" alt="Hono" width="50"/></a>&nbsp;&nbsp;
<a href="https://fastapi.tiangolo.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/FastAPI_logo.svg" alt="FastAPI" width="120"/></a>&nbsp;&nbsp;
<a href="https://flask.palletsprojects.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Flask_logo.svg" alt="Flask" width="100"/></a>&nbsp;&nbsp;
<br>
<i>Gin · Express · Hono · FastAPI · Flask</i>
</p>
<br>

<p align="center"><strong>Runtimes</strong></p>
<p align="center">
<a href="https://nodejs.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" alt="Node.js" width="70"/></a>&nbsp;&nbsp;
<a href="https://deno.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Deno_2021.svg" alt="Deno" width="50"/></a>&nbsp;&nbsp;
<a href="https://bun.sh/"><img src="https://bun.sh/logo.svg" alt="Bun" width="55"/></a>&nbsp;&nbsp;
<br>
<i>Node.js · Deno · Bun</i>
</p>
<br>

<p align="center"><strong>API Gateway and Reverse Proxy</strong></p>
<p align="center">
<a href="https://konghq.com/"><img src="https://konghq.com/wp-content/uploads/2018/08/kong-combination-mark-color-256px.png" alt="Kong API Gateway" width="88"/></a>
<a href="https://traefik.io/"><img src="https://raw.githubusercontent.com/docker-library/docs/a6cc2c5f4bc6658168f2a0abbb0307acaefff80e/traefik/logo.png" alt="Traefik" width="55"/></a>
<br>
<i>CORS · Rate Limit Plugin · Prometheus · Traefik</i>
</p>
<br>  

<p align="center"><strong>Storage Solutions</strong></p>  
<p align="center">
<a href="https://firebase.google.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/3/37/Firebase_Logo.svg" alt="Firebase" width="150"/></a>&nbsp;&nbsp;
<a href="https://cloud.google.com/storage/"><img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" alt="Google Cloud Storage" width="200"/></a>&nbsp;&nbsp;
<a href="https://supabase.com/"><img src="https://www.vectorlogo.zone/logos/supabase/supabase-icon.svg" alt="Supabase" width="40" /></a>&nbsp;&nbsp;
<br>
<i>Firebase · Google Cloud Storage · Supabase</i>
</p>
<br> 

<p align="center"><strong>Message Brokers</strong></p>
<p align="center">
<a href="https://www.rabbitmq.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/RabbitMQ_logo.svg/2560px-RabbitMQ_logo.svg.png" alt="RabbitMQ" width="100"/></a>
<br>
<i>RabbitMQ</i>
</p>
<br> 

<p align="center"><strong>Low Code Platform</strong></p>
<p align="center">
<a href="https://www.outsystems.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/8/82/OS-logo-color_500x108.png" alt="outsystems" width="88"/></a>
<br>
<iOutsystems</i>
</p>
<br> 

<p align="center"><strong>Cloud Services</strong></p>
<p align="center">
<a href="https://cloud.google.com/storage/"><img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" alt="Google Cloud Platform" width="200"/></a>&nbsp;&nbsp;
<a href="https://vercel.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Vercel_logo_black.svg" alt="Vercel" width="150"/></a>&nbsp;&nbsp;
<br>
<i>Google Cloud Platform · Vercel</i>
</p> 
<br>

<p align="center"><strong>Inter-service Communications</strong></p>
<p align="center">
<a href="https://grpc.io/"><img src="https://grpc.io/img/logos/grpc-icon-color.png" alt="gRPC" width="60"/></a>&nbsp;&nbsp;
<a href="https://restfulapi.net/"><img src="https://keenethics.com/wp-content/uploads/2022/01/rest-api-1.svg" alt="REST API" width="100"/></a>
<br>
<i>gRPC · REST API</i>
</p> 
<br>

<p align="center"><strong>DevSecOps and Site Reliability</strong></p>
<p align="center">
<a href="https://github.com/features/actions"><img src="https://github.com/user-attachments/assets/84046b86-7745-4ddd-8c36-b39b6a9ead91" alt="GitHub Actions" width="60"/></a>&nbsp;&nbsp;
<a href="https://grafana.com/"><img src="https://github.com/user-attachments/assets/f35638ce-2ad1-4664-9cf1-e219222ca4f0" alt="Snyk" width="120"/></a>&nbsp;&nbsp;
<a href="https://grafana.com/"><img src="https://github.com/user-attachments/assets/cd9f1fa6-5410-4407-81b3-d7cc28c79a75" alt="Checkov" width="120"/></a>&nbsp;&nbsp;
<a href="https://grafana.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a1/Grafana_logo.svg" alt="Grafana" width="60"/></a>&nbsp;&nbsp;
<a href="https://prometheus.io/"><img src="https://upload.wikimedia.org/wikipedia/commons/3/38/Prometheus_software_logo.svg" alt="Prometheus" width="60"/></a>&nbsp;&nbsp;
<a href="https://www.terraform.io/"><img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Terraform_Logo.svg" alt="Terraform" width="150"/></a>&nbsp;&nbsp;
<a href="https://argoproj.github.io/cd/"><img src="https://user-images.githubusercontent.com/25306803/43103633-a5d61dc4-8e83-11e8-9f0e-7ccdbee01eb6.png" alt="ArgoCD" width="70"/></a>&nbsp;&nbsp;
<br>
<i>Github Actions · Snyk · Checkov · Grafana · Prometheus · Terraform · ArgoCD</i>
</p> 
<br>

<p align="center"><strong>Other Technologies</strong></p>
<p align="center">
<a href="https://stripe.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/1280px-Stripe_Logo%2C_revised_2016.svg.png" alt="Stripe Payment API" width="150"/></a>&nbsp;&nbsp;
<a href="https://www.docker.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg" alt="Docker" width="150"/></a>&nbsp;&nbsp;
<a href="https://kubernetes.io/"><img src="https://upload.wikimedia.org/wikipedia/commons/6/67/Kubernetes_logo.svg" alt="Kubernetes" width="150"/></a>&nbsp;&nbsp;
<a href="https://openai.com/"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" alt="OpenAI" width="150"/></a>&nbsp;&nbsp;
<a href="https://socket.io/"><img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Socket-io.svg" alt="Socket.io" width="40"/></a>&nbsp;&nbsp;
</p>
<p align="center">
<i>StripeAPI · Docker Compose · Docker Hub · Kubernetes · OpenAI · Socket.io</i>
</p>
<br> 

## Contributors

**Team 8**

<div align="center">
    <table>
        <tr>
            <th><a href="https://www.linkedin.com/in/ryanbangras/">Ryan Bangras</a></th>
            <th><a href="https://www.linkedin.com/in/saurabh-maskara/">Saurabh Maskara</a></th>
            <th><a href="https://www.linkedin.com/in/kendrick-poon/">Kendrick Poon</a></th>
            <th><a href="https://www.linkedin.com/in/kevin-tan-513a9b207/">Kevin Tan</a></th>
            <th><a href="https://www.linkedin.com/in/ewan-lim-chee-chong/">Ewan</a></th>
        </tr>
        <tr>
            <td><img src="https://github.com/user-attachments/assets/80d01dda-0d39-4648-b695-5ed0367d2777" alt="Ryan" width="120" height="120" style="display:block; margin:0 auto;"></td>
            <td><img src="https://github.com/user-attachments/assets/aa289832-1d5d-4a4c-b8dc-15732eebc691" alt="Saurabh" width="120" height="120" style="display:block; margin: 0 auto;"></td>
            <td><img src="https://github.com/user-attachments/assets/fc41231a-1d80-4fdc-9c08-b89ead1b6b20" alt="Kendrick" width="120" height="120" style="display:block; margin: 0 auto;"></td>
            <td><img src="https://github.com/user-attachments/assets/47010ac4-2697-48bd-9083-7f6e91c0e49e" alt="Kevin" width="120" height="120" style="display:block; margin: 0 auto;"</td>
            <td><img src="https://github.com/user-attachments/assets/36147165-6866-489c-9642-bf9dd37590f2" alt="Ewan" width="120" height="120" style="display:block; margin: 0 auto;"></td>
        </tr>
    </table>
</div>

