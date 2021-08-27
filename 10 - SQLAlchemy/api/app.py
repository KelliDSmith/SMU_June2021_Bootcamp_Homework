from flask import Flask, jsonify
import pandas as pd
import numpy as np
from sqlalchemy import create_engine, inspect
import json

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
engine = create_engine("sqlite:///Resources/hawaii.sqlite")

#################################################
# Flask Routes
#################################################


@app.route("/")
def home():
    return (
        f"Welcome to the Hawaii Weather Station API!<br/>"
        f"<Available Routes:<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/tobs<br>"
        f"/api/v1.0/START_DATE<br/>"
        f"/api/v1.0/START_DATE/END_DATE<br/>"
    )

@app.route("/api/v1.0/stations")
def station():

    conn = engine.connect()
    query="SELECT * FROM station;"
    df = pd.read_sql(query,con=conn)
    conn.close()

    data = df.to_json(orient="records") # creates JSON string
    data = json.loads(data) # turns the string back into list of dicts

    return jsonify({"ok": True, "data": data})


@app.route("/api/v1.0/precipitation")
def precipitations():

    conn = engine.connect()
    query="SELECT date, avg(prcp) as avg_prcp FROM measurement GROUP BY date ORDER BY date"
    df = pd.read_sql(query,con=conn)
    conn.close()

    data = df.to_json(orient="records")
    data = json.loads(data)

    return jsonify({"ok": True, "data": data})

@app.route("/api/v1.0/tobs")
def tobs():

    conn = engine.connect()
    query="""
            SELECT date, prcp 
            FROM measurement 
            WHERE station='USC00519281' and date >='2016-08-23'
            ORDER BY date
            """
    df = pd.read_sql(query,con=conn)
    conn.close()

    data = df.to_json(orient="records")
    data = json.loads(data)

    return jsonify({"ok": True, "data": data})


@app.route("/api/v1.0/<start>") #yyyy-mm-dd
def startdate(start):

    conn = engine.connect()
    query=f"""
            SELECT 
                MIN(tobs) as min_temp, AVG(tobs) as avg_temp,date, MAX(tobs) as max_temp
            FROM 
                measurement 
            WHERE 
                date = '{start}' 
            """
    df = pd.read_sql(query,con=conn)
    conn.close()

    data = df.to_json(orient="records")
    data = json.loads(data)

    return jsonify({"ok": True, "data": data})

    
@app.route("/api/v1.0/<start>/<end>") #yyyy-mm-dd
def daterange(start,end):

    conn = engine.connect()
    query=f"""
            SELECT 
                MIN(date) as start_date,
                MAX(date) as end_date,
                MIN(tobs) as min_temp, AVG(tobs) as avg_temp,date, MAX(tobs) as max_temp
            FROM 
                measurement 
            WHERE 
                date >= '{start}' and date <='{end}'
           """
    df = pd.read_sql(query,con=conn)
    conn.close()

    data = df.to_json(orient="records")
    data = json.loads(data)

    return jsonify({"ok": True, "data": data})




if __name__ == "__main__":
    app.run(debug=True)
