# CanteenFlow Deployment Guide (Render & Vercel)

This guide walks you through deploying the **Spring Boot Backend on Render** and the **React Frontend on Vercel** in just a few minutes.

---

## 1. Push Code to GitHub

First, create a new repository on your GitHub account (e.g., `CanteenFlow`) and push this project:

```powershell
# Open terminal in the project root:
cd "c:\Users\Rishika Ellandula\OneDrive\Desktop\CanteenFlow"

# Add your GitHub repository remote:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/CanteenFlow.git

# Push the code:
git push -u origin main
```

---

## 2. Deploy Spring Boot Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** ➔ **Web Service**.
2. Connect your **GitHub account** and select your `CanteenFlow` repository.
3. Configure the Web Service settings:
   - **Name:** `canteenflow-backend` (or any name you prefer)
   - **Region:** Choose closest to your database (e.g. `Oregon (US West)` or `Singapore / Frankfurt`)
   - **Root Directory:** `backend`
   - **Runtime:** `Docker` *(Recommended - Render detects the `Dockerfile` automatically)*
     - *(Alternative if using Native Java: Build Command: `./mvnw clean package -DskipTests`, Start Command: `java -Dsun.net.inetaddr.ttl=60 -jar target/backend-0.0.1-SNAPSHOT.jar`)*
   - **Plan:** `Free`
4. Under **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `MYSQL_PASSWORD` | `<your-aiven-mysql-password>` |
   | `PORT` | `8081` |
5. Click **Create Web Service**.
6. Wait 2–3 minutes for the build to complete. Render will provide your public backend URL, for example:
   ```
   https://canteenflow-backend.onrender.com
   ```
   Test it in your browser: `https://canteenflow-backend.onrender.com/api/test` (it should display: *"CanteenFlow Backend is Working Successfully!"*).

---

## 3. Deploy React Frontend on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New...** ➔ **Project**.
2. Import your `CanteenFlow` repository from GitHub.
3. In the project configuration screen:
   - **Framework Preset:** `Vite` (automatically detected)
   - **Root Directory:** Click **Edit** and select `frontend`
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)
4. Under **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://canteenflow-backend.onrender.com/api` *(use your actual Render URL)* |
5. Click **Deploy**.
6. In ~30 seconds, Vercel will deploy your site at a live URL (e.g., `https://canteenflow.vercel.app`)!

---

## 4. Live Verification & Features

Once deployed:
- **Browse & Order:** Open your Vercel URL, browse dishes, add items to cart, and checkout.
- **Track Order:** Watch the live order progress on `/track/:orderNumber`.
- **Canteen Admin Access:** Open `/admin/login`:
  - **Email:** `admin@canteenflow.com`
  - **Password:** `admin123`
- Manage orders in real time and see status updates propagate seamlessly between Render and Vercel.
