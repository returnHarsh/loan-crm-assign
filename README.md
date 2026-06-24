# Loan CRM Dashboard

## Project Overview

This project is a Loan CRM application built with Next.js, designed to handle and display loan applications and key metrics through a comprehensive dashboard. I created a robust frontend interface with simulated backend interactions to demonstrate data management, filtering, and performance optimization.

## Features Built

- **Mock Data Generation:** I built a script to generate 2,000 realistic loan documents. The script distributes the `appliedDate` over a one-year span, with a specific focus on realistic data distributions for the last 7 days and the last month. I also added status-specific date fields like `approvedDate`.
- **Applications Page:** Displays the loan documents using a custom hook that simulates an API call with a 400ms delay to mimic real-world network latency. 
- **Pagination & Virtualization:** Implemented dual viewing modes for the applications page to handle large datasets efficiently. Users can either use traditional pagination to view 50 documents per page, or switch to a virtualization mode that loads and smoothly renders all rows at once without compromising UI responsiveness.
- **Advanced Filtering & Sorting:** 
  - Users can filter applications and sort them by date, risk score, and loan amount.
  - I implemented dynamic date sorting logic based on the selected loan status. By default, users can sort by `appliedDate` and `lastUpdatedDate`. If the "approved" status is selected, `approvedDate` becomes available for sorting. If "disbursed" is selected, `disbursedDate` is also added to the sorting options.
- **Dashboard & Analytics:** Developed interactive dashboard components on the Home page, including a conversion funnel to visualize the progression of loan applications and detailed **branch-wise data statistics** to track local performance and risk.

## Challenges Faced

During the development of this application, I encountered several interesting challenges:
- **State Management & Performance:** I had to carefully evaluate state management patterns for filtering data. This involved deciding whether to compute filtered data on-demand during the render cycle using `useMemo` or to calculate it via dedicated functions to ensure UI responsiveness and prevent unnecessary re-renders.
- **API Call Optimization:** I ran into an issue where API calls were firing repeatedly. I had to debug and restructure the data-fetching and dependency logic to ensure the simulated API was only called when needed.
- **Calendar Date Selection Bug:** I encountered a tricky issue where selecting a custom date range and clicking "apply" successfully fetched the correct documents, but clicking the same button again without modifications would unexpectedly shift the start date back by one day. Fixing this required careful handling of date objects and timezone offsets.

## Performance Optimizations

- **Shift from `useDeferredValue` to Debouncing:** Initially used `useDeferredValue` for search filtering, but the UI was still lagging. This happened because `searchQuery` state updates still triggered immediate re-renders of the parent component on every keystroke. I shifted to using a custom 400ms debounce on local state inside the filter bar, which completely shields the heavy table from rapid keystroke updates and makes typing buttery smooth.
- **Fixed Render Freeze on View Toggle:** Discovered a tricky React batching bug where toggling from "View All Data" (2,000 items) back to "View Pagination" (50 items) would briefly attempt to render all 2,000 items inside the non-virtualized standard table, freezing the browser's main thread. Fixed this by synchronously clearing the `paginatedData` array to `[]` on click, instantly freeing the main thread before the simulated API call fetches the new paginated data.
- **List Virtualization:** Implemented headless list virtualization using `@tanstack/react-virtual` for the "View All Data" feature. This ensures that even when loading all 2,000 documents, the browser only renders the ~15 DOM rows currently visible on screen (instead of 36,000+ total DOM nodes), maintaining 60fps scrolling performance.
- **Widespread Component Memoization:** Applied `React.memo()` across all heavy child components (`ApplicationsFilterBar`, `ApplicationsTable`, `PaginationControls`, etc.) to prevent wasteful re-renders during state updates in the parent directory.

## How to Run the Project

Follow these steps to run the application locally:

1. **Install dependencies:**
   Make sure you are in the `loan-crm` directory, then run:
   ```bash
   npm install
   # or yarn install / pnpm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or yarn dev / pnpm dev
   ```

3. **View the application:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the CRM dashboard.