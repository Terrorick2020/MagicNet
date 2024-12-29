MODULE_NAME=cpp/adder
OUTPUT_TS=src/wasm/adder_wasm.ts
OUTPUT_WASM=src/wasm/adder_wasm.wasm

emcc ${MODULE_NAME}.cpp \
     -o ${OUTPUT_TS} \
     -s EXPORT_ES6=1 \
     -s 'EXPORT_NAME="$MODULE_NAME"' \
     -s 'ENVIRONMENT="web"'

emcc .\cpp\math.cpp -o .\src\wasm\math.js -s MODULARIZE -s EXPORT_ES6 -s ENVIRONMENT=web -lembind