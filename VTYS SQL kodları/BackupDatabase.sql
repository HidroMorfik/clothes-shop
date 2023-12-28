USE VTYSCalisma
GO

CREATE PROCEDURE BackupDatabase
    @backupFile VARCHAR(50)
AS
BEGIN
    BACKUP DATABASE VTYSCalisma TO DISK = @backupFile
END