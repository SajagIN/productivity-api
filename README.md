# Productivity API  
**Full-Stack Productivity Tracker**

Live, secure, cloud-connected backend powering task management & deep productivity insights.

### Tech Stack 
- **Runtime**: Bun
- **Language**: TypeScript (strict)
- **Framework**: Express.js
- **Database**: MongoDB Atlas (cloud)
- **Auth**: JWT + bcrypt
- **Validation**: Zod (TypeScript-first)
- **Architecture**: Clean, Scalable, Production-Ready

### Architecture

```mermaid
%% Productivity API - Current State (2025) - 80% Complete
flowchart TD
    Client["Client<br/>Postman • Future Next.js App"]

    subgraph Server ["Server • Bun + Express • Port 5000"]
        Entry["src/server.ts<br/>Main Entry Point"]

        subgraph Middleware ["Middleware"]
            CORS["cors"]
            Auth["authMiddleware.ts<br/>protect() → req.user"]
            Validate["Zod Validators"]
        end

        subgraph Routes ["Routes"]
            AuthR["/api/auth<br/>authRoutes.ts"]
            TaskR["/api/tasks<br/>taskRoutes.ts<br/>CRUD + Ownership"]
            FutureDash["/api/dashboard<br/>(coming next)"]
        end

        subgraph Controllers ["Controllers"]
            AuthCtrl["authController.ts<br/>register • login"]
            TaskCtrl["taskController.ts<br/>getTasks • createTask • updateTask • deleteTask"]
        end

        subgraph Models ["Mongoose Models"]
            User["models/user.ts<br/>name • email • password • role"]
            Task["models/task.ts<br/>title • priority • status • deadline • tags • userId • isOverdue"]
        end

        DB["MongoDB Atlas<br/>productivity-db<br/>collections: users, tasks"]
    end

    Tools["Tools<br/>JWT • bcrypt • zod • mongoose • dotenv"]

    %% Flow
    Client -->|Bearer Token| Entry
    Entry --> CORS --> Routes
    
    AuthR --> Validate --> AuthCtrl --> User
    TaskR --> Auth --> Validate --> TaskCtrl --> Task
    
    User & Task --> DB
    Entry --> Tools

    %% Styling – Dark Mode Ready
    classDef client fill:#1e40af,stroke:#60a5fa,color:white
    classDef server fill:#0f172a,stroke:#6366f1,stroke-width:4px,color:#e0e7ff
    classDef middleware fill:#451a03,stroke:#fb923c,color:#fed7aa
    classDef routes fill:#581c87,stroke:#c084fc,color:#f3e8ff
    classDef controllers fill:#166534,stroke:#22c55e,color:#dcfce7
    classDef models fill:#831843,stroke:#f472b6,color:#fce7f3
    classDef db fill:#166534,stroke:#22c55e,stroke-width:5px,color:white
    classDef tools fill:#1e293b,stroke:#64748b,color:#e2e8f0

    class Client client
    class Entry server
    class CORS,Auth,Validate middleware
    class AuthR,TaskR,FutureDash routes
    class AuthCtrl,TaskCtrl controllers
    class User,Task models
    class DB db
    class Tools tools
```