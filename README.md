# Big_Data_Address_Validation
Der Workflow wurde im Rahmen der Big Data Studienarbeit erstellt.

## Workflow

1. Runterladen der NE Collection von OpenAddresses
2. Unzip der Collection
3. Import der Dateien in HDFS
4. Erstellen von Hive Tables auf Basis des HDFS
5. Zusammenführen des Hive Tables und aussortieren der unnützen Einträge
6. Bereitstellung der Daten durch einen final_addresses Table in Hive

## Backend
Das Backend ist ein Node.js Backend welches mithilfe des "hive-drivers" auf die Hive-Datenbank zugreift und Daten abfragen kann.

# Wichtig
Damit der Workflow richtig arbeitet muss der Postgres Treiber aktualisiert werden.

#### Pentaho Docker anpassen
Hierfür einfach in das Verzeichnis /home/pentaho/pentaho/data-integration/libs
Dort dann

``wget https://jdbc.postgresql.org/download/postgresql-42.2.24.jar```
``rm postgresql-41.1.0.jar``