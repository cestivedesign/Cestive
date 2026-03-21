import re

with open('szolgaltatasok.html', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'<!-- Three.js Interactive Globe Integration -->'

replacement = """  <script type="importmap">
    {
      "imports": {
        "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
      }
    }
  </script>
  <!-- Three.js Interactive Globe Integration -->"""

new_content = content.replace(pattern, replacement)

# Now fix the imports inside the module
pattern2 = r"import \* as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';"
replacement2 = "import * as THREE from 'three';"
new_content = new_content.replace(pattern2, replacement2)

pattern3 = r"import \{ OrbitControls \} from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';"
replacement3 = "import { OrbitControls } from 'three/addons/controls/OrbitControls.js';"
new_content = new_content.replace(pattern3, replacement3)


with open('szolgaltatasok.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Import map added!")
