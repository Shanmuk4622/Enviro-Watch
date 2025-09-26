# EnviroWatch Application

## Project Overview

EnviroWatch is a Next.js application designed to monitor and display data from various environmental sensor devices in real-time. It provides a user interface for visualizing device status, locations, and critical alerts.

## The Problem: Firebase Version Conflict

A critical issue can arise during development that causes the application to crash with the following error:

```
TypeError: Cannot read properties of undefined (reading 'INTERNAL')
```

This error is caused by a version mismatch between the `firebase` (client-side) and `firebase-admin` (server-side) packages. When these two packages are not compatible, they fail to initialize correctly, leading to the crash.

## The Solution

The following steps outline the proven method to resolve this dependency conflict and ensure a stable development environment.

### 1. Terminate All Rogue Server Processes

The Next.js development server can sometimes leave zombie processes running in the background. These must be stopped before any changes can take effect.

```bash
ps aux | grep node
```

This will list all running Node.js processes. Identify the process IDs (PIDs) associated with `next dev` and terminate them.

```bash
kill <PID_1> <PID_2>
```

### 2. Correct Firebase Package Versions

The core of the solution is to ensure that the versions of `firebase` and `firebase-admin` in your `package.json` are compatible.

Edit your `package.json` file to specify the following versions:

```json
{
  "dependencies": {
    "firebase": "10.11.1",
    "firebase-admin": "11.11.1"
  }
}
```

### 3. Perform a Clean Reinstallation

To ensure that the corrected package versions are installed and there are no lingering conflicts, you must perform a clean reinstallation of all dependencies.

This involves two steps:

*   **Deleting the `.next` directory:** This folder contains cached builds and compiled code that can cause old errors to persist.
*   **Deleting `node_modules` and `package-lock.json`:** This removes all previously installed packages and their lock file.

Execute the following command to perform a clean reinstallation:

```bash
rm -rf .next node_modules package-lock.json && npm install
```

### 4. Restart the Development Server

Once the clean reinstallation is complete, you can restart the development server.

```bash
npm run dev
```

The application should now build and run without the Firebase-related `TypeError`.
