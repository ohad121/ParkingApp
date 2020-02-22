#!/usr/bin/env python3
from flask import Flask
from templates.parking.views import app_blueprint

app = Flask(__name__,
            static_folder='./public',
            template_folder="./static")

# register the blueprints
app.register_blueprint(app_blueprint)


