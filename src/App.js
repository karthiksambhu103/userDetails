import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sele, setsele] = useState(null); // For selecting user for editing
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    profile: {
      email: '',
      gender: '',
      address: '',
      pincode: '',
      city: '',
      state: '',
      country: ''
    }
  });



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      // Edit mode: Update user
      try {
        await axios.patch(`http://localhost:3001/api/auth/update/${sele._id}`, formData);
        fetchUsers(); // Refresh the user list after updating
        resetForm(); // Reset the form and switch back to create mode
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {

      try {
        await axios.post('http://localhost:3001/api/auth/createuser', formData);

        fetchUsers(); // Refresh user list
        resetForm();
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }
  };






  useEffect(() => {
    // Fetch all users when component loads
    fetchUsers();
  }, []);



  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/auth/getAlluser');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };



  const handleViewProfile = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/auth/getuserbyid/${id}`);
      setSelectedUser(response.data);  // Set the selected user to display profile
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      profile: {
        ...prevData.profile,
        [name]: value
      }
    }));
  };




  const handleEditProfile = (user) => {
    setFormData({
      username: user.username,
      phone: user.phone,
      profile: {
        email: user.profile?.email || '',
        gender: user.profile?.gender || '',
        address: user.profile?.address || '',
        pincode: user.profile?.pincode || '',
        city: user.profile?.city || '',
        state: user.profile?.state || '',
        country: user.profile?.country || ''
      }
    });
    setsele(user); // Select the user for editing
    setIsEditing(true); // Switch to edit mode
  };

  const resetForm = () => {
    setFormData({
      username: '',
      phone: '',
      profile: {
        email: '',
        gender: '',
        address: '',
        pincode: '',
        city: '',
        state: '',
        country: ''
      }
    });
    setIsEditing(false); // Switch back to create mode
    setsele(null); // Clear the selected user
  };








  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/auth/delete/${id}`);
      fetchUsers(); // Refresh user list after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };





  return (
    <div className="App">

      

        <form onSubmit={handleSubmit} style={{marginRight:'65px'}}>
          <h2>{isEditing ? `Edit ${sele?.username}'s Profile` : 'Create New User'}</h2>
          <div>
            <label>Username:</label>
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Phone:</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
          </div>

          {/* Profile Info */}
          <h3>Profile Information</h3>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={formData.profile.email} onChange={handleProfileChange} required />
          </div>
          <div>
            <label>Gender:</label>
            <input type="text" name="gender" value={formData.profile.gender} onChange={handleProfileChange} />
          </div>
          <div>
            <label>Address:</label>
            <input type="text" name="address" value={formData.profile.address} onChange={handleProfileChange} />
          </div>
          <div>
            <label>Pincode:</label>
            <input type="text" name="pincode" value={formData.profile.pincode} onChange={handleProfileChange} />
          </div>
          <div>
            <label>City:</label>
            <input type="text" name="city" value={formData.profile.city} onChange={handleProfileChange} />
          </div>
          <div>
            <label>State:</label>
            <input type="text" name="state" value={formData.profile.state} onChange={handleProfileChange} />
          </div>
          <div>
            <label>Country:</label>
            <input type="text" name="country" value={formData.profile.country} onChange={handleProfileChange} />
          </div>

          <button type="submit">{isEditing ? 'Update Profile' : 'Create User'}</button>
          {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
        </form>



        {users.length > 0 ? (
          <ul style={{marginRight:'65px'}}>
            {users.map((user) => (
              <div className='ok'>


              <li key={user._id}>
                <strong>{user.username}</strong> - {user.phone}
                {/* <p>Email: {user.profile?.email}</p>
              <p>Address: {user.profile?.address}</p> */}
              </li>
              <button onClick={() => handleViewProfile(user._id)}>View Profile</button>
              <button onClick={() => handleEditProfile(user)}>Edit</button>
              <button onClick={() => handleDelete(user._id)}>Delete</button>


              </div>
            ))}
          </ul>
        ) : (
          <p>No users found</p>
        )}

      



      {selectedUser && (
        <div style={{border:'1px solid #ccc', paddingRight:'20px', paddingLeft:'20px'}}>
          <h2 style={{borderBottom:'1px solid #ccc', paddingBottom:'10px'}}>{selectedUser.username}'s Profile</h2>
          <p><strong>Email:</strong> {selectedUser.profile?.email}</p>
          <p><strong>Gender:</strong> {selectedUser.profile?.gender}</p>
          <p><strong>Address:</strong> {selectedUser.profile?.address}</p>
          <p><strong>Pincode:</strong> {selectedUser.profile?.pincode}</p>
          <p><strong>City:</strong> {selectedUser.profile?.city}</p>
          <p><strong>State:</strong> {selectedUser.profile?.state}</p>
          <p><strong>Country:</strong> {selectedUser.profile?.country}</p>
        </div>
      )}




    </div>
  );
};

export default App;
