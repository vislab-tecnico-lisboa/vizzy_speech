#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import print_function, unicode_literals
from PyInquirer import prompt, print_json
import yaml

import sys
import os


def main():
	if len(sys.argv) < 2:
		with open("../sentences_files/default.yaml", 'r') as stream:
		    try:
		        sentences = yaml.load(stream)
		    except yaml.YAMLError as exc:
		        print(exc)
	else:
		with open(os.path.join("../sentences_files",sys.argv[1]), 'r') as stream:
		    try:
		        sentences = yaml.load(stream)
		    except yaml.YAMLError as exc:
		        print(exc)
	while 1:	
		questions = [
		    {
		        'type': 'list',
		        'name': 'choice',
		        'message': 'What show i say?',
		        'choices': sentences + ['exit']
		    }
		]

		answers = prompt(questions)
		if answers['choice'] == 'exit':
			sys.exit(0)
		# Add Code to send sentence

if __name__ == '__main__':
	main()