# About the project

Hey Arek,

In this file, I'll try to explain a little bit about my decisions and the reasoning behind them.

## Tech / Packages

Next.js 16 - Latest version of Next.js
React-Hook-Form - Simply the best form library for React.
React-Query - For data fetching, caching, mutating data in the backend, and optimistic updates. I just love the way it works.
TailwindCSS - For styling.

## Changes to the backend

- Create a POST endpoint to handle Post creation.
- Fixed a bug when updating categories. The result of the update was missing the `name` field, which was throwing errors in the frontend.

## Frontend

- Changed the design a bit. I wanted to show how I handle UI/UX. I'm not that creative though.
- Added the ability to create posts.
- Added the ability to create categories.
- Optimistic UI techniques applied when *toggling* favorite status.
- Loading states for almost everything
- Custom Hook for dealing with some logics - like filtering posts by category, showing just the posts that are not favorited, etc.
- Using the `searchParams` as state - reducing usage of `useState`
- Using `react-query` cache mechanism as the single source of truth in terms of data.

## State management and Prop Drilling

I usually go straight to Zustand for state management, but react-query ends up doing all the heavy lifting in this scenario.
The main reason for this is that I wanted to keep the state of the app in sync with the backend.

We have a custom hook that returns some data for the `Page.tsx` - which later propagates to some rendering components.
I like this approach but I don't usually use it in other projects. It really depends on the component tree and logic.
I find it acceptable to drill props from one to, at most, two levels deep. After that, I go to Zustand.

## Tests

Yeah, I should've added tests. However, setting up cypress (or equivalent frameworks for e2e) takes a bit of time.
