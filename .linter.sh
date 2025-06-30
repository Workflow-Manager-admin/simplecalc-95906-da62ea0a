#!/bin/bash
cd /home/kavia/workspace/code-generation/simplecalc-95906-da62ea0a/react_app_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

