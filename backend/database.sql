-- Create database if not exists
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'salary_calculator')
BEGIN
    CREATE DATABASE salary_calculator;
END
GO

USE salary_calculator;
GO

-- Create data table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[data]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[data] (
        [id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [year] INT NULL,
        [region] INT NULL,
        [business] NVARCHAR(256) NULL,
        [total] INT NULL,
        [female] INT NULL,
        [male] INT NULL
    );
END


-- Create activity table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[activity]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[activity] (
        [id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [name_ge] NVARCHAR(250) NOT NULL,
        [name_en] NVARCHAR(250) NOT NULL,
        [icon] NVARCHAR(250) NOT NULL,
        [orderby] INT NULL
    );
END


-- Create isco08_2 table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[isco08_2]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[isco08_2] (
        [id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [code] INT NOT NULL,
        [name] NVARCHAR(256) NOT NULL,
        [total] INT NOT NULL,
        [female] INT NOT NULL,
        [male] INT NOT NULL
    );
END

-- Create isco08_2eng table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[isco08_2eng]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[isco08_2eng] (
        [id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [code] INT NOT NULL,
        [name] NVARCHAR(256) NOT NULL,
        [total] INT NOT NULL,
        [female] INT NOT NULL,
        [male] INT NOT NULL
    );
END