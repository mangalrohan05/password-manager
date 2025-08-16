import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const ref = useRef()
    const passRef = useRef()
    const [form, setform] = useState({
        site: "",
        username: "",
        password: ""
    })

    const [passwordLog, setPasswordLog] = useState([])
    const [copyVal, setCopyVal] = useState({ index: null, field: '' })

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json();
        // console.log(passwords)
        setPasswordLog(passwords)
    }

    useEffect(() => {
        getPasswords()
    }, [])

    const showPassword = () => {
        passRef.current.type = passRef.current.type.includes('password') ? 'text' : 'password'
        ref.current.src = ref.current.src.includes('icons/hide.png') ? 'icons/show.png' : 'icons/hide.png'
    }

    const savePassword = async () => {

        try {
            if (form.site === '' || form.password === '' || form.username === '') throw new Error("Enter Valid Input in url, username and password")

            if (setPasswordLog)
                setPasswordLog([...passwordLog, { ...form, id: uuidv4() }])

            let res = await fetch("http://localhost:3000/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...form, id: uuidv4() })
            })


            setform({
                site: "",
                username: "",
                password: ""
            })
            console.log([...passwordLog, form])
        } catch (err) {
            console.log(err.message)
            alert(err.message)
        }
    }

    const editPass = (id) => {
        setform(passwordLog.filter(item => item.id === id)[0])
        setPasswordLog(passwordLog.filter(item => item.id !== id))  

    }

    const deletePass = async (id) => {
        if (confirm('Are You Sure You want to delete this Password?')) {
            setPasswordLog(passwordLog.filter(item => item.id !== id))
            let res = await fetch("http://localhost:3000/", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id})
            })
        }
    }

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const copyText = (text, index, field) => {

        toast('Copied to clipboard!', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
        })

        navigator.clipboard.writeText(text)

        setCopyVal({ index, field })

        setTimeout(() => {
            setCopyVal({ index: null, field: '' })
        }, 3000);
    }



    return (
        <>

            <ToastContainer
                position='top-right'
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='light'
            ></ToastContainer>

            {/* Ful Body Background */}
            <div>
                <div className="fixed inset-0 -z-10  w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
            </div>

            {/* Password Management */}
            <div className="mx-auto my-10 rounded-2xl bg-gradient-to-r from-emerald-950 via-blue-950 to-emerald-950 max-w-7/8 text-white px-10 py-10">

                {/* Header to add passwords */}
                <h1 className='text-4xl text-center font-bold'>
                    <div className='logo font-bold text-2xl'>
                        <span className='text-green-500'>&lt;</span>
                        Pass
                        <span className='text-green-500'>Man&gt;</span>
                    </div>

                </h1>
                <p className='text-lg text-center text-green-700'>Secure Password Manager</p>


                {/* Body */}
                <div className='flex flex-col p-4 gap-8 items-center'>
                    <input value={form.site} onChange={(e) => handleChange(e)} placeholder='Enter Website URL' className='rounded-full w-full border border-green-500 focus: outline-none focus:border-green-800 px-5 py-1' type="text" name="site" id="" />

                    <div className="flex md:flex-row flex-col w-full gap-8 justify-between">
                        <input value={form.username} onChange={(e) => handleChange(e)} placeholder='Enter username' className='rounded-full w-full border border-green-500 focus: outline-none focus:border-green-800 px-5 py-1' type="text" name='username' />

                        <div className="relative md:w-3/4 w-full">
                            <input ref={passRef} value={form.password} onChange={(e) => handleChange(e)} placeholder='Enter Password' className='rounded-full w-full border border-green-500 focus: outline-none focus:border-green-800 px-5 py-1' type="password" name='password' />
                            <span className='absolute right-3 top-[6px] cursor-pointer' onClick={showPassword}>
                                <img ref={ref} src="icons/hide.png" alt="" />
                            </span>
                        </div>
                    </div>

                    <button onClick={savePassword} className='flex gap-2 font-bold cursor-pointer justify-center items-center bg-green-500 hover:bg-green-600 rounded-full px-6 py-2 w-fit'>
                        <lord-icon
                            src="https://cdn.lordicon.com/mfdeeuho.json"
                            trigger="hover"
                            stroke="bold"
                            state="hover-swirl"
                            colors="primary:#d1e3fa,secondary:#cb5eee"
                        >
                        </lord-icon>
                        <span>
                            Save
                        </span>
                    </button>
                </div>

                {/* List of passwords */}
                <div className='Table-Cont'>
                    <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>

                    {passwordLog.length === 0 ?

                        <span className='text-green-500'>No Passwords Saved</span> :

                        <table className='table-auto w-full rounded-md overflow-hidden'>
                            <thead className='bg-emerald-900'>
                                <tr>
                                    <th className='py-2 border border-white'>WebSite URL </th>
                                    <th className='py-2 border border-white'>User</th>
                                    <th className='py-2 border border-white'>Password</th>
                                    <th className='py-2 border border-white'>Actions</th>
                                </tr>
                            </thead>

                            <tbody className='bg-emerald-700'>
                                {passwordLog.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            {/* url data */}
                                            <td className='px-4 py-2 border border-white text-center'>

                                                <div className='flex justify-between'>
                                                    <a href={item.site} target='_blank'>{item.site}</a>
                                                    <div className='relative' onClick={() => copyText(item.site, index, 'site')}>
                                                        {copyVal.index === index && copyVal.field === 'site' && (
                                                            <span className="absolute bg-gradient-to-r font-bold italic from-purple-400 via-white to-slate-200 bg-clip-text text-transparent top-[-42px] left-[-20px]">Copied</span>
                                                        )}
                                                        <img className='cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 active:scale-90 hover:invert-90' width={'20px'} src="/icons/copy.png" alt="" />
                                                    </div>
                                                </div>
                                            </td>

                                            {/* username data */}
                                            <td className='px-4 py-2 border border-white text-center'>
                                                <div className='flex justify-between'>

                                                    <span>{item.username}</span>
                                                    <div className='relative' onClick={() => copyText(item.username, index, 'username')}>
                                                        {copyVal.index === index && copyVal.field === 'username' && (
                                                            <span className="absolute bg-gradient-to-r font-bold italic from-purple-400 via-white to-slate-200 bg-clip-text text-transparent top-[-42px] left-[-20px]">Copied</span>
                                                        )}
                                                        <img className='cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 active:scale-90 hover:invert-90' width={'20px'} src="/icons/copy.png" alt="" />
                                                    </div>
                                                </div>
                                            </td>

                                            {/* password data */}
                                            <td className='px-4 py-2 border border-white text-center'>
                                                <div className='flex justify-between'>

                                                    <span className='password'>{'●'.repeat(item.password.length)}</span>
                                                    <div className='relative' onClick={() => copyText(item.password, index, 'password')}>
                                                        {copyVal.index === index && copyVal.field === 'password' && (
                                                            <span className="absolute bg-gradient-to-r font-bold italic from-purple-400 via-white to-slate-200 bg-clip-text text-transparent top-[-42px] left-[-20px]">Copied</span>
                                                        )}
                                                        <img className='cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 active:scale-90 hover:invert-90' width={'20px'} src="/icons/copy.png" alt="" />
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className='px-4 py-2 border border-white text-center flex justify-center items-center gap-4'>
                                                {/* <span className='cursor-pointer hover:text-red-500'>Delete</span> */}

                                                <span className='cursor-pointer mx-1' onClick={() => editPass(item.id)}>
                                                    <lord-icon
                                                        className='cursor-pointer hover:invert'
                                                        src="https://cdn.lordicon.com/vysppwvq.json"
                                                        trigger="hover"
                                                        stroke="bold"
                                                        state="hover-line"
                                                        colors="primary:#d1e3fa,secondary:#cb5eee"
                                                        style={{ width: "25px", height: "25px" }}>

                                                    </lord-icon>
                                                </span>

                                                <span className='cursor-pointer mx-1' onClick={() => deletePass(item.id)}>
                                                    <lord-icon
                                                        className='cursor-pointer hover:invert'
                                                        src="https://cdn.lordicon.com/tftntjtg.json"
                                                        trigger="hover"
                                                        stroke="bold"
                                                        colors="primary:#d1e3fa,secondary:#cb5eee"
                                                        style={{ width: "25px", height: "25px" }}>

                                                    </lord-icon>
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>

                        </table>
                    }

                </div>
            </div>
        </>
    )
}

export default Manager
