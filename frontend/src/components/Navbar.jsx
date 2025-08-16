import React from 'react'

const Navbar = () => {
    return (
        <nav className='bg-slate-900 flex justify-between px-4 items-center h-14 text-white'>

            <a href="/">
                <div className='logo font-bold text-2xl'>
                    <span className='text-green-500'>&lt;</span>
                    Pass
                    <span className='text-green-500'>Man&gt;</span>
                </div>
            </a>
            <ul>
                <li className='flex gap-4'>
                    <a className='hover: font-bold' href="/">Home</a>
                    <a className='hover: font-bold' href="/">About</a>
                    <a className='hover: font-bold' href="/">Contact</a>
                </li>
            </ul>

        </nav>

    )
}

export default Navbar
