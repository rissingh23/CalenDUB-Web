
# CalenDUB

CalenDUB is a full‑stack calendar application designed specifically for University of Washington Registered Student Organizations (RSOs). It aggregates upcoming RSO events in one place, making it easy for students to discover, RSVP, and stay organized.

## 🚀 Features

* **Event Directory**: Browse and search for events across all UW RSOs
* **RSO Profiles**: View detailed information and contact links for each organization
* **RSO-Specific Calendars**: Filter the master calendar by individual RSOs
* **RSVP & Reminders**: Sign up for events and get notified before they start
* **Responsive UI**: Mobile‑friendly design for on‑the‑go access

## 🛠️ Tech Stack

* **Frontend**: React, Tailwind CSS
* **Backend**: Node.js, Express
* **Database**: MongoDB
* **Authentication**: JWT, Firebase

## 📦 Installation & Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/calendub.git
   cd calendub
   ```

2. **Start the server**

   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Start the client**

   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000` to view the app.

## 📂 Project Structure

```
calendub/
├── server/           # Express API and MongoDB models
├── client/           # React app
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route pages
│   │   └── utils/       # Helper functions
│   └── public/
└── README.md         # Project overview and instructions
```


## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

*Developed with ❤️ by the CalenDUB team at UW.*

