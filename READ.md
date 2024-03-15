## Running the Application

### React Frontend:

install nvm and pipenv

1. Navigate to the client directory.
2. Use the following command to activate Node.js version 21.6.2:
   ```bash
   nvm use
   ```
   Alternatively, you can specify the version with:
   ```bash
   nvm use 21.6.2
   ```
3. Install dependencies using npm, yarn, or pnpm:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn
   ```
   or
   ```bash
   pnpm install
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

### FastAPI Backend:

1. Navigate to the server directory.
2. Activate the virtual environment using pipenv:
   ```bash
   pipenv shell
   ```
3. Install project dependencies:
   ```bash
   pipenv install
   ```
4. Start the FastAPI server:
   ```bash
   python main.py
   ```

These instructions will ensure that both the React frontend and the FastAPI backend are up and running.

The application prioritizes a straightforward and efficient user interface, with a focus on enhancing user experience and server efficiency. Post data is stored within the application context, allowing users to effortlessly continue browsing without the need for page reloads. When revisiting a post, the application fetches data from the context, avoiding unnecessary API calls. This approach guarantees a seamless and efficient browsing experience for users.

## Key Frontend Features:

1. **Infinity Scroll with Context Persistence**:

   - Posts data is stored in the `useContext` hook, allowing users to resume browsing where they left off when returning to the page.
   - Infinity scroll loads only the necessary data for efficiency, ensuring smooth performance. Truncating lengthy content, such as assessments, enhances user experience.

2. **Comment Modal with Hierarchical Viewing**:

   - Users can view parent-child hierarchy of comments via a convenient comment modal popup, facilitating easy navigation and understanding of discussions.

3. **Commenting and Replying Functionality**:

   - Seamless commenting and replying to others' comments are supported, enhancing engagement and fostering community interaction.

4. **Hug Button for Post Appreciation**:

   - The "Hug" button allows users to express appreciation for a post with a single click, updating the hug count instantly.

5. **Efficient Data Caching**:

   - Infinity scroll page and expanded post page cache all post data, preventing redundant requests and optimizing performance.

6. **Synchronization of Hugs and Comments**:
   - Hugs and comments are synchronized between the server and frontend, ensuring consistency across the infinity scroll page, expanded post page, and the server.
