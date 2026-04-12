# Deploying Cake Store to Vercel

To deploy your MERN Cake Store to Vercel, I've configured it as a **Monorepo**. This allows both your React frontend and Node.js backend to live on the same Vercel project.

## 🛠️ What I've Done:
1.  **Modified `backend/server.js`**: Exported the Express `app` so Vercel can run it as a Serverless Function.
2.  **Created `vercel.json`**: Added a routing configuration in the root to ensure `/api` requests go to the backend and everything else goes to the Vite frontend.
3.  **Updated Frontend Config**: Modified `frontend/src/config/constants.js` to automatically use relative paths in production.

---

## 🚀 Steps to go Live:

### 1. Push to GitHub
If you haven't already, push your current project to a GitHub repository.

### 2. Import into Vercel
- Go to [vercel.com](https://vercel.com) and click **"Add New" -> "Project"**.
- Select your GitHub repository.
- **Root Directory**: Leave it as the project root.
- **Framework Preset**: Vercel should auto-detect Vite for the frontend.

### 3. Add Environment Variables
This is the most important step. In the Vercel project settings, add these variables:

| Variable | Value |
| :--- | :--- |
| `MONGODB_URI` | Your MongoDB Atlas Connection String |
| `JWT_SECRET` | A random long string for security |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API Secret |
| `NODE_ENV` | `production` |

### 4. Click Deploy
Once configured, click **Deploy**. Vercel will:
1.  Build your React frontend and host it on a CDN.
2.  Wrap your Express backend into a Serverless Function reachable at `/api`.

---

### 🔗 Project Links
- **Site**: `https://your-project.vercel.app`
- **Dashboard**: `https://your-project.vercel.app/admin`
- **API Test**: `https://your-project.vercel.app/api/products`
