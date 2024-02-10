const express=require("express")
const usermodel = require("../models/usermodel")
const router=express.Router()
const bcrypt=require("bcryptjs")


hashPaswordGenerator =async(pass)=>{
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(pass,salt)
}

router.post("/signup", async(req,res)=>{
    let {data} = {"data":req.body}
      let password =data.password
        hashPaswordGenerator(password).then(
            (hashedPassword)=>{
                console.log(hashedPassword)
                data.password=hashedPassword
                console.log(data)
               
                 let user =new usermodel(data)
                let result =user.save()
               
                res.json({status:"success"})
            }
        )

   
})
router.post("/signin",async(req,res)=>{
    let input=req.body
    let email=req.body.email
    let data=await usermodel.findOne({"email":email})
    if(!data){
        return res.json({
            status:"invalid user"
        })
    }
    console.log(data)
    let dbpassword=data.password
    let inputpassword=req.body.password
    console.log(dbpassword)
    console.log(inputpassword)
    const match=await bcrypt.compare(inputpassword,dbpassword)
    if(!match){
        return res.json({
            status:"invalid password"
        })
    }
    res.json(
        {status:"succes"}
    )
})

module.exports=router