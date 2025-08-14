
# iRacing Data API Playground

This project is a modern, interactive playground for the [iRacing Data API](https://members-ng.iracing.com/data/), built with Next.js, React, and shadcn/ui.

## Features

- **Explore All Endpoints:** Browse and search all available iRacing Data API endpoints, grouped by category.
- **View Documentation:** See detailed documentation for each endpoint, including parameters, notes, and cache expiration.
- **Test Endpoints:** Enter parameters and test any endpoint. View formatted JSON responses or CSV previews (first 10 rows), and download CSVs directly.
- **Linked Data Fetching:** For endpoints that return a `link` or `data_url`, fetch and preview/download the linked data with one click.
- **Authentication:** Securely enter your iRacing credentials at runtime. Credentials are stored in memory/session only and never persisted to disk or localStorage.
- **Dark Mode:** Toggle between light and dark themes with a modern, accessible UI.

## Usage

1. **Install dependencies:**
	```bash
	npm install
	```

2. **Start the development server:**
	```bash
	npm run dev
	```

3. **Open the app:**
	Visit [http://localhost:3000](http://localhost:3000) in your browser.

4. **Login:**
	Enter your iRacing email and password. Credentials are used only for your session and never stored permanently.

5. **Explore and test:**
	- Browse endpoints in the sidebar.
	- View documentation and parameters.
	- Test endpoints, view responses, and fetch/download linked data.

## Security

- Credentials are never logged or persisted to disk, localStorage, or cookies.
- All API requests are proxied through secure Next.js API routes to avoid exposing credentials or CORS issues.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [shadcn/ui](https://ui.shadcn.com/) (UI components)
- [Tailwind CSS](https://tailwindcss.com/)
- [axios](https://axios-http.com/) (with cookie jar support)

## Development

- All reusable components are in `src/components`.
- Feature-specific logic is in `src/features` (if present).
- API proxy routes are in `src/app/api`.
- UI is fully responsive and accessible.

## License

This project is not affiliated with or endorsed by iRacing.com. For personal and educational use only.
