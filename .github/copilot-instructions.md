# GitHub Copilot Instructions for iRacing Data Playground

## Project Purpose
This app is a playground for the iRacing Data API:

- **Base API URL:** https://members-ng.iracing.com/data/
- **Endpoint Documentation:** https://members-ng.iracing.com/data/doc/<endpoint>

## Requirements

1. **API Playground:**
   - The app should allow users to interact with any endpoint of the iRacing Data API.
   - Users should be able to select or enter endpoints and view the documentation for each endpoint within the app.
   - The app should display responses from the API in a readable format (e.g., JSON viewer or table).

2. **Authentication:**
   - The app must support authentication using the following environment variables, which should be settable by the user at runtime:
     - `EMAIL`
     - `PASSWORD`
   - These credentials are required to access the iRacing Data API.

3. **Environment Variables:**
   - The app must allow users to set or update the `EMAIL` and `PASSWORD` environment variables at runtime (e.g., via a settings page, modal, or form).
   - The app should use these variables for all authenticated API requests.

4. **Documentation Integration:**
   - For any endpoint, the app should provide a link or embedded view of the documentation at `https://members-ng.iracing.com/data/doc/<endpoint>`.
   - Users should be able to easily access documentation for the endpoint they are exploring.

5. **User Experience:**
   - The UI should be clear and modern, making it easy to:
     - Set credentials
     - Select or enter endpoints
     - View documentation
     - Make API requests and view responses

6. **Security:**
   - Do not log or expose the user's email or password in the browser console or in any error messages.
   - Store credentials securely in memory only (do not persist to localStorage or cookies).



## Implementation Notes
- Use Next.js (App Router) and React for the frontend, following Next.js best practices for file structure, routing, and component organization.
- Use fetch or axios for API requests, always proxying external API calls through Next.js API routes to avoid CORS and security issues.
- Use the shadcn/ui component library for all UI elements, ensuring a modern, accessible, and consistent user experience.
- Style all data displays (tables, JSON viewers, forms, etc.) using shadcn/ui components for best UX.
- Always mark files that use React hooks like `useEffect` or `useState` with the `"use client"` directive at the top.
- Only use React hooks in Client Components. Never use them in Server Components.
- Organize all reusable components in the `src/components` directory, and feature-specific logic in `src/features`.
- Follow best practices for error handling, separation of concerns, and idiomatic, maintainable, type-safe code.

---

**Summary:**
Build a secure, user-friendly playground for the iRacing Data API, allowing runtime credential entry and easy exploration of all endpoints and their documentation.
