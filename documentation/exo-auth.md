**Purpose:** practise the full authentication loop on your own: a protected back-end route, a form on the front end, and password handling. Allow 20 minutes.

**To do:**

1. Create a route `GET /auth/me` that returns the `id` and `email` of the logged-in user.
2. Create a route `PATCH /auth/password` that receives `oldPassword` and `newPassword`.
   - Wrong old password: error 401.
   - New password under 6 characters: error 400.
   - Otherwise: save the new password (hashed).
3. Make sure both routes need a token.
4. Create a page `/profile` that shows the user's email and has a form to change the password. It shows a success or error message.
5. Add a link to this page in the top bar.

**Tests:**
- `/auth/me` without a token returns 401.
- A wrong old password returns 401.
- A 3-character new password returns 400.
- After a successful change, you can log in with the new password.

**Rule:** no AI. If you are stuck for more than 5 minutes, ask me for a hint (not the answer). When you finish, send me your code and I'll review it.