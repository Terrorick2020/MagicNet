import { useState } from 'react'
import { loadWasmModule } from '@/wasm/wasmLoader'

import type { PageProps } from '@/types/types.components'
type PageProps = typeof PageProps


const GameContent = ( {t, i18nPath}: PageProps ) => {
    const baseGamePath = `${i18nPath}:btn`
    const [module, setModule] = useState<any>(null);

    const initializeWasm = async () => {
        const wasmModule = await loadWasmModule();
        console.log( wasmModule.my_div( 2, 4 ) )
        setModule(wasmModule); 
    }

    const [nums, setNums] = useState({ a: 0, b: 0, res: 0 })

    const handleClick = async () => {
        await initializeWasm()
        console.log( module )
        // const result = my_add( Number(nums.a), Number(nums.b) )
        // setNums({ ...nums, res: result })
    }

    return (
        <>
            <div className="box">
                <div className="mt-10 w-[400px] flex flex-row gap-10">
                    <input
                        value={nums.a}
                        type="text" 
                        className="w-[200px] bordered"
                        onChange={(event) => { setNums({ ...nums, a: Number(event.target.value) }) }}
                    />
                    <input
                        value={nums.b}
                        type="text" 
                        className="w-[200px] bordered"
                        onChange={ (event) => { setNums({ ...nums, b: Number(event.target.value) }) } }
                    />
                </div>
                <button className="mt-10" onClick={handleClick}>{ t( baseGamePath ) }</button>
                <div className="mt-10">
                    <p>Результат: { nums.res }</p>
                </div>
            </div>
        </>
    )
}

export default GameContent