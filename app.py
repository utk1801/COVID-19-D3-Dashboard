from flask import Flask, render_template, request, redirect, Response, jsonify, send_file
import numpy as np
import pandas as pd
import json
import math
import csv
app = Flask(__name__)

@app.route("/getMonthWiseData",methods=['POST'])
def getMonthWiseData():
    global df
    data = df
    month = request.form['data']
    month_data = data.loc[data['month'] == int(month)]
    my_data = month_data[['month','iso_code','location','total_cases']]
    chart_data = my_data.to_dict(orient='records')
    chart_data = json.dumps(chart_data,indent=2)
    data = {'chart_data': chart_data}
    return jsonify(data)


@app.route("/getStats",methods=['POST'])
def getStats():
    global df
    data = df
    month = request.form['month']
    country = request.form['location']
    id = request.form['id']
    month_data = data.loc[data['month'] == int(month)]
    country_data = month_data.loc[month_data['iso_code'] == id]
    country_stats_data = country_data[['population_density','median_age','total_cases_per_million','total_deaths_per_million','total_cases','total_deaths']]    
    country_stats_data = country_stats_data.round(2)
    print(country_stats_data)
    chart_data = country_stats_data.to_dict(orient='records')
    chart_data = json.dumps(chart_data,indent=2)
    data = {'chart_data': chart_data}
    return jsonify(data)

@app.route("/getPCData",methods=['POST'])
def getPCData():
    global df
    data = df
    month = request.form['month']
    country = request.form['location']
    id = request.form['id']
    month_data = data.loc[data['month'] == int(month)]
    
    country_data = month_data.loc[month_data['iso_code'] == id]

    continent = country_data['continent'].values[0]
    print("-------------------")
    print(continent)
    print("-------------------")

    continent_wise_data = month_data[month_data['continent'] == continent]

    print(continent_wise_data)
    continent_wise_data = continent_wise_data[['location','population','gdp_per_capita','cvd_death_rate','population_density','median_age','total_cases_per_million','total_deaths_per_million','total_cases','total_deaths','continent']]
    continent_wise_data = continent_wise_data.round(2)
    continent_wise_data = continent_wise_data.dropna()
    print(continent_wise_data)
    chart_data = continent_wise_data.to_dict(orient='records')
    chart_data = json.dumps(chart_data,indent=2)
    data = {'chart_data': chart_data}
    return jsonify(data)


@app.route("/dashboard")
def index():
    return render_template("index.html")

@app.route("/data")
def data():
    return render_template("data.html")

if __name__ == "__main__":
    df = pd.read_csv("data/payu.csv")
    app.run(debug=True,port=8099)
