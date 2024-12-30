# run_solution.sh

#!/bin/bash

# Verificăm extensia fișierului pentru a determina limbajul
filename=$1
extension="${filename##*.}"

# Rulăm codul în funcție de limbaj
case $extension in
  "py")
    # Executăm codul Python
    python3 $filename
    ;;
  "js")
    # Executăm codul Node.js
    node $filename
    ;;
  "c")
    # Compilăm și rulăm codul C
    gcc $filename -o program && ./program
    ;;
  "cpp")
    # Compilăm și rulăm codul C++
    g++ $filename -o program && ./program
    ;;
  "java")
    # Compilăm și rulăm codul Java
    javac $filename && java ${filename%.*}
    ;;
  *)
    echo "Limbaj necunoscut!"
    ;;
esac
