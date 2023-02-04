const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const _ = require("lodash")

mongoose.connect("mongodb://localhost:27017/To-Do-List",{useNewUrlParser:true})

const itemSchema = new mongoose.Schema({name : String})

const listSchema = new mongoose.Schema({title:String,items:[itemSchema]})

const Item = mongoose.model("Item",itemSchema)

const List = mongoose.model("List",listSchema)

const item1 = new Item({name:"Sign In"})

const item2 = new Item({name:"You are now in our To-Do-List"})

const item3 = new Item({name:"Click button to add a new Item to our To-Do-List"})

const DefaultItems = [item1,item2,item3]

const app = express()

let listTitle = "Work"

app.set("view engine","ejs")

app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended:true}))



app.get("/",function(req,res){
    Item.find({},function(err,NoOfItem){
        if(NoOfItem.length === 0){
            Item.insertMany(DefaultItems,function(err){
                if(!err){
                    console.log("Successfully Inserted")
                    res.redirect("/")
                }
                else{
                    console.log(err)
                }
            })
        }
        
        else{
            res.render("listen",{listTitle:"Today",itemList:NoOfItem})
    
        }

        
    })

    
})

app.get("/:content",function(req,res){
    let a = req.params.content
    

    List.findOne({title:a},function(err,founds){
        if(!err){
            if(!founds){
                const list = new List({
                    title:a,
                    items:DefaultItems
                })
            
                list.save()
                res.redirect("/"+a)
            }
            else{
                res.render("listen",{listTitle:founds.title,itemList:founds.items})
                
            }
        }
        else{
            console.log(err)
        }
    })



    
})

app.post("/",function(req,res){
    let a = req.body.Duty
    let page = req.body.abbb
    const newItem = new Item({
        name:a
    })

    if(page === "Today"){
        newItem.save()
        res.redirect("/")
    }
    else{
        List.findOne({title:page},function(err,listItems){
            listItems.items.push(newItem)
            listItems.save()
            console.log(listItems.items)
            res.redirect("/"+page)
        })
    }
   
})

app.post("/delete",function(req,res){
    const checkboxes  = req.body.cb
    const checkboxTitle = req.body.listName

    console.log(checkboxTitle)

    if(checkboxTitle === "Today"){
        Item.findByIdAndRemove(req.body.cb,function(err){
            if(!err){
                res.redirect("/")
            }
            else{
                console.log(err)
            }
        })
    }

     else{
        List.findOneAndUpdate({title:checkboxTitle},{$pull:{items:{_id:checkboxes}}},function(err,resultItem){
            if(!err){
                
                 res.redirect("/"+checkboxTitle)
            }
            else{
                console.log(err)
            }
        })
     }


   
})

// app.get("/work",function(req,res){
//     res.render("listen",{listTitle:"Work",itemList:workItem})
// })


app.listen(3000,function(){
    console.log("Server Started at port 3000")
})