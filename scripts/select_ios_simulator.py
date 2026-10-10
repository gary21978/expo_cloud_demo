#!/usr/bin/env python3
"""Select an available iPhone from installed iOS runtimes; output only UDID."""
import json
import re
import subprocess

state = json.loads(subprocess.check_output(['xcrun', 'simctl', 'list', 'devices', 'available', '--json']))
candidates = []
for runtime, devices in state['devices'].items():
    if '.iOS-' not in runtime:
        continue
    version = tuple(map(int, re.findall(r'\d+', runtime.split('.iOS-', 1)[1])))
    for device in devices:
        if device.get('isAvailable') and device['name'].startswith('iPhone'):
            candidates.append((version, device['name'], device['udid']))
if not candidates:
    raise SystemExit('No available iPhone simulator. Check installed Xcode runtimes.')
print(max(candidates)[2])
