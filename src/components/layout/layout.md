# Layout Component

## Context & Description
The Layout component provides the basic structure for all pages in the application. It includes the navigation bar and a main content area, ensuring a consistent look and feel across the app.

## Stack & Technologies
- React
- TypeScript
- Tailwind CSS

## Code Structure 
-   **`Layout.tsx`:**  The main layout component.

## Logic & Key Features

-   **`LayoutProps` Interface:** Defines the `children` prop, which allows any content to be nested inside the layout.
-   **Structure:**
    -   Wraps the entire application in a `div` with basic styling (min-height, background, text color).
    -   Includes the `Navigation` component at the top.
    -   Uses a `main` element with a container (centered content) to hold the page-specific content passed as `children`.

## Constraints & Parameters

-   None specific.  It's a very general-purpose layout.

## Usage Examples
tsx
import Layout from './components/layout/Layout';

function MyPage() {
    return (
        <Layout>
            <h1>My Page Content</h1>
            {/ ... other content ... /}
        </Layout>
    );
}
## References & Resources

-   **React Documentation:** [https://react.dev/](https://react.dev/)
-   **Tailwind CSS Documentation:** [https://tailwindcss.com/](https://tailwindcss.com/)
