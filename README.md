# DailyDSA - Master Data Structures and Algorithms

DailyDSA is a modern web application designed to help developers master Data Structures and Algorithms through daily practice. Built with Next.js and featuring a clean, intuitive interface, it provides a structured approach to learning and practicing DSA.

![DailyDSA Preview](preview.png)

## 🚀 Features

### Core Features
- **Problem Repository**: Access a curated collection of DSA problems with varying difficulty levels
- **User Authentication**: Secure signup and login functionality
- **Progress Tracking**: Monitor your problem-solving progress
- **Modern UI**: Clean and responsive interface with dark mode support

### Upcoming Features
- **Discussion Forum**: Engage with the community and discuss problem solutions
- **Contests**: Participate in coding contests and compete with fellow developers
- **Blog**: Access comprehensive DSA articles and learning resources

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Authentication**: JWT-based auth system
- **State Management**: React Context API
- **Styling**: TailwindCSS with custom configurations
- **Database**: MongoDB (with Mongoose)

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dailydsa.git
   cd dailydsa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📝 Environment Variables

The following environment variables are required:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication

## 🌐 Deployment

This app can be deployed on:
- Vercel (recommended)
- Netlify
- Railway
- Heroku

## 🎯 Project Structure

```
dailydsa/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Next.js pages
│   ├── styles/        # Global styles
│   ├── context/       # React Context providers
│   └── utils/         # Utility functions
├── public/            # Static assets
└── ...config files
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Made with ❤️ by Kshitij Jha
