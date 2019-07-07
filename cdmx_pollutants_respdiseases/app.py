from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
from pymongo import MongoClient
from flask import request
import json
import pandas as pd
from flask import jsonify

# Create an instance of Flask
app = Flask(__name__)

# Use PyMongo to establish Mongo connection
# mongo = PyMongo(app, uri="mongodb://localhost:27017/Project")
connectionString = "mongodb://dbAdmin:Vol8e3v5XLGYrwTK@cluster0-shard-00-00-0dend.mongodb.net:27017,cluster0-shard-00-01-0dend.mongodb.net:27017,cluster0-shard-00-02-0dend.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"
dbClient = MongoClient(connectionString)
db = dbClient["cdmx_pollution"]


# Route to render index.html template using data from Mongo

#######  Página HTML
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/overview")
def overview():
    return render_template("overview.html")

@app.route("/visualizations")
def plots():
    return render_template("visualizations.html")

@app.route("/data")
def datah():
    return render_template("data.html")

@app.route("/heatmaps")
def heatmaps():
    return render_template("heatmap.html")

@app.route("/townhalls")
def townhalls():
    return render_template("townhalls.html")

@app.route("/stations")
def stations():
    return render_template("stations.html")

@app.route("/team")
def team():
    return render_template("team.html")
#######  Termina HTML

###### Empieza Mapa Interactivo
@app.route("/heatmap.html")
def heatmap():
    return render_template("heatmap.html")

@app.route("/contaminants/")
def data1():
        _args = verifyQueryParameters(request.args)
        docs = getContaminants(**_args)
        df = pd.DataFrame(list(docs))
        print(df.head(5))
        result = {
            'data':  json.loads(df.to_json(orient='records'))
                # 'data': {}
        }
        return jsonify(result)


def getContaminants(match, project = {}, skip = 0, limit = 1000, orient='records'):
        _pipeline = [
            {
                '$match': {
                    **match
                }
            },
            {
                '$project': {
                        '_id': 0
                }
            }, 
            {
                '$sort': {
                    'date': 1
                }
            }, 
            {
                '$skip': skip
            }, 
            {
                '$limit': limit
            }            
        ]
        print(_pipeline)
        if len(project) > 0:
            _pipeline.append({'$project': { **project }})
        docs = db.contaminants2016.aggregate(_pipeline)
        # for doc in docs:
                # print(doc)
        return docs


# -----------------
@app.route("/emergencies/")
def data2():
        _args = verifyQueryParameters(request.args)
        docs = getEmergencies(**_args)
        df = pd.DataFrame(list(docs))
        print(df.head(5))
        result = {
            'data':  json.loads(df.to_json(orient='records'))
                # 'data': {}
        }
        return jsonify(result)


def getEmergencies(match, project = {}, skip = 0, limit = 1000, orient='records'):
        _pipeline = [
            {
                '$match': {
                    **match
                }
            },
            {
                '$project': {
                        '_id': 0
                }
            }, 
            {
                '$sort': {
                    'date': 1
                }
            }, 
            {
                '$skip': skip
            }, 
            {
                '$limit': limit
            }            
        ]
        print(_pipeline)
        if len(project) > 0:
            _pipeline.append({'$project': { **project }})
        docs = db.respiratorias2016.aggregate(_pipeline)
        # for doc in docs:
                # print(doc)
        return docs
# -----------------



# -----------------
@app.route("/municipality/")
def data3():
        _args = verifyQueryParameters(request.args)
        docs = getMunicipality(**_args)
        df = pd.DataFrame(list(docs))
        print(df.head(5))
        result = {
            'data':  json.loads(df.to_json(orient='records'))
                # 'data': {}
        }
        return jsonify(result)


def getMunicipality(match, project = {}, skip = 0, limit = 1000, orient='records'):
        _pipeline = [
            {
                '$match': {
                    **match
                }
            },
            {
                '$project': {
                        '_id': 0
                }
            }, 
            {
                '$sort': {
                    'date': 1
                }
            }, 
            {
                '$skip': skip
            }, 
            {
                '$limit': limit
            }            
        ]
        print(_pipeline)
        if len(project) > 0:
            _pipeline.append({'$project': { **project }})
        docs = db.daily_pollutants.aggregate(_pipeline)
        # for doc in docs:
                # print(doc)
        return docs
# ------------------------

# -----------------
@app.route("/municipality_and_emergencies/")
def data4():
        _args = verifyQueryParameters(request.args)
        docs = getMunAndEmer(**_args)
        df = pd.DataFrame(list(docs))
        print(df.head(5))
        result = {
            'data':  json.loads(df.to_json(orient='records'))
                # 'data': {}
        }
        return jsonify(result)


def getMunAndEmer(match, project = {}, skip = 0, limit = 1000, orient='records'):
        _pipeline = [
            {
                '$match': {
                    **match
                }
            },
            {
                '$project': {
                        '_id': 0
                }
            }, 
            {
                '$sort': {
                    'date': 1
                }
            }, 
            {
                '$skip': skip
            }, 
            {
                '$limit': limit
            }            
        ]
        print(_pipeline)
        if len(project) > 0:
            _pipeline.append({'$project': { **project }})
        docs = db.all_data.aggregate(_pipeline)
        # for doc in docs:
                # print(doc)
        return docs
# ------------------------




def verifyQueryParameters(args):
    _args = { }
    parametersAllowed = [
        'q',
        'project',
        'skip',
        'limit',
        'orient'
    ]
    if args.get('q'):
        qDict = json.loads(args.get('q'))
        if len(qDict) == 0:
            raise Exception("q parameter can't be empty")
        _args['match'] = qDict

    
    if args.get('project'):
        _args['project'] = json.loads(args.get('project'))
    
    if args.get('skip'):
        _args['skip'] = json.loads(args.get('skip'))

    if args.get('limit'):
        _args['limit'] = json.loads(args.get('limit'))

    if args.get('orient'):
        _args['orient'] = json.loads(args.get('orient'))
    else:
        _args['orient'] = 'records'

    return _args


######Termina Mapa Interactivo


@app.route("/diseases/")
def diseases():
        _args = verifyQueryParameters(request.args)
        docs = getDiseases(**_args)
        df = pd.DataFrame(list(docs))
        print(df.head(5))

        jsindex=list(df['index'])
        jscases=list(df['CASES'])
        jsO3=list(df['O3'])
        jsO3m=list(df['O3m'])
        jsPM10=list(df['PM10'])
        jsPM10m=list(df['PM10m'])


        trace = {
                "date":jsindex,
                "cases":jscases,
                "O3":jsO3,
                "PM10":jsPM10,
                "O3m":jsO3m,
                "PM10m":jsPM10m
        }

        return jsonify(trace)


def getDiseases(match, project = {}, skip = 0, limit = 366, orient='records'):
        _pipeline = [
            {
                '$match': {
                    **match
                }
            },
            {
                '$project': {
                        '_id': 0
                }
            }, 
            {
                '$sort': {
                    'date': 1
                }
            }, 
            {
                '$skip': skip
            }, 
            {
                '$limit': limit
            }            
        ]
        print(_pipeline)
        if len(project) > 0:
            _pipeline.append({'$project': { **project }})
        docs = db.poll_vs_dis.aggregate(_pipeline)
        # for doc in docs:
                # print(doc)
        return docs
###### Termina Pollutans Levels Town-HallTown and Stations
        

if __name__ == "__main__":
    app.run(debug=True)
