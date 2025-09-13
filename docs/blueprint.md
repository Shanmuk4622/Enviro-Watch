# **App Name**: EnviroWatch

## Core Features:

- Real-time CO Level Display: Display live CO concentration readings from sensors, color-coded by safety level (Green, Yellow, Red) on a geospatial map using Leaflet.js. Uses websockets for data streaming.
- Device Management: Enable admins and managers to register, edit, and remove sensor devices. Displays device ID, name, location, status, battery level, and CO reading.
- Alert Rule Configuration: Allow managers to create and edit alert rules based on CO levels and time thresholds, triggering email and web notifications upon threshold breaches.
- Predictive Alerting: Use an AI model to forecast the probability of safety limit breaches in specific zones, displaying the 'Future Risk Forecast' on the dashboard using AI tool
- Dashboard status: Display a banner at the top showing the overall system status such as 'All Systems Normal' or 'Critical Alert in Zone B'.
- Trend Charts: Generate CO trend charts from selected sensor devices using a line chart updated in real-time using web sockets, using data from the last hour.
- Animations: I need some animations here.

## Style Guidelines:

- Primary color: Deep blue (#2962FF) to convey trustworthiness and stability, important for a safety application.
- Background color: Light gray (#F0F4F8) for a clean and unobtrusive backdrop.
- Accent color: Teal (#00A3BF) to highlight key interactive elements and alerts, contrasting with the blue.
- Body and headline font: 'Inter', a sans-serif, providing a modern, machined, objective, neutral look; suitable for headlines or body text
- Use clear and intuitive icons to represent device status and alert levels; incorporate color-coding (green, yellow, red) for immediate recognition.
- Employ a clean and responsive layout that adapts to different screen sizes, ensuring critical information is always easily accessible.
- Use subtle transitions and animations to provide feedback on user interactions and draw attention to important alerts, avoiding excessive or distracting effects.