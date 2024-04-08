from google.cloud.sql.connector import Connector
import sqlalchemy
import pymysql

connector = Connector()

conn = connector.connect(DB_CONNECTION_NAME, "pymysql", user=DB_USER, password=DB_PASSWORD, db=DB_NAME)

story_id = 2
location = "Ruined Village"
text = "You discover an ancient, half-burnt tome among the debris, hinting at a demon bound to the forest, vulnerable to light."
choices = [
    "Take the tome and venture into the forest.",
    "Look for a light source in the abandoned houses." ,
    "Ignore the tome and search for survivors." ,
    "Head back and climb the hill for a better strategy. "
]
cursor = conn.cursor()
# get the lowest id of location=Ruined Village
cursor.execute("SELECT MIN(id) FROM stories WHERE location = %s", (location))
conn.commit()
cursor.close()

print(cursor.fetchall())
