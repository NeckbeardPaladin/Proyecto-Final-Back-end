IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'todo_api')
BEGIN
    CREATE DATABASE todo_api;
END
GO

USE todo_api;
GO

IF OBJECT_ID(N'dbo.users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.users (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        email NVARCHAR(255) NOT NULL,
        password NVARCHAR(255) NOT NULL,
        created_at DATETIME2 NOT NULL CONSTRAINT DF_users_created_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT UQ_users_email UNIQUE (email)
    );
END
GO

IF OBJECT_ID(N'dbo.tasks', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.tasks (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX) NULL,
        status NVARCHAR(20) NOT NULL CONSTRAINT DF_tasks_status DEFAULT (N'pending'),
        due_date DATE NULL,
        user_id INT NOT NULL,
        created_at DATETIME2 NOT NULL CONSTRAINT DF_tasks_created_at DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT FK_tasks_user FOREIGN KEY (user_id)
            REFERENCES dbo.users(id) ON DELETE CASCADE,
        CONSTRAINT CK_tasks_status CHECK (status IN (N'pending', N'in_progress', N'done'))
    );
END
GO
