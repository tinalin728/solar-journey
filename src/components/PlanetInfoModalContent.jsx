import React from 'react'

export default function PlanetInfoModalContent({ onClose, planetData }) {
    return (
        <div data-lenis-prevent className='fixed inset-0 z-50 p-6 md:p-14 flex items-center justify-center backdrop-blur-xl bg-black/50'>
            <div className='relative w-full p-2 md:p-8 lg:p-10 h-full max-h-[95vh] text-primary primary-border overflow-hidden' >
                <div onClick={onClose}
                    className='trapezoid absolute left-1/2 top-0 -translate-x-1/2 w-1/2 p-2 flex justify-center items-center'>
                    <button
                        className="w-4 h-3 bg-white"
                        style={{
                            clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                        }}
                        aria-label="Close"
                    ></button>
                </div>

                <div className='h-full overflow-y-auto px-2 py-8 lg:py-2'>
                    <div className='flex justify-center items-center gap-6 md:gap-10'>
                        <div className='h-[1px] w-full bg-primary/50'></div>
                        <h2>{planetData.name}</h2>
                        <div className='h-[1px] w-full bg-primary/50'></div>
                    </div>

                    <div className='mt-10 flex flex-col gap-10 md:flex-row'>
                        <div className="flex-1 h-full grid grid-cols-2 border border-primary/50 text-tiny md:text-sm w-fit">
                            {planetData.facts.map(([label, value], i) => (
                                <>
                                    <p key={`label-${i}`} className={`p-4 font-bold uppercase tracking-widest ${i % 2 === 0 ? 'bg-primary/15 text-white' : ''}`}>
                                        {label}
                                    </p>
                                    <p key={`value-${i}`} className={`p-4 ${i % 2 === 0 ? 'bg-primary/15 text-white' : ''}`}>
                                        {value}
                                    </p>
                                </>
                            ))}
                        </div>

                        {/* Fun Fact */}
                        <div className='h-full flex-1'>
                            <h4 className='text-2xl uppercase font-bold tracking-widest mb-3 text-white glow-text'>Fun Facts</h4>
                            <p className=''>{planetData.funFacts}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


// const planetData = {
//     name: 'Sun',
//     facts: [
//         ['Type', 'Yellow Dwarf Star'],
//         ['Equatorial Diameter', '865,374 mi'],
//         ['Mass', '1.99 × 10³⁰ kg'],
//         ['Galactic Center Distance', '26,038 ly'],
//         ['Rotation Period', '25 days'],
//         ['Galactic Orbit Period', '225 million years'],
//         ['Surface Gravity', '274 m/s²'],
//         ['Surface Temperature', '5,778 K (9,941°F)'],
//     ],
//     funFact: `The Sun is a massive, glowing ball of hot plasma at the heart of our solar system. Comprising over 99% of the solar system’s mass, it powers life on Earth through nuclear fusion in its core. Though it may look still, the Sun is constantly in motion, rotating at different speeds across its surface. Light from the Sun takes just over eight minutes to reach Earth, giving us warmth, energy, and beautiful sunrises. Currently middle-aged at 4.6 billion years old, the Sun will eventually expand into a red giant, dramatically altering the solar system as we know it.`,
// };
