#include <emscripten.h>
#include <emscripten/bind.h>


using namespace emscripten;

float my_add(float a, float b) {
    return a + b;
}

float my_div(float a, float b) {
    return a / b;  // Деление
}

float my_sub(float a, float b) {
    return a - b;
}

float my_mult(float a, float b) {
    return a * b;
}


EMSCRIPTEN_BINDINGS(my_math) {
    function("my_add", &my_add);
    function("my_div", &my_div);
    function("my_sub", &my_sub);
    function("my_mult", &my_mult);
}