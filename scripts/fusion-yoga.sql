-- Fusionne l'activité « Yoga » en double (id 3) dans la bonne (id 5), puis la supprime.
UPDATE seance SET activite_id = 5 WHERE activite_id = 3;
INSERT IGNORE INTO salle_activite (salle_id, activite_id) SELECT salle_id, 5 FROM salle_activite WHERE activite_id = 3;
DELETE FROM salle_activite WHERE activite_id = 3;
DELETE FROM activite WHERE id = 3;
