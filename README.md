# PropertyHub - Property Management Demo

A comprehensive property management system demo built with Next.js 16, TypeScript, and Shadcn UI. This demo showcases complete user interfaces and workflows for property managers, tenants, and service providers with professional-grade design and functionality.

## 🌟 Features

### For Property Managers
- **Portfolio Overview**: Manage multiple properties with detailed analytics
- **Service Request Management**: Review, assign, and track maintenance requests
- **Tenant Management**: View tenant information and communication
- **Financial Analytics**: Track income, expenses, and property performance
- **Document Management**: Store and organize property-related documents

### For Tenants
- **Property Information**: View current residence details and amenities
- **Service Requests**: Submit and track maintenance requests with photos
- **Document Access**: Download lease agreements and important documents
- **Communication**: Message property managers directly
- **Payment History**: View rent payment history and due dates

### For Service Providers
- **Work Order Management**: View and manage assigned maintenance tasks
- **Status Updates**: Update job progress and completion status
- **Service Portfolio**: Showcase available services and specialties
- **Earnings Tracking**: Monitor completed jobs and earnings
- **Rating System**: View customer ratings and feedback

## 🚀 Demo Accounts

The demo includes three pre-configured user accounts to showcase different roles:

### Property Manager
- **Email**: `sarah@propertymanagement.com`
- **Password**: `demo123`
- **Features**: Full property management dashboard with analytics

### Tenant
- **Email**: `mike.chen@email.com`
- **Password**: `demo123`
- **Features**: Tenant-focused interface with service request capabilities

### Service Provider
- **Email**: `contact@abcplumbing.com`
- **Password**: `demo123`
- **Features**: Work order management and service tracking

## 🛠 Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Components**: Shadcn UI with Radix primitives
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts for analytics visualization
- **Icons**: Lucide React
- **State Management**: React Context API
- **Authentication**: Mock authentication system (demo only)
- **Data**: Comprehensive mock data for realistic demonstration

## 🏃‍♂️ Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd property-management-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

5. **Try the demo**
   Use any of the demo accounts listed above to explore different user experiences.

## 📱 Demo Highlights

### Role Switching
The demo includes a convenient role-switching feature in the navigation bar, allowing you to quickly switch between different user types without logging out.

### Responsive Design
The interface is fully responsive and works seamlessly across desktop, tablet, and mobile devices.

### Interactive Features
- Submit service requests with priority levels
- Update work order statuses
- View detailed property analytics
- Browse document libraries
- Real-time status updates

## 🎯 Key Demo Scenarios

### Property Manager Scenario
1. Log in as Sarah Johnson (Property Manager)
2. Review portfolio overview with 5 properties
3. Check pending service requests
4. Assign maintenance work to service providers
5. View property financial performance

### Tenant Scenario
1. Log in as Mike Chen (Tenant)
2. View apartment details and amenities
3. Submit a new maintenance request
4. Track existing service requests
5. Access lease documents

### Service Provider Scenario
1. Log in as ABC Plumbing Services
2. Review assigned work orders
3. Update job status to "In Progress"
4. Mark jobs as completed
5. View earnings and ratings

## 🔧 Customization

The demo is built with modularity in mind:

- **Mock Data**: Located in `app/data/mockData.ts`
- **User Roles**: Defined in `app/types/index.ts`
- **Styling**: Tailwind CSS with role-specific color themes
- **Components**: Reusable UI components in `app/components/ui/`

## 📝 Notes

- This is a demonstration application with simulated data
- No real backend or database connections
- Authentication is mocked for demo purposes
- All data persists only in browser localStorage
- Images are placeholder references

## 🤝 Contributing

This is a demo project, but suggestions and improvements are welcome! Feel free to:
- Report issues
- Suggest new features
- Improve the user experience
- Add new demo scenarios

## 📄 License

This demo project is for educational and demonstration purposes.

---

**Built with ❤️ for property management professionals**