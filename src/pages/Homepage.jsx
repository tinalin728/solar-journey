import { Link } from 'react-router-dom';
import React, { useEffect, useRef } from 'react';
import Planets from './Planets';

export default function Homepage() {

    return (
        <>
            <section className='background-grid text-white h-screen'>
                <div className='relative h-full p-6 md:p-14'>
                    <div className='primary-border w-full h-full relative'>
                        <div className='absolute'>
                            <p> Time </p>
                        </div>

                        <div className=' w-full h-full flex flex-col justify-center items-center'>
                            <h1 className='font-nebula text-5xl md:text-7xl font-bold uppercase text-center glow-text'>To <br /> Infinity & beyond</h1>

                            <h3 className='mt-5 text-2xl'>Through the Solar System</h3>

                            <div className="notched-button overflow-visible mt-10">
                                <svg className="notch-border overflow-visible" viewBox="0 0 220 70" xmlns="http://www.w3.org/2000/svg">
                                    <polygon
                                        points="12,0 208,0 220,12 220,58 208,70 12,70 0,58 0,12"
                                        className="notch-static"
                                    />
                                    <polygon
                                        points="12,0 208,0 220,12 220,58 208,70 12,70 0,58 0,12"
                                        className="notch-animated"
                                    />
                                </svg>
                                <Link to="/planets" className="ui-btn">
                                    <span className='uppercase font-bold text-primary'>Explore Now</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
