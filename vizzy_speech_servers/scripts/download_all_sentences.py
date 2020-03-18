#!/usr/bin/env python
# -*- coding: utf-8 -*-

import yaml

import sys
import os
import rospy
import actionlib
import woz_dialog_msgs.msg


def main():
	if len(sys.argv) < 2:
		print('you need to provide the name of the yaml file located at $VIZZY_SPEECH_SERVERS/sentences_files')
	else:
		rospy.init_node('save_speech', anonymous=False)
		with open(os.path.join("../sentences_files",sys.argv[1]), 'r') as stream:
		    try:
		        sentences = yaml.load(stream)
			client = actionlib.SimpleActionClient('gcloud_tts', woz_dialog_msgs.msg.SpeechAction)
			client.wait_for_server()
			for sentence in sentences:
				sentence = sentence.split('/speed')
				print(sentence[0], "speed", float(sentence[1]))
				speak(client, sentence[0], float(sentence[1]))
		    except yaml.YAMLError as exc:
		        print(exc)
		

def speak(client, message, speed):
	goal = woz_dialog_msgs.msg.SpeechGoal(language="pt_PT", voice="pt-PT-Wavenet-D", message=message, speed=speed)
	client.send_goal(goal)
	client.wait_for_result() 

if __name__ == '__main__':
	main()
