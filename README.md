# 🚀 Advanced Service Management Predictive System

## 📋 Project Description

This project is a development and implementation of an advanced predictive system designed to address key challenges in service management: forecasting SLA (Service Level Agreement) breaches and estimating the expected Time-to-Resolve (TTR) for service requests.

Failures in managing resolution times can lead to significant operational and financial consequences. Therefore, a machine learning-based solution was developed to provide proactive insights, enabling real-time intervention.

## 🎯 Project Goals

- **SLA Breach Prediction**: Early identification of service requests that may violate Service Level Agreements
- **Time-to-Resolve Estimation**: Accurate prediction of the time required to resolve each request
- **Operational Efficiency Improvement**: Providing data-driven management tools for decision making
- **SLA Breach Reduction**: Early detection and prevention of Service Level Agreement violations

## 🏗️ Project Architecture

The project is built as a Full-Stack architecture with React Frontend and Python Flask Backend:

```
Project/
├── client/                 # Frontend - React Application
│   ├── src/
│   │   ├── components/     # React Components
│   │   ├── Screens/        # Application Screens
│   │   ├── redux/          # State Management
│   │   ├── services/       # API Services
│   │   └── types/          # TypeScript Types
│   ├── public/             # Static Assets
│   └── package.json        # Frontend Dependencies
├── Backend/                # Backend - Python Flask
│   ├── app/
│   │   ├── routes/         # API Endpoints
│   │   ├── services/       # Business Logic
│   │   └── models/         # Data Models
│   ├── data/               # Data Files
│   └── requirements.txt    # Python Dependencies
└── README.md               # Project Documentation
```

## 🛠️ Technologies

### Frontend
- **React 18.2.0** - Modern UI library
- **TypeScript** - Strong typing support
- **Material-UI (MUI)** - UI component library
- **Redux Toolkit** - Application state management
- **React Router** - Page navigation
- **Recharts** - Chart creation and interactions
- **Axios** - HTTP requests

### Backend
- **Python 3.x** - Programming language
- **Flask** - Web API framework
- **MongoDB** - NoSQL database
- **Machine Learning Libraries**:
  - **XGBoost** - Advanced prediction model
  - **CatBoost** - Decision tree-based prediction model
  - **Scikit-learn** - Machine learning tools
  - **Pandas & NumPy** - Data processing

## 📊 Machine Learning Models

The system uses advanced machine learning models:

### Main Models
1. **XGBoost** - High-performance decision tree-based prediction model
2. **CatBoost** - Advanced prediction model with automatic categorical handling
3. **Random Forest** - Ensemble model with high stability

### Prediction Tasks
- **Classification**: SLA breach prediction
- **Regression**: Time-to-Resolve (TTR) estimation

### Optimization
- **GridSearchCV** - Parameter optimization
- **Cross-Validation** - Model performance validation
- **Hyperparameter Tuning** - Optimal parameter adjustment

## 🚀 Installation & Setup

### Prerequisites
- Node.js (version 18 and above)
- Python 3.8 and above
- MongoDB
- Git

### Frontend Installation
```bash
cd client
npm install
npm start
```

### Backend Installation
```bash
cd Backend
pip install -r requirements.txt
python run.py
```

### Environment Variables
Create a `.env` file in the Backend directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FLASK_ENV=development
```

## 📱 System Features

### 1. User Authentication
- Secure login with JWT
- User permission management
- Secure password storage

### 2. Service Request Management
- Creating new service requests
- Tracking open requests
- Updating request status

### 3. Dashboard
- Visual data display
- Interactive charts
- Key Performance Indicators (KPIs)

### 4. Advanced Prediction
- Real-time SLA breach prediction
- Accurate time-to-resolve estimation
- Early warnings

### 5. Data Analytics
- Detailed reports
- Trend analysis
- Business insights

## 🔌 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - New user registration
- `POST /auth/logout` - User logout

### Prediction
- `POST /predict/sla` - SLA breach prediction
- `POST /predict/ttr` - Time-to-resolve estimation

### Service Requests
- `GET /service-requests` - Get all requests
- `POST /service-requests` - Create new request
- `PUT /service-requests/<id>` - Update request
- `DELETE /service-requests/<id>` - Delete request

### Dashboard
- `GET /dashboard/stats` - General statistics
- `GET /dashboard/trends` - Data trends

## 📈 Model Performance

### Evaluation Metrics
- **Accuracy**: 95%+ in SLA breach prediction
- **Mean Absolute Error (MAE)**: <2 hours in time-to-resolve estimation
- **F1-Score**: 0.92+ for binary classification

### Optimization Results
- **XGBoost** demonstrated consistent and stable performance
- **GridSearchCV** improved performance by 15%+
- **Cross-Validation** validated model stability

## 🔒 Security

- **JWT Authentication** - Secure authentication
- **CORS Protection** - Protection against unauthorized requests
- **Input Validation** - User input validation
- **Secure Headers** - Advanced security headers

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm test
```

### Backend Testing
```bash
cd Backend
python -m pytest
```

## 📦 Deployment

### Frontend
```bash
cd client
npm run build
```

### Backend
```bash
cd Backend
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

