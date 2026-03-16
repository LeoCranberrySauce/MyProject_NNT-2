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

// Check admin users
adminUserModel.find({}).then(users => {
  console.log('Admin users in database:');
  users.forEach(user => {
    console.log('- Username:', user.userName, '| Role:', user.role, '| ID:', user._id);
  });
  
  if (users.length === 0) {
    console.log('No admin users found in database');
  }
  
  mongoose.disconnect();
}).catch(err => {
  console.error('Error:', err);
  mongoose.disconnect();
});