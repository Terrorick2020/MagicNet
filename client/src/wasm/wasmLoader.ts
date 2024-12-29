import Imports from './wasmImports'

export const loadWasmModule = async () => {
    const module = await Imports.createMathModule()
    
    return module
}
