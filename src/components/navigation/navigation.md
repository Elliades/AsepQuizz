
# Navigation Component

## Context & Description

The `Navigation` component provides the main navigation links for the application. It allows users to switch between the main sections (Home, Subjects, Results). It's a persistent element at the top of the application.

## Stack & Technologies

-   **React:** JavaScript library for building user interfaces.
-   **TypeScript:** Superset of JavaScript that adds static typing.
-   **React Router:**  Declarative routing library for React.  Specifically uses `Link` and `useLocation`.
-   **Tailwind CSS:** Utility-first CSS framework.

## Code Structure
/navigation
└── Navigation.tsx


-   **`Navigation.tsx`:** The main navigation component.

## Logic & Key Features

-   **`useLocation` Hook:**  Gets the current location (URL) from React Router.
-   **`isActive` Function:**  Determines if a given navigation link is currently active based on the current path.  Adds styling to highlight the active link.
-   **Links:** Uses `Link` components from React Router to create navigation links.  These handle client-side routing without full page reloads.
-   **Responsive Design:** The navigation is designed to be responsive, though the provided code doesn't include specific mobile-first or breakpoint-specific styling.

## Constraints & Parameters

-   Hardcoded navigation links.  Adding new pages requires modifying this component.

## Usage Examples
tsx
// Typically used within the Layout component:
import Navigation from './components/navigation/Navigation';
function Layout({ children }: LayoutProps) {
    return (
    <div className="min-h-screen bg-gray-900 text-white">
        <Navigation />
        <main>{children}</main>
    </div>
    );
}

## References & Resources

-   **React Documentation:** [https://react.dev/](https://react.dev/)
-   **React Router Documentation:** [https://reactrouter.com/](https://reactrouter.com/)
-   **Tailwind CSS Documentation:** [https://tailwindcss.com/](https://tailwindcss.com/)