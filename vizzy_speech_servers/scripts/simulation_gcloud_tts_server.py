#!/usr/bin/env python
# -*- coding: utf-8 -*-

#Just prints the message to the terminal...

import rospy
import actionlib
from woz_dialog_msgs.msg import SpeechActionGoal, SpeechFeedback, SpeechActionFeedback, SpeechResult, SpeechGoal, SpeechAction, SpeechActionResult

import sys
import os

reload(sys)
sys.setdefaultencoding('utf8')

import rospkg

import sys

import hashlib


class TtsActionServer(object):
    _feedback = SpeechFeedback()
    _result = SpeechResult()

    def __init__(self, name):
        rospack = rospkg.RosPack()

        rospackagepath = rospack.get_path('vizzy_speech_servers')

        self._rospackagepath = rospackagepath

        self._action_name = name
        self._as = actionlib.SimpleActionServer(self._action_name, SpeechAction, execute_cb=self.execute_cb, auto_start = False)
        self._as.start()

    def execute_cb(self, goal):

        language = goal.language
        voice = goal.voice
        message = goal.message
        speed = goal.speed

        print(goal)

        print(message)

        if message == "EMPTY":
            self._result.success = True
            self._feedback.status = self._feedback.FREE
            self._as.publish_feedback(self._feedback)
            self._as.set_succeeded(self._result)
            return
        
        self._result.success = True
        self._feedback.status = self._feedback.FREE
        self._as.publish_feedback(self._feedback)
        self._as.set_succeeded(self._result)



if __name__ == '__main__':
    rospy.init_node('gcloud_tts_action_server')
    server = TtsActionServer(rospy.get_name())
    rospy.spin()