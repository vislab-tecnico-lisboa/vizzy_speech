# vizzy_speech
Speech messages and ros software for Vizzy


## Example Client

### Python

``` Python
import roslib
import rospy
from sound_play.msg import SoundRequest
from sound_play.libsoundplay import SoundClient
import woz_dialog_msgs.msg
import actionlib
from actionlib_msgs.msg import *


if __name__ == '__main__':
    # Initialize the node and name it.
    rospy.init_node('vizzy_speech_hello_world')
    try:
        speech_client = actionlib.SimpleActionClient('nuance_speech_tts',woz_dialog_msgs.msg.SpeechAction)
        goal = woz_dialog_msgs.msg.SpeechGoal()
        goal.voice = 'Joaquim'
        goal.language = 'pt_PT'
        goal.message = 'Hello World'
        speech_client.send_goal(goal)
except rospy.ROSInterruptException: pass

```
