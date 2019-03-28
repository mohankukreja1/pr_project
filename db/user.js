var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    email:{
		type:String,
		default: null
    },
    firstname: {
        type: String,
        default : null
    },
    lastname:{
        type:String,
	    default: null
    },
    password:{
		type:String,
		default: null
    },
    family_name:{
        type:String,
		default: null
    },
    family_emailid:{
        type:String,
		default: null
    },
    phone:{
        type:String,
		default: null
    }


});

userSchema.methods.encryptPassword=function (password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);
}

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password,this.password);
}
var obj = {};

obj.user = mongoose.model('user',userSchema);

module.exports = obj;