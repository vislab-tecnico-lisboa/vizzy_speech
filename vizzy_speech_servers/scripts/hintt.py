#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import print_function, unicode_literals
from PyInquirer import prompt, print_json
import yaml

import sys
import os

reload(sys)
sys.setdefaultencoding('utf8')

import roslib
import rospy
import actionlib
from actionlib_msgs.msg import *
import rospkg
from woz_dialog_msgs.msg import SpeechAction, SpeechGoal
from time import sleep
def main():
	rospy.init_node('vizzy_speech_hello_world')
	speech_client = actionlib.SimpleActionClient('nuance_speech_tts',SpeechAction)
	speech_client.wait_for_server()
	goal = SpeechGoal()
	goal.voice = 'Joaquim'
	goal.language = 'pt_PT'
	rospack = rospkg.RosPack()

	rospackagepath = rospack.get_path('vizzy_speech_servers')
   
	if len(sys.argv) < 2:
		with open(rospackagepath + "/sentences_files/default.yaml", 'r') as stream:
		    try:
		        sentences = yaml.load(stream)
		    except yaml.YAMLError as exc:
		        print(exc)
	else:
		with open(os.path.join(rospackagepath + "/sentences_files",sys.argv[1]), 'r') as stream:
		    try:
		        sentences = yaml.load(stream)
		    except yaml.YAMLError as exc:
		        print(exc)
	print(sentences)
	pauses = [1,1,1,1,1,1,1,1,1,1,1,1,1]
	for i,sentence in enumerate(sentences):
		goal.message = str(sentence)
		speech_client.send_goal(goal)
		speech_client.wait_for_result()
		# Add Code to send sentence
		sleep(pauses[i])
		print(sentence)
if __name__ == '__main__':
	main()
