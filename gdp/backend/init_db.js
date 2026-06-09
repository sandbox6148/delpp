const getDB = require('./config/db');

async function initDB() {
    try {
        const db = await getDB();
        console.log("Database connected. Creating tables...");

        // Users
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT DEFAULT 'member',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Projects
        await db.exec(`
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                start_date DATE,
                end_date DATE,
                owner_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
            )
        `);

        // Tasks
        await db.exec(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                start_date DATE,
                end_date DATE,
                status TEXT DEFAULT 'todo',
                assignee_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
                FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL
            )
        `);

        // Task Dependencies
        await db.exec(`
            CREATE TABLE IF NOT EXISTS task_dependencies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                predecessor_task_id INTEGER NOT NULL,
                successor_task_id INTEGER NOT NULL,
                type TEXT DEFAULT 'FS',
                UNIQUE (predecessor_task_id, successor_task_id),
                FOREIGN KEY (predecessor_task_id) REFERENCES tasks(id) ON DELETE CASCADE,
                FOREIGN KEY (successor_task_id) REFERENCES tasks(id) ON DELETE CASCADE
            )
        `);

        // Insert some dummy data for quick testing
        const projectCount = await db.get("SELECT COUNT(*) as count FROM projects");
        if (projectCount.count === 0) {
            console.log("Inserting demo data...");
            await db.run("INSERT INTO users (name, email, password_hash) VALUES ('Admin', 'admin@example.com', 'dummyhash')");
            await db.run("INSERT INTO projects (name, description, owner_id) VALUES ('Demo Project', 'First project to test Gantt', 1)");

            await db.run("INSERT INTO tasks (project_id, name, description, start_date, end_date, status) VALUES (1, 'Task 1', 'Desc 1', '2026-03-01', '2026-03-03', 'in_progress')");
            await db.run("INSERT INTO tasks (project_id, name, description, start_date, end_date) VALUES (1, 'Task 2', 'Desc 2', '2026-03-04', '2026-03-07')");
            await db.run("INSERT INTO tasks (project_id, name, description, start_date, end_date) VALUES (1, 'Task 3', 'Desc 3', '2026-03-08', '2026-03-10')");

            await db.run("INSERT INTO task_dependencies (predecessor_task_id, successor_task_id) VALUES (1, 2)");
            await db.run("INSERT INTO task_dependencies (predecessor_task_id, successor_task_id) VALUES (2, 3)");
        }

        console.log("Database initialized successfully!");
    } catch (err) {
        console.error("Error initializing database:", err);
    }
}

initDB();
