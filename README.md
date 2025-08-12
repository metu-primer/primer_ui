# PRIMER UI: Image Search Engine Frontend

## Overview

PRIMER UI is a React-based frontend for an image search engine project. It allows users to search for images using text prompts, configure search settings, and view or download results. The project is designed for research and educational purposes and is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.

## Architecture

- **Frontend Framework:** React (with TypeScript)
- **UI Library:** Ant Design (AntD)
- **State Management:** React hooks (`useState`, `useEffect`)
- **Internationalization:** `react-i18next` for multi-language support (English & Turkish)
- **Custom Components:**
	- `Header`, `SearchBar`, `HomePageSettings`, `SettingsDrawer`, `HowToUseDrawer`, `ImagesDisplay`, and custom button components
- **API Communication:**
	- Communicates with a backend server via REST API (URL set by `REACT_APP_BACKEND_URL` environment variable)
	- Handles image search, settings, and folder selection endpoints
- **Docker Support:**
	- Includes a `Dockerfile` and `docker-compose.yaml` for containerized development and deployment

### File Structure

- `src/` — Main source code
	- `App.tsx` — Main application logic and state
	- `components/` — Reusable UI components
	- `assets/` — Static images
	- `i18n.js` — Internationalization resources
- `public/` — Static files (e.g., `index.html`)
- `Dockerfile` — For building the frontend as a Docker container
- `docker-compose.yaml` — For multi-container orchestration (if used with backend)
- `package.json` — Project dependencies and scripts

## Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- (Optional) [Docker](https://www.docker.com/) for containerized setup

### 2. Clone the Repository
```bash
git clone <repository-url>
cd primer_ui
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the project root (if not present) and set the backend URL:
```
REACT_APP_BACKEND_URL=http://localhost:8000
```
Adjust the URL to match your backend server address.

### 5. Run the Development Server
```bash
npm start
```
- The UI will be available at [http://localhost:3000](http://localhost:3000)
- The app will automatically reload if you make changes to the code.

### 6. Build for Production
```bash
npm run build
```
- Outputs static files to the `build/` directory.

### 7. Run with Docker (Optional)
Build and run the frontend in a container:
```bash
docker build -t primer-ui .
docker run -p 3000:3000 --env REACT_APP_BACKEND_URL=<backend-url> primer-ui
```
Or use `docker-compose` if a `docker-compose.yaml` is provided.

## Usage
- Configure search settings using the main screen and the settings drawer.
- Enter a text query and click "Search" to fetch similar images.
- View, download, or zip the returned images.
- Switch language using the language selector.

## License
This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. See [LICENSE](LICENSE) for details.

## Contributors

- [@sinankalkan](https://github.com/sinankalkan)
- [@ahmetkilavuz](https://github.com/kilavuza)
- [@alperenovak](https://github.com/alperenovak)
- [@aliozcelik](https://github.com/aliozcelik)
- [@feyzayavuz](https://github.com/blisgard)

---
For backend setup and API documentation, refer to the backend repository or contact the maintainers.
