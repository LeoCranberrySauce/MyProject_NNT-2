const mongoose = require('mongoose');

// Connect to database
mongoose.connect('mongodb://localhost:27017/MyProject_NNT', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

// Admin user schema
const adminUserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    userName: {type:String,required:true},
    role: {type:String},
    address: {type: String, required: true},
    phone: {type: Number, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
},{minimize: false})

const adminUserModel = mongoose.model("adminUser", adminUserSchema);

// Update all admin users to have 'admin' role
adminUserModel.updateMany({}, { $set: { role: 'admin' } }).then(result => {
  console.log('Updated', result.modifiedCount, 'admin users to have role "admin"');
  
  // Show current users
  return adminUserModel.find({});
}).then(users => {
  console.log('Current admin users:');
  users.forEach(user => {
    console.log('- Username:', user.userName, '| Role:', user.role);
  });
  
  mongoose.disconnect();
}).catch(err => {
  console.error('Error:', err);
  mongoose.disconnect();
});