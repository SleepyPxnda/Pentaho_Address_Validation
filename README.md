# Big_Data_Address_Validation
Der Workflow wurde im Rahmen der Big Data Studienarbeit erstellt.

# Wichtig
Damit der Workflow richtig arbeitet, muss der Postgres Treiber aktualisiert werden.

#### Postgres Treiber im Pentaho Docker aktualisieren
Hierfür einfach in das Verzeichnis /home/pentaho/pentaho/data-integration/lib
Dort dann:

``wget https://jdbc.postgresql.org/download/postgresql-42.2.24.jar``

``rm postgresql-42.1.1.jar``

#### Download der Datei schlägt Fehl
Falls der Workflow die Datei nicht runterladen kann, kann diese mit folgendem Skript in den „data“ Ordner heruntergeladen werden.
Wichtig hierbei: Das Skript sollte auf dem Host ausgeführt werden, da aufgrund von Berechtigungsproblemen keine Dateien im Docker erstellt werden können.

„wget --header="Authorization: Bearer oa.2df226db3904d09727977a02c15b27e505b9ff874cf5faefe86e0b9a45e2e3c2" -O ne.zip https://batch.openaddresses.io/api/collections/2/data“ 
