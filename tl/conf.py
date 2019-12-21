import sys, os

# Append the config dir so we can import config package
sys.path.insert(0, os.path.abspath(os.path.join('..', 'config')))

# Pull in all the configuration options defined in the global config file..
from all import *

language = 'en'
