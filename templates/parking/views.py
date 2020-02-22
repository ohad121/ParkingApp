from flask import render_template, Blueprint, jsonify, request
import pymongo
from bson import json_util, ObjectId
from .database import db
import json
import datetime
import pytz
import threading
import time

app_blueprint = Blueprint('parking', __name__)


@app_blueprint.route('/')
def index():
    return render_template("index.html")


cur_drivers = []


def interval_query():
    col = db.drivers
    while True:
        time.sleep(60)
        for driver in cur_drivers:
            if driver is not None:
                if driver['exitdate'] is not '':
                    driver_exit_date = datetime.datetime.strptime(driver['exitdate'], "%Y-%m-%d %H:%M:%S")
                    now_date = datetime.datetime.now()
                    if now_date > driver_exit_date:
                        col.find_one_and_update({"firstname": driver['firstname']}, {"$set": {"parkingnum": -1}})


thread = threading.Thread(name='interval_query', target=interval_query)
thread.setDaemon(True)
thread.start()


@app_blueprint.route('/driver', methods=['GET'])
def get_all_drivers():
    drivers_to_return = []
    col = db.drivers
    drivers = col.find({}, {"firstname": 1, "lastname": 1}).sort("firstname", pymongo.ASCENDING)
    for driver in drivers:
        drivers_to_return.append(driver)
    return json.dumps(drivers_to_return, indent=4, default=json_util.default)


@app_blueprint.route('/driver/exit/<int:parking_num>', methods=['PUT'])
def exit_parking(parking_num):
    col = db.drivers
    col.find_one_and_update({"parkingnum": parking_num}, {"$set": {"parkingnum": -1}})
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


@app_blueprint.route('/driver/enter/<int:parking_num>', methods=['POST'])
def enter_parking(parking_num):
    body = request.json
    driver_id = body['driverID']
    exit_date = body['exitDate']
    note = body['note']

    if exit_date != "":
        tz = pytz.timezone('Asia/Jerusalem')
        exit_date_date = datetime.datetime.now(tz)
        exit_date_date = exit_date_date.replace(hour=int(exit_date.split(":")[0]), minute=int(exit_date.split(":")[1]))
        date_now = datetime.datetime.now(tz)
        if date_now > exit_date_date:
            exit_date_date = exit_date_date + datetime.timedelta(days=1)
        exit_date = exit_date_date.strftime("%Y-%m-%d %H:%M:%S")

    db.drivers.update_one(
        {'_id': ObjectId(driver_id)},
        {
            "$set": {
                "parkingnum": parking_num,
                "exitdate": exit_date,
                "note": note
            }
        }
    )

    return jsonify({'status': 'Data id: ' + driver_id + ' is updated!'})


@app_blueprint.route('/parkingDrivers', methods=['GET'])
def get_current_drivers():
    drivers_to_return = [None, None, None, None, None]
    col = db.drivers
    drivers = col.find({"parkingnum": {"$gt": -1}}).sort("parkingnum", pymongo.ASCENDING)
    for driver in drivers:
        driver['exitdate'] = str(driver['exitdate'])
        drivers_to_return[driver['parkingnum']] = driver
    global cur_drivers
    cur_drivers = drivers_to_return
    return json.dumps(drivers_to_return, indent=4, default=json_util.default)
