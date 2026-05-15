# Gmail SMTP Setup for Admin OTP

## Important: Only srikapotheswarawomenspg@gmail.com can access admin

## Step 1: Enable 2-Step Verification on Gmail

1. Go to https://myaccount.google.com/security
2. Sign in with **srikapotheswarawomenspg@gmail.com**
3. Under "How you sign in to Google", click on **2-Step Verification**
4. Follow the prompts to enable it (you'll need a phone number)

## Step 2: Create an App Password

1. After enabling 2-Step Verification, go back to https://myaccount.google.com/security
2. Search for **"App passwords"** in the search box at the top
3. Click on **App passwords**
4. Select **Mail** as the app
5. Select **Other (Custom name)** and type: `SRI Kapotheswara PG Admin`
6. Click **Generate**
7. Google will show a 16-character password like: `abcd efgh ijkl mnop`
8. **Copy this password** - you can only see it once!

## Step 3: Add the App Password to the Server

1. Open the file `.env` in the project root
2. Add this line:
   ```
   GMAIL_APP_PASSWORD=your-16-character-app-password
   ```
   (Replace with the actual 16-character password from step 2, without spaces)

## Step 4: Restart the Server

After adding the password, restart the server for changes to take effect.

---

## How Admin Access Works

### For First-Time Registration:
1. Go to `/admin-login` in your browser
2. Click "Register with OTP"
3. Enter:
   - Full Name: Your name
   - Email: **srikapotheswarawomenspg@gmail.com** (only this email works)
   - Password: Choose a strong password (min 6 characters)
4. Click "Send OTP" - OTP will be sent to your Gmail
5. Check your Gmail inbox for the OTP
6. Enter the OTP and click "Verify & Create Account"
7. You'll be redirected to the admin dashboard

### For Returning Login:
1. Go to `/admin-login`
2. Enter your email and password
3. Click "Login"
4. Access the full admin dashboard

### Public Website:
- The public website at `/` has NO admin link
- Only YOU know the `/admin-login` URL
- Regular visitors only see Book a Visit and Call Now buttons

---

## Security Notes

- Only **srikapotheswarawomenspg@gmail.com** can register or login
- All other emails will get "Access denied"
- OTP expires in 10 minutes
- JWT token expires in 7 days
- Passwords are hashed with bcrypt
