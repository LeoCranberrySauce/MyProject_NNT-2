import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import './AdminUserList.css'
import axios from "axios"
import { toast } from 'react-toastify'

const AdminUserList = ({ url }) => {

    // LIST OF USERS
    const [adminUserList, setAdminUserList] = useState([]);
    const baseURL = url;
    const [showPassword, setShowPassword] = useState(false);

    const [data, setData] = useState({
        name: "",
        userName: "",
        role: "",
        address: "",
        phone: "",
        email: "",
        password: ""
    });

    const adminUserRoles = ["Admin", "Staff"];

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!data.name || !data.userName || !data.role || !data.address || !data.phone || !data.email || !data.password) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const response = await axios.post(`${baseURL}/api/admin-user/register`, {
                name: data.name,
                userName: data.userName,
                role: data.role,
                address: data.address,
                phone: Number(data.phone),
                email: data.email,
                password: data.password
            });
            
            if (response.data.success) {
                setData({
                    name: "",
                    userName: "",
                    role: "",
                    address: "",
                    phone: "",
                    email: "",
                    password: ""
                });
                toast.success("A manager has successfully recruited");
            } else {
                toast.error("Failed to recruit a manager");
            }
        } catch (error) {
            toast.error("Error recruiting a manager");
            console.error(error);
        }
    }

    const fetchAdminUserList = async () => {
        const response = await axios.get(`${url}/api/admin-user/list`);
        if (response.data.success) {
            setAdminUserList(response.data.data);
        }
        else {
            toast.error("Admin user list error")
        }
    }

    useEffect(() => {
        fetchAdminUserList();
    }, [])

    return (
        <div className='admin-user-list add'>

            <h1>Manager List</h1>

            <div className='admin-user-list-container'>

                <div className='admin-user-list-left'>

                    <form className='flex-col' onSubmit={onSubmitHandler}>

                        <div className="add-admin-user-list">

                            <h2>Recruit and join us</h2>

                            <div className='add-admin-name'>
                                <p>Name</p>
                                <div className="add-admin-name-input-container">
                                    <input
                                        onChange={onChangeHandler}
                                        value={data.name}
                                        type='text'
                                        name='name'
                                        placeholder='Enter your name'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='add-admin-name'>
                                <p>User Name</p>
                                <div className="add-admin-name-input-container">
                                    <input
                                        onChange={onChangeHandler}
                                        value={data.userName}
                                        type='text'
                                        name='userName'
                                        placeholder='Enter your user name'
                                        required
                                    />
                                </div>
                            </div>

                            <div className="add-admin-roles-select-type">
                                <p>Role</p>
                                <select onChange={onChangeHandler} name='role' value={data.role}>
                                    {adminUserRoles.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='add-admin-address'>
                                <p>Address</p>
                                <div className="add-admin-address-container">
                                    <textarea
                                        onChange={onChangeHandler}
                                        value={data.address}
                                        type='text'
                                        name='address'
                                        placeholder='Enter address'
                                        rows='4'
                                        required
                                    />
                                </div>
                            </div>

                            <div className="add-admin-phone">
                                <p>Phone Number</p>
                                <input onChange={onChangeHandler} value={data.phone} type='number' name='phone' placeholder='Enter Phone Number' required />
                            </div>

                            <div className='add-admin-name'>
                                <p>Email</p>
                                <div className="add-admin-name-input-container">
                                    <input
                                        onChange={onChangeHandler}
                                        value={data.email}
                                        type='text'
                                        name='email'
                                        placeholder='Enter your email'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='add-admin-name'>
                                <p>Password</p>
                                <div className="add-admin-name-input-container" style={{position: 'relative'}}>
                                    <input
                                        onChange={onChangeHandler}
                                        value={data.password}
                                        type={showPassword ? 'text' : 'password'}
                                        name='password'
                                        placeholder='Enter your password'
                                        required
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '15px'
                                        }}
                                    >
                                        {showPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                        </div>

                        <button type='submit' className='add-btn'>Recruit</button>


                    </form>

                </div>

                <div className='admin-user-list-right'>

                    <div className="admin-user-list-table">

                        <h2>Managers</h2>

                        <div className="admin-user-list-table-format title">
                            <b>Name</b>
                            <b>Username</b>
                            <b>Role</b>
                            <b>Adress</b>
                            <b>Phone No.</b>
                            <b>Email</b>
                        </div>

                        {adminUserList.map((adminUser, index) => {
                            return (
                                <div className="admin-user-list-table-format" key={index}>
                                    <p>{adminUser.name}</p>
                                    <p>{adminUser.userName}</p>
                                    <p>{adminUser.role}</p>
                                    <p>{adminUser.address}</p>
                                    <p>{adminUser.phone}</p>
                                    <p>{adminUser.email}</p>
                                </div>
                            )
                        })}

                    </div>

                </div>

            </div>

        </div>
    )
}

export default AdminUserList
