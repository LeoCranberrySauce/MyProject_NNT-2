import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import './AdminUserList.css'
import axios from "axios"
import { toast } from 'react-toastify'

const AdminUserList = ({ url }) => {

    // LIST OF USERS
    const [adminUserList, setAdminUserList] = useState([]);

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
        <div className='admin-user-list add flex-col'>

            {/*LIST OF FOODS*/}
            <h1>Manager List</h1>
            <button type='submit' className='add-btn'>Add manager</button>
            <div className="admin-user-list-table">
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
    )
}

export default AdminUserList
